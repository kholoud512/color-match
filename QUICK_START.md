# Quick Start Guide - Color Match Challenge

Get up and running in **2 minutes**! 

---

## What You Have

A complete, production-ready gaming application:
- **Vue.js 3** with Composition API
- **Tailwind CSS** for beautiful styling
- **Node.js + Express** backend API
- **Docker Compose** for easy deployment
- **Multi-container** architecture
- **Professional code** quality

---

## 3-Step Quick Start

### Step 1: Check Prerequisites (30 seconds)

**You need:**
- Docker Desktop installed and running
- Ports 80 and 5000 available

**Verify Docker is installed:**
```bash
docker --version
# Should show: Docker version 20.x or higher

docker compose version
# Should show: Docker Compose version v2.x or higher
```

**Check Docker is running:**
- Look for Docker icon in system tray (Windows)
- Look for Docker icon in menu bar (Mac)
- Should say "Docker Desktop is running"

---

### Step 2: Start the Application (1 minute)

Open terminal and run:

```bash
# Navigate to project directory
cd color-match-vue

# Start everything with one command!
docker compose up --build
```

**What to expect:**

```
[+] Building frontend...
[+] Building backend...
backend  | Server running on port 5000
frontend | Compiled successfully!
```

**First time:** 2-3 minutes (downloads images, installs dependencies)  
**Next times:** 10-20 seconds (uses cached layers)

**Leave this terminal open!** Keep it running.

---

### Step 3: Play the Game! (30 seconds)

Open your web browser and go to:

```
http://localhost
```

**You should see:** The colorful Color Match Challenge welcome screen! 

**That's it!** You're done! 

---

## How to Play Your First Game

1. **Enter your name** 
   - Type at least 2 characters
   - Example: "Alex", "Player1", "ColorMaster"

2. **Choose an avatar**
   - Click one of the 10 emoji options
   - 🎮 👑 ⚡ 🎯 🧠 🚀 🎨 🏆 🌟

3. **Click "Start Playing"**
   - Game begins immediately

4. **Watch the sequence**
   - Colors will light up one by one
   - Pay attention to the order!

5. **Repeat the pattern**
   - Click the colors in the same order
   - Each round adds one more color

6. **Game over?**
   - Your score is automatically saved
   - Check the global leaderboard!

---

## Useful Commands

### Start the application
```bash
docker compose up --build
```

### Start in background (detached mode)
```bash
docker compose up -d
```

### Stop the application
```bash
docker compose down
```

### View logs (real-time)
```bash
docker compose logs -f
```

### View logs for specific service
```bash
docker compose logs frontend
docker compose logs backend
```

### Check running containers
```bash
docker compose ps
```

### Restart a specific service
```bash
docker compose restart frontend
docker compose restart backend
```

### Rebuild without cache
```bash
docker compose build --no-cache
docker compose up
```

### Stop and remove everything (including volumes)
```bash
docker compose down -v
```

---

## Troubleshooting

### Problem: Port 80 or 5000 already in use

**Error message:**
```
Error: bind: address already in use
```

**Solution 1:** Stop other services using these ports

**Solution 2:** Change ports in `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Use port 8080 instead of 80
  backend:
    ports:
      - "5001:5000"  # Use port 5001 instead of 5000
```

Then access at: `http://localhost:8080`

**Find what's using the port:**

Mac/Linux:
```bash
lsof -ti:80
lsof -ti:5000
```

Windows:
```bash
netstat -ano | findstr :80
netstat -ano | findstr :5000
```

---

### Problem: Docker not starting

**Solution:**
1. Make sure Docker Desktop is running
2. Restart Docker Desktop
3. Check system requirements

**Still not working?**
```bash
docker compose down -v
docker system prune -a -f
docker compose up --build
```

---

### Problem: Page not loading

**Try these steps:**

1. **Wait a bit longer**
   - First build takes 2-3 minutes
   - Refresh the page

2. **Check containers are running**
   ```bash
   docker compose ps
   # Both should show "Up"
   ```

3. **Check logs for errors**
   ```bash
   docker compose logs
   ```

4. **Hard refresh the browser**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

5. **Try different browser**
   - Chrome, Firefox, Safari, Edge

---

### Problem: Backend API not responding

**Check backend is running:**
```bash
curl http://localhost:5000/api/health
```

**Should return:**
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

**If not working:**
```bash
docker compose restart backend
docker compose logs backend
```

---

### Problem: Build fails

**Common causes:**
- No internet connection
- Insufficient disk space
- Corrupted cache

**Solution:**
```bash
# Clean everything
docker compose down -v
docker system prune -a --volumes -f

# Rebuild from scratch
docker compose build --no-cache
docker compose up
```

---

## What Happens When You Start?

### Behind the Scenes

When you run `docker compose up --build`:

1. **Docker Compose reads `docker-compose.yml`**
   - Sees 2 services: frontend + backend
   - Creates a network for them to communicate

2. **Builds Backend Container**
   - Uses `backend/Dockerfile`
   - Installs Node.js dependencies
   - Starts Express server on port 5000

3. **Builds Frontend Container**
   - Uses `frontend/Dockerfile`
   - Installs npm packages
   - Builds Vue.js app (`npm run build`)
   - Copies built files to Nginx
   - Starts Nginx on port 80

