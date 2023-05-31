# MMM-DaikinAirbase

A module for [MagicMirror²](https://github.com/MichMich/MagicMirror/) designed to pull data from a Daikin AirBase wifi controller and display it on the mirror. As far as I can tell this device is only in the Australian/New Zealand market so this module would only be relevant to users there. Essentially if you use the Daikin Airbase app on your phone to access your air conditioner then this module should work with it.

This module was originally forked from the [MMM-Daikin](https://github.com/kymeyer/MMM-daikin/) module built by Kyrill Meyer which made use of a node module for accessing the Daikin device which unfortunately did not support the Daikin Airbase. Luckily the Airbase API is fairly basic so not too difficult to get working.


![Alt text](/screenshots/DaikinAirbase.png?raw=true "Screenshot")

## Installation

Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/matt-thurling/MMM-DaikinAirbase.git`

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
  modules: [
    {
      module: 'MMM-Daikin',
      position: 'top_right',
      config: {
          ipAddress: '10.1.1.99', // replace with the ip address of your airbase
     }
    },
  ],
};

```

## Configuration options

| Option           | Description                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `ipAddress`      | _Required_ Local IP address of the Daikin Device.                                                                         |
| `updateInterval` | _Optional_ How often the content will be fetched. <br><br>**Type:** `int`(milliseconds) <br>Default 30000 (1/2 minute)    |
| `animationSpeed` | _Optional_ Speed of the update animation. <br><br>**Type:** `int`(milliseconds) <br>Default 1000 milliseconds (1 second)  |

## Attribution

This module was originally forked from the [MMM-Daikin](https://github.com/kymeyer/MMM-daikin/) module built by Kyrill Meyer.


The MIT License (MIT)
=====================

Copyright © 2023 Matt Thurling

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
