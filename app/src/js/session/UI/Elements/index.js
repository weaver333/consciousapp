const Elements = {
	// Main elements
	body:	document.body,

	// Calibration elements
	breathMeterBar: document.getElementById('breath-meter-bar'),	
	breathMeter: document.getElementById('breath-meter'),
	calibrationText: document.getElementById('calibrating-text'),
	calibrationCheckbox: document.getElementById('refreshtMinMaxFlag'),
	measureboxCheckbox:	document.getElementById('adjustMinMaxFlag'),
	calibrationWrapper: document.getElementById('calibration-wrapper'),
	calibrationList: document.getElementById('calibration-list'),

	// Inputs
	packSessionBackground: document.getElementById('pack-sessionBackground'),
	packSessionAudio:	document.getElementById('pack-sessionAudio'),

	// Steps
	stepBars: document.getElementById('step-bars'),
	stepBar1: document.getElementById('step-bar-1'),
	stepBar2: document.getElementById('step-bar-2'),
	stepBar3: document.getElementById('step-bar-3'),
	stepIcon1: document.getElementById('step-icon-1'),
	stepIcon2: document.getElementById('step-icon-2'),
	stepIcon3: document.getElementById('step-icon-3'),

	// Session
	sessionUI: document.getElementById('sessionUI'),
};

export default Elements;