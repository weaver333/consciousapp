
//Load jQuery library using plain JavaScript
(function () {

    function loadScript(url, callback) {

        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
	}

	loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js", function () {
        var cardForm = $('#cardForm');
        var cardFormBtn = $(cardForm).find('button');

        cardForm.submit(function(e) {
            e.preventDefault();

            var cardNum,
                cardMonth,
                cardYear,
                cardCVC;
            
            cardNum = $('#card-num').val();
            cardMonth = $('#card-month').val();
            cardYear = $('#card-year').val();
            cardCVC = $('#card-cvc').val();

            Stripe.card.createToken({
                number: cardNum,
                exp_month: cardMonth,
                exp_year: cardYear,
                cvc: cardCVC
                }, function(status, response) {
                    if (response.error) {
                        alert(response.error.message);
                        cardForm.find('button').prop('disabled', false);
                    } else {
                        var token = response.id;
                        cardForm.append($('<input type="hidden" name="stripeToken" />').val(token));
                        cardForm.get(0).submit();
                    }
                });
            
            return false;
        });
    });
})();