4. **Connects Everything**
   - Backend accessible at: `http://localhost:5000`
   - Frontend accessible at: `http://localhost`
   - Frontend can call backend API

5. **You can play!**
   - Open browser
   - Enjoy the game! 🎮

---

## Quick File Overview

```
color-match-vue/
│
├── docker-compose.yml       ← Orchestrates both containers
│
├── backend/
│   ├── Dockerfile          ← How to build backend container
│   ├── package.json        ← Backend dependencies
│   └── src/
│       └── server.js       ← Express API (endpoints)
│
└── frontend/
    ├── Dockerfile          ← How to build frontend container
    ├── nginx.conf          ← Nginx web server config
    ├── package.json        ← Frontend dependencies
    └── src/
        ├── App.vue         ← Main game (Vue component)
        ├── main.js         ← Entry point
        └── style.css       ← Tailwind CSS
```

---

## Understanding the Stack

### Frontend (What You See)
- **Vue.js 3** - JavaScript framework for UI
- **Tailwind CSS** - Utility classes for styling
- **Nginx** - Web server (serves the built app)
- **Runs on:** Port 80 (http://localhost)

### Backend (Behind the Scenes)
- **Node.js** - JavaScript runtime
- **Express** - Web framework for APIs
- **In-memory storage** - Simple data storage
- **Runs on:** Port 5000 (http://localhost:5000)

### Docker (Deployment)
- **docker-compose.yml** - Defines services
- **Dockerfile (frontend)** - Builds Vue.js app
- **Dockerfile (backend)** - Runs Node.js server
- **Network** - Connects frontend ↔ backend

---

## Testing Your Setup

### 1. Test Backend API

Open terminal and run:
```bash
# Health check
curl http://localhost:5000/api/health

# Get leaderboard
curl http://localhost:5000/api/leaderboard

# Get stats
curl http://localhost:5000/api/stats
```

### 2. Test Frontend

Open browser:
```
http://localhost
```

You should see the game!

### 3. Test Full Flow

1. Enter name: "TestPlayer"
2. Choose avatar: 🎮
3. Click "Start Playing"
4. Play a few rounds
5. Intentionally lose
6. Check leaderboard
7. See "TestPlayer" in the list 

---

## Checking Container Status

### View all containers
```bash
docker compose ps
```

**Expected output:**
```
NAME                    STATUS
colormatch-backend      Up (healthy)
colormatch-frontend     Up
```

### View resource usage
```bash
docker stats
```

Shows CPU and memory usage in real-time.

---

## Stopping the Application

### Option 1: Stop (keeps containers)
```bash
docker compose stop
```

To restart:
```bash
docker compose start
```

### Option 2: Down (removes containers)
```bash
docker compose down
```

To start again:
```bash
docker compose up
```

### Option 3: Down + Remove volumes
```bash
docker compose down -v
```

**Warning:** This removes all data!

---

## Next Steps

### Just Want to Play?
You're done! Keep playing and competing!

### Want to Understand How It Works?
Read the full **README.md**

### Need to Record a Demo?
Check out the demo video guide

### Want to Deploy to Production?
Read the Deployment section in README.md

### Want to Modify the Game?
Edit `frontend/src/App.vue`
- Change colors
- Adjust timing
- Add features

---

## Success Checklist

Before saying "It works!":

1- Docker Desktop is installed
2- Docker Desktop is running
3- Ran `docker compose up --build`
4- Saw "Server running" messages
5- Opened http://localhost in browser
6- Entered name and chose avatar
7- Played at least one game
8- Submitted score successfully
9- Viewed leaderboard
10- All features work!

**All checked? Congratulations! **

---

## Pro Tips

### Tip 1: Use detached mode for development
```bash
docker compose up -d
# Runs in background, frees up terminal
```

### Tip 2: Watch logs in separate terminal
```bash
# Terminal 1: Start containers
docker compose up -d

# Terminal 2: Watch logs
docker compose logs -f
```

### Tip 3: Quick rebuild after code changes
```bash
docker compose up --build
# Rebuilds changed containers only
```

### Tip 4: Clean restart
```bash
docker compose down && docker compose up --build
# One command to restart everything fresh
```

---

## Common Use Cases

### "I changed backend code"
```bash
docker compose restart backend
# Or rebuild:
docker compose up --build backend
```

### "I changed frontend code"
```bash
docker compose up --build frontend
```

### "I changed docker-compose.yml"
```bash
docker compose down
docker compose up --build
```

### "Nothing works, start over"
```bash
docker compose down -v
docker system prune -a -f
docker compose up --build
```

---

## Need More Help?

1. **Check README.md** - Comprehensive documentation
2. **Check logs** - `docker compose logs`
3. **Google the error** - Copy-paste error message
4. **Check Docker docs** - https://docs.docker.com
5. **Ask in course forum** - Share logs and errors

---

## You're All Set!

You now have:
- Working application
- Docker environment
- Frontend + Backend + Database
- Professional setup
- Portfolio-worthy project

**Time to play and learn! 🚀**

---

**Questions? Check README.md for detailed documentation!**