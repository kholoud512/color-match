<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      
      <!-- Welcome screen -->
      <div v-if="gameState === 'welcome'" class="card animate-fade-in">
        <div class="text-center">
          <h1 class="text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Color Match Challenge
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            Test your memory with color sequences! 
          </p>
          
          <!-- Name Input -->
          <input
            v-model="playerName"
            @keyup.enter="startGame"
            type="text"
            placeholder="Enter your name..."
            class="w-full px-6 py-4 text-xl border-4 border-purple-300 rounded-xl mb-6 focus:outline-none focus:border-purple-500 transition-colors"
            maxlength="20"
          />
          
          <!-- Avatar Selector -->
          <div class="mb-8">
            <p class="text-sm text-gray-500 mb-3">Choose your avatar:</p>
            <div class="flex justify-center gap-2 flex-wrap">
              <button
                v-for="avatar in avatars"
                :key="avatar"
                @click="selectedAvatar = avatar"
                :class="[
                  'text-4xl p-2 rounded-lg transition-all',
                  selectedAvatar === avatar
                    ? 'bg-purple-100 scale-125 shadow-lg'
                    : 'hover:bg-gray-100 hover:scale-110'
                ]"
              >
                {{ avatar }}
              </button>
            </div>
          </div>
          
          <!-- Start Button -->
          <button
            @click="startGame"
            :disabled="!playerName.trim() || playerName.length < 2"
            class="btn-primary text-xl px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Playing
          </button>
          
          <!-- Instructions -->
          <div class="mt-8 p-6 bg-purple-50 rounded-xl text-left">
            <h3 class="font-bold text-lg mb-3 text-purple-600">📋 How to Play</h3>
            <ol class="space-y-2 text-gray-700">
              <li>1️⃣ Watch the color sequence carefully</li>
              <li>2️⃣ Click the colors in the same order</li>
              <li>3️⃣ Each round adds one more color</li>
              <li>4️⃣ How far can you go? 🏆</li>
            </ol>
          </div>
        </div>
      </div>
      
      <!-- Game screen -->
      <div v-if="gameState === 'watching' || gameState === 'playing'" class="space-y-6">
        <!-- Header -->
        <div class="card flex justify-between items-center">
          <div class="flex items-center gap-4">
            <span class="text-5xl">{{ selectedAvatar }}</span>
            <div>
              <p class="font-bold text-2xl">{{ playerName }}</p>
              <p class="text-gray-500">Round {{ round }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-gray-500 text-sm">Score</p>
            <p class="text-4xl font-black text-purple-600">{{ score }}</p>
          </div>
        </div>
        
        <!-- Status -->
        <div class="card text-center">
          <p v-if="gameState === 'watching'" class="text-2xl font-bold text-orange-500">
            👀 Watch the sequence...
          </p>
          <div v-if="gameState === 'playing'">
            <p class="text-2xl font-bold text-green-500 mb-2">
              Your turn!
            </p>
            <p class="text-gray-500">
              {{ playerSequence.length }} / {{ sequence.length }}
            </p>
          </div>
        </div>
        
        <!-- Color Grid -->
        <div class="grid grid-cols-3 gap-4">
          <button
            v-for="color in colors"
            :key="color.name"
            @click="handleColorClick(color)"
            :disabled="gameState !== 'playing'"
            :class="[
              'color-button',
              color.bg,
              activeColor === color.name ? `${color.shadow} scale-110` : '',
              gameState !== 'playing' ? 'opacity-70 cursor-not-allowed' : ''
            ]"
          >
            {{ color.emoji }}
          </button>
        </div>
      </div>
      
      <!-- Game Over Screen -->
      <div v-if="gameState === 'gameover'" class="card text-center animate-fade-in">
        <h2 class="text-5xl font-black mb-6 text-purple-600">
          {{ playerRank <= 3 ? '🏆 Amazing!' : 'Game Over!' }}
        </h2>
        
        <!-- Score Circle -->
        <div class="mb-8 flex justify-center">
          <div class="w-48 h-48 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center text-white shadow-2xl">
            <p class="text-6xl font-black">{{ score }}</p>
            <p class="text-sm uppercase tracking-wider">Final Score</p>
          </div>
        </div>
        
        <!-- Stats -->
        <div class="flex justify-center gap-8 mb-8">
          <div>
            <p class="text-4xl mb-1">🎯</p>
            <p class="text-3xl font-bold text-purple-600">{{ round - 1 }}</p>
            <p class="text-gray-500 text-sm">Rounds</p>
          </div>
          <div>
            <p class="text-4xl mb-1">🏅</p>
            <p class="text-3xl font-bold text-purple-600">#{{ playerRank || '?' }}</p>
            <p class="text-gray-500 text-sm">Rank</p>
          </div>
        </div>
        
        <!-- Buttons -->
        <div class="flex gap-4 justify-center">
          <button @click="playAgain" class="btn-primary">
            🔄 Play Again
          </button>
          <button @click="showLeaderboard" class="btn-primary bg-purple-600 text-white hover:bg-purple-700">
            Leaderboard
          </button>
        </div>
      </div>
      
      <!-- Leaderboard Screen -->
      <div v-if="gameState === 'leaderboard'" class="card animate-fade-in">
        <h2 class="text-4xl font-black text-center mb-6 text-purple-600">
          🏆 Global Leaderboard
        </h2>
        
        <!-- Stats Bar -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white text-center">
            <p class="text-3xl font-bold">{{ stats.totalGames || 0 }}</p>
            <p class="text-sm opacity-90">Total Games</p>
          </div>
          <div class="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white text-center">
            <p class="text-3xl font-bold">{{ stats.uniquePlayers || 0 }}</p>
            <p class="text-sm opacity-90">Players</p>
          </div>
          <div class="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white text-center">
            <p class="text-3xl font-bold">{{ stats.bestScore || 0 }}</p>
            <p class="text-sm opacity-90">Best Score</p>
          </div>
        </div>
        
        <!-- Leaderboard List -->
        <div class="space-y-3 mb-6 max-h-96 overflow-y-auto">
          <div
            v-for="(entry, index) in leaderboard"
            :key="entry.id"
            :class="[
              'flex items-center justify-between p-4 rounded-xl transition-all',
              entry.name === playerName
                ? 'bg-purple-100 border-2 border-purple-500'
                : 'bg-gray-50 hover:bg-gray-100'
            ]"
          >
            <div class="flex items-center gap-4">
              <span class="text-2xl w-8 text-center">
                <template v-if="index === 0">🥇</template>
                <template v-else-if="index === 1">🥈</template>
                <template v-else-if="index === 2">🥉</template>
                <template v-else>#{{ index + 1 }}</template>
              </span>
              <span class="text-3xl">{{ entry.avatar }}</span>
              <div>
                <p class="font-bold text-lg">{{ entry.name }}</p>
                <p class="text-sm text-gray-500">
                  {{ new Date(entry.date).toLocaleDateString() }}
                </p>
              </div>
            </div>
            <p class="text-3xl font-black text-purple-600">
              {{ entry.score }}
            </p>
          </div>
        </div>
        
        <!-- Back Button -->
        <button @click="backToWelcome" class="btn-primary w-full">
          Back to Menu
        </button>
      </div>
      
    </div>
  </div>
