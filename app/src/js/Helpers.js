import moment from 'moment';

function getQueryStringParams(search) {
	var query = document.location.search;

	return query
		 ? (/^[?#]/.test(query) ? query.slice(1) : query)
			  .split('&')
			  .reduce((params, param) => {
						 let [key, value] = param.split('=');
						 params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
						 return params[search];
					}, {}
			  )
		 : {}
}


var formatSession = {
	formatMinutes(timeInSeconds) {
		if ( timeInSeconds < 60 ) {
			return (timeInSeconds == 1) ? timeInSeconds + ' second' : timeInSeconds + ' seconds';
		} else {
			var minutes =
				totalSessionTimeMinutes = moment
				.duration(timeInSeconds, 'seconds')
				.get('minutes');
			return (minutes == 1) ? minutes + ' minute' : minutes + ' minutes';
		}
	},
	formatDate(inputDate) {
		var currDate = moment(),
			sessionTimestamp = moment(inputDate).utc(),
			daysDiff = sessionTimestamp.diff(currDate, 'days'),
			daysText = '';

		daysDiff = Math.abs(daysDiff);

		switch (daysDiff) {
			case 0:
				daysText = 'today';
				break;
			case 1:
				daysText = 'yesterday';
				break;
			default:
				daysText = daysDiff + ' days ago';
		}

		return daysText;
	},
	formatTime(inputDate) {
		return moment(inputDate).utc().format('hh:mma');
	},
	format(session) {
		sessionTime = this.formatTime(session.timestamp),
			totalSessionTimeMinutes = this.formatMinutes(session.totalSessionTime),
			daysText = this.formatDate(session.timestamp);
		guideBackground = '',
			breathBackground = '';

		// Percentage background color for guide accuracy
		if (session.guideAccuracyAvg < 30) {
			guideBackground = 'red';
		} else if (session.guideAccuracyAvg < 70) {
			guideBackground = 'yellow';
		} else if (session.guideAccuracyAvg > 70) {
			guideBackground = 'green';
		}

		// Percentage background color for breath depth
		if (session.topOfBreathAvg < 50) {
			breathBackground = 'red';
		} else if (session.topOfBreathAvg < 70) {
			breathBackground = 'yellow';
		} else if (session.topOfBreathAvg > 70) {
			breathBackground = 'green';
		}

		if (session.packType == '') session.packType = 'Undefined pack';
		session.sessionDateDay = daysText;
		session.sessionDateTime = sessionTime;
		session.totalSessionTime = totalSessionTimeMinutes;
		session.guideBackground = guideBackground;
		session.breathBackground = breathBackground;
		session.link = '/session-stats/' + session._id;
		
		return session;
	},
	leftIconBoxes() {
		const leftIconBoxes = document.querySelectorAll('.left-icon-box');
		leftIconBoxes.forEach( box => {
			// Percentage background color for guide accuracy
			let guidePercentageEl = box.querySelector('.guide-percentage'),
				guidePercentage = parseInt( guidePercentageEl.getAttribute('data-percentage') ),
				guideBackground = '';

			if (guidePercentage < 30) {
				guideBackground = 'stats-red';
			} else if (guidePercentage < 70) {
				guideBackground = 'stats-yellow';
			} else if (guidePercentage > 70) {
				guideBackground = 'stats-green';
			}

			guidePercentageEl.classList.add(guideBackground);

			// Percentage background color for breath depth
			let tobPercentageEl = box.querySelector('.tob-percentage'),
			tobPercentage = parseInt( tobPercentageEl.getAttribute('data-percentage') ),
			tobBackground = '';

			if (tobPercentage < 50) {
				tobBackground = 'stats-red';
			} else if (tobPercentage < 70) {
				tobBackground = 'stats-yellow';
			} else if (tobPercentage > 70) {
				tobBackground = 'stats-green';
			}

			tobPercentageEl.classList.add(tobBackground);

			// For total session time to convert into X seconds/minutes
			let totalSessionTimeMinutesEl = box.querySelector('.total-session-time'),
				totalSessionTimeMinutes = totalSessionTimeMinutesEl.getAttribute('data-total-session-time'),
				totalSessionTimeMinutesText = formatSession.formatMinutes(totalSessionTimeMinutes);
			totalSessionTimeMinutesEl.innerHTML = totalSessionTimeMinutesText;

			// For timestamp and sessiondateday
			let timestampEl = box.querySelector('.timestamp'),
				timestamp = timestampEl.getAttribute('data-timestamp'),
				timeStampFormatted = formatSession.formatTime(timestamp),
				sessionDateDayFormatted = formatSession.formatDate(timestamp),
				sessionDateDayEl = box.querySelector('.session-date-day');
			
			timestampEl.innerHTML = timeStampFormatted;
			sessionDateDayEl.innerHTML = sessionDateDayFormatted;
		});
	}
}

export {
	formatSession,
	getQueryStringParams
};