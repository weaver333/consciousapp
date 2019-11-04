import { setCookie, getCookie } from './Cookie';

const body = document.body;
const themeTogglerEl = document.querySelector('#theme-toggler');
const themeTogglerTextEl = themeTogglerEl.querySelector('.theme-toggler-text');
const currentTheme = getCookie('theme');

if ( currentTheme == 'dark' ) {
	body.classList.add('dark-theme');
}

themeTogglerEl.addEventListener('click', e => {
	e.preventDefault();

	if ( body.classList.contains('dark-theme') ) {
		setCookie('theme', 'light', 60);
		themeTogglerTextEl.innerHTML = 'Dark';
	} else {
		setCookie('theme', 'dark', 60);
		themeTogglerTextEl.innerHTML = 'Light';
	}

	body.classList.toggle('dark-theme');
})