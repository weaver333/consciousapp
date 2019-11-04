import Flickity from "flickity";
import Utils from '../engines/breathEngine/utils';

let utils = new Utils('errorMessage');

function grantCamera() {
	utils.startCamera('qvga', ()=>{
		document.getElementById('video').srcObject = utils.stream;
		document.getElementById('video').play();
	}, 'videoInput');
}

function grantLocation() {
	if ( navigator.geolocation ) {
		navigator.geolocation.getCurrentPosition(function(position) {
			return; // don't do anything - just ask for locaation 
	  });
	} else {
		console.error( "Geolocation is not supported by this browser." );
	}
}

var elem = document.querySelector('.main-carousel');
var flkty = new Flickity( elem, {
  cellAlign: 'center',
  contain: true,
  prevNextButtons: false,
  adaptiveHeight: true
});


// Next button slides next
function goToNextSlide() {
	flkty.next();
}
var nextBtn = document.querySelector('.next-carousel');
nextBtn.addEventListener("click", goToNextSlide);


// Change button text depending the step
function redirectToDashboard() {
	window.location.href = "/dashboard";
}
flkty.on( 'change', function( index ) {
	var btnText = '';
	switch( index ) {
		case 0:
			btnText = 'next';
			break;
		case 1:
			grantCamera(); // ask user for camera permission
			grantLocation(); // ask user for location
			btnText = 'continue';
			break;
		case 2:
			btnText = 'get started!';
			nextBtn.addEventListener( 'click', redirectToDashboard );
			break;
	}
	nextBtn.innerText = btnText;
});
