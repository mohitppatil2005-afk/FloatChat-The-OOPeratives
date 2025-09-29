// Mock AI response generator for FloatChat
// Modes: 'standard', 'visual', 'deep'

const oceanFacts = [
  'Over 80% of the ocean remains unexplored.',
  'Phytoplankton produce more than half of Earth\'s oxygen.',
  'The Mariana Trench is deeper than Mount Everest is tall.',
  'Ocean currents act like a global conveyor belt for heat.',
  'Sound travels over 4x faster in water than in air.'
];

function randomFact() { return oceanFacts[Math.floor(Math.random() * oceanFacts.length)]; }

export async function getFloatChatResponse({ mode, prompt }) {
  // simulate different latency per mode
  const delay = mode === 'deep' ? 1800 : mode === 'visual' ? 1100 : 700;
  await new Promise(r => setTimeout(r, delay));

  if (mode === 'visual') {
    // Return structured data for charts
    const series = Array.from({ length: 7 }, (_, i) => ({
      day: `D${i+1}`,
      temp: +(12 + Math.random() * 8).toFixed(2),
      salinity: +(30 + Math.random() * 5).toFixed(2)
    }));
    return {
      type: 'visual',
      title: 'Weekly Surface Conditions',
      description: 'Simulated surface temperature (°C) and salinity (PSU) pattern.',
      data: series
    };
  }

  if (mode === 'deep') {
    // Return mock geo features for mapping
    const features = Array.from({ length: 6 }, (_, i) => ({
      id: `pt-${i}`,
      lat: +( -60 + Math.random() * 120).toFixed(3),
      lon: +(-180 + Math.random() * 360).toFixed(3),
      depth: +(100 + Math.random() * 4800).toFixed(0),
      value: +(Math.random() * 100).toFixed(1)
    }));
    return {
      type: 'deep',
      title: 'Random Bathymetry Sample Points',
      description: 'Synthetic geospatial points with depth and intensity values.',
      features
    };
  }

  // Standard text mode
  return {
    type: 'text',
    content: `Analysis: ${prompt}\n${randomFact()}\nSuggested next query: Ask about thermocline variability.`
  };
}
