'use strict';

let App = require(__dirname+'/../../components/App');
let Utils = App.Utils();
let User = App.getModel('User');

const users = [
  {email:'diego.prieto@beeva.com', password:'123'},
  {email:'user1@gmail.com', password:'123'}
];

exports.login = function(req, res) {
  let find = false;
  const user = JSON.parse(Utils.b64decode(req.body.user));
  users.forEach(u => {
    if(user.email === u.email && user.password === u.password){
      find = true;
      return Utils.response(req, res , 200);
    }
  });
  if (!find) {
    return Utils.error(req, res, 412);
  }
};

