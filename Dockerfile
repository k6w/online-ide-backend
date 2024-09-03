# Use the official Node.js image.
FROM node:18

# Set the working directory.
WORKDIR /usr/src/app

# Install dependencies.
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code and environment file.
COPY . .

# Expose the port the app runs on.
EXPOSE 3000

# Start the application.
CMD ["node", "server.js"]
