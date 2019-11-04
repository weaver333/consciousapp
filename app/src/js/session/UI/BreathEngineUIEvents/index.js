import Dispatcher from "../../../Dispatcher";
import { Timer } from "../Timer";
import { Steps } from '../Steps';


const breathEngineUIEvents = new Dispatcher();

Timer.updateUI.start({
	onTick: () => {
		
		let facesDetected = sessionData.calibration.facesDetected,
			shoulderPoints = sessionData.calibration.shoulderPoints;
		
		switch( facesDetected ) {
			case 0: {
				// Reset the stepsInterval from step 4 if no faces are detected
				Timer.stepsInterval.stop();
				breathEngineUIEvents.dispatch('noFaceDetected');
				return;
			}
			case 1: {
				breathEngineUIEvents.dispatch('faceDetected');
			}
		}
	
		switch ( shoulderPoints ) {
			case 0: {
				// Reset the stepsInterval from step 4 if no faces are detected
				Timer.stepsInterval.stop();
				breathEngineUIEvents.dispatch('noShoulderPointsDetected');
				return;
			}
			case 1: {
				// Reset the stepsInterval from step 4 if no faces are detected
				Timer.stepsInterval.stop();
				breathEngineUIEvents.dispatch('oneShoulderPointsDetected');
				return;
			}
			default: {
				breathEngineUIEvents.dispatch('shoulderPointsDetected');
			}
		}
	}
});



export default breathEngineUIEvents;