<template>
  <el-container>
    <el-header>
      <h2>会议中ing</h2>
    </el-header>
    <el-main>
      <h3>本地视频</h3>
      <video
        id="localVideo"
        style="width: 200px; height: 200px"
        autoplay
        muted
      ></video>
      <br />

      <h3>远程视频</h3>
      <div id="remoteDiv"></div>
    </el-main>
  </el-container>
</template>
<script>
import WebRTCConfig from "../config";
import io from "socket.io-client";

// 兼容处理
const PeerConnection =
  window.RTCPeerConnection ||
  window.mozRTCPeerConnection ||
  window.webkitRTCPeerConnection;
const SessionDescription =
  window.RTCSessionDescription ||
  window.mozRTCSessionDescription ||
  window.webkitRTCSessionDescription;
const GET_USER_MEDIA = navigator.getUserMedia
  ? "getUserMedia"
  : navigator.mozGetUserMedia
  ? "mozGetUserMedia"
  : navigator.webkitGetUserMedia
  ? "webkitGetUserMedia"
  : "getUserMedia";
const v = document.createElement("video");
const SRC_OBJECT =
  "srcObject" in v
    ? "srcObject"
    : "mozSrcObject" in v
    ? "mozSrcObject"
    : "webkitSrcObject" in v
    ? "webkitSrcObject"
    : "srcObject";

// socket连接
let socket;
let localStream = null;
// 本地socket id
let socketId;
// 房间 id
let roomId;
// 对RTCPeerConnection连接进行缓存
let rtcPeerConnects = {};

let $ = document.querySelector;

const domLocalVideo = document.querySelector("#localVideo"); // 本地视频dom
export default {
  data() {
    return {
      meetingData: {
        meetingID: "",
        myName: "",
      },
    };
  },
  created() {
    this.meetingData.meetingID = this.$route.params.meetingID;
    this.meetingData.myName = this.$route.params.name;
    roomId = this.meetingData.meetingID;

    openCamera()
      .then((stream) => {
        console.log("fuck fuck");
        localStream = stream; // 保存本地视频到全局变量
        pushStreamToVideo(domLocalVideo[0], stream);
        connetMeeting(this.meetingData.meetingID); // 成功打开摄像头后，开始创建或者加入输入的房间号
      })
      .catch((e) => alert(`getUserMedia() error: ${e.name}`));

    this.socketInit();
  },
  methods: {
    socketInit() {
      socket = io(WebRTCConfig.signalServer);
      socket.on("created", async (data) => {
        // data: [id,room,peers]
        console.log("created: ", data);
        // 保存signal server给我分配的socketId
        socketId = data.id;
        // 保存创建房间或者加入房间的room id
        roomId = data.room;
        // 如果data.peers = []，说明房间里没有人，是创建房间，以下步骤则不会执行
        // 如果data.peers != []，说明房间里有人，是加入房间，给返回的每一个peers，创建WebRtcPeerConnection并发送offer消息
        for (let i = 0; i < data.peers.length; i++) {
          let otherSocketId = data.peers[i].id;
          // 创建WebRtcPeerConnection // 注意：这个函数是下一个步骤写的。
          let pc = getWebRTCConnect(otherSocketId);
          // 创建offer
          const offer = await pc.createOffer(WebRTCConfig.offerOptions);
          // 发送offer
          onCreateOfferSuccess(pc, otherSocketId, offer);
        }
      });

      socket.on("offer", (data) => {
        // data:  [from,to,room,sdp]
        console.log("收到offer: ", data);
        // 获取RTCPeerConnection
        const pc = getWebRTCConnect(data.from);
        console.log("getWebRTCConnect: ", pc);
        // 构建RTCSessionDescription参数
        const rtcDescription = {
          type: "offer",
          sdp: data.sdp,
        };

        console.log("offer设置远端setRemoteDescription");
        // 设置远端setRemoteDescription
        pc.setRemoteDescription(new SessionDescription(rtcDescription));
        console.log("setRemoteDescription: ", rtcDescription);

        // createAnswer
        pc.createAnswer(WebRTCConfig.offerOptions)
          .then((offer) => onCreateAnswerSuccess(pc, data.from, offer))
          .catch((error) => onCreateAnswerError(error));
      });

      socket.on("answer", (data) => {
        // data:  [from,to,room,sdp]
        console.log("收到answer: ", data);
        // 获取RTCPeerConnection
        const pc = getWebRTCConnect(data.from);

        // 构建RTCSessionDescription参数
        const rtcDescription = {
          type: "answer",
          sdp: data.sdp,
        };

        console.log("answer设置远端setRemoteDescription");
        console.log("setRemoteDescription: ", rtcDescription);
        //设置远端setRemoteDescription
        pc.setRemoteDescription(new SessionDescription(rtcDescription));
      });

      socket.on("candidate", (data) => {
        // data:  [from,to,room,candidate[sdpMid,sdpMLineIndex,sdp]]
        console.log("candidate: ", data);
        const iceData = data.candidate;

        // 获取RTCPeerConnection
        const pc = getWebRTCConnect(data.from);

        const rtcIceCandidate = new RTCIceCandidate({
          candidate: iceData.sdp,
          sdpMid: iceData.sdpMid,
          sdpMLineIndex: iceData.sdpMLineIndex,
        });

        console.log("添加对端Candidate");
        // 添加对端Candidate
        pc.addIceCandidate(rtcIceCandidate);
      });

      socket.on("exit", (data) => {
        // data: [from,room]
        console.log("exit: ", data);
        // 获取RTCPeerConnection
        const pc = rtcPeerConnects[data.from];
        if (typeof pc == "undefined") {
          return;
        } else {
          // RTCPeerConnection关闭
          getWebRTCConnect(data.from).close;

          // 删除peer对象
          removeRtcConnect(data.from);
          console.log($("#" + data.from));
          // 移除video
          $("#" + data.from).remove();
        }
      });
    },
  },
};

