import toastr from 'toastr';

// This can be used to provide biofeedback notifications in the UI. The logic for the delivery should be stored elsewhere, though.

function notifyBreathsPerMin() {
    toastr.success('Calculated just now!', sessionData.breathsPerMin + ' breaths per minute');
}

export { 
    notifyBreathsPerMin
};