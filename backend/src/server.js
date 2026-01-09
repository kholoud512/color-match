// Backend API Server

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// DATA STORAGE 
// Start with empty leaderboard 
let leaderboard = [];
let nextId = 1;

// API ROUTES
app.get('/', (req, res) => {
  res.json({
    name: 'Color Match Challenge API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      leaderboard: '/api/leaderboard',
      submitScore: 'POST /api/score',
      stats: '/api/stats'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/leaderboard', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const sortedLeaderboard = [...leaderboard]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
        date: entry.date.toISOString()
      }));
    
    res.json({
      success: true,
      count: sortedLeaderboard.length,
      data: sortedLeaderboard
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leaderboard'
    });
  }
});

app.post('/api/score', (req, res) => {
  try {
    const { name, score, avatar = '🎮' } = req.body;
    
    if (!name || name.trim().length < 2 || name.trim().length > 20) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 20 characters'
      });
    }
    
    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({
        success: false,
        message: 'Score must be a positive number'
      });
    }
    
    const newEntry = {
      id: nextId++,
      name: name.trim(),
      score: score,
      avatar: avatar,
      date: new Date()
    };
    
    leaderboard.push(newEntry);
    
    const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);
    const rank = sortedLeaderboard.findIndex(entry => entry.id === newEntry.id) + 1;
    
    res.status(201).json({
      success: true,
      message: 'Score submitted successfully',
      data: {
        ...newEntry,
        date: newEntry.date.toISOString(),
        rank: rank
      }
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit score'
    });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const totalGames = leaderboard.length;
    const uniquePlayers = new Set(leaderboard.map(entry => entry.name)).size;
    const averageScore = totalGames > 0
      ? leaderboard.reduce((sum, entry) => sum + entry.score, 0) / totalGames
      : 0;
    const bestScore = totalGames > 0
      ? Math.max(...leaderboard.map(entry => entry.score))
      : 0;
    
    res.json({
      success: true,
      data: {
        totalGames,
        uniquePlayers,
        averageScore: Math.round(averageScore * 10) / 10,
        bestScore
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics'
    });
  }
});

app.delete('/api/leaderboard', (req, res) => {
  try {
    leaderboard = [];
    nextId = 1;
    
    res.json({
      success: true,
      message: 'Leaderboard cleared'
    });
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear leaderboard'
    });
  }
});

// ERROR HANDLING
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// SERVER STARTUP
const server = app.listen(PORT, () => {
  console.log('');
  console.log('   Color Match Challenge - Backend API   ');
  console.log('');
  console.log(`Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Leaderboard: http://localhost:${PORT}/api/leaderboard`);
  console.log('');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;