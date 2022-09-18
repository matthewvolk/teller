# Multi-Stage Docker Build
# Stage 1
FROM node:18.6 as build

# Create app directory in container
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy remaining app files
COPY . .

# Build app
RUN npm run build

# Stage 2
FROM node:18.6

# Create app directory in new container
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy dist from Stage 1
COPY --from=build /usr/app/dist ./dist

# Node environment
ENV NODE_ENV=production

# Configure ports
EXPOSE 1337
ENV PORT=1337

# Run app
CMD npm run start
