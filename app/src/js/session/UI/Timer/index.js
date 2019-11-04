import Dispatcher from '../../../Dispatcher';

const timerEvents = new Dispatcher();

let
	stepsInterval,
	oneSecondInterval,
	updateUI;

const Timer = {
	oneSecondInterval: {
		started: false,
		start: callback => {
			if ( !Timer.oneSecondInterval.started ) {
				Timer.oneSecondInterval.started = true;
				oneSecondInterval = setInterval(() => {
					callback.onTick( Timer.stepsInterval.counter );
					timerEvents.dispatch('oneSecondInterval');
				}, 1000);
			}
		},
		stop() {
			timerEvents.dispatch('oneSecondIntervalStopped');
			clearInterval(oneSecondInterval);
		}
	},
	stepsInterval: {
		started: false,
		counter: 3,
		start: callback => {
			if ( !Timer.stepsInterval.started ) {
				Timer.stepsInterval.started = true;
				stepsInterval = setInterval(() => {
					if ( Timer.stepsInterval.counter > 0 ) {
						callback.onTick( Timer.stepsInterval.counter );
						timerEvents.dispatch('stepsInterval', Timer.stepsInterval.counter);
						Timer.stepsInterval.counter--;
					} else {
						callback.onFinish();
						timerEvents.dispatch('stepsIntervalDone');
						clearInterval(stepsInterval);
					}
				}, 1000);
			}
		},
		reset() {
			Timer.stepsInterval.counter = 3;
			Timer.stepsInterval.started = false;
			clearInterval(stepsInterval);
		},
		stop() {
			clearInterval(stepsInterval);
		}
	},
	updateUI: {
		started: false,
		start: callback => {
			if ( !Timer.updateUI.started ) {
				updateUI = setInterval(() => {
					callback.onTick();
					timerEvents.dispatch('updateUI');
				}, 50);
				Timer.updateUI.started = true;
			}
		},
		stop() {
			timerEvents.dispatch('updateUIStopped');
			clearInterval(updateUI);
		}
	}
};

export {
	Timer,
	timerEvents
};