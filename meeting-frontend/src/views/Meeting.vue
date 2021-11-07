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
export default {
  name: "Meeting",
  data() {
    return {
      meetingID: "",
      myName: "",
      localStream: null,
      socket: null,
      socketID: null,
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
        console.log(this.socketID);
      });
    },
    connectMeeting(meetingID) {
      console.log("发送进入房间请求" + meetingID);
      console.log(this.socket);
      this.socket.emit("createAndJoinRoom", {
        room: meetingID,
      });
    },
  },
};
</script>