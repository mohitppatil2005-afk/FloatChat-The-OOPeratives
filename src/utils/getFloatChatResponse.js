// AI-powered response generator for FloatChat using OpenAI API

// Enhanced environment debugging
const envDebug = {
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD,
  hasApiKey: !!import.meta.env.VITE_OPENAI_API_KEY,
  keyLength: import.meta.env.VITE_OPENAI_API_KEY?.length || 0,
  keyPrefix: import.meta.env.VITE_OPENAI_API_KEY?.substring(0, 7) || 'none',
  allViteVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
};

console.log('🔧 FloatChat Environment Debug:', envDebug);

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

// Fallback responses when API is unavailable
const fallbackResponses = {
  greeting: "Hello! I'm FloatChat. I'm currently running in offline mode, but I can still help with basic questions!",
  error: "I'm having trouble connecting to my AI brain right now. Please try again in a moment!",
  noApiKey: "I need an API key to access my full AI capabilities. For now, I can give you basic responses!",
  apiKeyInvalid: "My API key seems to be invalid. I'll use basic responses for now."
};

// System prompt to define FloatChat's personality
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

// Validate API key format
function isValidApiKey(key) {
  const isValid = key && 
         typeof key === 'string' && 
         key.trim().length > 20 && 
         key !== 'undefined' && 
         key !== 'null' &&
         key.startsWith('sk-');
  
  console.log('🔑 API Key Validation:', {
    hasKey: !!key,
    isString: typeof key === 'string',
    length: key?.length || 0,
    startsWithSk: key?.startsWith('sk-') || false,
    isValid
  });
  
  return isValid;
}

export const getFloatChatResponse = async (message, conversationHistory = []) => {
  console.log('💬 Processing message:', { message, historyLength: conversationHistory.length });
  
  // Safely handle message input
  if (!message || typeof message !== 'string' || !message.trim()) {
    return "I didn't catch that. What would you like to talk about?";
  }

  // Check if API key is available and valid
  if (!isValidApiKey(OPENAI_API_KEY)) {
    console.warn('⚠️ OpenAI API key not found or invalid. Using fallback responses.');
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
        .filter(msg => msg && msg.text && msg.sender)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: String(msg.text).trim()
        })),
      { role: 'user', content: String(message).trim() }
    ];

    console.log('🚀 Making API request to OpenAI...', { messageCount: messages.length });
    
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
      const errorText = await response.text();
      console.error('❌ API request failed:', response.status, response.statusText, errorText);
      
      if (response.status === 401) {
        return "🔑 My API key seems to be invalid. I'll use basic responses for now.";
      } else if (response.status === 429) {
        return "⏳ I'm getting a lot of requests right now. Please try again in a moment!";
      } else if (response.status === 503) {
        return "🔧 OpenAI's servers are temporarily unavailable. Let me help with a basic response instead.";
      }
      
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API response received successfully');
    
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return String(data.choices[0].message.content).trim();
    } else {
      console.error('❌ Unexpected API response format:', data);
      throw new Error('Unexpected API response format');
    }

  } catch (error) {
    console.error('💥 OpenAI API Error:', error);
    
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return "🌐 I'm having connection issues. Let me try to help with a basic response: " + getFallbackResponse(message);
    }
    
    return fallbackResponses.error;
  }
};

