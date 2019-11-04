import { Heartbeat } from './heartbeat';

function monitorHeart(){
    const OPENCV_URI = "assets/js/lib/opencv4.1.1.js";
    const HAARCASCADE_URI = "/haarcascade_frontalface_default.xml"
    
    // Load opencv when needed
    async function loadOpenCv(uri) {
      return new Promise(function(resolve, reject) {
        console.log("starting to load opencv");
        var tag = document.createElement('script');
        tag.src = uri;
        tag.async = true;
        tag.type = 'text/javascript'
        tag.onload = () => {
          cv['onRuntimeInitialized'] = () => {
            console.log("opencv ready");
            resolve();
          }
        };
        tag.onerror = () => {
          throw new URIError("opencv didn't load correctly.");
        };
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      });
    }
    
    let demo = new Heartbeat("webcam", "canvas", HAARCASCADE_URI, 30, 6, 250);
    var ready = loadOpenCv(OPENCV_URI);
    ready.then(function() {
      demo.init();
    });
}

export { monitorHeart };

