// backend api server

const express = require('express');      
const cors = require('cors');            
const helmet = require('helmet');        

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

// allows frontend (port 80) to call backend (port 5000)
app.use(cors({
  origin: '*',                    
  methods: ['GET', 'POST'],       
  credentials: true               
}));

app.use(express.json());

// logs every incoming request to console
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();  
});
 
let nextId = 6;

// api routes

app.get('/', (req, res) => {
  res.json({
    message: '🎮 Color Match Challenge API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      leaderboard: 'GET /api/leaderboard',
      score: 'POST /api/score',
      stats: 'GET /api/stats'
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

// to get top Scores (default: 10, max: 50)
app.get('/api/leaderboard', (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    
    // sort by score 
    const topScores = [...leaderboard]
      .sort((a, b) => b.score - a.score)  
      .slice(0, limit)                     
      .map((entry, index) => ({
        ...entry,
        rank: index + 1                    
      }));
    
    // return success response
    res.json({
      success: true,
      count: topScores.length,
      data: topScores
    });
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

// to submit new Score
app.post('/api/score', (req, res) => {
  try {
    const { name, score, avatar = '🎮' } = req.body;
    
    // validate name
    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Name is required. Must be a string'
      });
    }
    
    if (name.length < 2 || name.length > 20) {
      return res.status(400).json({
        success: false,
        error: 'Name must be between 2 and 20 characters'
      });
    }
    
    // validate score
    if (!score || typeof score !== 'number' || score < 0) {
      return res.status(400).json({
        success: false,
        error: 'Score is required. Must be a positive number'
      });
    }
    
    // create new entiry
    const newEntry = {
      id: nextId++,                        
      name: name.trim(),                   
      score: Math.floor(score),                          
      date: new Date().toISOString()       
    };
    
    leaderboard.push(newEntry);
    
    // sort leaderboard and find rank
    const sortedBoard = [...leaderboard].sort((a, b) => b.score - a.score);
    const rank = sortedBoard.findIndex(entry => entry.id === newEntry.id) + 1;
    
    
    console.log(`✅ New score submitted: ${name} - ${score} points (Rank: ${rank})`);
    
    // return success response
    res.status(201).json({
      success: true,
      message: 'Score submitted successfully',
      data: {
        ...newEntry,
        rank
      }
    });
    
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit score'
    });
  }
});

// to get game statistics
app.get('/api/stats', (req, res) => {
  try {
    const totalGames = leaderboard.length;
    const uniquePlayers = new Set(leaderboard.map(entry => entry.name)).size;
    const totalScore = leaderboard.reduce((sum, entry) => sum + entry.score, 0);
    const avgScore = totalGames > 0 ? (totalScore / totalGames).toFixed(1) : 0;
    const bestScore = Math.max(...leaderboard.map(entry => entry.score), 0);
    
    res.json({
      success: true,
      data: {
        totalGames,                      
        uniquePlayers,                   
        averageScore: parseFloat(avgScore),  
        bestScore                        
      }
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// delete all leaderboard, only allow in development
app.delete('/api/leaderboard', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      error: 'Not allowed in production'
    });
  }
  
  leaderboard = [];
  nextId = 1;
  
  res.json({
    success: true,
    message: 'Leaderboard cleared'
  });
});


// handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('    Backend API    ');
  console.log('');
  console.log(`Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Leaderboard: http://localhost:${PORT}/api/leaderboard`);
  console.log('');
  console.log(`Current leaderboard entries: ${leaderboard.length}`);
  console.log('');
  console.log('Ready to accept requests!');
  console.log('');
});


// to make server close connections gracefully before exiting
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;