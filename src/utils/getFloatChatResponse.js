// AI-powered response generator for FloatChat using OpenAI API

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

// Fallback responses when API is unavailable
const fallbackResponses = {
  greeting: "Hello! I'm FloatChat. I'm currently running in offline mode, but I can still help with basic questions!",
  error: "I'm having trouble connecting to my AI brain right now. Please try again in a moment!",
  noApiKey: "I need an API key to access my full AI capabilities. For now, I can give you basic responses!"
};

// System prompt to define FloatChat's personality and capabilities
const SYSTEM_PROMPT = `You are FloatChat, a helpful and friendly AI assistant created by The OOPeratives team. 

Your personality:
- Helpful, engaging, and conversational
- Knowledgeable about programming, technology, and general topics
- Can perform calculations and explain concepts clearly
- Always try to be useful and provide practical information
- Keep responses concise but informative (usually 1-3 sentences unless more detail is needed)

Your capabilities include:
- Answering questions on various topics
- Helping with programming and web development
- Performing calculations and explaining math concepts
- Providing suggestions and advice
- Having friendly conversations

If you don't know something, be honest about it and suggest alternatives when possible.`;

export const getFloatChatResponse = async (message, conversationHistory = []) => {
  // Safely handle message input
  if (!message || typeof message !== 'string' || !message.trim()) {
    return "I didn't catch that. What would you like to talk about?";
  }

  // Check if API key is available
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'undefined') {
    console.warn('OpenAI API key not found. Using fallback responses.');
    return getFallbackResponse(message);
  }

  try {
    // Safely prepare conversation context (last 6 messages for efficiency)
    const recentHistory = Array.isArray(conversationHistory) 
      ? conversationHistory.slice(-6) 
      : [];
    
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...recentHistory
        .filter(msg => msg && msg.text && msg.sender) // Filter out invalid messages
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: String(msg.text).trim()
        })),
      { role: 'user', content: String(message).trim() }
    ];

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return String(data.choices[0].message.content).trim();
    } else {
      throw new Error('Unexpected API response format');
    }

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Return intelligent fallback based on the error and user message
    if (error.message.includes('401')) {
      return "I'm having authentication issues with my AI service. Please check back later!";
    } else if (error.message.includes('429')) {
      return "I'm getting a lot of requests right now. Please try again in a moment!";
    } else if (error.message.includes('network') || error.name === 'TypeError') {
      return "I'm having connection issues. Let me try to help with a basic response: " + getFallbackResponse(message);
    }
    
    return fallbackResponses.error;
  }
};

// Fallback function for when API is unavailable
function getFallbackResponse(message) {
  // Safely handle message input
  if (!message || typeof message !== 'string') {
    return fallbackResponses.greeting;
  }

  const userMessage = String(message).toLowerCase().trim();
  
  // Basic pattern matching for common queries
  if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
    return fallbackResponses.greeting;
  }
  
  if (userMessage.includes('calculate') || userMessage.includes('math') || /\d+[\+\-\*\/]\d+/.test(userMessage)) {
    return handleBasicMath(userMessage);
  }
  
  if (userMessage.includes('time') || userMessage.includes('date')) {
    const now = new Date();
    return `The current date and time is: ${now.toLocaleString()}`;
  }
  
  if (userMessage.includes('help') || userMessage.includes('what can you do')) {
    return "I'm currently in offline mode, but I can still help with basic math, tell you the time, and have simple conversations. My full AI capabilities will return soon!";
  }

  if (userMessage.includes('thank') || userMessage.includes('thanks')) {
    return "You're welcome! Happy to help however I can.";
  }

  if (userMessage.includes('bye') || userMessage.includes('goodbye')) {
    return "Goodbye! Thanks for chatting with FloatChat.";
  }
  
  // Default fallback
  return "I'm running in basic mode right now. Try asking me about math, the time, or just say hello! My full AI capabilities will be back soon.";
}

// Basic math handler for fallback mode
function handleBasicMath(message) {
  try {
    if (!message || typeof message !== 'string') {
      return "I can help with basic math operations. Try something like '15 + 25' or '10 * 3'.";
    }

    const mathPattern = /(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/;
    const match = String(message).match(mathPattern);
    
    if (match) {
      const [_, num1, operator, num2] = match;
      const a = parseFloat(num1);
      const b = parseFloat(num2);
      
      if (isNaN(a) || isNaN(b)) {
        return "I need valid numbers to calculate. Try '15 + 25' or '10 * 3'.";
      }
      
      let result;
      
      switch (operator) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': 
          if (b === 0) return 'Cannot divide by zero!';
          result = a / b; 
          break;
        default: return "I can help with basic math: +, -, *, /";
      }
      
      return `${a} ${operator} ${b} = ${result}`;
    }
  } catch (error) {
    console.error('Math calculation error:', error);
    return "I can help with basic calculations like: 15 + 25, 10 * 3, etc.";
  }
  
  return "I can help with basic math operations. Try something like '15 + 25' or '10 * 3'.";
}
