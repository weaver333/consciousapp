var modalToggleEl = document.getElementsByClassName('modal-toggle')[0],
	body = document.getElementsByTagName('body')[0],
	modalBackdropEl = document.getElementsByClassName('modal-backdrop')[0],
	closeModalEl = document.getElementsByClassName('close-modal')[0];

function closeModal() {
	body.classList.remove('modal-active');
}

function openModal() {
	body.classList.add('modal-active');
}

modalToggleEl.addEventListener('click', function(e) {
	e.preventDefault();
	openModal();
});

modalBackdropEl.addEventListener('click', function(e) {
	e.preventDefault();
	closeModal();
});

closeModalEl.addEventListener('click', function(e) {
	e.preventDefault();
	closeModal();
});

document.onkeydown = function(evt) {
	evt = evt || window.event;
	if (evt.keyCode == 27) {
		closeModal();
	}
};