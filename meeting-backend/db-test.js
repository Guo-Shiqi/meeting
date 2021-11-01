const model = require('./model');

let
  User = model.User;

(async () => {
  var user = await User.create({
    name: 'John',
    password: 'hahaha'
  });
  console.log('created: ' + JSON.stringify(user));
})();