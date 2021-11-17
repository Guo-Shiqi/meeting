function GetInvitationInformation(meeting, user) {
    var str = `${user.name}邀请您参加腾讯会议
    会议主题：${meeting.title}
    会议时间：${meeting.beginTime}-${meeting.endTime} (GMT+08:00) 
    
    点击链接直接加入会议：
    https://loaclhost:8080/join/${meeting.id}
    
    会议ID：${meeting.id}`
    if (meeting.password) {
        str += `
        会议密码：${meeting.password}`
    }
    return str;
}
export default { GetInvitationInformation }