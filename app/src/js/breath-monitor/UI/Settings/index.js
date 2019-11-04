import Buttons from '../Buttons';
import { performanceMode } from '../../../engines/breathEngine/settings/performanceSettings';
// Settings UI toggle
Buttons.settingsBtn.addEventListener('click', e => {
	e.preventDefault();
	Buttons.settingsBtn.style = "display:none";
   Buttons.settingsPanel.style = 'display: block;'
});

Buttons.settingsClose.addEventListener('click', e => {
	e.preventDefault();
	Buttons.settingsBtn.style = "display:block";
	Buttons.settingsPanel.style = 'display: none;'
});

// Set performance mode
Buttons.settingsAveragePerf.addEventListener('click', function (e) {
	e.preventDefault();
	performanceMode('HighPerfLowAcc');
	Buttons.settingsAveragePerf.innerHTML = '✅ Low CPU/GPU usage, Low accuracy';
	Buttons.settingsBetterPerf.innerHTML = '⬜️ Standard CPU/GPU usage, Standard accuracy';
	Buttons.settingsBestPerf.innerHTML = '⬜️ Higher CPU/GPU usage, Higher accuracy';
});

Buttons.settingsBetterPerf.addEventListener('click', function (e) {
	e.preventDefault();
	performanceMode('AvgPerfAvgAcc');
	Buttons.settingsAveragePerf.innerHTML = '⬜️ Low CPU/GPU usage, Low accuracy';
	Buttons.settingsBetterPerf.innerHTML = '✅ Standard CPU/GPU usage, Standard accuracy';
	Buttons.settingsBestPerf.innerHTML = '⬜️ Higher CPU/GPU usage, Higher accuracy';
});

Buttons.settingsBestPerf.addEventListener('click', function (e) {
	e.preventDefault();
	performanceMode('LowPerfHighAcc');
	Buttons.settingsAveragePerf.innerHTML = '⬜️ Low CPU/GPU usage, Low accuracy';
	Buttons.settingsBetterPerf.innerHTML = '⬜️ Standard CPU/GPU usage, Standard accuracy';
	Buttons.settingsBestPerf.innerHTML = '✅ Higher CPU/GPU usage, Higher accuracy';
});