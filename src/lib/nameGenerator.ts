const ADJECTIVES = [
  'silent', 'purple', 'winter', 'pixel', 'neon', 'cyber', 'quantum', 'cosmic', 'stellar', 'lunar',
  'solar', 'astral', 'crimson', 'emerald', 'sapphire', 'golden', 'silver', 'crystal', 'hollow', 'phantom',
  'shadow', 'ghost', 'mystic', 'ancient', 'frozen', 'burning', 'electric', 'magnetic', 'kinetic', 'static'
];

const NOUNS = [
  'falcon', 'river', 'moon', 'cloud', 'star', 'sun', 'sky', 'ocean', 'wave', 'storm',
  'wind', 'fire', 'ice', 'snow', 'rain', 'thunder', 'lightning', 'forest', 'mountain', 'valley',
  'fox', 'wolf', 'bear', 'eagle', 'hawk', 'owl', 'raven', 'dragon', 'phoenix', 'griffin'
];

export function generateMemorableName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 900) + 100; // 100-999
  
  return `${adj}-${noun}-${num}`;
}
