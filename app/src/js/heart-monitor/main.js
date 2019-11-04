import { monitorHeart } from '../engines/heartEngine';

monitorHeart();

function updateHeartRate() {
    let heartRate = parseInt(heartbeatData.heartRate, 10);
    if(!isNaN(heartRate)){
        document.getElementById('heartRate').innerHTML = heartRate;
    } else {
        document.getElementById('heartRate').innerHTML = 'Processing...';
    }
}

setInterval(updateHeartRate, 1000);