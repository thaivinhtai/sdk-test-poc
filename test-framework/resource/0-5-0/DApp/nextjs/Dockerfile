# ARG to input node version
ARG NODE_VERSION=18
ARG PORT=3000
FROM node:${NODE_VERSION}

# Setup working dir
WORKDIR /app

# Copy all source to container
COPY . .

# setup dependencies
RUN npm install

# Build Next.js app
RUN npm run build

# Start Next.js server on port 3000
CMD ["sh", "-c", "PORT=${PORT} npm run start"]