function openCamera() {
  return navigator.mediaDevices[GET_USER_MEDIA]({
    audio: true,
    video: true,
  });
}
function pushStreamToVideo(video, stream) {
  console.log("视频流绑定到video节点展示", video, stream);
  video[SRC_OBJECT] = stream;
}
function connetMeeting(meetingID) {
  socket.emit("createAndJoinRoom", {
    room: meetingID,
  });
}

function onCreateOfferSuccess(pc, otherSocketId, offer) {
  console.log(
    "createOffer: success " + " id:" + otherSocketId + " offer: ",
    offer
  );
  // 设置本地setLocalDescription 将自己的描述信息加入到PeerConnection中
  pc.setLocalDescription(offer);
  // 构建offer
  const message = {
    from: socketId,
    to: otherSocketId,
    room: roomId,
    sdp: offer.sdp,
  };
  console.log("发送offer消息", message);
  // 发送offer消息
  socket.emit("offer", message);
}
function onCreateAnswerSuccess(pc, otherSocketId, offer) {
  console.log(
    "createAnswer: success " + " id:" + otherSocketId + " offer: ",
    offer
  );
  // 设置本地setLocalDescription，将对方的描述信息加入到PeerConnection中
  pc.setLocalDescription(offer);
  // 构建answer信息
  const message = {
    from: socketId,
    to: otherSocketId,
    room: roomId,
    sdp: offer.sdp,
  };
  console.log("发送answer消息", message);
  // 发送answer消息
  socket.emit("answer", message);
}
function onCreateAnswerError(error) {
  console.log("createAnswer: fail error " + error);
}
function getWebRTCConnect(otherSocketId) {
  if (!otherSocketId) return;
  // 查询全局中是否已经保存了连接
  let pc = rtcPeerConnects[otherSocketId];
  console.log("建立连接：", otherSocketId, pc);
  if (typeof pc === "undefined") {
    // 如果没有保存，就创建RTCPeerConnection
    // 构建RTCPeerConnection
    pc = new PeerConnection(WebRTCConfig.iceServers); // PeerConnection是4.3.2定义的兼容处理

    // 设置获取icecandidate信息回调 此处可暂时忽略，将在4.3.5讲解
    pc.onicecandidate = (e) => onIceCandidate(pc, otherSocketId, e);
    // 设置获取对端stream数据回调-track方式 此处可暂时忽略，将在4.3.5讲解
    pc.ontrack = (e) => {
      console.log("我接到数据流了！！", pc, otherSocketId, e);
      onTrack(pc, otherSocketId, e);
    };
    // 设置获取对端stream数据回调 此处可暂时忽略，将在4.3.5讲解
    pc.onremovestream = (e) => onRemoveStream(pc, otherSocketId, e);
    // peer设置本地流 此处可暂时忽略，将在4.3.5讲解
    if (localStream != null) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    // 缓存peer连接
    rtcPeerConnects[otherSocketId] = pc;
  }
  return pc;
}
function removeRtcConnect(otherSocketId) {
  delete rtcPeerConnects[otherSocketId];
}
function onIceCandidate(pc, otherSocketId, event) {
  console.log("onIceCandidate to " + otherSocketId + " candidate: ", event);
  if (event.candidate !== null) {
    // 构建信息 [from,to,room,candidate[sdpMid,sdpMLineIndex,sdp]]
    const message = {
      from: socketId,
      to: otherSocketId,
      room: roomId,
      candidate: {
        sdpMid: event.candidate.sdpMid,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdp: event.candidate.candidate,
      },
    };
    console.log("向信令服务器发送candidate", message);
    // 向信令服务器发送candidate
    socket.emit("candidate", message);
  }
}
function onTrack(pc, otherSocketId, event) {
  console.log("onTrack from: " + otherSocketId);
  console.log(event);
  let otherVideoDom = $("#" + otherSocketId);
  if (otherVideoDom.length === 0) {
    // TODO 未知原因：会两次onTrack，就会导致建立两次dom
    const video = document.createElement("video");
    video.id = otherSocketId;
    video.autoplay = "autoplay";
    video.muted = "muted";
    video.style.width = 200;
    video.style.height = 200;
    video.style.marginRight = 5;
    $("#remoteDiv").append(video);
  }
  pushStreamToVideo($("#" + otherSocketId)[0], event.streams[0]);
}
function onRemoveStream(pc, otherSocketId, event) {
  console.log("onRemoveStream from: " + otherSocketId);
  // peer关闭
  getWebRTCConnect(otherSocketId).close;
  // 删除peer对象
  removeRtcConnect(otherSocketId);
  // 移除video
  $("#" + otherSocketId).remove();

  console.log(event);
}
</script>
<style scoped>
.el-header {
  width: 320px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  padding: 0;
}

.el-main {
  text-align: left;
}

.el-form {
  margin-left: auto;
  margin-right: auto;
  width: 320px;
}

.el-button {
  height: 40px;
  width: 320px;
}

.el-form-item {
  margin-top: -10px;
}
</style>