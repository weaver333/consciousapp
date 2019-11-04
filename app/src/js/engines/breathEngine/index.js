// INITIALISATION 
import Utils from './utils';
import initEngine from './computerVision';
import Dispatcher from '../../Dispatcher';

let breathEngineEvents = new Dispatcher();

const startBreathEngine = options => {
  console.log( 'BreathEngine Initialised with mode:', options.mode );

  // new Promise((resolve, reject) => {
  let utils = new Utils('errorMessage');

  utils.startCamera('qvga', ()=>{
    document.getElementById('video').srcObject = utils.stream;
    document.getElementById('video').play();
  }, 'videoInput');

  // OpenCV needs to be loaded before breath engine loads
  utils.loadOpenCv(() => {
  
    let faceCascadeFile = 'haarcascade_frontalface_default.xml';
    utils.xmlLoaded = new Promise(
      function(resolve) {
        utils.createFileFromUrl(faceCascadeFile, `/${faceCascadeFile}`, () => {
          resolve();
        });
      }
    );

    cv['onRuntimeInitialized']=()=>{
      console.log('OpenCV initialised, initialising engine...');
      const windowWidth = document.body.clientWidth;
      let graphWidth = windowWidth - 500;
      initEngine(utils, options.mode, { graphWidth, graphHeight: 400 });
      breathEngineEvents.dispatch('initialised');
      document.body.classList.add('engine-loaded');
      console.log('Engine initialised!');
    };
  });
}

export {
  startBreathEngine,
  breathEngineEvents
}