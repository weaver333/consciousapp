console.log('rewards/main.js Initialised');

import '../Dropdown';
import { formatSession } from '../Helpers';

/*
**** Edit the left icon boxes on past sessions (date formatting, background boxes of accuracy..)
*/
formatSession.leftIconBoxes();



// Code to ask to install the web app 'natively'

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});

let installBtn = document.getElementById('installBtn');
installBtn.addEventListener('click', (e) => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    console.log(deferredPrompt)
    deferredPrompt.userChoice.then(function(choiceResult){

      if (choiceResult.outcome === 'accepted') {
      console.log('Your PWA has been installed');
    } else {
      console.log('User chose to not install your PWA');
    }

    deferredPrompt = null;

    });
  }
});
