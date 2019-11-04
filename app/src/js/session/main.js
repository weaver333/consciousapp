// SESSION VIEW
// 
// Session view is the classic view that just shows breathing guides, uses breath biofeedback and stores results.
// The breath engine is abstracted from this view so we can create different breath engine use cases, such as passive monitoring
// And include the breath engine in different places, but keep it in one place.

import Elements from './UI/Elements';
import { startBreathEngine, breathEngineEvents } from '../engines/breathEngine';
import { Steps, stepsUIEvents } from './UI/Steps';
import { Session } from './UI/Session';
import './UI/Settings';

startBreathEngine({
    mode: '',
});

breathEngineEvents.on('initialised', () => {
    Steps.start();

    // When clicked on Start! button on last step
    stepsUIEvents.on('finished', () => {
        // Hide calibration steps
        Elements.calibrationWrapper.style.display = 'none';

        // Show session UI
        Elements.sessionUI.style.display = 'flex';

        // Start the session
        Session.start();
    });
});