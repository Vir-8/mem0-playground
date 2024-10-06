# Dockerfile for Next.js
# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your Next.js app to the working directory
COPY . .

# Expose the port Next.js will run on
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "run", "dev"]
