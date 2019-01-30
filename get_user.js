// get_user.js
// The purpose of this script is to simply return the screen name of the user of this developer account

module.exports = function(data = 'screen_name'){
    let twitter = require('twitter')
    let config = require('./config')
    let t = new twitter(config)
    
    t.get('account/settings', function(err, res){
        if(err) console.log(err)
        else return res[data]
    })
}

