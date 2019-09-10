var jwt = require('jsonwebtoken');
var SECRET_KEY = '4hm4d_4rd14nsy4h_N0d3';

exports.access = (req, res, next) => {
	var token = req.headers['token'] || req.query.token;
	if(!token) return res.json({ status: 500, message: 'No token provided'});

	jwt.verify(token, SECRET_KEY, function(err, decoded) {
		if(err) return res.json({ status: 500, message: 'Failed to authenticate token'});

		req.app.token = decoded;
		next();
	});
};