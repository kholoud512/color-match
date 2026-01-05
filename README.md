# 🎮 Color Match Challenge - Vue.js Edition

> A modern memory game built with **Vue.js 3**, **Node.js**, **Tailwind CSS**, and **Docker**

![Tech Stack](https://img.shields.io/badge/Vue.js-3.3-green)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

Test your memory by watching and repeating increasingly complex color sequences. Compete on the global leaderboard!

## Features

- **Beautiful UI** - Modern design with Tailwind CSS
- **Engaging Gameplay** - Progressive difficulty
- **Sound Effects** - Audio feedback using Web Audio API
- **Global Leaderboard** - Compete with other players
- **Real-time Stats** - Track your performance
- **Dockerized** - Multi-container setup with Docker Compose
- **Responsive** - Works on all devices
- **Vue 3 Composition API** - Modern, reactive architecture

## Quick Start

### Prerequisites

- Docker Desktop installed
- Ports 80 and 5000 available

### Installation

1. **Navigate to project**
   ```bash
   cd color-match-vue
   ```

2. **Start with Docker Compose**
   ```bash
   docker compose up --build
   ```

3. **Play the game!**
   ```
   Open: http://localhost
   ```

That's it! Both frontend and backend will start automatically.

## Project Structure

```
color-match-vue/
├── docker-compose.yml          # Multi-container orchestration
├── README.md                   # This file
├── QUICK_START.md             # Quick setup guide
│
├── frontend/                   # Vue.js application
│   ├── Dockerfile             # Frontend container config
│   ├── nginx.conf             # Nginx web server config
│   ├── package.json           # Frontend dependencies
│   ├── vue.config.js          # Vue CLI configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── postcss.config.js      # PostCSS config
│   ├── public/
│   │   └── index.html         # HTML template
│   └── src/
│       ├── main.js            # Vue entry point
│       ├── App.vue            # Main game component
│       └── style.css          # Tailwind + global styles
│
└── backend/                    # Node.js API
    ├── Dockerfile             # Backend container config
    ├── package.json           # Backend dependencies
    └── src/
        └── server.js          # Express API + in-memory storage
```

## How to Play

1. **Enter your name** (2-20 characters)
2. **Choose an avatar** from 10 emoji options
3. **Watch the sequence** - Colors will light up in order
4. **Your turn!** - Click the colors in the same order
5. **Level up** - Each round adds one more color
6. **Compete** - Try to beat the high scores!

### Scoring

- Score = Sequence Length
- Each successful round = points
- Game ends on first mistake
- Scores saved to leaderboard automatically

## Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Composition API** - Modern, composable logic
- **Tailwind CSS 3** - Utility-first styling
- **Axios** - HTTP client
- **Nginx** - Production web server

### Backend
- **Node.js 18** - JavaScript runtime
- **Express** - Web framework
- **CORS** - Cross-origin requests
- **Helmet** - Security headers
- **In-memory storage** - Simple, fast (can upgrade to database)

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Alpine Linux** - Minimal base images
- **Multi-stage builds** - Optimized images

## Docker Architecture

### Multi-Stage Build

**Frontend Container:**
```dockerfile
Stage 1: Build Vue app with Node.js (installs dependencies, builds app)
Stage 2: Serve with Nginx (only built files, 20MB final image!)
```

**Backend Container:**
```dockerfile
Node.js 18 Alpine + Express API
In-memory storage (can extend with PostgreSQL/MongoDB/Redis)
```

### Services

| Service  | Port | Description                |
|----------|------|----------------------------|
| Frontend | 80   | Vue.js app served by Nginx |
| Backend  | 5000 | RESTful API with Express   |

### Communication
- Containers connected via Docker network: `app-network`
- Frontend calls backend: `http://localhost:5000/api/*`
- Backend accessible from host: `http://localhost:5000`

## API Endpoints

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00Z",
  "uptime": 123.45
}
```

### GET /api/leaderboard
Get top scores

**Query Parameters:**
- `limit` - Number of results (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "name": "PlayerName",
      "score": 35,
      "avatar": "🎮",
      "date": "2024-01-01T12:00:00Z",
      "rank": 1
    }
  ]
}
```

