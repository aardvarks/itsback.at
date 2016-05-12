# itsback.at

The idea is to create a replacement for [isup.me](http://isup.me), that will alert users when the status of a site changes. 

You can test out the site with this URL: http://alpha.itsback.at/upanddown.herokuapp.com

[![Build Status](https://img.shields.io/travis/aardvarks/itsback.at.svg?style=flat-square)](https://travis-ci.org/aardvarks/itsback.at)
[![Build Status](https://img.shields.io/david/aardvarks/itsback.at.svg?style=flat-square)](https://david-dm.org/aardvarks/itsback.at)
[![Build Status](https://img.shields.io/codecov/c/github/aardvarks/itsback.at.svg?style=flat-square)](https://codecov.io/github/aardvarks/itsback.at)

## Setup

```
nave usemain 4.3.1
npm install
npm run build
npm start

# development mode (watches for source changes)
npm run watch
```

## To do
- [x] Refactor code to ES6 and node 4
- [x] Setup Jade / Stylus
- [x] Setup mongodb
- [ ] Test ~~whole URL, include path and~~ port
- [ ] Adjustable certainty (X successful attempts before declared up)
- [x] Display users watching domain feature
- [x] Report incorrect results 
- [ ] Working animation
- [x] Desktop notitications
- [ ] 100% test coverage
- [ ] ~~JSON API~~
- [ ] ~~Plaintext (command line) API~~

## License
Copyright (C) 2016 Kenan Yusuf, Matthew Elphick, Owen Garland, Vaishal Parmar

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
