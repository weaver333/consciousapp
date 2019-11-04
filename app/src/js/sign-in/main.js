import toastr from 'toastr';

toastr.options = {
	closeButton: true
};

var currentUrl = window.location.href,
	accountDeletedQuery = "account_deleted";

// Check if url contains account_deleted in the query and show toastr if it does
if (currentUrl.includes(accountDeletedQuery)) {
	toastr.success('You have successfully deleted your account.', 'Account deleted!');
}