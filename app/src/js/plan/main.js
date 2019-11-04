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
		$('form').each((i, el) => {
			var form = $(el);
			var btn = $(el).find('button');
			var plan = form.data('plan');
		});
    });
})();