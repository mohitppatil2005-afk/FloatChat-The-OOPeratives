import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Assume Recharts is available in the environment for component rendering
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Send, Globe, Zap, Compass, Info, MessageSquare, History, User, PlusCircle, Menu } from 'lucide-react';

/**
 * Utility Function: Hardcoded Data/Response Generator
 * This function simulates the AI response based on keywords in the user's message and the selected chat mode.
 */
const getFloatChatResponse = (message, chatMode) => {
  const lowerMessage = message.toLowerCase();

  const baseResponses = {
    // --- STANDARD QUERY RESPONSES (TEXT) ---
    'average depth': {
      modeType: 'text',
      content: {
        type: 'text',
        text: "The **average depth** is about **3,688 meters**. The deepest point is the Challenger Deep (Mariana Trench) at nearly 11 km.",
      }
    },
    'thermohaline circulation': {
      modeType: 'text',
      content: {
        type: 'text',
        text: "**Thermohaline circulation** is the global ocean 'conveyor belt' driven by differences in **water density**, controlled by **temperature** (thermo) and **salinity** (haline).",
      }
    },
    'ocean glider': {
      modeType: 'text',
      content: {
        type: 'text',
        text: "An **ocean glider** is an Autonomous Underwater Vehicle (AUV) that moves by changing its **buoyancy**. It collects long-duration data with very low power consumption.",
      }
    },
    // --- VISUAL DISCOVERY RESPONSES (GRAPH) ---
    'temperature trends': {
      modeType: 'graph',
      content: {
        type: 'graph',
        text: "Analyzing the **temperature profile** near the equator shows strong **thermal stratification**. Note the rapid temperature drop at the **thermocline** (50-100m).",
        data: [
          { depth: 0, temp: 28.5, salinity: 35.1 },
          { depth: 25, temp: 28.2, salinity: 35.1 },
          { depth: 50, temp: 26.5, salinity: 35.2 },
          { depth: 75, temp: 20.1, salinity: 35.3 },
          { depth: 100, temp: 15.8, salinity: 35.4 },
          { depth: 200, temp: 10.5, salinity: 35.5 },
          { depth: 500, temp: 5.2, salinity: 35.7 },
        ],
        graphType: 'Temperature Profile (vs. Depth)',
      },
    },
    'oxygen levels': {
      modeType: 'graph',
      content: {
        type: 'graph',
        text: "Comparing **oxygen profiles** reveals distinct **Oxygen Minimum Zones (OMZs)** at mid-depths (300-500m), especially noticeable in Profile B.",
        data: [
          { depth: 0, profileA: 5.5, profileB: 5.3, profileC: 5.6 },
          { depth: 100, profileA: 3.5, profileB: 2.1, profileC: 4.0 },
          { depth: 300, profileA: 1.8, profileB: 0.5, profileC: 2.5 },
          { depth: 500, profileA: 2.1, profileB: 0.8, profileC: 2.8 },
          { depth: 1000, profileA: 3.2, profileB: 1.5, profileC: 3.5 },
        ],
        graphType: 'Oxygen Comparison (mL/L vs. Depth)',
      }
    },
    'temperature anomalies': {
        modeType: 'graph',
        content: {
            type: 'graph',
            text: "The historical **Sea Surface Temperature (SST) Anomaly** trend shows increasing positive anomalies in recent years, peaking significantly in 2024.",
            data: [
                { year: 2015, anomaly: 0.6 },
                { year: 2016, anomaly: 0.8 },
                { year: 2017, anomaly: 0.4 },
                { year: 2018, anomaly: 0.1 },
                { year: 2019, anomaly: 0.3 },
                { year: 2020, anomaly: 0.5 },
                { year: 2021, anomaly: 0.2 },
                { year: 2022, anomaly: 0.45 },
                { year: 2023, anomaly: 0.7 },
                { year: 2024, anomaly: 0.9 },
            ],
            graphType: 'Historical SST Anomalies (°C)',
        }
    },
    // --- DEEP SEARCH RESPONSES (MAP) ---
    'argo floats': {
      modeType: 'map',
      content: {
        type: 'map',
        text: "Here are the positions of **ARGO floats** in the Arabian Sea, showing real-time distribution of profiling data collection assets.",
        data: [
          { lat: 15, lon: 65, status: 'Active', name: 'Float 54001' },
          { lat: 12, lon: 68, status: 'Recent', name: 'Float 54002' },
          { lat: 18, lon: 62, status: 'Active', name: 'Float 54003' },
          { lat: 20, lon: 66, status: 'Pending', name: 'Float 54004' },
          { lat: 8, lon: 70, status: 'Active', name: 'Float 54005' },
        ],
        mapContext: 'Arabian Sea ARGO Deployments',
      },
    },
    'deep-sea trenches': {
      modeType: 'map',
      content: {
        type: 'map',
        text: "Mapping major **deep-sea trenches** highlights tectonic subduction zones, with the **Challenger Deep** (Mariana Trench) marked prominently.",
        data: [
          { lat: 11, lon: 142, status: 'Challenger Deep', name: 'Mariana Trench' },
          { lat: -20, lon: -68, status: 'Active Zone', name: 'Peru-Chile Trench' },
          { lat: 40, lon: 143, status: 'Seismic Area', name: 'Japan Trench' },
        ],
        mapContext: 'Major Deep-Sea Trenches (Pacific Region)',
      }
    },
    'hurricane paths': {
      modeType: 'map',
      content: {
        type: 'map',
        text: "This map shows the **last reported positions** of recent Atlantic hurricanes, illustrating storm tracking and active zones.",
        data: [
          { lat: 25, lon: -75, status: 'Category 3', name: 'Hurricane Alex' },
          { lat: 30, lon: -60, status: 'Tropical Storm', name: 'Storm Betty' },
          { lat: 18, lon: -85, status: 'Dissipated', name: 'Depression Charlie' },
        ],
        mapContext: 'Recent Atlantic Storm Activity',
      }
    },
    // 4. Fallback text responses for mode suggestions
    'default': {
      modeType: 'text',
      content: {
        type: 'text',
        text: "Welcome to **FloatChat**. Please choose a mode on the sidebar (click 'Change Mode') to begin tailored data queries.",
      }
    }
  };

  let selectedResponse = baseResponses.default;

  // Find the best match
  for (const key in baseResponses) {
    if (lowerMessage.includes(key) && key !== 'default') {
      selectedResponse = baseResponses[key];
      break;
    }
  }

  // --- Mode Restriction Logic ---
  const responseMode = selectedResponse.modeType;

  if (responseMode === 'text' || chatMode === 'default') {
    return { sender: 'ai', timestamp: Date.now(), ...selectedResponse.content };
  }

  if (chatMode === 'standard' && responseMode !== 'text') {
    const visualType = responseMode === 'graph' ? 'graph/chart' : 'map';
    const suggestedMode = responseMode === 'graph' ? 'Visual Discovery' : 'Deep Search';
    return {
      sender: 'ai',
      timestamp: Date.now(),
      type: 'text',
      text: `I found data, but **Standard Query** only allows text. To view the **${visualType}**, please switch to the **${suggestedMode}** mode.`,
    };
  } else if (chatMode === 'visual' && responseMode === 'map') {
    return {
      sender: 'ai',
      timestamp: Date.now(),
      type: 'text',
      text: "That's a geospatial question. My **Visual Discovery** mode is optimized for **charts/graphs**. Please switch to **Deep Search** to view the map.",
    };
  } else if (chatMode === 'deep' && responseMode === 'graph') {
    return {
      sender: 'ai',
      timestamp: Date.now(),
      type: 'text',
      text: "I can plot that trend, but **Deep Search** is focused on **geospatial maps**. Please switch to **Visual Discovery** for the graph.",
    };
  }

  // If the mode and response type align, return the visual content
  return { sender: 'ai', timestamp: Date.now(), ...selectedResponse.content };
};

