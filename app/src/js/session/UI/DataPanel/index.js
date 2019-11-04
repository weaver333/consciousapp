// UI Functions concerning the data panel that holds the biofeedback
import moment from 'moment';
import { calculateIfFollowingGuide } from '../Circle';

// Main updating function
function updateDataPanelUI() {
    var updateUIInterval = function() {
        updateBreathDepth();
        updateBreathCycles();
        updateBreathState();
        updateBreathsPerMin();
        showSessionTime();

        calculateXP();
        calculateIfFollowingGuide();
        //console.log(performanceVars.updateUIInterval)
        // Make sure we are using the latest interval time from performance settings
        // clearInterval(updateUIInterval);
        setTimeout(updateUIInterval, performanceVars.updateUIInterval);
    }
    setTimeout(updateUIInterval, performanceVars.updateUIInterval);
}

// Sub-functions that the main function uses

function updateBreathsPerMin() {
    // Making sure breaths per minute isn't shown until 60s has passed
    //console.log(sessionData.totalSessionTime);
    if (sessionData.totalSessionTime > 60) {
        document.getElementById('breathsPerMinute').innerHTML = sessionData.breathsPerMin;
    }
    else {
        document.getElementById('breathsPerMinute').innerHTML = '<p class="brpm-calculation">Result in ' + (60 - sessionData.totalSessionTime) + ' seconds</p>';
    }
}

function showSessionTime() {
    var timeToShow = moment.utc(sessionData.totalSessionTime * 1000).format('mm:ss');
    document.getElementById('session-timer').innerHTML = timeToShow;
}

function updateBreathDepth() {
    document.getElementById('breathDepth').innerHTML = sessionData.breathDepthNow + "%";
}

function updateBreathCycles() {
    document.getElementById('breathCycles').innerHTML = sessionData.breathCycles;
}

function updateBreathState() {
    document.getElementById('actualState').innerHTML = sessionData.breathStateNow;
}

// WARNING: This function needs to be done on the server eventually to avoid manipulation of XP
function calculateXP() {
    if (sessionData.breathStateNow === sessionData.guideStateNow) {
        sessionData.totalXP = sessionData.totalXP + 0.05;
    }
    // Sets XP in the UI
    document.getElementById('xp').innerHTML = parseInt(sessionData.totalXP) + "xp";
}


export {
    updateDataPanelUI
};