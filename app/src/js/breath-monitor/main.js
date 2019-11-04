// BREATH MONITOR MODE
// 
// Shows a realtime view of someones stats, and is meant mainly for running in the background whilst working
// Biofeedback to be added later!

import Elements from './UI/Elements';
import { startBreathEngine, breathEngineEvents } from '../engines/breathEngine';
import { Steps, stepsUIEvents } from './UI/Steps';
import { Session } from './UI/Session';
import './UI/Settings';

startBreathEngine({
    mode: 'monitorMode',
});

breathEngineEvents.on('initialised', () => {
    Steps.start();

    // Steps are finished
    stepsUIEvents.on('finished', () => {
        // Hide calibration steps
        Elements.calibrationWrapper.style.display = 'none';

        // Show session UI
        Elements.sessionUI.style.display = 'flex';

        // Start the session
        Session.start();
    });
});