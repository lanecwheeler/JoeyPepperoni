// get_your_name_out_there.js
// Basically, you supply it with a query to look for
// and it just goes and favorites those tweets.

const Twitter = require('twitter');
const config = require('./config.js');
const t = new Twitter(config);

// Set up search params
// query: #pepperoni, 100 most recent english tweets
let params = {
	q: '#pepperoni',
	count: 100,
	result_type: 'recent',
	lang: 'en',
}

t.get('search/tweets', params, function(err, data, response) {
	if(!err){
		// If tweets were retreived successfully, loop through and get all tweets
		for(let i = 0; i < data.statuses.length; i++){
			let id = { id: data.statuses[i].id_str }
			// For each individual tweet, post back a 'favorite' with the tweet id
			t.post('favorites/create', id, function(err, response){
				if(err){
					 console.log(err[0].message);
				}
				else{
					let user = response.user.screen_name;
					let tweetId = response.id_str;
					// on a successfull response, give me the url of the tweet I favorited
					console.log(`Favorited: https://twitter.com/${user}/status/${tweetId}`);
				}
			});
		}
	}
	else {
		console.log(err);
	}
})
