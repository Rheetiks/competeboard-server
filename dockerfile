# Use an official Node.js image from the Docker Hub
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Define environment variables (optional, can also be set via .env or Docker run commands)
ENV PORT=3000

# Start the Node.js application
CMD ["node", "server.js"]