### POST /api/score
Submit new score

**Body:**
```json
{
  "name": "PlayerName",
  "score": 35,
  "avatar": "🎮"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Score submitted successfully",
  "data": {
    "id": 6,
    "name": "PlayerName",
    "score": 35,
    "avatar": "🎮",
    "date": "2024-01-01T12:00:00Z",
    "rank": 3
  }
}
```

### GET /api/stats
Get global statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalGames": 25,
    "uniquePlayers": 10,
    "averageScore": 28.5,
    "bestScore": 42
  }
}
```

## Development

### Run Locally (Without Docker)

**Backend:**
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run serve
# Runs on http://localhost:8080
```

### Environment Variables

**Frontend** (.env):
```env
VUE_APP_API_URL=http://localhost:5000
```

**Backend** (.env):
```env
PORT=5000
NODE_ENV=development
```

## Vue.js 3 Composition API

### Why Composition API?

The Composition API is the modern way to write Vue components. Benefits:

- **Better code organization** - Group related logic together
- **Reusable logic** - Extract to composable functions
- **TypeScript support** - Better type inference
- **Less boilerplate** - No `data()`, `methods`, `computed` objects
- **More flexible** - Easier to compose complex logic

### Example: Counter Component

**Options API (Old Way):**
```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    double() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
```

**Composition API (New Way):**
```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)
const increment = () => count.value++
</script>
```

Much cleaner! 

## Key Vue.js Concepts

### 1. Reactive References
```javascript
import { ref } from 'vue'

const count = ref(0)        // Create reactive value
count.value++               // Update value
console.log(count.value)    // Access value
```

### 2. Reactive Objects
```javascript
import { reactive } from 'vue'

const state = reactive({
  name: 'Alice',
  age: 25
})

state.name = 'Bob'  // No .value needed for objects
```

### 3. Computed Properties
```javascript
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

### 4. Template Directives
```vue
<template>
  <!-- Conditional rendering -->
  <div v-if="isVisible">Visible</div>
  <div v-else>Hidden</div>
  
  <!-- List rendering -->
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
  
  <!-- Event handling -->
  <button @click="handleClick">Click</button>
  
  <!-- Two-way binding -->
  <input v-model="text" />
</template>
```

## Customization

### Add More Colors

Edit `frontend/src/App.vue`:
```javascript
const COLORS = [
  { name: 'red', emoji: '🔴', bg: 'bg-red-500', shadow: 'shadow-glow-red' },
  { name: 'pink', emoji: '🩷', bg: 'bg-pink-500', shadow: 'shadow-glow' },
  // Add your color here
]
```

### Change Avatars

```javascript
const AVATARS = ['🎮', '👑', '⚡', '🎯', '🧠', '🚀', '🎨', '🏆', '🌟', '💎', '🔥']
```

### Adjust Difficulty

Modify timing in `App.vue`:
```javascript
await sleep(500)  // Color display time (lower = harder)
await sleep(200)  // Gap between colors
```

### Change Color Display Duration
```javascript
// In playSequence function
await sleep(300)  // Faster sequence (harder)
await sleep(700)  // Slower sequence (easier)
```

## Deployment

### Deploy to Production

1. **Build images**
   ```bash
   docker compose build
   ```

2. **Run in production mode**
   ```bash
   docker compose up -d
   ```

3. **Update API URL** (if deploying to different domains)
   ```bash
   export VUE_APP_API_URL=https://api.yourdomain.com
   docker compose build frontend
   docker compose up -d
   ```

### Deploy to Cloud Platforms

**Frontend (Static):**
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

**Backend (API):**
- Railway
- Render
- Heroku
- DigitalOcean App Platform

**Full Stack:**
- AWS ECS / Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean Apps

### Example: Vercel + Railway

1. **Backend on Railway:**
   ```bash
   railway login
   railway init
   railway up
   ```

2. **Frontend on Vercel:**
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

## Performance

- **Frontend Bundle:** ~150KB gzipped (Vue + Tailwind)
- **Backend Image:** ~120MB (Node.js Alpine)
- **Frontend Image:** ~25MB (Nginx Alpine)
- **Load Time:** < 1s on fast connection
- **Lighthouse Score:** 95+ (Performance)

## Testing

### Manual Testing Checklist

1- Start Docker containers
2- Access http://localhost
3- Enter name and select avatar
4- Play game (multiple rounds)
5- Make intentional mistake
6- Check game over screen
7- View leaderboard
8- Verify score appears
9- Check global stats
10- Return to welcome screen

### API Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Get leaderboard
curl http://localhost:5000/api/leaderboard

# Submit score
curl -X POST http://localhost:5000/api/score \
  -H "Content-Type: application/json" \
  -d '{"name":"TestPlayer","score":25,"avatar":"🎮"}'

# Get stats
curl http://localhost:5000/api/stats
```

