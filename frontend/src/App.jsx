import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingContext } from './LoadingContext';
import LoadingSpinner from './components/LoadingSpinner';
import Home from './Home';
import Chats from './Chats';
import { useContext } from 'react';

function App() {
  const { isLoading } = useContext(LoadingContext);
  return (
    <>
      <div className="transition-opacity duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chats />} />
        </Routes>
      </div>
    {isLoading && <LoadingSpinner />}
    </>
  );
}

export default App;
