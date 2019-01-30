// tweet.js
// exporting whole function as module
module.exports = function (mentioner, message, replyId){
    const Twitter = require('twitter')
    const config = require('./config')
    const t = new Twitter(config)
    const getYonName = require('./create_name/make_name')
    const getScreenName = require('./get_user')

    //if I mess up and send joey a tweet from himself, I don't want him getting stuck in an endless loop
    //also, turns out that sending a tweet yourself DEFINITELY TRIGGERS THE tweet_create_events
    if(mentioner == 'AyJoeyPepperoni' || mentioner == getScreenName()){
        //do nuttin
        console.log(getScreenName()) //just to see what it's passin back...
        console.log('Nothin to see here...')
    } else {
        //may make joey reply to tweets later instead of just tweet, but then it won't show up in his timeline... thinking about it...
        //Make sure message contains one of 2 key phrases, if it does...
        if(message.toLowerCase().includes('itsame') || message.toLowerCase().includes('give me a slice') || message.toLowerCase().includes('slice') || message.toLowerCase().includes('it\'s')){
            getYonName().then((value) => {
                value = '@' + mentioner + ' Ay! It\'s ' + value + '!' //set the tweet message
                let params = {status: value} //create params object

                t.post('statuses/update', params, function(err, res){ //call twitters post method, passing in the endpoint and the params obj
                    if(err) console.log(err)
                    else console.log(res)
                })
            })
        //If it doesn't, do this instead
        } else {
            getYonName().then((value) => {
                let date = new Date(Date.now() - (1000 * 60 * 60 * 6)) //get utc milliseconds for cmt (-6hrs gmt)
                let dateString = date.toLocaleString('en-us', {month:"long", day: "numeric", year: "numeric"}) //create the date to be passed back in the tweet
                let timeString = date.toLocaleString('en-us', {hour: 'numeric', minute: 'numeric', second: 'numeric'}) //create the time the tweet was received 

                value = '@' + mentioner + ' You tweet at me, on this the Lord\'s day of '+ dateString + ' at ' + timeString + ' with' + 
                ' this garbage? Fuhgeddaboudit! I need to hear those magic words, "Itsame!" or "Give me a slice!", if you want somethin\' from me!'
                let params = {status: value, in_reply_to_status_id: replyId} //create param object NOTE: the status id miiiight be broken right now... figuring it out.
                t.post('statuses/update', params, function(err, res){ //posts the sass tweet with instructions
                    if(err) console.log(err)
                    else console.log(res)
                })
            })
        }
    }
}