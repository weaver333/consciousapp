// COMPUTER VISION

import { analyseCVData } from '../realtimeAnalysis'; // Modules to analyse data in real time
import { startSnapshotAnalysis, stopSnapshotAnalysis } from '../snapshotAnalysis'; // Modules to analyse data at intervals
import toastr from 'toastr'; // Notifications package
import axios from 'axios';

import { newSessionDataModel } from '../settings/sessionDataModel.js';
import { performanceMode } from '../settings/performanceSettings.js';

// Object to store all of the sessionData - acts as global object for all session data
sessionData = newSessionDataModel();
window.resetSessionData = function(){
    sessionData = newSessionDataModel();
}
function resetSessionData(){
    sessionData = newSessionDataModel();
}

// Sets engine variables based on performance mode wanted - AvgPerfAvgAcc is default
performanceVars = performanceMode('AvgPerfAvgAcc');

function initEngine(utils, engineMode, options = { graphWidth: 200, graphHeight: 75 }) {

    // Set Engine mode (session mode or monitor mode)
    if( engineMode ){
        sessionData.mode = engineMode;
    }

    let streaming = false;
    let videoInput = document.getElementById('videoInput');
    let canvasOutput = document.getElementById('canvasOutput');
    let canvasContext = canvasOutput.getContext('2d');
    let finishSessionBtnEl = document.getElementById('finish-session-btn');


    let cap = new cv.VideoCapture(videoInput);

    // parameters for ShiTomasi corner detection
    let [maxCorners, qualityLevel, minDistance, blockSize] = [20, 0.25, 3, 1];
    // let [maxCorners, qualityLevel, minDistance, blockSize] = [100, 0.3, 7, 7];

    // parameters for lucas kanade optical flow
    let winSize = new cv.Size(15, 15);
    // Defines levels of pyramid - the more the more sensitive it is to movement (1px could = 4px of virtual space e.g.)
    let maxLevel = 0;
    let criteria = new cv.TermCriteria(cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 0.03);

    // create some random colors
    let color = [];
    for (let i = 0; i < maxCorners; i++) {
        color.push(new cv.Scalar(51,255,255));
    }

    // take first frame and find corners in it
    let oldFrame = new cv.Mat(videoInput.height, videoInput.width, cv.CV_8UC4);
    cap.read(oldFrame);
    let oldGray = new cv.Mat();
    cv.cvtColor(oldFrame, oldGray, cv.COLOR_RGB2GRAY);
    let p0 = new cv.Mat();
    let none = new cv.Mat();
    cv.goodFeaturesToTrack(oldGray, p0, maxCorners, qualityLevel, minDistance, none, blockSize);

    // Create a mask image for drawing purposes
    let zeroEle = new cv.Scalar(0, 0, 0, 255);
    let mask = new cv.Mat(oldFrame.rows, oldFrame.cols, oldFrame.type(), zeroEle);

    let frame = new cv.Mat(videoInput.height, videoInput.width, cv.CV_8UC4);
    let frameGray = new cv.Mat();
    let p1 = new cv.Mat();
    let st = new cv.Mat();
    let err = new cv.Mat();

    let faces = new cv.RectVector();
    let classifier = new cv.CascadeClassifier();
    // load pre-trained classifiers
    // classifier.load('haarcascade_frontalface_default.xml');
    utils.xmlLoaded.then(function() {
        classifier.load('haarcascade_frontalface_default.xml');
    });

    let dfDict = { 0: [], 1: [] };
    let minDict = {};
    let maxDict = {};
    let adjustMinMax = true;
    var onetimeFlag = 0;

    function initVars() {
        if (oldFrame.$$.ptr) oldFrame.delete();
        if (oldGray.$$.ptr) oldGray.delete();
        if (p0.$$.ptr) p0.delete();
        if (mask.$$.ptr) mask.delete();
        if (frame.$$.ptr) frame.delete();
        if (frameGray.$$.ptr) frameGray.delete();
        if (p1.$$.ptr) p1.delete();
        if (st.$$.ptr) st.delete();
        if (err.$$.ptr) err.delete();

        oldFrame = new cv.Mat(videoInput.height, videoInput.width, cv.CV_8UC4);
        cap.read(oldFrame);
        oldGray = new cv.Mat();
        cv.cvtColor(oldFrame, oldGray, cv.COLOR_RGB2GRAY);
        p0 = new cv.Mat();
        none = new cv.Mat();
        cv.goodFeaturesToTrack(oldGray, p0, maxCorners, qualityLevel, minDistance, none, blockSize);

        // Create a mask image for drawing purposes
        // zeroEle = new cv.Scalar(0, 0, 0, 255);
        mask = new cv.Mat(oldFrame.rows, oldFrame.cols, oldFrame.type(), zeroEle);

        frame = new cv.Mat(videoInput.height, videoInput.width, cv.CV_8UC4);
        frameGray = new cv.Mat();
        p1 = new cv.Mat();
        st = new cv.Mat();
        err = new cv.Mat();

        dfDict = { 0: [], 1: [] };
        minDict = {};
        maxDict = {};
        adjustMinMax = true;
    }

    function startSessionTimer() {
        calcSessionTime = setInterval(function() {
            sessionData.totalSessionTime = sessionData.totalSessionTime + 1;
            sessionData.timestamp = Date.now();
            // showSessionTime();
        }, 1000);
    }

    function stopSessionTimer() {
        clearInterval(calcSessionTime);
        // sessionData.totalSessionTime = 0;
    }

    function startTheStream() {
        streaming = true;
        // Resets session data block (from calibration)
        // Engine mode shows us which mode to run in (session or monitor mode for example)
        resetSessionData();

        // console.log('session started mode', engineMode);
        // Inits vars for computer vision
        initVars();
        // Hides the guide until calibrated
        // hideGuideUI();
        // Calibrates if necessary, then after calibration shows the guide and main session view
        // calibrate();   
        // All UI that relies on realtime data will be updated and shown, only if calibrated
        // updateDataPanelUI();
       
    
        // Start up the engine
        startSessionTimer();
        startSnapshotAnalysis(options);
        
        utils.clearError();
        utils.startCamera('qvga', onVideoStarted, 'videoInput');
    
        function onVideoStarted() {
            videoInput.width = videoInput.videoWidth;
            videoInput.height = videoInput.videoHeight;
            setTimeout(processVideo, 0);
        }
    }

    startTheStream();


    function stopTheStream() {
        streaming = false;

        // Stop the totalSessionTime timer
        stopSessionTimer();
        // Stop snapshop analysis & calculate final average results
        stopSnapshotAnalysis();
        // Stop the engine
        canvasContext.clearRect(0, 0, canvasOutput.width, canvasOutput.height);
        clearTimeout(processVideo);
        utils.stopCamera();

        // circleAnimation.stop();

        if(sessionData.mode !== 'monitorMode'){
            // Set session pack's name
            sessionData.packType = document.getElementById('pack-name').value;

            // console.log(sessionData);
            // Send the session data for storage
            axios
            .post('/session', {session: sessionData})
            .then(function (response) {
                var sessionID = response.data.session._id;
                // After stats have been posted, go back to dashboard for now
                window.location.href = "/after-session/" + sessionID;
            })
            .catch(function(err) {
                console.error(err);
                toastr.error('Your results werent saved :(','Check your connection');
            });
        } else {
            window.location.href = "/dashboard";
        }
    }

    finishSessionBtnEl.addEventListener('click', function(){
        stopTheStream();
    })

    function cleanAndStopEngine() {
        streaming = false;
        // Stop the engine
        canvasContext.clearRect(0, 0, canvasOutput.width, canvasOutput.height);
        clearTimeout(processVideo);
        // hideGuideUI();
        // utils.stopCamera();
        toastr.error('Reloading the session now','Breath Engine Error :(',{
            onHidden: function () {
                //window.location.reload();
            }
        });
    }

    function processVideo() {
        try {
            let begin = Date.now();

            // Start processing
            cap.read(frame);
            cv.cvtColor(frame, frameGray, cv.COLOR_RGBA2GRAY);

            // Detect faces
            classifier.detectMultiScale(frameGray, faces, 1.1, 5, 0);
            sessionData.calibration.facesDetected = faces.size();
            for (let i = 0; i < faces.size(); ++i) {
                let face = faces.get(i);
                let point1 = new cv.Point(face.x, face.y);
                let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                sessionData.calibration.facePositionY = face.y;
                sessionData.calibration.faceHeightInFrame = face.height;
                // Colour of face recognition frame in RGB
                cv.rectangle(frame, point1, point2, [118, 255, 0, 0]);
            }

            // Calculate optical flow
            try {
                cv.calcOpticalFlowPyrLK(oldGray, frameGray, p0, p1, st, err, winSize, maxLevel, criteria);
            } catch (e) { console.log(e); }

            // Refresh the flags
            function refreshMinMax() {
                let minDict = {};
                let maxDict = {};
                if (minDict && maxDict) {
                    document.getElementById('adjustMinMaxFlag').checked = true;
                }
            }

            // Add to Dataframe function
            function addToDF(value, slNo) {
                // Value is the point position value, slNo is the position in array (I think!)
                //console.log(value);
                adjustMinMax = document.getElementById('adjustMinMaxFlag').checked;
                var tempValue = value;
                if (!dfDict[slNo]) {
                    dfDict[slNo] = [];
                }
                // Removing vals in array so it's not massive and it is temporary!
                if (dfDict[slNo].length >= 5) {
                    dfDict[slNo].shift();
                    // tempValue = dfDict[slNo].reduce(add, value)/dfDict[slNo].length+1;
                }
                dfDict[slNo].push(tempValue);
                //console.log(dfDict[slNo].reduce(add, value)/dfDict[slNo].length+1)

                if (document.getElementById('refreshtMinMaxFlag').checked) {
                    minDict = {};
                    maxDict = {};
                    dfDict = { 0: [], 1: [] };
                    document.getElementById('adjustMinMaxFlag').checked = true;
                }

                // BREATH RANGES
                // 1) Calibrate the fixed range of the breath (where the top of the users breath is, and bottom)
                // 2) Once we've found it, we no longer update the difference between boundaries - we keep it the same.
                // 3) Now, we just move the breath boundaries based on where their head position is (if adjustminmax is off)
                // This gives us a way to define the breath range, but if the user moves around, it's still going to work as the boundaries move with them, rather than stay in the same place

                if (adjustMinMax) {

                    // Saying, if the current value is less than the bottom of the breath, set the new bottom of breath boundary
                    minDict[slNo] = minDict[slNo] < value ? minDict[slNo] : value;

                    // Saying, if the current value is more than the top of breath, set the new top of breath boundary
                    maxDict[slNo] = maxDict[slNo] > value ? maxDict[slNo] : value;
                
                    //console.log('we are adjusting',minDict[slNo], maxDict[slNo] )
                }
            }

            function checkBound(x, y, lb, tb, rb, bb) {
                if (x < lb || x > rb) return false;
                if (y < tb || y > bb) return false;
                // console.log(x, y, lb, tb, rb, bb);
                return true;
            }

            // Select good points
            let goodNew = [];
            let goodOld = [];
            var topBound = 120;
            var bottomBound = 200;
            var leftBound = 30;
            var rightBound = 275;
            if (faces.size() > 0) {
                let singleface = faces.get(0);
                // BOUNDARIES FOR THE POINTS. IF THEY FALL OUT OF THESE AREAS THEY ARE NOT SELECTED.
                topBound = singleface.y + singleface.height + 5; // TOP BOUNDARY + 5px so that the neckline and background is less likely to be detected as most background appears above shoulders and below head
                leftBound = singleface.x - 20 > 0 ? singleface.x - 20 : leftBound; // LEFT BOUNDARY
                rightBound = singleface.x + singleface.width + 20 > 320 ? singleface.x + singleface.width + 20 : 320; // RIGHT BOUNDARY
                
                // THE IDEAL ROI TO USE (JUST A RECTANGLE, NOT USED YET)
                topLeft = {x:singleface.x - 20, y:singleface.y+singleface.height + 10};
                bottomRight = {x:singleface.x + singleface.width + 20, y:singleface.y+singleface.height + 65};
                // let dst = new cv.Mat();
                cv.rectangle(frame, topLeft, bottomRight, [51, 255, 255, 0]);

                try {
                    leftBound = topLeft.x;
                    topBound = topLeft.y;
                    rightBound = bottomRight.x;
                    bottomBound = bottomRight.y;
                    // dst = frame.roi({x: topLeft.x, y: topLeft.y, width: bottomRight.x - topLeft.x, height: bottomRight.y - topLeft.y}); 
                    // cv.imwrite(frame, dst);
                } catch (e) { console.log(e); }
            }
            
            // This will add the point(s) data to the dataframe so we can analyse min and max values
            for (let i = 0; i < st.rows; i++) {

                // If there's data and if the point position is within our defined region of interest constraints, push the point
                // THIS CAN BE IMPROVED, that is to say that our region of interest could be improved here with MOG2 or masks
                // if (st.data[i] === 1 && (p1.data32F[i * 2 + 1] > (topBound)) && p1.data32F[i * 2] > leftBound & p1.data32F[i * 2] < rightBound) {
                if (st.data[i] === 1 &&
                    checkBound(p1.data32F[i * 2], p1.data32F[i * 2 + 1], leftBound, topBound, rightBound, bottomBound)) { //&& 
                    // checkBound(p0.data32F[i * 2], p0.data32F[i * 2 + 1], leftBound, topBound, rightBound, bottomBound)) {
                    goodNew.push(new cv.Point(p1.data32F[i * 2], p1.data32F[i * 2 + 1]));
                    goodOld.push(new cv.Point(p0.data32F[i * 2], p0.data32F[i * 2 + 1]));
                    // Adds the position of the point to DF function which analyses min max values
                    addToDF(p1.data32F[i * 2 + 1], i);
                    // <!-- console.log(p1.data32F[i*2+1], "jhj", p1.data32F[i*2+1]>150) -->
                    onetimeFlag = 1;
                }
            }

            function isNotEmpty(obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop))
                        return true;
                }
                return false;
            }

            // Send data to realtime analysis modules for processing
            if (streaming && isNotEmpty(minDict)) {
                analyseCVData(dfDict, minDict, maxDict, sessionData.totalSessionTime);
            }

            // Draw the tracks
            sessionData.calibration.shoulderPoints = goodNew.length;
            for (let i = 0; i < goodNew.length; i++) {
                //cv.line(mask, goodNew[i], goodOld[i], color[i], 2);
                cv.circle(frame, goodNew[i], 5, color[i], -1);
            }
            cv.add(frame, mask, frame);
            cv.imshow('canvasOutput', frame);

            if (!goodNew.length || !goodOld.length) {
                initVars();

                // Schedule the next one.
                let delay = Math.max(1000 / performanceVars.FPS - (Date.now() - begin), 1000 / performanceVars.FPS);
                if (streaming) {
                    setTimeout(processVideo, delay);
                    // console.log(delay);
                }
            } else {
                // Now update the previous frame and previous points
                frameGray.copyTo(oldGray);
                p0.delete();
                p0 = null;
                p0 = new cv.Mat(goodNew.length, 1, cv.CV_32FC2);
                for (let i = 0; i < goodNew.length; i++) {
                    //console.log('think this is the shoulder point height', goodNew[i].y);
                    p0.data32F[i * 2] = goodNew[i].x;
                    p0.data32F[i * 2 + 1] = goodNew[i].y;
                }

                // Schedule the next one.
                let delay = Math.max(1000 / performanceVars.FPS - (Date.now() - begin), 1000 / performanceVars.FPS);
                if (streaming) {
                    setTimeout(processVideo, delay);
                    if (!onetimeFlag) initVars();
                    // console.log(delay);
                } else {
                    clearTimeout(processVideo);
                }
            }
        } catch (err) {
            // Gives a good basis for recalibration. Only restarting right now.
            console.log(err);
            //refreshMinMax();
            cleanAndStopEngine();
            console.log('BreathEngine.js Stopped by Error');
        }
    }
}

export default initEngine;