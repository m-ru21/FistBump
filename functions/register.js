
const user = require('../models/User');
const bcrypt = require('bcryptjs');

exports.registerUser = function(res,personInfo,result){ 

	

	    const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(personInfo.password, salt);

		/*const newUser = new user({

			name: name,
			email: email,
			hashed_password: hash,
			created_at: new Date()
			newUser.save()
		});*/
		personInfo.password=hash;
		console.log(personInfo);

		user.saveUser(personInfo,result)
		res.send({"message":"Registration successfully!"});
}