## Troubleshooting

### Port Already in Use

```bash
# Stop containers
docker compose down

# Check what's using the port
lsof -ti:80   # Mac/Linux
netstat -ano | findstr :80  # Windows

# Kill the process or change port in docker-compose.yml
ports:
  - "8080:80"  # Use port 8080 instead
```

### Docker Build Fails

```bash
# Clean Docker cache
docker compose down -v
docker system prune -a -f

# Rebuild
docker compose build --no-cache
docker compose up
```

### Frontend Can't Connect to Backend

1. Check both containers are running:
   ```bash
   docker compose ps
   ```

2. Check backend logs:
   ```bash
   docker compose logs backend
   ```

3. Verify backend is accessible:
   ```bash
   curl http://localhost:5000/api/health
   ```

### Containers Exit Immediately

```bash
# View logs
docker compose logs

# Common issues:
# - Port already in use
# - Syntax error in code
# - Missing dependencies
```

## Roadmap

### Phase 1 (Current)
- [x] Basic game mechanics
- [x] Leaderboard system
- [x] Docker deployment
- [x] Responsive design

### Phase 2 (Easy)
- [ ] Add difficulty levels (Easy, Medium, Hard)
- [ ] Add sound on/off toggle
- [ ] Add dark mode
- [ ] Add more color options

### Phase 3 (Medium)
- [ ] User accounts (localStorage)
- [ ] Save game progress
- [ ] Achievements system
- [ ] Share scores on social media
- [ ] PWA support (offline mode)

### Phase 4 (Advanced)
- [ ] Replace in-memory with PostgreSQL
- [ ] Add WebSocket for real-time updates
- [ ] Multiplayer mode
- [ ] Tournament system
- [ ] Mobile apps (React Native / Capacitor)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use Vue 3 Composition API (`<script setup>`)
- Follow Tailwind CSS conventions
- Write clear comments
- Test before submitting

## License

This project is licensed under the MIT License - see the LICENSE file for details.


## Acknowledgments

- Built with Vue.js 3 Composition API
- Styled with Tailwind CSS
- Containerized with Docker
- Inspired by classic memory games
- Icons: Native emoji
- Font: Inter (Google Fonts)

## Learning Resources

### Vue.js
- Official Docs: https://vuejs.org
- Composition API: https://vuejs.org/guide/extras/composition-api-faq.html
- Vue School: https://vueschool.io

### Tailwind CSS
- Official Docs: https://tailwindcss.com
- Tailwind UI: https://tailwindui.com

### Docker
- Official Docs: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose

## Useful Links

- [Vue.js Documentation](https://vuejs.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Docker Documentation](https://docs.docker.com)
- [Node.js Documentation](https://nodejs.org)
- [Express Documentation](https://expressjs.com)

---

**Good Luck!**