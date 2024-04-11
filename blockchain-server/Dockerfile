# Use an official Node.js runtime as a base image
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


RUN npx scrypt-cli@latest compile

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run your app
CMD ["npx", "ts-node", "server.ts"]