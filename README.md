[![Build Status](https://travis-ci.org/netbeast/dashboard.svg)](https://travis-ci.org/netbeast/dashboard)
![dependencies](https://david-dm.org/netbeast/dashboard.svg)

# Netbeast dashboard
### Connect everything. Regarless its brand or technology,

This is a web panel from you can install, manage or publish IoT applications. For every platform. Mac, Windows & Linux app/repo. Check out our http://docs.netbeast.co for builds for Raspberry Pi, Beagle Bone and Arduino.

[<img src="https://slack.com/img/slack_hash_128.v1442100037.png" height="24px" width="auto"/> Join us in Slack!](https://netbeastco.typeform.com/to/VGLexg)

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

##Desktop version compilation

If you want to know how you can compile the Netbeast dashboard to get a desktop application go [here](https://github.com/netbeast/dashboard/tree/electron)

## Contact
* Visit our site [https://netbeast.co](https://netbeast.co)
* Mail us: staff [at] netbeast.co
* Report a bug or enter discussion at [issues](https://github.com/netbeast/docs/issues)
* Other resources: [Docs](https://github.com/netbeast/docs/wiki), Netbeast [API](https://github.com/netbeast/API)

[<img src="https://slack.com/img/slack_hash_128.v1442100037.png" height="24px" width="auto"/> Join us in Slack!](https://netbeastco.typeform.com/to/VGLexg)


<img src="https://github.com/netbeast/docs/blob/master/img/open-source.png?raw=true" height="140px" width="auto"/>
<img src="https://github.com/netbeast/docs/blob/master/img/open-hw.png?raw=true" height="140px" width="auto"/>
