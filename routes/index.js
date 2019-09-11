var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var TOKEN_BOT = "915963347:AAE7TRrFASw5yuV0wEzfeeX6ng-RwJdeP0o";
// chat_id client faruq
//var CHAT_ID = 812449714;
var CHAT_ID = 316438698;
var TelegramBotClient = require('telegram-bot-client');
var client = new TelegramBotClient(TOKEN_BOT);

var auth = require('../configs/auth');
var conn = require('../configs/dbase');

var SECRET_KEY = '4hm4d_4rd14nsy4h_N0d3';
var MY_TOKEN = 'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWhtYWQiLCJwYXNzIjoiYXJkaWFuc3lhaCIsImlhdCI6MTU2ODEyMjE0Mn0.-Wyt8h9bmP5Z6m_HvqaxF8QN6Txux3Vrv8b337J3saQYnbJsO9k6hCDCaoz1G4nh';

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({ status: 'OK', message: 'You must generate your token.' });
});

router.get('/rows', (req, res, next) => {
	conn.serialize( () => {
		let sql = "SELECT * FROM stock";
		conn.all(sql, (err, rows) => {
			if(err) return console.error(err);
			if(rows) {
				res.json({ status: 'OK', message: 'Stock Data', data: rows});
			} else {
				console.log('Nothing data to show.');
			}
		})
	});
});

router.get('/api/v1/stock', auth.access, (req, res, next) => {
	if(req.query.stock) {
		conn.serialize( () => {
			let sql = "SELECT * FROM stock WHERE id = ?";
			conn.get(sql, [1], (err, rows) => {
				if(err) return console.error(err);

				if(rows) {
					if(rows.stock == req.query.stock) {
						if(req.query.stock == 0) {
							let message = "Stock habis sisa 0";
							client.sendMessage(CHAT_ID, message);
							res.json({ status: 'OK', message: 'Stock on shopee empty.', data: rows});
						} else {
							res.json({ status: 'OK', message: 'Stock on database same with on shoopee.', data: rows});
						}
					} else if(rows.stock >= req.query.stock) {
						let hitung = rows.stock - req.query.stock;
						let message = "Stok berkurang sebanyak "+hitung;
						conn.serialize( () => {
							let sql = "UPDATE stock SET stock = "+req.query.stock+" WHERE id = ?";
							conn.run(sql, [1], (err) => { 
								if(!err) {
									console.log('Data stock updated.'); 
									client.sendMessage(CHAT_ID, message);
									res.json({ status: 'OK', message: message, data: rows});
								}
							});
						});
					} else if(rows.stock <= req.query.stock) {
						let hitung = req.query.stock - rows.stock;
						let message = "Stok bertambah sebanyak "+hitung;
						conn.serialize( () => {
							let sql = "UPDATE stock SET stock = "+req.query.stock+" WHERE id = ?";
							conn.run(sql, [1], (err) => { 
								if(!err) {
									console.log('Data stock updated.'); 
									client.sendMessage(CHAT_ID, message);
									res.json({ status: 'OK', message: message, data: rows});
								}
							});
						});
					} else{
						res.json({ status: 'OK', message: 'Stock on database not greater and not lower.', data: rows});
					}
				} else {
					console.log('Nothing data not found.');		
				}

			});
		});
	} else {
		res.json({ status: 'ERROR', message: 'Parameters stock must be filled.'});
	}
});

router.post('/api/v1/generate', (req, res, next) => {
	var userParams = req.query.user;
	var passParams = req.query.pass;

	if(!userParams) return res.json({ status: 500, message: 'Parameter user must be filled.'});
	if(!passParams) return res.json({ status: 500, message: 'Parameter pass must be filled.'});

	var token = jwt.sign(
		{ user: userParams, pass: passParams }, 
		SECRET_KEY, 
		{ algorithm: 'HS384' }
	);

	res.json({ status: 'OK', message: 'You can get your token.', data: token });
});

router.post('/reset', (req, res, next) => {
	conn.serialize( () => {
		let sql = "UPDATE stock SET stock = 0 WHERE id = ?";
		conn.run(sql, [1], (err) => { 
			if(!err) console.log('Stock has been reseted.');
		});
	});
});

module.exports = router;
