// Circle dom elements
const guideCircleEl = document.querySelector(".breathing-circle .circle"),
	userCircleEl = document.querySelector(".user-circle .circle"),
	circleTopTextEl = document.getElementById("circle-top-text"),
	circleBottomTextEl = document.getElementById("circle-bottom-text"),
	circleTextEl = document.querySelector(".circle-text"),
	packBreathPatternInhale = document.getElementById('pack-breathPatternInhale').value,
	packBreathPatternHoldIn = document.getElementById('pack-breathPatternHoldIn').value,
	packBreathPatternExhale = document.getElementById('pack-breathPatternExhale').value,
	packBreathPatternHoldEx = document.getElementById('pack-breathPatternHoldEx').value;

function hideGuideUI() {
	// Hides the ring
	hideBreathDepthCircle();
	// Hides the guide
	hideBreathGuide();
}

function showBreathGuide() {
    // Shows the main guide element
    document.getElementById('breathGuide').style.display = "block";
}

function hideBreathGuide() {
    // Hides the main guide element
    document.getElementById('breathGuide').style.display = "none";
}

function showBreathDepthCircle() {
    userCircleEl.setAttribute('style', "display: block");
}

function hideBreathDepthCircle() {
    userCircleEl.setAttribute('style', "display: none");
}

function calculateIfFollowingGuide() {
    // Set the ring colour if the guide state is the same as the actual state
    if (sessionData.breathStateNow === sessionData.guideStateNow) {
        document.getElementById('guideRing').setAttribute('style', 'border-color: #33E1FF; box-shadow: 0 2px 75px 0 rgba(51, 225, 255, 0.75);');
    } else {
        document.getElementById('guideRing').setAttribute('style', 'border-color: #ff7dcb78; box-shadow: 0 2px 75px 0 #ca333399');
    }
}

// Timer for breathing pattern
let timer = 0;

// Loop timer for circle
var guideCircleTimer;
var userCircleTimer;

// Param for the pack id
const circleAnimation = {
	start() {
		circleTextEl.style.display = 'flex';
		// Getting the packs breath parterns
		const sessionInhaleSeconds = parseInt( packBreathPatternInhale ),
			sessionHoldInStartAt = sessionInhaleSeconds,
			sessionHoldInSeconds = parseInt ( packBreathPatternHoldIn ),
			sessionExhaleStartAt = sessionInhaleSeconds + sessionHoldInSeconds,
			sessionExhaleSeconds = parseInt( packBreathPatternExhale ),
			sessionHoldExStartAt = sessionExhaleStartAt + sessionExhaleSeconds,
			sessionHoldExSeconds = parseInt( packBreathPatternHoldEx ),
			sessionPatternDuration =
				sessionInhaleSeconds +
				sessionHoldInSeconds +
				sessionExhaleSeconds +
				sessionHoldExSeconds;
		// Start animation the seconds text
		circleBottomTextEl.style.animation =
			"zoomText .5s linear infinite alternate";
		circleBottomTextEl.style.webkitAnimation =
			"zoomText .5s linear infinite alternate";

		// Running the function every 300ms so we update the guide circle
		userCircleEl.style.transitionDuration = ".2s";
		
		userCircleTimer = setInterval(() => {
			userCircleEl.style.strokeDashoffset = 100 - sessionData.breathDepthNow;
		}, 50);

		// Running the function every second so we update the guide circle
		guideCircleTimer = setInterval(() => {				
			if (timer >= 0 && timer < sessionHoldInStartAt) {
				// Update the circle
				guideCircleEl.style.transitionDuration =
					sessionInhaleSeconds + "s";
				guideCircleEl.style.strokeDashoffset = 0;
			} else if (timer == sessionExhaleStartAt) {
				guideCircleEl.style.transitionDuration =
					sessionExhaleSeconds + "s";
				guideCircleEl.style.strokeDashoffset = 100;

				// Reset the circle
				setTimeout(() => {
					// Reset circle
					guideCircleEl.style.transitionDuration = "0s";
					guideCircleEl.style.strokeDashoffset = 100;
				}, (sessionExhaleSeconds + sessionHoldExSeconds) * 1000 - 40);
				// reset a bit earlier so it has time to refresh the circle for inhale
			}

			// Timer in circle update
			if (timer >= 0 && timer < sessionInhaleSeconds) {
				var inhaleSecond = 0 - timer + sessionInhaleSeconds;
				circleTopTextEl.innerHTML = "Inhale";
				circleBottomTextEl.innerHTML = inhaleSecond;
			} else if (
				timer >= sessionInhaleSeconds &&
				timer < sessionExhaleStartAt
			) {
				var holdInSecond =
					sessionHoldInStartAt - timer + sessionHoldInSeconds;
				circleTopTextEl.innerHTML = "Hold";
				circleBottomTextEl.innerHTML = holdInSecond;
			} else if (
				timer >= sessionExhaleStartAt &&
				timer < sessionHoldExStartAt
			) {
				var exhaleSecond =
					sessionExhaleStartAt - timer + sessionExhaleSeconds;
				circleTopTextEl.innerHTML = "Exhale";
				circleBottomTextEl.innerHTML = exhaleSecond;
			} else {
				var holdExSecond =
					sessionHoldExStartAt - timer + sessionHoldExSeconds;
				circleTopTextEl.innerHTML = "Hold";
				circleBottomTextEl.innerHTML = holdExSecond;
			}

			timer++;
			if (timer == sessionPatternDuration) {
				timer = 0;
			}
		}, 1000);
	},
	stop() {
		circleTextEl.style.display = 'none';
		circleTopTextEl.innerHTML = "-";
		circleBottomTextEl.innerHTML = "-";

		// Reset the circles
		guideCircleEl.style.transitionDuration = "0s";
		guideCircleEl.style.strokeDashoffset = 100;

		userCircleEl.style.strokeDashoffset = 100;
		userCircleEl.style.transitionDuration = "0s";


		// Reset the timers
		timer = 0;
		clearInterval(guideCircleTimer);
		clearInterval(userCircleTimer);
	}
};

export { circleAnimation, hideGuideUI, showBreathDepthCircle, showBreathGuide, calculateIfFollowingGuide };
