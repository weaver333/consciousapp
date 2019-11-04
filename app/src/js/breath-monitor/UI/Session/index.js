import Elements from '../Elements';
import Buttons from '../Buttons';
import { updateDataPanelUI } from '../DataPanel';
import { notifyBreathsPerMin } from '../Notifications';
import { Timer } from '../Timer';
import { Steps } from '../Steps';

const Session = {
	sessionStarted: false,
	start() {
		if ( !this.sessionStarted ) {
			// Reset the session data /engines/breathEngine/computerVision
			if ( Steps.firstRun ) {
				window.resetSessionData();

				// Set background & audio
				//setPackBackground(Elements.packSessionBackground.value);
				//packSoundtrack('start', Elements.packSessionAudio.value);
			}

			// Add class to body that the session started
			Elements.body.classList.add('breath-monitor-started');

			Buttons.sessionRecalibrate.addEventListener('click', function() {
				Steps.recalibrate();
			});

			// Update the panels
			updateDataPanelUI();

			// Timer notify brpm
			Timer.oneSecondInterval.start({
				onTick: () => {
					// Notify if we hit 60s
					if(sessionData.totalSessionTime === 60){
						notifyBreathsPerMin();
					}
				}
			});
			this.sessionStarted = true;
		}
	}
};

export {
	Session
}