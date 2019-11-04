function packSoundtrack(condition, url = '/') {

    if (condition === 'start'){
        /* --- set up web audio --- */
        //create the context
        packAudioContext = new AudioContext();
        //...and the source
        var source = packAudioContext.createBufferSource();
        //connect it to the destination so you can hear it.
        source.connect(packAudioContext.destination);
        
        gainNode = packAudioContext.createGain();
        source.connect(gainNode);
        gainNode.connect(packAudioContext.destination);
        
        /* --- load buffer ---  */
        var request = new XMLHttpRequest();
        //open the request
        request.open('GET', url, true); 
        //webaudio paramaters
        request.responseType = 'arraybuffer';
        //Once the request has completed... do this
        request.onload = function() {
            packAudioContext.decodeAudioData(request.response, function(response) {
                /* --- play the sound AFTER the buffer loaded --- */
                //set the buffer to the response we just received.
                source.buffer = response;
                //start(0) should play asap.
                source.start(0);
                source.loop = true;
            }, function () { console.error('The request failed.'); } );
        }
        //Now that the request has been defined, actually make the request. (send it)
        request.send();
    }

    if(condition === 'mute'){
        gainNode.gain.linearRampToValueAtTime(-1, packAudioContext.currentTime + 1);
        //gainNode.gain.value = -1;
    }

    if(condition === 'unmute'){
        gainNode.gain.linearRampToValueAtTime(1, packAudioContext.currentTime + 1);
        //gainNode.gain.value = 1;
    }
    
}
export { 
    packSoundtrack
};
