//'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var user = mongoose.model('user');
var counter = mongoose.model('counter');
var influencer = mongoose.model('influencer');

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');

const register = require('../functions/register');
const login = require('../functions/login');
const search = require('../functions/search');

const profile = require('../functions/profile');
const password = require('../functions/password');
const config = require('../config/config.json');

/*router.post('/create_user', function(req, res){
    //var personInfo = req.body; //Get the parsed information
    var personInfo=req.body
    counter.getNextSequenceValue("userid", function(result){
      user.saveUser(personInfo,result);
      var userid = result;
      if(req.body.is_influencer)
      {
        counter.getNextSequenceValue("influencerid", function(result){
          influencer.saveInfluencer(personInfo,result,userid);
            console.log("in post of post of create influencer");
        });    
      }
        console.log("in post");
    });
    res.send(req.body);
    console.log(req.body.username);
  }
  );*/
//  module.exports = router => {

  router.get('/search1/:query',function(req,res){
			console.log(req.params.query);
		//	var abc=user.username;
   // user.ensureIndexes({ abc : "text"});
      var query = req.params.query;
  
      user.find({ $text: { $search: query }},function(err, books) {
              if (err) {
								//console.log("search"+books);

                  res.json(err);
              } else {
								console.log("search"+books);

                  res.send({"searchlist":books});
							}
});
	});
	
  
	router.get('/search111/:query',function(req,res){
		console.log(req.params.query);
	//user.index({"user.username": "text"});
	var query = req.params.query;

	var s = "cupcake";
	var n = s.length;
	var p = "cake";
	var m = p.length;
	var f = [-1];
	errorTable (p, m, f);
	var c=kmp (s, n, p, m, f);

	user.find({ $text: { $search: query }},function(err, books) {
					if (err) {
						//console.log("search"+books);

							res.json(err);
					} else {
						console.log("search"+books);

							res.send({"searchlist":books});
					}
});
});
router.get('/search/:query', function(req, res) {
	var query = req.params.query;

	//const credentials = auth(req);
//console.log(credentials.name, credentials.pass);
	if (!query) {

		res.status(400).json({ message: 'Invalid Request !' });

	} else {
		//login.loginUser(credentials.name, credentials.pass)

		search.searchUser(query)
    .then(result => {

		//	const token = jwt.sign(result, config.secret, { expiresIn: 1440 });
		console.log("aASa"+ result.message);
			res.status(result.status).json({ searchlist: result.message});

		})

		.catch(err => res.status(err.status).json({ message: err.message }));
	}
});


  router.get('/', function(req, res) {res.end('Welcome to Learn2Crack !')});

	router.post('/authenticate', function(req, res) {

		const credentials = auth(req);
console.log(credentials.name, credentials.pass);
		if (!credentials) {

			res.status(400).json({ message: 'Invalid Request !' });

		} else {

			login.loginUser(credentials.name, credentials.pass)

			.then(result => {

				const token = jwt.sign(result, config.secret, { expiresIn: 1440 });
			console.log(token, result.message);
				res.status(result.status).json({ message: result.message, token: token , u_id:result.u_id});

			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});
 
  router.post('/users', function(req, res){
    console.log('aaaaa');
    
		const name = req.body.username;
		const email = req.body.email;
    const password = req.body.password;
        var personInfo=req.body
        console.log(name,email,password,req.body.is_influencer);
		if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {

			res.status(400).json({message: 'Invalid Request 1!'});

		} else {

      counter.getNextSequenceValue("userid", function(result){
       // user.saveUser(personInfo,result);

        var userid = result;
        if(req.body.is_influencer)
        {
          counter.getNextSequenceValue("influencerid", function(result){
            influencer.saveInfluencer(personInfo,result,userid);
              console.log("in post of post of create influencer");
          });    
        }
        register.registerUser(res,personInfo,result)
          console.log("in post");
      });
    }

		
});

	router.get('/users/:id', function(req,res)  {

		if (checkToken(req)) {

			profile.getProfile(req.params.id)

			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.put('/users/:id', function(req,res)  {

		if (checkToken(req)) {

			const oldPassword = req.body.password;
			const newPassword = req.body.newPassword;

			if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

				res.status(400).json({ message: 'Invalid Request !' });

			} else {

				password.changePassword(req.params.id, oldPassword, newPassword)

				.then(result => res.status(result.status).json({ message: result.message }))

				.catch(err => res.status(err.status).json({ message: err.message }));

			}
		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.post('/users/:id/password', function(req,res)  {

		const email = req.params.id;
		const token = req.body.token;
		const newPassword = req.body.password;

		if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

			password.resetPasswordInit(email)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			password.resetPasswordFinish(email, token, newPassword)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	function checkToken(req) {

		const token = req.headers['x-access-token'];

		if (token) {

			try {

  				var decoded = jwt.verify(token, config.secret);

  				return decoded.message === req.params.id;

			} catch(err) {

				return false;
			}

		} else {

			return false;
		}
  }
//}

function errorTable (p, m, f) {
	for (var j = 1; j <= m-1; j++) {  
		k = f[j-1];   
		while (k!=-1 && p[j-1] != p[k]) {
			k = f[k];
		}
		f[j] = k+1;
	}
}

function kmp (s, n, p, m, f) {
	var i=0;
	var j=0;
	while (i < n) {
		while (j != -1 && s[i] != p[j]) {
			j = f[j];
		}
		if (j == m-1) {
			return i-m+1;
		} else {
			i++;
			j++;
		}
	}
	return -1;
}


module.exports = router;