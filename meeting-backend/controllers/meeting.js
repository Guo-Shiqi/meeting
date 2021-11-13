const Meeting = require("../models/Meeting");
const User = require("../models/User");


var createMeeting = async (ctx, next) => {
    var { name, password, title, beginTime, endTime, userId, note } = ctx.request.body;
    console.log(ctx.request.body)
    const meeting = await Meeting.create({ name, password, title, userId, beginTime, endTime, note });
    ctx.response.body = meeting.toJSON();
};

var getMeetings = async (ctx, next) => {
    ctx.response.body = await Meeting.findAll();
}

var getMeeting = async (ctx, next) => {
    var { meetingId } = ctx.params
    console.log(meetingId)
    meetingId = Number(meetingId)
    if (meetingId > 0) {
        ctx.response.body = await Meeting.findByPk(meetingId)
    }
}

module.exports = {
    'POST /api/meeting': createMeeting,
    'GET /api/meeting': getMeetings,
    'GET /api/meeting/:meetingId': getMeeting,
};