# Speech-to-Speech Conversational AI Assistant

A full-stack **voice-based AI assistant** that:

- Records user speech  
- Converts speech to text using Whisper  
- Generates AI response using LLaMA (via Ollama)  
- Converts response back to speech 
- Displays live chat history in a React frontend  

---

# Architecture

### Backend (FastAPI)
- Manages assistant state (`recording` / `speaking`)
- Stores in-memory chat history
- Provides REST APIs for frontend

### Voice Engine (Python Script)
- Records audio (`sounddevice`)
- Speech-to-Text → `faster-whisper`
- LLM Response → `Ollama (llama3.2)`
- Text-to-Speech → `gTTS`
- Syncs state + chat history with backend

### Frontend (React + Tailwind)
- Live chat history display
- Auto-refresh every 3 seconds
- Smooth navigation with loading spinner
- Clean UI with Lucide icons

---

# Tech Stack

## Backend
- FastAPI
- Uvicorn
- CORS Middleware

## Voice Processing
- sounddevice
- faster-whisper
- Ollama (llama3.2)
- LangChain
- gTTS
- pygame

## Frontend
- React
- React Router
- Axios
- Tailwind CSS
- Lucide Icons
