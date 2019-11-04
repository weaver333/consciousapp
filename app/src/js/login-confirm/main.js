import { UsersApi } from '../Api';
import { getQueryStringParams } from '../Helpers';
import { TweenLite, TimelineLite, Back } from 'gsap';

var line1 = document.getElementById('env-line-1');
var line2 = document.getElementById('env-line-2');
var line3 = document.getElementById('env-line-3');
var envLid = document.getElementById('env-lid');
var envPaper = document.getElementById('env-paper');


/*
** Envelope animation
*/

TweenLite.defaultEase = Back.easeOut;

var tl = new TimelineLite({
	paused: true,
});

tl
	.to(envLid, 0.3, {
		scaleY: -1,
		y: 1.5,
	}
	)
	.fromTo(envPaper, 0.4, {
		transformOrigin: "50% 100%",
		scaleY: 0,
	}, {
		scaleY: 1,
	}, "=-0.25")
	.staggerFromTo([line1, line2, line3], 0.3, {
		transformOrigin: "50% 50%",
		scaleX: 0
	}, {
		scaleX: 1,
	}, -0.09)


setTimeout(function () {
	tl.play();
}, 1400);

/*
** Resend confirmation
*/

const paramEmail = getQueryStringParams('email');
const resendConfirmationBtn = document.querySelector('.resend-confirmation');

toggleButtonVisibility = (timer) => {
	setTimeout( () => {
		resendConfirmationBtn.classList.toggle('invisible');
	}, timer * 1000);
};

// Toggle after 5 seconds
toggleButtonVisibility(5);

resendConfirmationBtn.addEventListener('click', e => {
	e.preventDefault();

	// Hide the button on click
	toggleButtonVisibility();

	if ( paramEmail ) {
		UsersApi.resendConfirmation( paramEmail );
	}

	// Show the button again after 5 seconds
	toggleButtonVisibility(5);
})
