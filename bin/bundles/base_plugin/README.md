# Example plugin

This file contains the skeleton of a common plugin for the Netbeast dashboard.
You can use it, in order to give support for a device through the dashboard.

We have already developed plugins to control devices like:
* Belkin WeMo
* Philips Hue
* Lifx
* Sonos
* Chromecast
* ...

I encourage you to help us growing this list, by adding new devices plugins

## Good to know

#### Testing

The plugins are installed at the dashboard like applications so, you should
install it for testing. You can do it through:
 1. The user interface of the dashboard
 2. Command line, by copying your folder to dashboard/.sandbox/NAME_PLUGIN


#### Resources Database

All the physical devices available are include on the resources database.
You can check the discovered devices by searching the database on

`sqlite3 dashboard/.database.sqlite`

Once you are in, check the following table:

`select * from resources;`

#### Data structure

All the **topics** declared have a defined structured, that you can check on the [Docs](http://docs.netbeast.co/chapters/api_reference/methods.html).

If you are going to work on this topic, please follow this structures:
*   switch & bridge
    * power `true || false`
*   lights
    * power:        `true || false`
    * brightness:   `0..100`
    * hue:          `0..360`
    * saturation:   `0..100`
    * color:    `{r: 0, b: 0, g: 0} || CC00AA` // Will be translated to hue and saturation
*   sound
    * volume:       `0..100`
    * status:       `play || pause || stop || mute || unmute || info`  
    * track: `must be the url of the song`

If you need to define a new **topic**, you should think in a general structure that can be
used for all devices with the same topic.

Topics are: lights, sound, temperature, switch, camera, video, lock, etc...

Example. If we are working with sound:
1. GET method will only accept volume, status and track as parameters
2. POST method will accept the same parameters. 
