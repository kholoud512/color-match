# Troubleshooting Guide

## VS Code Warnings: "Unknown at rule @tailwind"

### This is NORMAL and SAFE!

**What you see:**
```
Unknown at rule @tailwind
Unknown at rule @apply
```

**Why it happens:**
- VS Code's CSS validator doesn't understand Tailwind
- These directives are processed during Docker build
- The app works perfectly despite warnings!

**Solutions:**

#### Option 1: Ignore (Easiest)
Just ignore the warnings. Your app works fine! 

#### Option 2: Hide Warnings in VS Code
The `.vscode/settings.json` file is already included to hide these warnings.

If you don't see it working:
1. Reload VS Code (`Ctrl + Shift + P` → "Reload Window")
2. Or restart VS Code

#### Option 3: Install Tailwind Extension
1. Open Extensions (`Ctrl + Shift + X`)
2. Search "Tailwind CSS IntelliSense"
3. Install by Tailwind Labs
4. Reload VS Code

---

## Docker Issues

### Port Already in Use

**Error:**
```
Error: bind: address already in use
```

**Solution:**
```bash
# Stop containers
docker compose down

# Check what's using the port
# Windows:
netstat -ano | findstr :80
netstat -ano | findstr :5000

# Mac/Linux:
lsof -ti:80
lsof -ti:5000

# Kill the process or change ports in docker-compose.yml
```

### Docker Not Starting

**Error:**
```
Cannot connect to Docker daemon
```

**Solution:**
1. Make sure Docker Desktop is running
2. Check system tray (Windows) or menu bar (Mac)
3. Restart Docker Desktop
4. Wait 30 seconds for it to fully start

### Build Fails

**Error:**
```
npm install failed
```

**Solution:**
```bash
# Clean everything
docker compose down -v
docker system prune -a -f

# Rebuild from scratch
docker compose build --no-cache
docker compose up
```

### Container Exits Immediately

**Solution:**
```bash
# View logs
docker compose logs

# Check specific service
docker compose logs backend
docker compose logs frontend

# Look for error messages in red
```

---

## Browser Issues

### Page Not Loading

**Solutions:**

1. **Wait longer** - First build takes 2-3 minutes
   ```bash
   # Check if containers are running
   docker compose ps
   # Both should show "Up"
   ```

2. **Hard refresh**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **Clear browser cache**
   - Chrome: `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Clear data

4. **Try different browser**
   - Chrome, Firefox, Safari, Edge

5. **Check URL**
   - Should be: `http://localhost` (not https)

### Frontend Loads But Backend Fails

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

## npm/Node.js Issues

### Running Locally (Without Docker)

**Backend:**
```bash
cd backend
npm install
npm start
```

**Common issues:**
- Node.js version too old → Install Node 18+
- Port 5000 in use → Change PORT in backend/src/server.js

**Frontend:**
```bash
cd frontend
npm install
npm run serve
```

**Common issues:**
- `vue-cli-service` not found → Run `npm install` again
- Port 8080 in use → Change port in vue.config.js

---

## API Issues

### CORS Errors

**Error in browser console:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
- Make sure backend is running
- Check `docker compose ps` shows both containers
- CORS is already configured in backend/src/server.js
- If still failing, restart containers:
  ```bash
  docker compose restart
  ```

### API 404 Errors

**Error:**
```
GET http://localhost:5000/api/leaderboard 404
```

**Solution:**
1. Check backend is running: `docker compose logs backend`
2. Test API directly: `curl http://localhost:5000/api/health`
3. Restart backend: `docker compose restart backend`

---

## Game Issues

### Colors Not Lighting Up

**Possible causes:**
- JavaScript error (check browser console: F12)
- Audio context not initialized
- Browser blocking audio

**Solution:**
1. Check browser console for errors (F12)
2. Click anywhere on page first (audio needs user interaction)
3. Try different browser

### Score Not Submitting

**Check:**
1. Backend is running: `docker compose logs backend`
2. Network tab in browser (F12 → Network)
3. Look for POST request to `/api/score`
4. Check response status (should be 201)

**Solution:**
```bash
# Restart backend
docker compose restart backend

# Check logs
docker compose logs backend -f
```

---

## Development Issues

### Hot Reload Not Working

**For local development (without Docker):**

**Backend:**
```bash
cd backend
npm install --save-dev nodemon
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run serve
```

Changes should now auto-reload!

### Tailwind Classes Not Working

**Check:**
1. `tailwind.config.js` exists 
2. `postcss.config.js` exists 
3. `style.css` has `@tailwind` directives 
4. Rebuild: `docker compose up --build`