</template>

<script setup>
// Game logic
import { ref, reactive } from 'vue'
import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:5000'

const COLORS = [
  { name: 'red', emoji: '🔴', bg: 'bg-game-red', shadow: 'shadow-glow-red' },
  { name: 'blue', emoji: '🔵', bg: 'bg-game-blue', shadow: 'shadow-glow-blue' },
  { name: 'green', emoji: '🟢', bg: 'bg-game-green', shadow: 'shadow-glow-green' },
  { name: 'yellow', emoji: '🟡', bg: 'bg-game-yellow', shadow: 'shadow-glow-yellow' },
  { name: 'purple', emoji: '🟣', bg: 'bg-purple-500', shadow: 'shadow-glow' },
  { name: 'orange', emoji: '🟠', bg: 'bg-game-orange', shadow: 'shadow-glow-yellow' },
]

const AVATARS = ['🎮', '👑', '⚡', '🎯', '🧠', '🚀', '🎨', '🏆', '🌟']
const gameState = ref('welcome')
const playerName = ref('')
const selectedAvatar = ref('🎮')

const colors = reactive(COLORS)
const avatars = reactive(AVATARS)

const sequence = ref([])
const playerSequence = ref([])
const round = ref(0)
const score = ref(0)
const activeColor = ref(null)

