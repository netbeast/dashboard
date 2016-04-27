# Netbeast Dockerfile to create an image at Docker Hub

# Select debian as base image
FROM ubuntu:latest

# to avoid some problems:
# debconf: unable to initialize frontend: Dialog
ENV DEBIAN_FRONTEND noninteractive

MAINTAINER <https://github.com/luisfpinto>

LABEL multi.label1="https://netbeast.co"="Netbeast" \
      multi.label2="version"="0.0.1" \
      multi.label3="description"="Netbeast is an Internet of Things javascript development platform \
      that empowers developers to easily create and deploy IoT apps"

# Install git, nodejs & npm

RUN apt-get update &&  apt-get install -y nodejs npm git

# Copy app to /src
COPY . /src

# Install all dependencies
RUN cd /src; npm install


# Bind port 8000 & run app
EXPOSE 8000
CMD nodejs ./index.js