**If still not working:**
```bash
# Full rebuild
docker compose down -v
docker compose build --no-cache
docker compose up
```

---

## File Issues

### Missing Files

**If you see "file not found" errors:**

1. Check all files exist:
   ```bash
   ls -la frontend/
   ls -la backend/
   ```

2. Re-download project if needed

3. Check `.gitignore` isn't hiding files

### Permission Issues (Linux/Mac)

**Error:**
```
Permission denied
```

**Solution:**
```bash
# Fix permissions
sudo chown -R $USER:$USER .

# Or run with sudo (not recommended)
sudo docker compose up
```

---

## Debugging Tips

### View Container Logs

```bash
# All logs
docker compose logs

# Follow logs (real-time)
docker compose logs -f

# Specific service
docker compose logs backend
docker compose logs frontend

# Last 50 lines
docker compose logs --tail=50
```

### Enter Container Shell

```bash
# Backend container
docker compose exec backend sh

# Frontend container (Nginx)
docker compose exec frontend sh

# Explore files, check environment, etc.
```

### Check Container Status

```bash
# List containers
docker compose ps

# Should show:
# NAME                    STATUS
# colormatch-backend      Up (healthy)
# colormatch-frontend     Up
```

### Inspect Container

```bash
# View container details
docker inspect colormatch-backend
docker inspect colormatch-frontend

# Check networks
docker network ls
docker network inspect color-match-react_app-network
```

---

## Clean Up Commands

### Remove Everything

```bash
# Stop and remove containers
docker compose down

# Remove containers, networks, and volumes
docker compose down -v

# Remove all Docker data (careful!)
docker system prune -a --volumes -f
```

### Fresh Start

```bash
# Complete reset
docker compose down -v
docker system prune -a -f

# Rebuild
docker compose up --build
```

---

## Performance Issues

### Slow Build Times

**First build is always slow (2-3 minutes).**

**To speed up:**
1. Use layer caching (already configured)
2. Don't change `package.json` frequently
3. Use faster internet connection
4. Increase Docker resources (Settings → Resources)

### Slow Runtime

**Check:**
```bash
docker stats
```

**Shows CPU and memory usage.**

**Solutions:**
- Increase Docker memory limit (Settings → Resources)
- Close other applications
- Restart Docker Desktop

---

## Still Not Working?

### Step 1: Check Docker Installation

```bash
docker --version
docker compose version
```

Should show version numbers.

### Step 2: Test Simple Container

```bash
docker run hello-world
```

Should show "Hello from Docker!"

### Step 3: Check Ports

```bash
# Make sure ports 80 and 5000 are free
# Windows:
netstat -ano | findstr :80
netstat -ano | findstr :5000

# Mac/Linux:
lsof -ti:80
lsof -ti:5000
```

### Step 4: Complete Reset

```bash
# Nuclear option - removes everything
docker compose down -v
docker system prune -a --volumes -f
docker compose up --build
```

### Step 5: Check System Requirements

**Minimum:**
- RAM: 4GB
- Disk: 10GB free
- OS: Windows 10, macOS 10.15, Linux kernel 3.10+

**Recommended:**
- RAM: 8GB+
- Disk: 20GB+ free
- SSD (faster builds)

---

## Getting Help

### Before Asking for Help

1. **Check logs:** `docker compose logs`
2. **Try clean rebuild:** `docker compose down -v && docker compose up --build`
3. **Google error message:** Usually someone else had same issue
4. **Check GitHub Issues:** For Docker, Vue, or Tailwind

### What to Include When Asking

1. Full error message (copy-paste, don't screenshot)
2. Docker version: `docker --version`
3. OS and version (Windows 10, macOS 13, Ubuntu 22.04)
4. Steps you tried
5. Output of `docker compose logs`

### Useful Resources

- **Docker Docs:** https://docs.docker.com
- **Vue.js Docs:** https://vuejs.org
- **Tailwind Docs:** https://tailwindcss.com
- **Stack Overflow:** https://stackoverflow.com

---

## Checklist for Success

1- Docker Desktop installed and running
2- All files present in project
3- Ports 80 and 5000 available
4- Ran `docker compose up --build`
5- Waited 2-3 minutes for first build
6- Opened `http://localhost` in browser
7- Checked browser console (F12) for errors
8- Checked Docker logs for errors

**If all checked → Should work!** 

---

**Most issues are solved by:**
1. Restarting Docker Desktop
2. Running `docker compose down -v && docker compose up --build`
3. Waiting longer (first build is slow)
4. Checking ports aren't in use

**Good luck!** 