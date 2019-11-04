import Elements from '../Elements';
import Buttons from '../Buttons';
import Strings from '../Strings';
import Dispatcher from '../../../Dispatcher';

import { Timer, timerEvents } from '../Timer';
import breathEngineUIEvents from '../BreathEngineUIEvents';

const stepsUIEvents = new Dispatcher();

const Steps = {
	firstRun: true,
	breathTimerFinished: false,
	finished: false,
	inhaleDone: false,

	start() {
		// When there's no faces detected
		breathEngineUIEvents.on('noFaceDetected', () => { 
			this.reset();
			this.showStep1();
		});

		// When there's no shoulders detected
		breathEngineUIEvents.on('noShoulderPointsDetected', () => { 
			this.reset();
			console.log('zovi shoulder');
			this.showStep2Warning();
		});

		// When faces are detected and shoulders
		breathEngineUIEvents.on('shoulderPointsDetected', () => {
			// Steps interval to countdown the inhaling 3...2...1...
			Timer.stepsInterval.start({
				// On every tick update the number 3...2...1...
				onTick: counter => {
					this.showStep3();
					let calibratingSteps3Text = Strings.calibratingStep3_1.replace('{{counter}}', counter);
					Elements.calibrationText.innerHTML = calibratingSteps3Text;
				},
				onFinish: () => {
					// If the timer has finished
					Steps.breathTimerFinished = true;
					this.inhaleDone = false;
					
					// When countdown finishes, show step 4 and if inhales show step 5 with the meter
					this.showStep4();

					timerEvents.on('updateUI', () => {
						if ( Steps.breathTimerFinished ) {
							if ( sessionData.breathStateNow == 'Inhaling' ) {
								this.setIconDone( Elements.stepIcon3 );
								this.inhaleDone = true;
							}
	
							// Update the breathing bar and show step 5
							if ( this.inhaleDone ) {
								Elements.breathMeterBar.style.width = sessionData.breathDepthNow + '%';
	
								if ( sessionData.breathStateNow == 'Exhaling' ||  
									sessionData.breathStateNow == 'Holding') {
									// Show the meter when started to hold / exhale
									this.showStep5();
								}
							}
						}
					});

					// Turn refresh on and off to set vals (for better cal) __needsCleanup
					this.recalibrate();

					// Recalibrate
					Buttons.recalibrate.addEventListener('click', () => {
						this.reset();
					});

					Buttons.startSession.addEventListener('click', e => {
						e.preventDefault();
						stepsUIEvents.dispatch('finished');
						sessionData.calibration.calibrationComplete = true;
						Steps.firstRun = false;
						Steps.finished = true;
						Timer.updateUI.stop();
					});
				}
			});
		});

		// When all steps finished, clicking on start button starts the session
		
	},

	reset() {
		sessionData.calibration.calibrationComplete = false;
		Timer.stepsInterval.reset();
		this.breathTimerFinished = false;
		this.inhaleDone = false;
		this.finished = false;
		
		setTimeout(function(){
			Elements.calibrationCheckbox.checked = false;
		}, 2000);

		// Hide session UI
		// Elements.sessionUI.style.display = 'none';

		// // Show calibration steps
		// Elements.calibrationWrapper.style.display = 'flex';
	},

	recalibrate() {
		Elements.calibrationCheckbox.checked = true;
		setTimeout(() => {
			Elements.calibrationCheckbox.checked = false;
		}, 1000);
	},

	setBarEmpty(el) {
		el.className ='step-bar';
	},

	setBarDoing(el) {
		el.className = 'step-bar doing';
	},

	setBarDoneWithWarning(el) {
		el.className = 'step-bar done-warning';
	},

	setBarDone(el) {
		el.className = 'step-bar done';
	},

	setIconDoing(el) {
		el.className = 'icon icon-dots';
	},

	setIconDone(el) {
		el.className = 'icon icon-tick';
	},

	showStep1() {
		this.setBarDoing( Elements.stepBar1 );
		this.setIconDoing( Elements.stepIcon1 );
		this.setIconDoing( Elements.stepIcon2 );
		this.setIconDoing( Elements.stepIcon3 );
		this.setBarEmpty( Elements.stepBar2 );
		this.setBarEmpty( Elements.stepBar3 );
		Elements.calibrationText.innerHTML = Strings.calibratingText1;
		Elements.stepBars.style.display = 'flex';
		Elements.breathMeter.style.display = 'none';
		Buttons.afterCalibration.style.display = 'none';
		Elements.calibrationList.style.display = 'block';
	},

	showStep2() {
		this.setBarDone( Elements.stepBar1 );
		this.setIconDone( Elements.stepIcon1 );
		this.setIconDoing( Elements.stepIcon2 );
		this.setBarDone( Elements.stepBar2 );
		this.setBarEmpty( Elements.stepBar3 );
		this.setIconDoing( Elements.stepIcon3 );
		Elements.calibrationText.innerHTML = Strings.calibratingText2;
		Elements.stepBars.style.display = 'flex';
		Elements.breathMeter.style.display = 'none';
		Buttons.afterCalibration.style.display = 'none';
		Elements.calibrationList.style.display = 'block';
	},

	showStep2Warning() {
		this.setBarDone( Elements.stepBar1 );
		this.setIconDone( Elements.stepIcon1 );
		this.setIconDoing( Elements.stepIcon2 );
		this.setBarDoneWithWarning( Elements.stepBar2 );
		this.setBarEmpty( Elements.stepBar3 );
		this.setIconDoing( Elements.stepIcon3 );
		Elements.calibrationText.innerHTML = Strings.calibratingText2Warning;
		Elements.stepBars.style.display = 'flex';
		Elements.breathMeter.style.display = 'none';
		Buttons.afterCalibration.style.display = 'none';
		Elements.calibrationList.style.display = 'block';
	},

	showStep3() {
		this.setIconDone( Elements.stepIcon1 );
		this.setBarDone( Elements.stepBar1 );
		this.setIconDone( Elements.stepIcon2 );
		this.setBarDone( Elements.stepBar2 );
		this.setBarDoing( Elements.stepBar3 );
		this.setIconDoing( Elements.stepIcon3 );
		Elements.stepBars.style.display = 'flex';
		Elements.breathMeter.style.display = 'none';
		Buttons.afterCalibration.style.display = 'none';
		Elements.calibrationList.style.display = 'block';
	},

	showStep4() {
		this.setIconDone( Elements.stepIcon1 );
		this.setIconDone( Elements.stepIcon2 );
		this.setIconDoing( Elements.stepIcon3 );
		Elements.calibrationText.innerHTML = Strings.calibratingText4;
		Elements.calibrationList.style.display = 'block';
	},

	showStep5() {
		this.setIconDone( Elements.stepIcon1 );
		this.setIconDone( Elements.stepIcon2 );
		this.setIconDone( Elements.stepIcon3 );
		document.getElementById('pulse-dot').classList.remove('dot-orange');
		document.getElementById('pulse-dot').classList.add('dot-green');
		Elements.calibrationText.innerHTML = Strings.calibratingText5;
		Elements.stepBars.style.display = 'none';
		Elements.breathMeter.style.display = 'block';
		Buttons.afterCalibration.style.display = 'flex';
		Elements.calibrationList.style.display = 'none';
	}
};

export { 
	Steps,
	stepsUIEvents
}