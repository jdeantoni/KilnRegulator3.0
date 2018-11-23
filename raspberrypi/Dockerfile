FROM node

ARG prefix

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ${prefix}/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY ${prefix}/. .

COPY ${prefix}/../doc/swagger.yaml .

EXPOSE 3000
CMD [ "npm", "start" ]
