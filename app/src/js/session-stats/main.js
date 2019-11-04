import '../Dropdown';
import '../ThemeToggle';
import '../Chart';
import Dygraph from 'dygraphs';
import smoothPlotter from '../DygraphSmoothPlotter';

/*
 **** Progress Bar & Start another session box
 */

let sessionBrPM = document.querySelector('#sessionBrPM').value,
	guideBrPM = document.querySelector('.guideBreathsPerMin').value;

// Setting progress bar for guide
let guideBrPMPercentage = (guideBrPM < sessionBrPM) ? Math.floor(guideBrPM / sessionBrPM * 100) : 100;
document.querySelector('.guide-line').style.width = guideBrPMPercentage + '%';

// Setting progress bar for the session
let sessionBrPMPercentage = (guideBrPM > sessionBrPM) ? Math.floor(sessionBrPM / guideBrPM * 100) : 100;
document.querySelector('.bar').style.width = sessionBrPMPercentage + '%';


// Guide text
let guideTextEl = document.querySelector('.guide-text');
let BrPMDiff = (guideBrPM > sessionBrPM) ? guideBrPM - sessionBrPM : -(sessionBrPM - guideBrPM);

if (BrPMDiff > 1) {
	guideTextEl.innerHTML = 'You were breathing slightly slower than the guide this time';
} else if (BrPMDiff < -1) {
	// Update the icon & background color
	const breathingRateIconEl = document.getElementById('breathing-rate-icon');
	breathingRateIconEl.classList.remove('bg-green');
	breathingRateIconEl.classList.add('bg-yellow');
	breathingRateIconSpanEl = breathingRateIconEl.querySelector('span');
	breathingRateIconSpanEl.classList.remove('icon-tick');
	breathingRateIconSpanEl.classList.add('icon-info');
	guideTextEl.innerHTML = 'You were breathing slightly faster than the guide this time';
}

/*
 **** Graph 
 */
// Dygraph with smooth plotting
let functionData = [];
let sessionBreathDepthData = window.breathDepthData;
sessionBreathDepthData.forEach(item => {
	let i = item[0];
	let v = item[1];
	functionData.push([i, v, v]);
});

new Dygraph(
	document.getElementById('chart'),
	functionData, {
		labels: ['Time', 'DepthStraight', 'Depth'],
		series: {
			DepthStraight: {
				color: 'rgba(0,0,0,1)',
				strokeWidth: 0,
			},
			Depth: {
				plotter: smoothPlotter,
				drawPoints: true,
				pointSize: 3,
				color: '#27B4AB',
				strokeWidth: 2,
			}
		},
		gridLineColor: '#ddd',
		valueRange: [0, 101],
		width: 700,
		height: 200,
		legendFormatter: function (data) {
			data.series = [data.series[1]]; // pick whichever series you want to keep
			return Dygraph.Plugins.Legend.defaultFormatter.call(this, data);
		}

	}
);