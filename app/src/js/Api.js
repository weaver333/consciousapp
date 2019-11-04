import axios from 'axios';

var UsersApi = {
	deleteCurrentUser() {
		return axios
			.post('/delete-account')
			.then(() => {
				window.location.replace('/?account_deleted=true');
			})
			.catch(err => err);
	},
	resetPassword(email) {
		return axios
			.post('/forgot-password', {email});
	},
	changeUserData(fullname, password, passwordConf) {
		return axios
			.post('/user', {
				fullname,
				password,
				passwordConf
			})
			.then(res => res.data)
			.catch(err => err);
	},
	resendConfirmation(email) {
		return axios
			.post('/resend', {
				type: 'verify',
				email,
			})
			.then(res => res)
			.catch(err => err);
	},
}

var PlansApi = {
	getMonthlyPlans() {
		return axios
			.get('/user/billing')
			.then(res => {
				let plans = res.data.plans;
				for (var key in plans) {
					if (plans.hasOwnProperty(key)) {
						var obj = plans[key];
						for (var prop in obj) {
							if (obj.hasOwnProperty(prop)) {
								plans[key].period = 'per month';
							}
						}
					}
				}

				return plans;
			})
			.catch(err => err);
	},
	getYearlyPlans() {
		return axios
			.get('/user/billing')
			.then(res => {
				let plans = res.data.plans;
				for (var key in plans) {
					if (plans.hasOwnProperty(key)) {
						var obj = plans[key];
						for (var prop in obj) {
							if (obj.hasOwnProperty(prop)) {
								plans[key].period = 'per year';
								if ( prop == 'price' ) {
									// Yearly - 10%
									plans[key][prop] = Math.floor(
										(obj[prop] * 12) * .9
									);
								}
							}
						}
					}
				}
				
				return plans;
			})
			.catch(err => err);
	},
}

var LocationsApi = {
	newLocation(lng, lat) {
		return axios
			.post('/location', {
				lng,
				lat
			})
			.then(res => res)
			.catch(err => err);
	}
}

export {
	UsersApi,
	PlansApi,
	LocationsApi
};