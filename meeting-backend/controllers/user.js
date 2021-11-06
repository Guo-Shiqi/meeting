const model = require("../model")
const User = model.User;

var fn_signin = async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    const user = await User.findOne({ where: { name: name, password: password } });
    if (user === null) {
        console.log('登录失败');
        ctx.response.body="login failed";
    } else {
        console.log(user.toJSON());
        ctx.response.body=user.toJSON();
    }
};

var fn_signup = async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signup with name: ${name}, password: ${password}`);
    const user = await User.create({ name: name, password: password });
    ctx.response.body = user.toJSON();
};

module.exports = {
    // 'GET /api/user': fn_index,
    'POST /api/user/signin': fn_signin,
    'POST /api/user/signup': fn_signup
};