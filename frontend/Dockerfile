FROM node:18-alpine AS builder

# working Directory
WORKDIR /app

# copy Package Files 
COPY package*.json ./

# install dependencies
RUN npm install

# copy application code
COPY . .

# build Production bundle
RUN npm run build


FROM nginx:alpine

# copy built Files 
COPY --from=builder /app/dist /usr/share/nginx/html

# copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# expose Port
EXPOSE 80

# start nginx
CMD ["nginx", "-g", "daemon off;"]