const Meeting = require("../models/Meeting");
const User = require("../models/User");


var  createMeeting= async (ctx, next) => {
    var {name,password,title,beginTime,endTime,userId}=ctx.request.body;
    console.log(ctx.request.body)
    const meeting=await Meeting.create({name,password,title,userId,beginTime,endTime});
    ctx.response.body=meeting.toJSON();
};

var getMeetings=async(ctx,next)=>{
    ctx.response.body=await Meeting.findAll();
}
// var fn_signup = async (ctx, next) => {
//     var
//         name = ctx.request.body.name || '',
//         password = ctx.request.body.password || '';
//     console.log(`signup with name: ${name}, password: ${password}`);
//     const user = await User.create({ name: name, password: password });
//     ctx.response.body = user.toJSON();
// };

module.exports = {
    'POST /api/meeting': createMeeting,
    'GET /api/meeting': getMeetings
};