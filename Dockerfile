# Netbeast Dockerfile to create an image at Docker Hub

# Select debian as base image
FROM ubuntu:latest

# to avoid some problems:
# debconf: unable to initialize frontend: Dialog
ENV DEBIAN_FRONTEND noninteractive

MAINTAINER <https://github.com/luisfpinto>

# Install required packages
RUN apt-get update && apt-get install -y \
    nodejs \
    nodejs-legacy \
    npm \
    git \
    net-tools

# Only install dependencies when there's a change in package.json otherwise
# we rebuild the modules when there's any change to the source code.
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Copy the app
WORKDIR /src
ADD . /src

# Bind port 8000 & run app
EXPOSE 8000

CMD ["node", "index.js"]