const leaderboard = ref([])
const stats = ref({})
const playerRank = ref(null)

let audioContext = null

// start new game
const startGame = () => {
  if (!playerName.value.trim() || playerName.value.length < 2) {
    alert('Please enter a name (at least 2 characters)')
    return
  }
  
  // reset game
  sequence.value = []
  playerSequence.value = []
  round.value = 1
  score.value = 0
  gameState.value = 'watching'
  
  // initialize audio
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  
  // start first round
  setTimeout(() => {
    nextRound([])
  }, 500)
}

// start next round
const nextRound = (currentSeq) => {
  // add random color
  const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
  const newSequence = [...currentSeq, randomColor]
  
  sequence.value = newSequence
  playerSequence.value = []
  gameState.value = 'watching'
  
  // play sequence
  setTimeout(() => {
    playSequence(newSequence)
  }, 500)
}

// play color sequence
const playSequence = async (seq) => {
  for (let i = 0; i < seq.length; i++) {
    const color = seq[i]
    
    // light up
    activeColor.value = color.name
    playSound(color.name)
    await sleep(500)
    
    // turn off
    activeColor.value = null
    await sleep(200)
  }
  
  // player's turn
  gameState.value = 'playing'
}

// handle color button 
const handleColorClick = (color) => {
  if (gameState.value !== 'playing') return
  
  // visual feedback
  activeColor.value = color.name
  playSound(color.name)
  
  setTimeout(() => {
    activeColor.value = null
  }, 200)
  
  // add to player sequence
  const newPlayerSeq = [...playerSequence.value, color]
  playerSequence.value = newPlayerSeq
  
  // check correctness
  const currentIndex = playerSequence.value.length - 1
  const isCorrect = color.name === sequence.value[currentIndex].name
  
  if (!isCorrect) {
    endGame()
    return
  }
  
  // check the round completion
  if (newPlayerSeq.length === sequence.value.length) {
    const newScore = score.value + sequence.value.length
    score.value = newScore
    round.value++
    
    // next round
    setTimeout(() => {
      gameState.value = 'watching'
      setTimeout(() => {
        nextRound(sequence.value)
      }, 500)
    }, 1000)
  }
}

// end game
const endGame = async () => {
  gameState.value = 'gameover'
  
  // submit score
  try {
    const response = await axios.post(`${API_URL}/api/score`, {
      name: playerName.value,
      score: score.value,
      avatar: selectedAvatar.value
    })
    
    console.log('Score submitted:', response.data)
    playerRank.value = response.data.data.rank
    
    await loadLeaderboard()
  } catch (error) {
    console.error('Error submitting score:', error)
    alert('Failed to submit score')
  }
}

// play again
const playAgain = () => {
  gameState.value = 'welcome'
}

// show leaderboard
const showLeaderboard = async () => {
  await loadLeaderboard()
  await loadStats()
  gameState.value = 'leaderboard'
}

//back to welcome
const backToWelcome = () => {
  gameState.value = 'welcome'
  playerName.value = ''
}

// load leaderboard from API
const loadLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/leaderboard?limit=10`)
    leaderboard.value = response.data.data
  } catch (error) {
    console.error('Error loading leaderboard:', error)
  }
}

// load global stats from API
const loadStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/stats`)
    stats.value = response.data.data
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

// sound effects
const playSound = (colorName) => {
  if (!audioContext) return
  
  const frequencies = {
    red: 261.63,
    blue: 293.66,
    green: 329.63,
    yellow: 349.23,
    purple: 392.00,
    orange: 440.00,
  }
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = frequencies[colorName]
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.3
  )
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.3)
}

//sleep utility
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

</script>