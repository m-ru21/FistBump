'use strict';

const user = require('../models/User');
const bcrypt = require('bcryptjs');

exports.searchUser = (query) => 

	new Promise((resolve,reject) => {

        //user.find({email: email})
        user.aggregate([{$project:{_id:0,username:1}}])  

        //user.find({ $text: { $search: query }})
		.then(users => {
                var s,n,p,m,f,check;
                var c=new Array(users.length);
                var i=0;
                var j=0;
                c[0]="null";
                for (i = 0; i < users.length; i++) { 
                
                    s = users[i].username;
                    n = s.length;
                    p = query;
                    m = p.length;
                    f = [-1];
                    console.log("bbbbbbbbbbb"+users[i].username);

                    errorTable (p, m, f);
                    check=kmp (s, n, p, m, f);
                    console.log("check"+check);

                  if(check!=-1)
                  {
                    c[j]=users[i].username;
                    console.log("checkjjjjjj"+c[j]);

                    j++;
                  }
          
                }
                if(c[0]=="null")
                {
                  c[2]="Influencer not found";

                }
                if(query=="z")
                {
                  c[2]="akshay";
                }
              

                console.log("checkxxxxxxx"+c[j]);

                console.log("aaaaaaaaaaaaaaaa"+users[0].username);

             user.find({ $text: { $search: c[0]+" "+c[1]+" "+c[2]+" "+c[3]+" "+c[4]}})
               
             .then(users => {

              if (users.length == 0) {
                console.log("eeeeeeeeeeeeeeeeee"+users[0].username);

                reject({ status: 404, message: 'User Not Found !' });
        
              } else {
        
                return users;
                
              }
            })
		.then(user => {

		//	const hashed_password = user.password;
			//console.log(user);
			if (1) {
				//console.log(u_id);
				resolve({ status: 200, message: user , u_id:1});

			} else {

				reject({ status: 401, message: 'Invalid Credentials !' });
			}
		})

		.catch(err => reject({ status: 500, message:"Internal error"}));

	});

});


function errorTable (p, m, f) {
  var k;
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