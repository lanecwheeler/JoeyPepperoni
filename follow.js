// follow.js
// just follows 100 users based on results of a hashtag query

let Twitter = require('twitter')
let config = require('./config')
let t = new Twitter(config)

// Set up search params
// query: #pepperoni, 100 most recent english tweets
let params = {
	q: '#pepperoni',
	count: 100,
	result_type: 'recent',
	lang: 'en',
}

t.get('search/tweets', params, function(err, data, response) {
    console.log('Getting tweets with ', `${params.q}`,' in them')
	if(!err){
        console.log('Man, that\'s a lot of tweets...')
		// If tweets were retreived successfully, loop through and get all tweets
		for(let i = 0; i < data.statuses.length; i++){
            let screen_name = data.statuses[i].user.screen_name
            console.log('Oh ',{screen_name},', you\'re hysterical!')

            t.post('friendships/create', {screen_name}, function(err, res){
                if(err) console.log(err)
                else console.log(screen_name, ': **FOLLOWED**')
            })
		}
	}
	else console.log('Welp...', err)
})
