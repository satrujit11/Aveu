# Use Node.js 20 Alpine as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and pnpm-lock.yaml (if it exists) to the container
COPY package.json pnpm-lock.yaml* ./

# Install pnpm globally
RUN npm install -g pnpm

# Install project dependencies using pnpm
RUN pnpm install

# Install 'serve' globally using pnpm (this is necessary to serve the build)
RUN npm i -g serve

# Copy the remaining application files into the container
COPY . .

# Build the application (e.g., for a Vite app)
RUN pnpm run build

# Expose the port the application will run on
EXPOSE 3000

# Serve the build folder using the 'serve' package (pnpm equivalent)
CMD [ "serve", "-s", "dist" ]

