[![Build Status](https://travis-ci.org/netbeast/dashboard.svg)](https://travis-ci.org/netbeast/dashboard)
![dependencies](https://david-dm.org/netbeast/dashboard.svg)

# Netbeast dashboard – Desktop Version
### Connect everything. Regarless its brand or technology,

This is a web panel from you can install, manage or publish IoT applications. For every platform. Mac, Windows & Linux app/repo. Check out our http://docs.netbeast.co for builds for Raspberry Pi, Beagle Bone and Arduino.

[<img src="https://slack.com/img/slack_hash_128.v1442100037.png" height="24px" width="auto"/> Join us in Slack!](https://netbeastco.typeform.com/to/VGLexg)

### Download it

This is the desktop version of the Netbeast dashboard. If you want to run the desktop version locally run:

```
git clone -b electron --single-branch https://github.com/netbeast/dashboard
cd dashboard
npm install  #Installing all dependencies
npm start
```

After that, an Electron window of the Netbeast dashboard will appear.

##Compile the desktop version for MACOS

If you want to create the Netbeast dashboard application for mac, follow these steps:

##### 1. Install last Nodejs version (In this example I have v5.7.1) & npm packages

```
##Install electron-packager
npm install electron-packager -g

## Install appdmg
npm install appdmg -g

## Clone the Netbeast dashboard
git clone -b electron --single-branch https://github.com/netbeast/dashboard
```

- You can find more information about how these packages work: [electron-packager](https://github.com/electron-userland/electron-packager) [appdmg](https://github.com/LinusU/node-appdmg)

##### 2. Create the Mac App

```
electron-packager dashboard Netbeast --platform=darwin --arch=all --version=0.36.10 --icon=dashboard/desktop_app/icon.icns --version-string.CompanyName=Netbeast --version-string.ProductName=NetbeastDashboard
```

-  Check the electron version ```./node_modules/.bin/electron -v```in my case: 36.10

##### 3. Create the Mac dmg

Once you have created the Netbeast dashboard app you can run the following command:


```
cd Netbeast-darwin-x64
appdmg ../dashboard/desktop_app/appdmg.json ~/Desktop/Netbeast.dmg
```

- Then you will have the Netbeast.dmg file on your desktop :smile:

## Contact
* Visit our site [https://netbeast.co](https://netbeast.co)
* Mail us: staff [at] netbeast.co
* Report a bug or enter discussion at [issues](https://github.com/netbeast/docs/issues)
* Other resources: [Docs](https://github.com/netbeast/docs/wiki), Netbeast [API](https://github.com/netbeast/API)

[<img src="https://slack.com/img/slack_hash_128.v1442100037.png" height="24px" width="auto"/> Join us in Slack!](https://netbeastco.typeform.com/to/VGLexg)


<img src="https://github.com/netbeast/docs/blob/master/img/open-source.png?raw=true" height="140px" width="auto"/>
<img src="https://github.com/netbeast/docs/blob/master/img/open-hw.png?raw=true" height="140px" width="auto"/>
