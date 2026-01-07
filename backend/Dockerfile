# Backend Dockerfile – Node.js + Express API

# - Start server
FROM node:18-alpine

#  working Directory
WORKDIR /app

# copy Package Files First 
COPY package*.json ./

# install dependencies
RUN npm install --production

# clean npm cache to save space
RUN npm cache clean --force

# Copy all files from backend directory to app in container
COPY . .

# expose port
EXPOSE 5000

# health Check
HEALTHCHECK --interval=30s \
            --timeout=3s \
            --start-period=5s \
            --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# start Command
CMD ["node", "src/server.js"]