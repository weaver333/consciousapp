import Dygraph from 'dygraphs';
import smoothPlotter from './DygraphSmoothPlotter';

let functionData = [];
window.breathDepthData.forEach(item => {
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