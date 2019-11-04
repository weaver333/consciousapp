var dropdownBtn = document.querySelector('.dropdown');
var body = document.querySelector('body');

function closeDropdown() {
	dropdownBtn.classList.remove('active');
}

function triggerDropdown(ev) {
	dropdownBtn.classList.toggle('active');
	ev.stopPropagation();
}

// Close dropdown when clicked on the page
body.addEventListener('click', closeDropdown);

// Trigger active class on dropdown when clicked on it
dropdownBtn.addEventListener('click', triggerDropdown);