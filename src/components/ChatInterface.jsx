import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertCircle, CheckCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { getFloatChatResponse } from '../utils/getFloatChatResponse';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm FloatChat, your AI assistant. I can help with questions, calculations, programming, and much more. What would you like to chat about?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!inputMessage || typeof inputMessage !== 'string' || !inputMessage.trim() || isTyping) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      // Get AI response
      const botResponse = await getFloatChatResponse(currentInput, messages);
      
      if (botResponse && typeof botResponse === 'string') {
        const botMessage = {
          id: Date.now() + 1,
          text: botResponse.trim(),
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error('Error getting response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble processing your request right now. Please try again!",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Check API key status
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const hasValidApiKey = apiKey && 
                        apiKey !== 'undefined' && 
                        apiKey !== 'null' &&
                        apiKey.trim().length > 0 &&
                        apiKey.startsWith('sk-');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">FloatChat</h2>
              <p className="text-sm text-gray-500">
                {hasValidApiKey ? 'AI-Powered Assistant' : 'Basic Mode'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasValidApiKey ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-xs">AI Ready</span>
              </div>
            ) : (
              <div className="flex items-center text-amber-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-xs">Basic Mode</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Debug info in development */}
        {import.meta.env.DEV && (
          <div className="mt-2 text-xs text-gray-400 font-mono">
            Mode: {import.meta.env.MODE} | 
            API Key: {apiKey ? `${apiKey.substring(0, 7)}...` : 'Not set'}
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-start space-x-3">
            <Bot className="w-8 h-8 text-blue-600 mt-1" />
            <div className="bg-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isTyping ? "AI is thinking..." : "Type your message..."}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputMessage?.trim() || isTyping}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
