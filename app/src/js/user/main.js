import "../components/Modal";
import '../Dropdown';
import '../ThemeToggle';
import toastr from 'toastr';
import { UsersApi } from "../Api";


/*
 ** Subscription plan text
 */
const subscriptionTextEl = document.querySelector('.subscription-text');
const currentPlan = subscriptionTextEl.getAttribute('data-plan');
// console.log(currentPlan);

if ( currentPlan != 'pro' ) {
	subscriptionTextEl.innerHTML = "<a class='mt-3 t-primary d-table bold' href='/user/plan'>Click here to upgrade!</a>";
}

/*
 ** Modal deletion
 */
var modalDeleteAccBtnEl = document.getElementById("modal-delete-account"),
	inputDeleteAccEl = document.getElementById("input-delete-account");
(inputDeleteAccEl.value = ""),
	(inputDeleteAccValue = ""),
	(disabledAttr = document.createAttribute("disabled"));

inputDeleteAccEl.addEventListener("input", function() {
	inputDeleteAccValue = inputDeleteAccEl.value;
	if (inputDeleteAccValue == "delete") {
		modalDeleteAccBtnEl.removeAttribute("disabled");
	} else {
		modalDeleteAccBtnEl.setAttributeNode(disabledAttr);
	}
});

modalDeleteAccBtnEl.addEventListener("click", function(e) {
	e.preventDefault();

	if (!this.hasAttribute("disabled")) {
		UsersApi.deleteCurrentUser();
		window.location.href = "/?account_deleted=true";
	}
});


/*
 ** Form submit to change profile
 */
const form = document.getElementById("change-profile");

form.onsubmit = function(e) {
	e.preventDefault();
	
	// Get form data
	const fullnameValue = document.getElementById("fullname").value;
	let passwordFieldValue = document.getElementById("password").value;
	let passwordConfirmFieldValue = document.getElementById("password_conf").value;

	// Check if confirm password is the same as new password
	if (passwordFieldValue != passwordConfirmFieldValue) {
		alert("Passwords do not match. Please try again.");
	} else {
		UsersApi.changeUserData(
			fullnameValue,
			passwordFieldValue,
			passwordConfirmFieldValue
		).then(data => {
			// Feedback
			if( data.status == 'success' ) {
				toastr.success('Your profile has been updated!');
			} else {
				toastr.error( data.message );
			}
		});
	}
};
