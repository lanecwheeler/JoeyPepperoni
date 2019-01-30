/* server.js
    Joey Pepperoni bot - Fuhgeddaboudit!

    This bot is entirely for fun, it just tweets italian sounding names at you
    Made with nodeJs and the twit api. Uses registered webhooks and subscriptions.
    Note: registered to the Account Activity API on developer.twitter.com
    Hosted on Google cloud (app engine) and served with ExpressJS

    Note: You'll see REDACTED a few places in here, replace those with your information

    external-dependencies: express, bodyParser, twitter   
    
    TODO: 
    Pull name api with axios, 
    find food api, 
    account for follows and dms,
    pull all twitter config creation into one class
    add aliteration chance???
*/

//external dependencies and express config
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static('public'))
const path = require('path')
const Twitter = require('twitter')

//internal dependencies
const getYonName = require('./create_name/make_name')
const security = require('./security')
const config = require('./config')
const message_processor = require('./message_processor')

//create twitter obj
const t = Twitter(config)

//mapping urls (these first 3 were mainly for testing)
app.get('/', (request, response) =>{
    response.sendFile(path.join(__dirname, '/html_names.html'))
})
app.get('/getName', (request, response) =>{
    getYonName().then((value) => {
        response.send('Ay! It\'s ' + value + '!')
    })
})
app.get('/sendName', (request, response) =>{
    getYonName().then((value) =>{
        value = '@REDACTED Ay! It\'s ' + value + '!'
        let params = {status: value}
        t.post('statuses/update', params, function(err, res){
            if(err) console.log(err)
            else console.log(res)
        })
    })
})
//this is for registering your webhook (it passes off the crc token to validate your webhook)
app.get('/webhook/twitter', (request, response) =>{
    let crc_token = request.query.crc_token

    if(crc_token){
        let hash = security(crc_token, config.consumer_secret)
        response.status(200)
        response.send({
            response_token: 'sha256=' + hash
        })
    }else{
        response.status(400)
        response.send('Error: crc_token is missing from request')
    }
})
//this is for receiving your account activity via the api NOTE: IT'S POST, NOT GET
//the body parser was required to look at payload content (accessed via req.body)
app.post('/webhook/twitter', (req, res) => {
    message_processor.process(req.body)
    res.send('200 OK')
})
//this was for adding a subscription. Trust me, it's easier to use the account activity dashboard (specifically the cli portion)
app.get('/callbacks/addsub', (req, res) =>{
    //redacted for obv reasons. Probably put these in as environment variables if you can. 
    //otherwise use a config file and add that file to your gitignore
    var WEBHOOK_ID = 'REDACTED'
    var request_options = {
        url: 'https://api.twitter.com/1.1/account_activity/webhooks/' + WEBHOOK_ID + '/subscriptions.json',
        oauth: config
      }
    req.post(request_options, function (error, response, body) {
        if (response.statusCode == 204) {
          console.log('Subscription added.')
        } else {
          console.log('User has not authorized your app.')
        }
      })
})
//tell express to listen to port 8080, the default for webrequests
app.listen(8080)

