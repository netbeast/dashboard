[![Build Status](https://travis-ci.org/netbeast/dashboard.svg)](https://travis-ci.org/netbeast/dashboard)
![dependencies](https://david-dm.org/netbeast/dashboard.svg)

# Netbeast dashboard
### Connect everything. Regarless its brand or technology,

This is a web panel from you can install, manage or publish IoT applications. For every platform. Mac, Windows & Linux app/repo. Check out our http://docs.netbeast.co for builds for Raspberry Pi, Beagle Bone and Arduino.

[<img src="https://slack.com/img/slack_hash_128.v1442100037.png" height="24px" width="auto"/> Join us in Slack!](https://netbeastco.typeform.com/to/VGLexg)

## Try it locally
```bash
git clone https://github.com/netbeast/dashboard
cd dashboard
npm i # by default, dependencies are ignored
npm run dev
```

Find it live at `http://localhost:8000` 
> Or run it as `node index.js --port <a port of convenience>`. You can also modify the **.env** file.

![Dashboard live GIF](public/img/dashboard-demo.gif)

## Measure all your data
Use the [Netbeast API](https://github.com/netbeast/api) along with the dashboard to publish data through MQTT or reuse it in your apps. http://docs.netbeast.co/chapters/api_reference/index.html 
![Dashboard live GIF](public/img/history.gif)

## Docs
You can build IoT apps using only web technologies: javascript and HTML5! Also we hace tutorials at our docs to build apps with python.
http://docs.netbeast.co

##Desktop version compilation

If you want to know how you can compile the Netbeast dashboard to get a desktop application go [here](https://github.com/netbeast/dashboard/tree/electron)

## We are also on Docker! :whale:

First you need to install docker. Click [here](https://docs.docker.com/engine/installation/) to see how

Once we have all set up, start a docker terminal and see what is the **IP assigned** to that container

#### Download the netbeast image from dockerhub

```
docker pull netbeast/netbeast
```

#### Run it

```
docker run -p 49160:8000 -d netbeast/netbeast
```

This will run your docker container on the port 49160

#### Play with it

Now access to the docker container url

http://IP_assigned:49160

Et voilà

## Contribute

Take a look to our CONTRIBUTING file in order to see how you can be part of this project. [Contribue](https://github.com/netbeast/dashboard/blob/master/CONTRIBUTING.md)

If you are part of the Netbeast community don't forget to write down your name on the AUTHORS file. [Authors](https://github.com/netbeast/dashboard/blob/master/AUTHORS)

## Contact
* Visit our site [https://netbeast.co](https://netbeast.co)
* Mail us: staff [at] netbeast.co
* Report a bug or enter discussion at [issues](https://github.com/netbeast/docs/issues)
* Other resources: [Docs](https://github.com/netbeast/docs/wiki), Netbeast [API](https://github.com/netbeast/API)

[<img src="https://slack.com/img/slack_hash_128.v1442100037.png" height="24px" width="auto"/> Join us in Slack!](https://netbeastco.typeform.com/to/VGLexg)


<img src="https://github.com/netbeast/docs/blob/master/img/open-source.png?raw=true" height="140px" width="auto"/>
<img src="https://github.com/netbeast/docs/blob/master/img/open-hw.png?raw=true" height="140px" width="auto"/>

Check out [npm dependencies](http://npm.anvaka.com/#/view/2d/netbeast-cli) we relay on
