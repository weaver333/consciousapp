import { packSoundtrack } from '../../../engines/AudioEngine';
import Buttons from '../Buttons';

const body = document.querySelector('body');

/*
** Open stats for mobile
*/
Buttons.openStats.addEventListener('click', () => {
    body.classList.add('stats-opened');
});
Buttons.closeStats.addEventListener('click', () => {
    body.classList.remove('stats-opened');
});

/*
** Toggle mute
*/
function toggleMute() {
	if (sessionData.sessionMuted) {
		sessionData.sessionMuted = false;
		packSoundtrack('unmute');
		Buttons.mute.innerHTML = '<span class="icon icon-volume"></span> Mute';
	} else if (!sessionData.sessionMuted) {
		sessionData.sessionMuted = true;
		packSoundtrack('mute');
		Buttons.mute.innerHTML = '<span class="icon icon-volume"></span> Unmute';
	}
}
Buttons.mute.addEventListener('click', function (e) {
	e.preventDefault();
	toggleMute();
});

/*
** Hide elements after 5 seconds of mouse inactivity
*/
let time = 0;

// If mouse moves, remove inactive class to body
document.onmousemove = (function() {
	let onmousestop = function() {
		body.classList.remove('inactive');
		time = 0;
	}, thread;

	return () => {
		clearTimeout(thread);
		thread = setTimeout(onmousestop, 100);
	};
})();

// Check every 1 second if the mouse is inactive
setInterval(() =>  { 
	if (time >= 4) { 
		body.classList.add('inactive');
	}

	time++;
}, 1000);

export { 
	toggleMute
}