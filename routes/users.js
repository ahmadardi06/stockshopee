var express = require('express');
var request = require('request');
var router = express.Router();

// var TOKEN_BOT = "845430643:AAGDRv1fRcQaEhNKLHLfPY_Ow2qPaSflbjE";
var TOKEN_BOT = "915963347:AAE7TRrFASw5yuV0wEzfeeX6ng-RwJdeP0o";
// chat_id client faruq
var CHAT_ID = 812449714;
var TelegramBotClient = require('telegram-bot-client');
var client = new TelegramBotClient(TOKEN_BOT);

var API_URL = "https://shopee.co.id/api/v2/item/get?itemid=2381734994&shopid=83382147";

/* GET users listing. */
router.get('/send', function(req, res, next) {
	if(!req.query.message) return res.json({msg: 'query message required.'});

	if(req.query.chat_id && req.query.message){
  	client.sendMessage(req.query.chat_id, req.query.message);
  	res.json({msg: 'Chat sended.'});
	} else {
  	client.sendMessage(CHAT_ID, req.query.message);
  	res.json({msg: 'Chat sended.'});
	}
});

router.get('/webui', (req, res, next) => {
	res.render('webui', {
		title: 'Web UI Stock Shopee'
	})
})

router.get('/item/:itemid/:shopid', (req, res, next) => {
	var LINK = "https://shopee.co.id/api/v2/item/get?itemid="+req.params.itemid+'&shopid='+req.params.shopid;
	request(LINK, (error, response, body) => {
		if(error) console.error(error);

		var jsonParse = JSON.parse(body);

		res.status(200).json({
			name: jsonParse.item.name,
			stock: jsonParse.item.stock
		});
	})
})

module.exports = router;
