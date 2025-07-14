import sounddevice as sd
from scipy.io.wavfile import write
import numpy as np
import tempfile
import io
import pygame
import requests
from faster_whisper import WhisperModel
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from gtts import gTTS
import os

def set_state(state):
    try:
        requests.post(f"http://localhost:8000/status/{state}")
    except requests.exceptions.RequestException as e:
        print("Error updating frontend state:", e)

def save_chat(user, ai):
    try:
        requests.post("http://localhost:8000/add_chat", params={"user": user, "ai": ai})
    except requests.exceptions.RequestException as e:
        print("Error saving chat history:", e)


pygame.mixer.init()

template = """
Answer the question below.

Here is the conversation history:{context}

Question:{question}

Answer:
"""

model = OllamaLLM(model="llama3.2")
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model
context = ""

model_whis = WhisperModel("small.en", device="cpu", compute_type="int8")

def handle_conversation(user_input):
    global context
    if user_input.lower() == 'exit':
        return None
    result = chain.invoke({"context": context, "question": user_input})
    context += f'\nUser: {user_input}\nAI: {result}'
    save_chat(user_input, result)
    print("AI:", result)
    return result

def record_audio(duration=5, samplerate=16000):
    print(f"🎙️ Recording for {duration} seconds...")
    set_state("recording")
    audio = sd.rec(int(samplerate * duration), samplerate=samplerate, channels=1, dtype='int16')
    sd.wait()
    return samplerate, audio

def transcribe_audio(samplerate, audio):
    '''
    #Linux
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as tmpfile:
    write(tmpfile.name, samplerate, audio)
    segments, _ = model_whis.transcribe(tmpfile.name, beam_size=5)
    return " ".join([seg.text for seg in segments])
    '''
    #Windows
    fd, path = tempfile.mkstemp(suffix=".wav")
    os.close(fd)
    try:
        write(path, samplerate, audio)
        segments, _ = model_whis.transcribe(path, beam_size=5)
        return " ".join([seg.text for seg in segments])
    finally:
        os.remove(path)

def speak_text(text):
    tts = gTTS(text=text, lang='en')
    mp3_fp = io.BytesIO()
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)

    set_state("speaking")
    pygame.mixer.music.load(mp3_fp, 'mp3')
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        continue

if __name__ == "__main__":
    print("🎧 Voice Assistant Started (say 'exit' to quit)")
    while True:
        samplerate, audio = record_audio(duration=5)
        transcribed_text = transcribe_audio(samplerate, audio)
        print("🗣️ You said:", transcribed_text)

        if transcribed_text.strip().lower() == "exit":
            print("👋 Exiting...")
            set_state("recording")
            break

        response = handle_conversation(transcribed_text)
        if response:
            speak_text(response)

        set_state("recording")
