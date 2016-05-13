| Linux & Mac   |      Windows      | Docker | Docs | Forum | *
|----------|:-------------:|:------:|:------:|:------:|:------:|------:|
| [![Build Status](https://travis-ci.org/netbeast/dashboard.svg)](https://travis-ci.org/netbeast/dashboard) |  [![Windows Build Status](https://ci.appveyor.com/api/projects/status/l67h46kbdxtvy43p?svg=true)](https://ci.appveyor.com/project/jsdario/dashboard) | [<img src="https://pbs.twimg.com/profile_images/378800000124779041/fbbb494a7eef5f9278c6967b6072ca3e_400x400.png" height="24px" width="auto"/>](https://dashboard.netbeast.co/) | [<img src="https://avatars2.githubusercontent.com/u/7111340?v=3&s=400" height="24px" width="auto"/>](https://docs.netbeast.co) |  [<img src="https://pbs.twimg.com/profile_images/3264780953/6c9a2cd7bb2efcb4c53d32900e52c8ac_400x400.png" height="24px" width="auto"/>](https://forum.netbeast.co) | [<img src="https://www.iconexperience.com/_img/i_collection_png/512x512/plain/graph.png" height="24px" width="auto"/>](http://npm.anvaka.com/#/view/2d/netbeast-cli)

# Netbeast dashboard
### Connect everything. Regardless its brand or technology,

One API, unlimited products and hacks. Netbeast middleware translates messages from different IoT protocols and device interfaces so they work as one. Have no more "hubs". Work across **devices** not _brands_.

```
var netbeast = require('netbeast')
netbeast.find().then(function () {
  netbeast('lights').set({ power: 1 }) // will turn on all lights in your home
})
```

# Contents
* [Installation](#installation)
  * [Basic](#installation-basic)
  * [Raspberry / Beagle Bone / Pine64 or your choice of board](#installation-board)
  * [Using docker](#installation-docker)
* [Overview](#overview)
* [Documentation](#documentation)
* Create IoT with Node.js
  * apps
  * devices
* [Community](#community)
* [Contribute](#contribute)
* [License](https://github.com/netbeast/dashboard/blob/master/LICENSE.txt)

<a name="installation">
# Installation
<a name="installation-basic">
## Basic
Make sure you have installed [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [nodejs](https://nodejs.org/en/).
```bash
npm install -g netbeast-cli
netbeast start
```

Find it live at http://localhost:8000 or run it as `netbeast start --port <PORT>`

**Pro tip.** To get started developing you will find handy to have it installed in a folder of
your choice.
```
git clone https://github.com/netbeast/dashboard
cd dashboard
npm install --production
npm start
```

![Dashboard live GIF](public/img/dashboard-demo.gif)

<a name="installation-board">
## Raspberry / Beagle Bone / Pine64 or your choice of board
Make sure again you have installed [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [nodejs](https://nodejs.org/en/). It can be tricky depending on your OS & architecture. If any doubts please reach https://forum.netbeast.co or open an [issue](https://github.com/netbeast/dashboard/issues).
1. Apply the basic installation from above, preferably using git.
```
git clone https://github.com/netbeast/dashboard . # clone in this folder
npm i --production # no front-end or test dependencies
```
1. Keep it running 24h 7 days a week, to use it as Smart Home Hub. You can use utilities such as [forever](https://www.npmjs.com/package/forever) or [pm2](https://www.npmjs.com/package/pm2).
```
npm i -g pm2
sudo pm2 start index.js --port 80
```
3. [Soon] Learn how to attach a DHCP name to your Netbeast as https://home.netbeast and how to deal with wireless configuration in Linux from our [blog](https://blog.netbeast.co).

<a name="installation-docker">
## Using docker :whale:
Make sure you already have [docker](https://docs.docker.com/engine/installation/) installed.

1. Download the netbeast image from dockerhub
```
docker pull netbeast/netbeast
```
2. Run it
```
docker run -p 49160:8000 -d netbeast/netbeast
```
This will run your docker container on the port 49160

3. You can now play on it. Access to your docker `CONTAINER_IP`.
> http://CONTAINER_IP:49160
>
> – Et voilà

<a name="overview">
# Overview
#### Find inspiration, think about new projects, connect your new hardware.
Netbeast apps are HTML5 user interfaces that enable controlling IoT or visualizing their data. Netbeast plugins are apps that translate from the Netbeast IoT Unified Scheme, to each particular implementation of an IoT device.

**Explore existing apps and plugins of our [public registry](https://dashboard.netbeast.co/explore).**

## Control devices regardless of their brand and technology
Take a look on our unified API on action in this demo on youtube, under a Netbeast app that creates new scenes.

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/YNERwJdykuQ/0.jpg)](https://www.youtube.com/watch?v=YNERwJdykuQ)

https://www.youtube.com/watch?v=YNERwJdykuQ

## Measure all your data
Use the [Netbeast API](https://github.com/netbeast/api) along with the dashboard to publish data through MQTT or reuse it in your apps. [Read more](http://docs.netbeast.co/chapters/api_reference/index.html
).

![Dashboard live GIF](public/img/history.gif)

## Write IoT apps without spending on hardware or suffering expensive deployments
Take advance of Netbeast IoT middleware to test your apps with software that mocks the hardware interface.

![Virtual plugins](https://docs.netbeast.co/img/bulb-padjs.gif)

Find tutorials in the [docs](https://docs.netbeast.co), read a blog post about it on [TopTal](https://www.toptal.com/nodejs/programming-visually-with-node-red) or join the [forum](https://forum.netbeast.co) to ask how to do it.

<a name="documentation">
## Documentation
We publish a gitbook with fresh documentation on https://docs.netbeast.co. If you want to open an issue, contribute or edit it, find your way on its github repo https://github.com/netbeast/docs.

<a name="community">
## Community
* Visit our site [https://netbeast.co](https://netbeast.co)
* Mail us: staff [at] netbeast.co
* Report a bug or enter discussion at [issues](https://github.com/netbeast/docs/issues)
* Other resources: [Docs](https://github.com/netbeast/docs/wiki), Netbeast [API](https://github.com/netbeast/API)

<a name="contribute">
## Contribute
Take a look to our [CONTRIBUTING.md](https://github.com/netbeast/dashboard/blob/master/CONTRIBUTING.md) file in order to see how can you be part of this project. Or take a look on [Netbeast's discourse forum](https://forum.netbeast.co) to find for inspiration, projects and help.

**TL;DR** Make a Pull Request.
If your PR is eventually merged don't forget to write down your name on the [AUTHORS.txt](https://github.com/netbeast/dashboard/blob/master/AUTHORS) file.

##### <img src="https://pbs.twimg.com/profile_images/3264780953/6c9a2cd7bb2efcb4c53d32900e52c8ac_400x400.png" height="24px" width="auto"/> Join us in our forum https://forum.netbeast.co
##### <img src="https://slack.com/img/slack_hash_128.v1442100037.png" height="24px" width="auto"/> Ask for an invitation to join our Slack team [here](https://netbeastco.typeform.com/to/VGLexg)

<img src="https://github.com/netbeast/docs/blob/master/img/open-source.png?raw=true" height="140px" width="auto"/>
<img src="https://github.com/netbeast/docs/blob/master/img/open-hw.png?raw=true" height="140px" width="auto"/>
