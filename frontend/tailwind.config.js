// we use postcss to process our tailwind css

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",              
    "./src/**/*.{vue,js,ts,jsx,tsx}",  
  ],
  
  theme: {
    extend: {
      colors: {
        'game-red': '#ef4444',        
        'game-blue': '#3b82f6',       
        'game-green': '#10b981',      
        'game-yellow': '#f59e0b',     
        'game-purple': '#a855f7',     
        'game-orange': '#f97316',     
      },
      
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      
      boxShadow: {
        'glow': '0 0 20px rgba(168, 85, 247, 0.4)',           
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.4)',        
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.4)',      
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.4)',     
        'glow-yellow': '0 0 20px rgba(245, 158, 11, 0.4)',    
      },
    },
  },
  
  plugins: [],
}