var args = require("system").args;

var url = args[1];

var page = require('webpage').create();

// https://itunes.apple.com/us/app/pages/id361309726?mt=8
page.open(url, function(status) {
	if (status !== 'success') {
		phantom.exit();
	}

	page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js", function() {
		var app_info = page.evaluate(function() {
			var company = $('#title h2').text();
			company = company.substring(3); // removing "By "

			var rating_curr_div = $('.extra-list .rating')[0];
			var ratings_curr_number = parseInt($('.rating-count', rating_curr_div).text());
			var rating_curr = $('.rating-star', rating_curr_div).length
					- $('.rating-star.ghost', rating_curr_div).length
					- 0.5 * $('.rating-star.half', rating_curr_div).length;

			var rating_all_div = $('.extra-list .rating')[1];
			var ratings_all_number = parseInt($('.rating-count', rating_all_div).text());
			var rating_all = $('.rating-star', rating_all_div).length
					- $('.rating-star.ghost', rating_all_div).length
					- 0.5 * $('.rating-star.half', rating_all_div).length;

			return { 
				'price' : $('.price').text(),
				'title' : $('#title h1').text(),
				'company' : company,
				'description' : $('.center-stack .product-review p').html(),
				'artwork' : $('#left-stack .product img.artwork').attr('src'),
				'rating_current' : rating_curr,
				'ratings_current_number' : ratings_curr_number,
				'rating_all' : rating_all,
				'ratings_all_number' : ratings_all_number,
			};
		});

		console.log(JSON.stringify(app_info));

		phantom.exit();
	});
});

