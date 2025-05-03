# Base stage to install dependencies
FROM --platform=linux/amd64 node:20-alpine AS base
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the container
COPY . .

# Copy local.env to .env in the container
COPY local.env .env

# Expose the application port
EXPOSE 3000

# Set the default command to start the application in development mode
CMD ["npm", "run", "start:dev"]