const Buttons = {
	// Stats
	openStats: document.querySelector('.open-stats'),
	closeStats: document.querySelector('.close-stats'),

	// Mute button
	mute: document.getElementById('mute-btn'),

	// Settings buttons
	settingsPanel: document.getElementById('settings-panel'),
	settingsBtn: document.getElementById('session-settings-btn'),
	settingsClose: document.getElementById('session-settings-btn-close'),
	settingsAveragePerf: document.getElementById('average-performance-btn'),
	settingsBetterPerf: document.getElementById('better-performance-btn'),
	settingsBestPerf: document.getElementById('best-performance-btn'),

	// Calibration buttons
	recalibrate: document.getElementById('recalibrate-btn'),
	sessionRecalibrate: document.getElementById('session-recalibrate-btn'),
	afterCalibration: document.getElementById('after-calibration-btns'),

	// Session
	startSession: document.getElementById('start-session-btn')
};

export default Buttons;