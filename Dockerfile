# Netbeast Dockerfile to create an image at Docker Hub

# Select debian as base image
FROM ubuntu:latest

# to avoid some problems:
# debconf: unable to initialize frontend: Dialog
ENV DEBIAN_FRONTEND noninteractive

MAINTAINER <https://github.com/luisfpinto>

# Install required packages

RUN apt-get update &&  apt-get install -y nodejs nodejs-legacy npm git net-tools

# Copy app to /src
COPY . /src

# Install all dependencies
RUN cd /src; npm install

# Bind port 8000 & run app
EXPOSE 8000
CMD cd /src; node ./index.js
