var passWordField = document.getElementById('password')
var passWordConfirmField = document.getElementById('password_conf')
var form = document.getElementById('register');

form.onsubmit = function() {
	if (passWordField.value != passWordConfirmField.value) {
		alert("Passwords do not match. Please try again.");
	} else {
		form.submit()
	}
}