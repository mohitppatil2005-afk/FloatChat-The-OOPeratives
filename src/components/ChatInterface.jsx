import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { getFloatChatResponse } from '../utils/getFloatChatResponse';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm FloatChat, your AI assistant powered by OpenAI. I can help with questions, calculations, programming, and much more. What would you like to chat about?",
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
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      // Get AI response
      const botResponse = await getFloatChatResponse(inputMessage, messages);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      setError('Sorry, I encountered an error. Please try again.');
      
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
                {import.meta.env.VITE_OPENAI_API_KEY ? 'AI-Powered Assistant' : 'Basic Mode'}
              </p>
            </div>
          </div>
          
          {!import.meta.env.VITE_OPENAI_API_KEY && (
            <div className="flex items-center text-amber-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span className="text-xs">API Key Required</span>
            </div>
          )}
        </div>
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
        
        {error && (
          <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded-lg">
            {error}
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
            disabled={!inputMessage.trim() || isTyping}
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
