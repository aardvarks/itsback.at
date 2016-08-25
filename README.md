# itsback.at

The idea is to create a replacement for [isup.me / downforeveryoneorjustme.com](http://isup.me), that will alert users when the status of a site changes, so that the user doesn't have to hit F5 waiting for the site to come back and the downed service only has to handle one request while the site is down rather than hundreds of users requesting the downed site. 

You can test out the site with [this link](http://alpha.itsback.at/owen.cymru:1234), the site will go up and down every 30 seconds so you can see the service in action. 

[![Build Status](https://img.shields.io/travis/aardvarks/itsback.at.svg?style=flat-square)](https://travis-ci.org/aardvarks/itsback.at)
[![Coverage](https://img.shields.io/codecov/c/github/aardvarks/itsback.at.svg?style=flat-square)](https://codecov.io/github/aardvarks/itsback.at)
[![Dependencies](https://img.shields.io/david/aardvarks/itsback.at.svg?style=flat-square)](https://david-dm.org/aardvarks/itsback.at)
[![Code Climate](https://img.shields.io/codeclimate/github/aardvarks/itsback.at.svg?style=flat-square)](https://codeclimate.com/github/aardvarks/itsback.at)
[![http://alpha.itsback.at/alpha.itsback.at](https://img.shields.io/badge/stability-probably-brightgreen.svg?style=flat-square)](http://alpha.itsback.at/alpha.itsback.at)
![Users Online](http://apibadg.es:8080/badge?api=alpha.itsback.at%2Fusers)

## Features

* Check domains every 5 seconds with an HTTP request
* Sends desktop notifications to all users watching the domain when the status of the site changes
* The ability to test domains running on non-standard ports, domain<span></span>.com:3000 for example
* See how many people are currently watching the domain 
* Report domains that don't work with our service, to alert other users


![Alpha image](http://i.imgur.com/cZuYyzI.png)
***Please note this is a pre-release image, will be updated when UI is finalised***

## Development Setup

To run this site you need to have nodejs and MongoDB installed. We are using node@4.3.1 and mongodb@3.2.6.

```
nave usemain 4.3.1
npm install
npm run build
npm start

# development mode (watches for source changes)
npm run watch
```

## License
Copyright (C) 2016 Kenan Yusuf, Matthew Elphick, Owen Garland, Vaishal Parmar, Ben Parnell

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.


## History
This is a rebuild and completion of the [itsback.at](http://itsback.at) website. The original code can be found [here](https://github.com/bag-man/nodeup).
