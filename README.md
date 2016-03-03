# Netbeast dashboard

[![Build Status](https://travis-ci.org/netbeast/dashboard.svg)](https://travis-ci.org/netbeast/dashboard)
[![npm version](https://badge.fury.io/js/nb-dashboard.svg)](https://badge.fury.io/js/nb-dashboard)
![dependencies](https://david-dm.org/netbeast/dashboard.svg)
[![devDependency](https://david-dm.org/netbeast/dashboard/dev-status.svg)](https://david-dm.org/netbeast/dashboard#info=devDependencies)

[![Join the chat at https://gitter.im/netbeast/docs](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/netbeast/docs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

###Iot in html5.

This is a web panel from you can install, manage or publish IoT applications. For Linux + node.js. You already tried the Netbeast dashboard or distro? Let us know http://bit.ly/1dQmFKt!

## Try it locally
Find it live at `http://localhost`
![Dashboard live GIF](public/img/dashboard-demo.gif)

### Install
``` bash
npm install -g netbeast-cli
```

### Run
```bash
beast start --port 8000 # default port
```

## Turn your Raspberry Pi in a home automation gateway!

Compiling with npm the Dashboard node.js native modules may take a while. That is why we precompile them weekly and push them to this repo production branch. You can have it on your Raspberry Pi in less than a minute:

```bash
git clone -b master --single-branch https://github.com/netbeast/dashboard/
cd dashboard
npm i # by default, dependencies are ignored
sudo ./index.js
```

We also prepared a <u>very lightweight Raspberry Pi distro with the dashboard already installed</u> is published every two weeks here http://bit.ly/1HjkWo2. Available for Rpi 1 and 2 versions.

## Docs
You can build IoT apps using only web technologies: javascript and HTML5! Also we hace tutorials at our docs to build apps with python.
http://docs.netbeast.co

## Contact
* Visit our site [https://netbeast.co](https://netbeast.co)
* Mail us: staff [at] netbeast.co
* Report a bug or enter discussion at [issues](https://github.com/netbeast/docs/issues)
* Other resources: [Docs](https://github.com/netbeast/docs/wiki), Netbeast [API](https://github.com/netbeast/API)

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/netbeast/docs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)


<img src="https://github.com/netbeast/docs/blob/master/img/open-source.png?raw=true" height="140px" width="auto"/>
<img src="https://github.com/netbeast/docs/blob/master/img/open-hw.png?raw=true" height="140px" width="auto"/>
