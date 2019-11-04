# Conscious Breath
Conscious Breath is a web based approach to respiratory rate tracking, using OpenCV.js. It can calculate:

- Breath depth
- Breath cycles
- Breaths per minute
- Current Breath State (in, hold, out)
- Whether you are following a breath guide correctly


## Running the app :arrow_forward:

0) Make sure you have mongodb installed and running
1) cd to root directory and run `npm install`
2) Run `npm run-script watch` in the root - this sets up a hotrecompile and loads on https://localhost:10001
3) Also run `npm run-script watch` in this app directory
4) You're good to go!

## The technology

The main technology is within the session view `js/src/session`. The main cycle for the breath tech is as follows:

## Computer Vision module :movie_camera:
This is the opencv.js part of the application. It does the preprocessing of the video and applies essential algorithms for tracking as follows:

1) Converts video feed to greyscale for analysis
2) Uses face detection to remove face from...
3) ...ShiTomasi Corner detection. Only gets points on chest and shoulders.
4) Lucas-Kanade algorithm is then applied to detect the direction of the movement
## Realtime Analysis module :rotating_light:
This takes the raw values given from the tracking algorithms of opencv.js and derives further breath data from the computer vision module in a pipeline process as follows:


### S1 - Breath Depth
1) The raw movement values are passed into the Realtime analysis module at this first step. They are processed and a breath depth is calculated based on what we percieve to be the top of the breath and the bottom of the breath - as calculated by the users first breath (or by the calibration module which effectively just resets the top and bottom breath values).
### S2 - Raw Prediction
2) The raw movement values then get passed through to make a rough prediction of the current state at a rate of around 17-20 predictions a second. These are mostly accurate but we use S3 to smooth the predictions further.
### S3 - Prediction Smoothing
3) S3 uses a results based window of around 7 results (but this can be altered higher to improve accuracy but slow down the time it takes to make a result). An array of the predictions is stored and the most frequent one is picked out to be the current breath state.
### S4 - Breaths Per Min (Does more than Breaths Per min currently)
4) The current state is then added to an array to assess the patterns of breathing. e.g. `[Inhale, Hold, Exhale]` or `[Inhale, Exhale]'.
5) Then each `[Inhale, Hold, Exhale]` or `[Inhale, Exhale]` is counted as one breath cycle.
6) Given a timer created at the start of the session, breaths per minute are also assessed from the outset - giving an accurate result past 1m session duration.
7) The top of the breath is calculated here too, by taking a snapshot of the breath depth when a user holds their breath after an inhale, and adds it to an array for a final breath depth average later. This shows how much of their potential breath depth they were using.

### A note on PerformanceVars
Performance variables are stored in a separate file and referenced throughout the code for the engine. This way they are neatly packed together and easily to manipulate as to provide different types of performance settings, with varying CPU/GPU use and therefore also varying accuracy, framerate and snapshot interval durations. All variables that affect performance should live there.

## Snapshot Analysis module :zap:
The snapshot analysis module is a series of setTimeout calls on the realtime data, so we can collect more sparse datasets for plotting and saving data to the server. Here are some of the snapshot analysis functions we use:

### calcBreathDepthTimeSeries
Every `200ms` we capture the time and breath depth at that time, so we can plot the data on a graph to visualise the smoothness, length and depth of the users breath. Having less points means it's more performant to plot and store serverside.

### calcGuideAccuracyTimeSeries
Every `500ms` we capture a `true` or `false` of whether the user is following the breath guide correctly. This is used to show how accurately they follow the guide throughout the session, and can be used to make assumptions about how much they may feel the effects of a session given they followed the guide well or not.

### startSnapshotAnalysis & stopSnapshotAnalysis 
These functions are to start and stop the snapshot analysis and are called when the engine starts, and when the user finishes the session respectively. On stopping snapshot analysis, averages of the snapshot data are calculated and stored.

## Calibration :cyclone:
We have built calibration on top of the breath engine, which will reset the top and the bottom of the breath values given certain criteria are met. The calibration steps are roughly as follows:

1) If a face is found, step one is completed
2) If more than 2 ShiTomasi points are found, step two is completed (if not, user will swipe hand over camera)
3) User inhale is detected and top and bottom of breath are set
4) User checks whether they are satisfied with the calibration using the inhale/exhale meter on screen.
5) User can recalibrate if they wish.

### Auto-recalibration
We've also built a method that will auto recalibrate the top and bottom of the breath if the user is moving around too much. Given the technology relies on the person being mostly still, we are using two methods to track whether to autorecalibrate:

1) To detect whether the person has slouched or sat up we gather the face.y position in space and store it. Every x milliseconds, check whether the face has moved x pixels - if so recalibrate and send notification.
2) To detect whether they have got further or closer to the camera we gather face.height and store it (we can assume that if the bounding box of face calibration grows in height, they are closer on the z axis). Every x milliseconds, check whether the face has 'grown' x pixels - if so recalibrate and send notification.

  
## App data flow :arrows_clockwise:	
Please see `sessionDataModel.js` to understand the global variable that stores all data derived from the application in session view. Throughout the steps of the breath engine, the stats are stored onto this global data object for use everywhere in the session view source.

## Packs 💳
Packs are different breathing variations and themes for the session view. They may in future hold more features. Packs are set using a separate admin and their specifications are delivered through an API if the user has subscribed. For testing, you will find `packs.json` in the public/assets folder.

## The rest of the App :iphone:
Other good to know pointers:

1) The app uses rollup to compile Sass and JS to CSS and bundles respectively
2) The app uses obfuscation on the code for security. Sometimes this may break things so always test this as a last resort.
3) The app uses handlebars for templating the data, and axios to make requests for the data.
4) API reference can be found in the root directory readme
5) A serviceWorker is added for caching and making the web app installable with browsers
6) We use location data and Mapbox API to plot 'meditators' on the dashboard map
7) We use sendgrid to handle verification emails/registration/lost password etc
