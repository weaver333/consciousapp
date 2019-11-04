# Conscious-Breath (Front End)

## How it works and what is used
The front end for this app is written with HTML5, Sass (Transpiled to CSS3 using Rollup), and Javascript (es6+).

The structure is very simple. We have an assets folder which contains all fonts, images, and Sass. Javascript should live in the `src` folder one level above this, but we also have a JS folder here temporarily until we have finished reconstructing the front end.

Each page, or 'view', has it's own folder with an `index.html` within it. It will have corresponding Javascript in the source folder above `../src/YourViewName/index.js`. Routes will need to be added so that this Javascript is executed on page path. This is simplistic routing for now.

We are not currently managing state within the front end, as there is limited state to manage. In future we may move to React, or using Beeble to create a Store to manage state - but only if the data flow becomes more complicated. Currently, the only state that is really stored and used is in the Session view, where breath stats are collected and updated in realtime, then sent to the server after a session is completed/stopped.