/**
 * Component: Mock Map Visualizer (using SVG/Tailwind for a geospatial feel)
 */
const MockMap = ({ data, mapContext }) => {
  const containerRef = React.useRef(null);
  const [size, setSize] = useState({ width: 300, height: 180 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = width * 0.6; // Maintain 5:3 aspect ratio
        setSize({ width, height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const mapWidth = 1000;
  const mapHeight = 600;
  const minLon = -90; maxLon = 180; 
  const minLat = -40; maxLat = 50;  

  const normalize = (val, min, max, scale) => (val - min) / (max - min) * scale;

  const projectedPoints = data.map(d => ({
    x: normalize(d.lon, minLon, maxLon, mapWidth),
    y: mapHeight - normalize(d.lat, minLat, maxLat, mapHeight), 
    ...d
  }));

  let colorMap;
  if (mapContext.includes('ARGO')) {
      colorMap = { 'Active': '#10B981', 'Recent': '#FBBF24', 'Pending': '#6B7280' };
  } else if (mapContext.includes('Trenches')) {
      colorMap = { 'Challenger Deep': '#6366F1', 'Active Zone': '#F87171', 'Seismic Area': '#FBBF24' };
  } else if (mapContext.includes('Storm')) {
      colorMap = { 'Category 3': '#EF4444', 'Tropical Storm': '#3B82F6', 'Dissipated': '#6B7280' };
  } else {
      colorMap = { 'Default': '#10B981' };
  }

  return (
    <div ref={containerRef} className="w-full h-auto mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
      <h3 className="font-semibold text-lg text-gray-700 mb-2 flex items-center">
        <Compass className="w-4 h-4 mr-2 text-green-600" />
        {mapContext}
      </h3>
      <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} width={size.width} height={size.height} preserveAspectRatio="xMidYMid meet" className="bg-blue-100/50 border border-blue-300 rounded-md shadow-inner">
        {/* Ocean Background */}
        <rect x="0" y="0" width={mapWidth} height={mapHeight} fill="#70A0FF" />
        {/* Mock Landmass: Simplified global continents for context */}
        <polygon points="100,200 150,150 200,300 100,350" fill="#B3B6B7" opacity="0.6" /> 
        <polygon points="500,450 600,400 700,500 650,550" fill="#B3B6B7" opacity="0.6" /> 
        <polygon points="300,300 350,250 450,300 400,400" fill="#B3B6B7" opacity="0.6" /> 

        {/* Plot Data Points */}
        {projectedPoints.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={12}
              fill={colorMap[point.status] || '#10B981'}
              opacity="0.9"
              stroke="#fff"
              strokeWidth="3"
              className="transition-all duration-300 hover:scale-150 cursor-pointer"
            >
              <title>{`${point.name} (${point.status}) - Lat: ${point.lat}°, Lon: ${point.lon}°`}</title>
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
};


/**
 * Component: Graph Visualizer (using Recharts)
 */
const GraphVisualizer = ({ data, graphType }) => {
  const xKey = data[0] && data[0].depth !== undefined ? 'depth' : 'year';

  const keys = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(key => key !== xKey);
  }, [data, xKey]);

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];
  const isDepthChart = xKey === 'depth';

  return (
    <div className="w-full h-80 mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
      <h3 className="font-semibold text-lg text-gray-700 mb-2 flex items-center">
        <Zap className="w-4 h-4 mr-2 text-red-600" />
        {graphType}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey={xKey}
            label={{ value: isDepthChart ? 'Depth (m)' : 'Year', position: 'bottom', offset: -5 }}
            reversed={isDepthChart} 
            type={isDepthChart ? 'number' : 'category'} 
          />
          <YAxis yAxisId="left" orientation="left" stroke={colors[0]} label={{ value: keys[0] || 'Value', angle: -90, position: 'insideLeft', fill: colors[0], fontWeight: 'bold' }} />
          {keys.length > 1 && (
            <YAxis yAxisId="right" orientation="right" stroke={colors[1]} label={{ value: keys[1] || 'Value', angle: 90, position: 'insideRight', fill: colors[1], fontWeight: 'bold' }} />
          )}
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />

          {keys.map((key, index) => (
            <Line
              key={key}
              yAxisId={index === 0 ? "left" : "right"}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={isDepthChart ? false : true} 
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Component: Chat Message Renderer
 */
const ChatMessage = ({ message }) => {
  const isAI = message.sender === 'ai';
  const messageClass = isAI
    ? 'bg-blue-50 text-gray-800 rounded-br-none'
    : 'bg-blue-600 text-white rounded-tl-none';
  const alignmentClass = isAI ? 'self-start' : 'self-end';

  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`max-w-4/5 md:max-w-3/4 mb-4 flex flex-col ${alignmentClass}`}>
      <div className={`px-4 py-3 rounded-xl shadow-lg ${messageClass}`}>
        <p className="whitespace-pre-wrap leading-relaxed">{renderText(message.text)}</p>

        {/* Conditional Visual Output */}
        {message.type === 'graph' && message.data && (
          <GraphVisualizer data={message.data} graphType={message.graphType} />
        )}
        {message.type === 'map' && message.data && (
          <MockMap data={message.data} mapContext={message.mapContext} />
        )}
      </div>
      <span className={`text-xs mt-1 text-gray-500 ${isAI ? 'text-left' : 'text-right'}`}>
        {isAI ? 'FloatChat AI' : 'You'}
      </span>
    </div>
  );
};

/**
 * Component: Onboarding Content
 */
const OnboardingContent = ({ onStartChat, toggleSidebar }) => {
  const modes = [
    { key: 'standard', icon: MessageSquare, color: 'blue', title: 'Standard Query', description: 'Quick, text-based answers and high-level summaries. Best for general ocean facts.', focus: 'Textual Output' },
    { key: 'visual', icon: Zap, color: 'red', title: 'Visual Discovery', description: 'Generates **graphs** and **charts** to visualize data trends over time or depth profiles.', focus: 'Data Trends & Profiles' },
    { key: 'deep', icon: Compass, color: 'green', title: 'Deep Search', description: 'Locate assets, research platforms (like ARGO floats), or regions using **interactive maps**.', focus: 'Geospatial Data' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white">
        {/* Onboarding Header - Provides mobile access to sidebar (Hamburger Menu) */}
        <div className="flex items-center p-4 border-b border-gray-100 shadow-sm md:hidden">
            <button onClick={toggleSidebar} className="p-2 mr-2 text-gray-500 hover:text-blue-600">
                <Menu className="w-6 h-6" /> 
            </button>
            <h2 className="text-2xl font-extrabold text-blue-600">FloatChat</h2>
        </div>

        {/* Onboarding Body */}
        <div className="flex flex-col items-center justify-center p-8 text-center h-full flex-grow bg-blue-50 overflow-y-auto">
            <Globe className="w-16 h-16 text-blue-600 mb-4 animate-pulse" />
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Welcome to FloatChat</h1>
            <p className="text-xl text-gray-600 mb-10 max-w-lg">
                Select a mode to define the type of data output you need. Let's dive in!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
                {modes.map((mode) => {
                const Icon = mode.icon;
                const colorClass = `border-${mode.color}-500`;
                return (
                    <div
                    key={mode.key}
                    className={`bg-white p-6 rounded-xl shadow-lg border-t-4 ${colorClass} transition hover:shadow-xl hover:scale-[1.02] cursor-pointer`}
                    onClick={() => onStartChat(mode.key)}
                    >
                    <Icon className={`w-6 h-6 text-${mode.color}-500 mb-3`} />
                    <h3 className="font-bold text-xl mb-2 text-gray-800">{mode.title}</h3>
                    <p className="text-sm text-gray-500">{mode.description.replace(/\*\*/g, '')}</p>
                    
                    <button
                        className={`mt-4 w-full py-2 text-white font-semibold rounded-lg bg-${mode.color}-600 hover:bg-${mode.color}-700 transition`}
                    >
                        Start in {mode.title}
                    </button>
                    </div>
                );
                })}
            </div>
        </div>
    </div>
  );
};

/**
 * Component: Sidebar
 * Updated to handle both persistent (click) and temporary (hover) state.
 */
const Sidebar = ({ chatMode, onModeChange, isSidebarOpen, setIsSidebarOpen, isHovering, setIsHovering }) => {
    const modes = {
        default: { title: 'Not Selected', icon: Globe, color: 'text-gray-400' },
        standard: { title: 'Standard Query', icon: MessageSquare, color: 'text-blue-400' },
        visual: { title: 'Visual Discovery', icon: Zap, color: 'text-red-400' },
        deep: { title: 'Deep Search', icon: Compass, color: 'text-green-400' },
    };

    const currentMode = modes[chatMode] || modes.default;

    const navItems = [
        { name: 'New Chat', icon: PlusCircle, action: () => console.log('New Chat started'), active: false },
        { name: 'History', icon: History, action: () => console.log('History opened'), active: false },
        { name: 'Account', icon: User, action: () => console.log('Account settings'), active: false },
    ];

    // The sidebar is considered open if the persistent state is true OR if the user is hovering.
    const isDisplayedOpen = isSidebarOpen || isHovering;

    // Tailwind classes for width transition
    // Uses isDisplayedOpen for width transition
    const widthClass = isDisplayedOpen ? 'w-64' : 'w-16';

    const handleMouseEnter = () => {
        // Only allow hover expansion if the sidebar is persistently closed (!isSidebarOpen)
        // And only on desktop screens (md: or wider)
        if (!isSidebarOpen && window.innerWidth >= 768) {
            setIsHovering(true);
        }
    };
    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        // Sidebar container with hover handlers
        <div 
            className={`
                ${widthClass} bg-gray-900 flex-shrink-0 flex flex-col justify-between text-white p-2 md:p-4 
                transition-all duration-300 overflow-x-hidden relative z-20
            `}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            
            {/* Logo/Title & Desktop Collapse Button */}
            <div className={`flex items-center mb-6 pb-4 border-b border-gray-700`}>
                <Globe className={`w-8 h-8 text-blue-500 ${isDisplayedOpen ? 'mr-2' : 'mx-auto'}`} />
                {/* Use isDisplayedOpen to show text */}
                {isDisplayedOpen && <span className="text-xl font-extrabold hidden md:inline">FloatChat AI</span>}
                
                {/* Desktop Collapse Button (Info Icon) */}
                <button
                    className={`hidden md:block absolute top-4 ${isDisplayedOpen ? 'right-4' : 'right-0 -mr-8'} p-2 text-white transition transform`}
                    // Toggles the persistent state (isSidebarOpen)
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    aria-label={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
                >
                    <Info className={`w-5 h-5 transition transform ${isDisplayedOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
            </div>
            
            <div className="flex-1 space-y-2">
                {/* Current Mode Display (Always visible) */}
                <div className={`p-3 bg-gray-800 rounded-lg border border-gray-700`}>
                    <div className={`flex items-center text-sm font-semibold ${!isDisplayedOpen ? 'justify-center' : ''}`}>
                        <currentMode.icon className={`w-4 h-4 ${isDisplayedOpen ? 'mr-2' : 'mx-auto'}`} />
                        {isDisplayedOpen && <span className="hidden md:inline">{currentMode.title}</span>}
                    </div>
                </div>

                {/* Main Navigation Items */}
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={item.action}
                        className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-gray-700 transition"
                    >
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${!isDisplayedOpen ? 'mx-auto' : ''}`} />
                        {isDisplayedOpen && <span className="ml-3 hidden md:inline">{item.name}</span>}
                    </button>
                ))}

                {/* Change Mode Button */}
                <button
                    onClick={onModeChange}
                    className="flex items-center w-full p-3 rounded-lg font-semibold bg-blue-700 hover:bg-blue-600 transition shadow-md mt-4"
                >
                    <Compass className={`w-5 h-5 flex-shrink-0 ${!isDisplayedOpen ? 'mx-auto' : ''}`} />
                    {isDisplayedOpen && <span className="ml-3 hidden md:inline">Change Mode</span>}
                </button>
            </div>
            
            {/* Footer / User Placeholder */}
            <div className="pt-4 border-t border-gray-800 mt-4">
                <div className="flex items-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition">
                    <User className={`w-5 h-5 ${!isDisplayedOpen ? 'mx-auto' : ''}`} />
                    {isDisplayedOpen && <span className="ml-3 hidden md:inline">User 123</span>}
                </div>
            </div>
        </div>
    );
};

/**
 * Component: Main Chat Interface
 */
const ChatInterface = ({ chatHistory, handleSendMessage, chatMode, toggleSidebar }) => {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Start simulation
    setIsSending(true);
    handleSendMessage(trimmedInput, chatMode).finally(() => {
      setInput('');
      setIsSending(false);
    });
  };

  useEffect(() => {
    setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [chatHistory]);

  const modeDisplay = {
    standard: { title: 'Standard Query', color: 'text-blue-600', icon: MessageSquare, colorCode: 'blue' },
    visual: { title: 'Visual Discovery', color: 'text-red-600', icon: Zap, colorCode: 'red' },
    deep: { title: 'Deep Search', color: 'text-green-600', icon: Compass, colorCode: 'green' },
    default: { title: 'FloatChat', color: 'text-gray-900', icon: Globe, colorCode: 'gray' },
  }[chatMode] || { title: 'FloatChat', color: 'text-gray-900', icon: Globe, colorCode: 'gray' };

  const ModeIcon = modeDisplay.icon;
  const buttonClass = `bg-${modeDisplay.colorCode}-600 hover:bg-${modeDisplay.colorCode}-700`;

  return (
    <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-100 shadow-sm">
            {/* Mobile Sidebar Toggle Button (Hamburger Menu) */}
            <button onClick={toggleSidebar} className="p-2 mr-2 md:hidden text-gray-500 hover:text-blue-600">
                <Menu className="w-6 h-6" /> 
            </button>

            <ModeIcon className={`w-7 h-7 ${modeDisplay.color} mr-3`} />
            <h2 className={`text-2xl font-extrabold ${modeDisplay.color}`}>{modeDisplay.title}</h2>
            <span className="text-sm font-semibold text-gray-500 ml-2 hidden sm:inline">Mode Active</span>

            <button
            className="ml-auto text-sm text-gray-500 hover:text-blue-600 flex items-center p-2 rounded-lg transition hover:bg-blue-50"
            onClick={() => console.log("Help Placeholder Clicked")}
            >
            <Info className="w-4 h-4 mr-1" />
            Help
            </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {chatHistory.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
            ))}
            {isSending && (
            <div className="self-start max-w-3/4 mb-4">
                <div className="px-4 py-3 rounded-xl bg-blue-50 text-gray-800 rounded-br-none shadow-md">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-150"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-300"></div>
                </div>
                </div>
            </div>
            )}
            <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask a ${modeDisplay.title} query...`}
                className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-inner"
                disabled={isSending}
            />
            <button
                type="submit"
                disabled={isSending || input.trim() === ''}
                className={`px-6 py-3 text-white rounded-full shadow-lg flex items-center justify-center disabled:bg-gray-400 transition transform hover:scale-[1.02] ${buttonClass}`}
            >
                <Send className="w-5 h-5 mr-1" />
                Send
            </button>
            </form>
            <p className="text-xs text-gray-400 mt-2 text-center">
            Prototype: Outputs are restricted by the current mode. Click **Change Mode** in the sidebar to switch.
            </p>
        </div>
    </div>
  );
};


/**
 * Main Application Component (App)
 */
const App = () => {
  const [view, setView] = useState('onboarding'); 
  const [chatMode, setChatMode] = useState('default'); 
  const [chatHistory, setChatHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Changed to false: collapsed by default on desktop
  const [isHovering, setIsHovering] = useState(false); // Temporary state (hover control)

  const modeExampleQueries = useMemo(() => ({
    standard: [
      'What is the average depth of the world\'s oceans?',
      'Explain the concept of thermohaline circulation.',
      'What is the function of an ocean glider?'
    ],
    visual: [
      'Show me temperature trends near the equator.',
      'Compare oxygen levels in Indian Ocean profiles, July 2024.',
      'Plot the historical sea surface temperature anomalies.'
    ],
    deep: [
      'Where are the latest ARGO floats in the Arabian Sea?',
      'Map the locations of major deep-sea trenches.',
      'Show recent hurricane paths in the Atlantic.'
    ]
  }), []);

  // Welcome message logic
  useEffect(() => {
    if (view === 'chat' && chatHistory.length === 0) {
      const queries = modeExampleQueries[chatMode] || modeExampleQueries['default'];
      const queryList = queries.map((q, i) => `${i + 1}. **${q}**`).join('\n');

      const initialMessage = `Hello! I'm **FloatChat**. You are in **${chatMode.toUpperCase()}** mode.
      \nTry one of these queries optimized for this mode:\n\n${queryList}`;

      setChatHistory([{
        sender: 'ai',
        timestamp: Date.now(),
        type: 'text',
        text: initialMessage,
      }]);
    }
  }, [view, chatMode, modeExampleQueries, chatHistory.length]);

  const handleStartChat = useCallback((mode) => {
    setChatMode(mode);
    setChatHistory([]); 
    setView('chat');
    setIsSidebarOpen(false); // Keep collapsed state for chat focus
  }, []);

  const handleModeChange = useCallback(() => {
      setView('onboarding');
      setChatMode('default'); 
      setChatHistory([]); 
      setIsSidebarOpen(false); // Keep collapsed state for consistent hover behavior on desktop
  }, []);

  const handleSendMessage = useCallback((message, mode) => {
    const newUserMessage = {
      sender: 'user',
      timestamp: Date.now(),
      type: 'text',
      text: message,
    };

    setChatHistory(prev => [...prev, newUserMessage]);

    return new Promise(resolve => {
      setTimeout(() => {
        const aiResponse = getFloatChatResponse(message, mode);
        setChatHistory(prev => [...prev, aiResponse]);
        resolve();
      }, 1500); 
    });
  }, []);

  const toggleSidebar = useCallback(() => {
      setIsSidebarOpen(prev => !prev);
  }, []);
  
  const handleSetIsHovering = useCallback((value) => {
    setIsHovering(value);
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-2 sm:p-4 md:p-6">
      <style>{`
        .recharts-tooltip-wrapper {
          border-radius: 8px !important;
          padding: 10px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1) !important;
        }

        .font-sans {
          font-family: 'Inter', sans-serif;
        }
        /* Ensure dynamic Tailwind classes work */
        .text-blue-500, .border-blue-500, .bg-blue-600, .hover\:bg-blue-700, .bg-blue-700, .hover\:bg-blue-600, .text-blue-400,
        .text-red-500, .border-red-500, .bg-red-600, .hover\:bg-red-700, .text-red-400,
        .text-green-500, .border-green-500, .bg-green-600, .hover\:bg-green-700, .text-green-400,
        .bg-gray-400, .bg-gray-900, .text-gray-300, .hover\:bg-gray-700, .border-gray-700, .text-gray-800, .text-blue-600, .text-red-600, .text-green-600, .text-gray-500 {}
      `}</style>
      
      <div className="w-full max-w-6xl h-[94vh] md:h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex">
        
        {/* SIDEBAR RENDERED ALWAYS */}
        <Sidebar
            chatMode={chatMode}
            onModeChange={handleModeChange}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isHovering={isHovering}
            setIsHovering={handleSetIsHovering}
        />

        {/* MAIN CONTENT AREA */}
        {view === 'onboarding' ? (
            <OnboardingContent onStartChat={handleStartChat} toggleSidebar={toggleSidebar} />
        ) : (
            <ChatInterface
                chatHistory={chatHistory}
                handleSendMessage={handleSendMessage}
                chatMode={chatMode}
                toggleSidebar={toggleSidebar} 
            />
        )}
      </div>
    </div>
  );
};

export default App;
