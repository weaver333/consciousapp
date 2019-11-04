import { TweenLite, TimelineLite, Back } from 'gsap';
import { UsersApi } from '../Api';

const line1 = document.getElementById('env-line-1'),
	line2 = document.getElementById('env-line-2'),
	line3 = document.getElementById('env-line-3'),
	envLid = document.getElementById('env-lid'),
	envPaper = document.getElementById('env-paper'),
	form = document.getElementById('register'),
	step1 = document.getElementById('step-1'),
	step2 = document.getElementById('step-2'),
	innerEl = document.querySelector('.inner'),
	email = document.getElementById('email').value;


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


/*
** Steps logic, fade out step 1 , fade in step 2
*/


innerEl.style.height = step1.clientHeight + 108;

form.onsubmit = function(e) {
	e.preventDefault();

	step1.classList.add('invisible');
	setTimeout( () => {
		step1.classList.add('d-none');
		step2.classList.remove('d-none');
	}, 300 );

	setTimeout( () => {
		step2.classList.remove('invisible');
		innerEl.style.height = step2.clientHeight + 108;

		// Tell server to send the reset password email
		UsersApi.resetPassword(email);

		// Animate the letter
		setTimeout(function () {
			tl.play();
		}, 500);
	}, 300 );
}