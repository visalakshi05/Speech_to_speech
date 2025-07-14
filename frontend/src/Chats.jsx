import { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { Bot, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoadingContext } from './LoadingContext';


function Chats() {
  const [chatHistory, setChatHistory] = useState([]);
  const containerRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate
  const { setIsLoading } = useContext(LoadingContext);

  const handleGoHome = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/');
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('http://localhost:8000/chats');
        setChatHistory(res.data.history || []);
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
      }
    };

    fetchChats();
    const intervalId = setInterval(fetchChats, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#f0f2f5] to-[#e4ecf7] font-sans">
      {/* Header */}
      <div className="text-4xl font-bold text-center py-6 bg-white shadow-sm">
        <span className="flex justify-center items-center gap-2 text-gray-800">
          <Sparkles className="h-6 w-6 text-indigo-500" />
          Chat History
        </span>
      </div>

      {/* Go to Home Button */}
      <button
        className="absolute top-4 left-4 px-4 py-2 bg-white text-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 transition"
        onClick={handleGoHome} // Navigate to home
      >
        ← Go to Home
      </button>

      {/* Chat Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-8 space-y-6"
      >
        {chatHistory.length === 0 ? (
          <p className="text-gray-500 text-center">No chats yet.</p>
        ) : (
          chatHistory.map((entry, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start gap-3 pl-4">
                <div className="flex-shrink-0 bg-indigo-600 text-white p-2 rounded-full">
                  <User size={18} />
                </div>
                <div className="bg-white border border-indigo-100 shadow-md px-5 py-3 rounded-xl w-fit max-w-[90%] text-gray-800 text-base leading-relaxed">
                  {entry.user}
                </div>
              </div>
              <div className="flex items-start gap-3 pl-4">
                <div className="flex-shrink-0 bg-gray-300 text-white p-2 rounded-full">
                  <Bot size={18} className="text-gray-800" />
                </div>
                <div className="bg-[#f9fafb] border border-gray-300 shadow px-5 py-3 rounded-xl w-fit max-w-[90%] text-gray-900 text-base leading-relaxed">
                  {entry.ai}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Chats;