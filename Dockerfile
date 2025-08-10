# Base image node v18.14.2 alpine versión super ligera de linux - at least necessary
FROM node:18-alpine3.15

# Create app directory - set working directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

#clear cache
RUN yarn cache clean --force

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
