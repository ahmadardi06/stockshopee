var express = require('express');
var router = express.Router();

// var TOKEN_BOT = "845430643:AAGDRv1fRcQaEhNKLHLfPY_Ow2qPaSflbjE";
var TOKEN_BOT = "915963347:AAE7TRrFASw5yuV0wEzfeeX6ng-RwJdeP0o";
// chat_id client faruq
var CHAT_ID = 812449714;
var TelegramBotClient = require('telegram-bot-client');
var client = new TelegramBotClient(TOKEN_BOT);

/* GET users listing. */
router.get('/send', function(req, res, next) {
	if(!req.query.chat_id) return res.json({msg: 'query chat_id required.'}); 
	if(!req.query.message) return res.json({msg: 'query message required.'});

	if(req.query.chat_id && req.query.message){
  	client.sendMessage(req.query.chat_id, req.query.message);
  	res.json({msg: 'Chat sended.'});
	} else {
  	client.sendMessage(CHAT_ID, req.query.message);
  	res.json({msg: 'Chat sended.'});
	}
});

module.exports = router;
