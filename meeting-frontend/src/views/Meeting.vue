<template>
  <el-container>
    <el-header>
      <h2>会议中ing</h2>
    </el-header>
    <div class="room">
      <div class="video-box" ref="video-box">
        <video class="video-mine" autoplay controls ref="video-mine"></video>
      </div>
    </div>
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
// const GET_USER_MEDIA = navigator.getUserMedia
//   ? "getUserMedia"
//   : navigator.mozGetUserMedia
//   ? "mozGetUserMedia"
//   : navigator.webkitGetUserMedia
//   ? "webkitGetUserMedia"
//   : "getUserMedia";
const v = document.createElement("video");
const SRC_OBJECT =
  "srcObject" in v
    ? "srcObject"
    : "mozSrcObject" in v
      ? "mozSrcObject"
      : "webkitSrcObject" in v
        ? "webkitSrcObject"
        : "srcObject";

// // socket连接
// let socket;
// // 本地socket id
// let socketId;
// 对RTCPeerConnection连接进行缓存

let that;
export default {
  name: "Meeting",
  data() {
    return {
      meetingID: "",
      myName: "",
      localStream: null,
      socket: null,
      socketID: null,
      roomID: null,
      rtcPeerConnects: {}
    };
  },
  mounted() {
    this.meetingID = this.$route.params.meetingID;
    this.myName = this.$route.params.name;
    this.socket = io(WebRTCConfig.signalServer);
    this.$nextTick(() => {
      this.getUserMedia().then(() => {
        this.connectMeeting(this.meetingID);
      });
      this.socketInit();
    });
    that = this;
  },
  methods: {
    getUserMedia() {
      //兼容浏览器的getUserMedia写法
      let myVideo = this.$refs["video-mine"];
      let getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      //获取本地的媒体流，并绑定到一个video标签上输出，并且发送这个媒体流给其他客户端
      return new Promise((resolve, reject) => {
        getUserMedia.call(
          navigator,
          {
            audio: true,
            video: true,
          },
          (stream) => {
            //绑定本地媒体流到video标签用于输出
            myVideo.srcObject = stream;
            this.localStream = stream;
            resolve();
          },
          function (error) {
            reject(error);
            // console.log(error);
            //处理媒体流创建失败错误
          }
        );
      });
    },
    socketInit() {
      this.socket.on("created", async (data) => {
        // data: [id,room,peers]
        console.log("created: ", data);
        // 保存signal server给我分配的socketId
        this.socketID = data.id;
        this.roomID = data.room;
        console.log(this.socketID);
        for (let i = 0; i < data.peers.length; i++) {
          let otherSocketId = data.peers[i].id;
          // 创建WebRtcPeerConnection // 注意：这个函数是下一个步骤写的。
          let pc = this.getWebRTCConnect(otherSocketId);
          // 创建offer
          const offer = await pc.createOffer(WebRTCConfig.offerOptions);
          // 发送offer
          this.onCreateOfferSuccess(pc, otherSocketId, offer);
        }
      });
      this.socket.on("offer", (data) => {
        // data:  [from,to,room,sdp]
        console.log("收到offer: ", data);
        // 获取RTCPeerConnection
        const pc = this.getWebRTCConnect(data.from);
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
          .then((offer) => this.onCreateAnswerSuccess(pc, data.from, offer))
          .catch((error) => this.onCreateAnswerError(error));
      });

      this.socket.on("answer", (data) => {
        // data:  [from,to,room,sdp]
        console.log("收到answer: ", data);
        // 获取RTCPeerConnection
        const pc = this.getWebRTCConnect(data.from);

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

      this.socket.on("candidate", (data) => {
        // data:  [from,to,room,candidate[sdpMid,sdpMLineIndex,sdp]]
        console.log("candidate: ", data);
        const iceData = data.candidate;

        // 获取RTCPeerConnection
        const pc = this.getWebRTCConnect(data.from);

        const rtcIceCandidate = new RTCIceCandidate({
          candidate: iceData.sdp,
          sdpMid: iceData.sdpMid,
          sdpMLineIndex: iceData.sdpMLineIndex,
        });

        console.log("添加对端Candidate");
        // 添加对端Candidate
        pc.addIceCandidate(rtcIceCandidate);
      });

      this.socket.on("exit", (data) => {
        // data: [from,room]
        console.log("exit: ", data);
        // 获取RTCPeerConnection
        const pc = this.rtcPeerConnects[data.from];
        if (typeof pc == "undefined") {
          return;
        } else {
          // RTCPeerConnection关闭
          this.getWebRTCConnect(data.from).close;

          // 删除peer对象
          this.removeRtcConnect(data.from);
          // 移除video
          // $("#" + data.from).remove();
        }
      });
    },

    connectMeeting(meetingID) {
      console.log("发送进入房间请求" + meetingID);
      console.log(this.socket);
      this.socket.emit("createAndJoinRoom", {
        room: meetingID,
      });
    },
    pushStreamToVideo(video, stream) {
      console.log("视频流绑定到video节点展示", video, stream);
      video[SRC_OBJECT] = stream;
    },
    // function connetMeeting(meetingID) {
    //   socket.emit("createAndJoinRoom", {
    //     room: meetingID,
    //   });
    // }

    onCreateOfferSuccess(pc, otherSocketId, offer) {
      console.log(
        "createOffer: success " + " id:" + otherSocketId + " offer: ",
        offer
      );
      // 设置本地setLocalDescription 将自己的描述信息加入到PeerConnection中
      pc.setLocalDescription(offer);
      // 构建offer
      const message = {
        from: that.socketID,
        to: otherSocketId,
        room: this.roomID,
        sdp: offer.sdp,
      };
      console.log("发送offer消息", message);
      // 发送offer消息
      that.socket.emit("offer", message);
    },
    onCreateAnswerSuccess(pc, otherSocketId, offer) {
      console.log(
        "createAnswer: success " + " id:" + otherSocketId + " offer: ",
        offer
      );
      // 设置本地setLocalDescription，将对方的描述信息加入到PeerConnection中
      pc.setLocalDescription(offer);
      // 构建answer信息
      const message = {
        from: that.socketID,
        to: otherSocketId,
        room: this.roomID,
        sdp: offer.sdp,
      };
      console.log("发送answer消息", message);
      // 发送answer消息
      that.socket.emit("answer", message);
    },
    onCreateAnswerError(error) {
      console.log("createAnswer: fail error " + error);
    },
    getWebRTCConnect(otherSocketId) {
      if (!otherSocketId) return;
      // 查询全局中是否已经保存了连接
      let pc = this.rtcPeerConnects[otherSocketId];
      console.log("建立连接：", otherSocketId, pc);
      if (typeof pc === "undefined") {
        // 如果没有保存，就创建RTCPeerConnection
        // 构建RTCPeerConnection
        pc = new PeerConnection(WebRTCConfig.iceServers); // PeerConnection是4.3.2定义的兼容处理

        // 设置获取icecandidate信息回调 此处可暂时忽略，将在4.3.5讲解
        pc.onicecandidate = (e) => this.onIceCandidate(pc, otherSocketId, e);
        // 设置获取对端stream数据回调-track方式 此处可暂时忽略，将在4.3.5讲解
        pc.ontrack = (e) => {
          console.log("我接到数据流了！！", pc, otherSocketId, e);
          this.onTrack(pc, otherSocketId, e);
        };
        // 设置获取对端stream数据回调 此处可暂时忽略，将在4.3.5讲解
        pc.onremovestream = (e) => this.onRemoveStream(pc, otherSocketId, e);
        // peer设置本地流 此处可暂时忽略，将在4.3.5讲解
        if (this.localStream != null) {
          this.localStream.getTracks().forEach((track) => {
            pc.addTrack(track, this.localStream);
          });
        }

        // 缓存peer连接
        this.rtcPeerConnects[otherSocketId] = pc;
      }
      return pc;
    },
    removeRtcConnect(otherSocketId) {
      delete this.rtcPeerConnects[otherSocketId];
    },
    onIceCandidate(pc, otherSocketId, event) {
      console.log("onIceCandidate to " + otherSocketId + " candidate: ", event);
      if (event.candidate !== null) {
        // 构建信息 [from,to,room,candidate[sdpMid,sdpMLineIndex,sdp]]
        const message = {
          from: that.socketID,
          to: otherSocketId,
          room: this.roomID,
          candidate: {
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            sdp: event.candidate.candidate,
          },
        };
        console.log("向信令服务器发送candidate", message);
        // 向信令服务器发送candidate
        that.socket.emit("candidate", message);
      }
    },
    onTrack(pc, otherSocketId, event) {
      console.log("onTrack from: " + otherSocketId);
      console.log(event);
      // let otherVideoDom = $("#" + otherSocketId);
      let otherVideoDom = null;
      if (otherVideoDom.length === 0) {
        // TODO 未知原因：会两次onTrack，就会导致建立两次dom
        const video = document.createElement("video");
        video.id = otherSocketId;
        video.autoplay = "autoplay";
        video.muted = "muted";
        video.style.width = 200;
        video.style.height = 200;
        video.style.marginRight = 5;
        // $("#remoteDiv").append(video);
      }
      // pushStreamToVideo($("#" + otherSocketId)[0], event.streams[0]);
      this.pushStreamToVideo(null, event.streams[0]);
    },
    onRemoveStream(pc, otherSocketId, event) {
      console.log("onRemoveStream from: " + otherSocketId);
      // peer关闭
      this.getWebRTCConnect(otherSocketId).close;
      // 删除peer对象
      this.removeRtcConnect(otherSocketId);
      // 移除video
      // $("#" + otherSocketId).remove();

      console.log(event);
    }
  },
};


</script>