// Enhanced fallback function
function getFallbackResponse(message) {
  if (!message || typeof message !== 'string') {
    return fallbackResponses.greeting;
  }

  const userMessage = String(message).toLowerCase().trim();
  
  // Greeting responses
  if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
    const greetings = [
      "Hello! 👋 I'm FloatChat running in basic mode. I can still help with math, time, and simple conversations!",
      "Hi there! 😊 I'm currently offline from my AI brain, but I can still chat with you!",
      "Hey! 🤖 Good to see you. I'm running with limited capabilities, but let's talk!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Math calculations
  if (userMessage.includes('calculate') || userMessage.includes('math') || /\d+[\+\-\*\/]\d+/.test(userMessage)) {
    return handleBasicMath(userMessage);
  }
  
  // Time and date
  if (userMessage.includes('time') || userMessage.includes('date') || userMessage.includes('today')) {
    const now = new Date();
    return `🕐 Current time: ${now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  }
  
  // Help
  if (userMessage.includes('help') || userMessage.includes('what can you do')) {
    return `🤖 I'm currently in basic mode, but I can still help with:

• 🧮 Basic math calculations (try "15 + 25")
• 🕐 Current time and date
• 💬 Simple conversations  
• ❓ Basic questions

💡 To unlock my full AI capabilities, an OpenAI API key needs to be configured!

What would you like to try?`;
  }

  // Programming questions
  if (userMessage.includes('programming') || userMessage.includes('code') || userMessage.includes('javascript') || userMessage.includes('react')) {
    return "💻 I'd love to help with programming! While I'm in basic mode, I can still discuss general concepts. What are you working on?";
  }

  // Thank you
  if (userMessage.includes('thank') || userMessage.includes('thanks')) {
    return "😊 You're very welcome! Happy to help however I can, even in basic mode!";
  }

  // Goodbye
  if (userMessage.includes('bye') || userMessage.includes('goodbye')) {
    return "👋 Goodbye! Thanks for chatting with FloatChat. Hope to see you again soon!";
  }

  // API questions
  if (userMessage.includes('api') || userMessage.includes('key') || userMessage.includes('openai')) {
    return "🔑 I'm currently running without my AI API connection. To enable full AI capabilities, an OpenAI API key would need to be configured in the environment variables. For now, I'm happy to help with basic responses!";
  }

  // Weather
  if (userMessage.includes('weather')) {
    return "🌤️ I can't check the weather right now, but I'd recommend checking your local weather app for current conditions!";
  }
  
  // Default responses
  const defaults = [
    "🤔 That's interesting! I'm in basic mode right now, so I might not have the perfect answer, but I'm happy to chat about it.",
    "💭 I'm running with limited capabilities at the moment, but I'd love to hear more about what you're thinking!",
    "🗣️ While I'm in offline mode, I can still have a conversation! Tell me more about that.",
    "🤖 I'm currently using basic responses, but I'm here to chat! What would you like to talk about?",
    "💡 My full AI brain isn't available right now, but I can still try to help! Can you tell me more?"
  ];
  
  return defaults[Math.floor(Math.random() * defaults.length)];
}

// Enhanced math handler
function handleBasicMath(message) {
  try {
    if (!message || typeof message !== 'string') {
      return "🧮 I can help with basic math operations. Try something like '15 + 25' or '10 * 3'.";
    }

    // Handle multiple operations
    const mathPattern = /(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/g;
    const matches = [...String(message).matchAll(mathPattern)];
    
    if (matches.length > 0) {
      const results = matches.map(match => {
        const [_, num1, operator, num2] = match;
        const a = parseFloat(num1);
        const b = parseFloat(num2);
        
        if (isNaN(a) || isNaN(b)) return null;
        
        let result;
        switch (operator) {
          case '+': result = a + b; break;
          case '-': result = a - b; break;
          case '*': result = a * b; break;
          case '/': 
            if (b === 0) return `${a} ÷ ${b} = ❌ Cannot divide by zero!`;
            result = a / b; 
            break;
          default: return null;
        }
        
        return `${a} ${operator} ${b} = ${result}`;
      }).filter(Boolean);
      
      if (results.length > 0) {
        return "🧮 Here's your calculation:\n" + results.join('\n');
      }
    }

    // Special math functions
    if (userMessage.includes('square root')) {
      const num = parseFloat(message.match(/\d+(?:\.\d+)?/)?.[0]);
      if (!isNaN(num) && num >= 0) {
        return `🔢 The square root of ${num} is ${Math.sqrt(num).toFixed(2)}`;
      }
    }

    if (userMessage.includes('power') || userMessage.includes('^')) {
      const powerMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:\^|\*\*|power)\s*(\d+(?:\.\d+)?)/);
      if (powerMatch) {
        const base = parseFloat(powerMatch[1]);
        const exponent = parseFloat(powerMatch[2]);
        if (!isNaN(base) && !isNaN(exponent)) {
          return `🔢 ${base} to the power of ${exponent} = ${Math.pow(base, exponent)}`;
        }
      }
    }

  } catch (error) {
    console.error('Math calculation error:', error);
  }
  
  return `🧮 I can help with basic math operations like:
• Addition: 15 + 25
• Subtraction: 50 - 12  
• Multiplication: 8 * 7
• Division: 100 / 4
• Square root: square root of 16
• Powers: 2 ^ 3

What would you like to calculate?`;
}
