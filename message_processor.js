const tweet = require('./tweet')
mp = {}

/**
 * Processes incoming events
 * @param  payload  the incoming webhook json payload
 */
mp.process = function (payload) {
    //checking the event type here
    //will add more for other activity later

    //check for anything under the 'tweet_create_events' activity
    if(payload.tweet_create_events){
        let userObj = payload.tweet_create_events[0].user //had to pull this user object out into it's own variable. it didn't like me trying to access it's properties any further
        let user = userObj.screen_name //NOW I can get the screen name of the mentioner
        let message = payload.tweet_create_events[0].text //get what they said
        message = message.replace(/.*(itsame|give me a slice|it\'s).*/gi, '$1') //strip the message of anything but these phrases
        let replyId = payload.tweet_create_events[0].in_reply_to_status_id
        if(!payload.tweet_create_events[0].is_quote_status && !payload.tweet_create_events[0].retweeted_status) //if it's not a quoted status
            tweet(user, message, replyId) //pass the tweet and the mentioner to the tweet function
    }
}

module.exports = mp