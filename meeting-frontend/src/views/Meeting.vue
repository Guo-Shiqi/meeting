<template>
    <el-container>
        <el-header>
            <h2>关于</h2>
        </el-header>
        <el-main></el-main>
    </el-container>
</template>
    <script>
// WebRTC配置文件
const THSConfig = {
    // 信令服务器
    signalServer: 'wss://localhost:8443',
    // Offer/Answer模型请求配置
    offerOptions: {
        offerToReceiveAudio: true, // 请求接收音频
        offerToReceiveVideo: true, // 请求接收视频
    },
    // ICE服务器
    iceServers: {
        iceServers: [
            { urls: 'stun:stun.xten.com' }, // Safri兼容：url -> urls
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            { urls: 'stun:stun01.sipphone.com' },
            { urls: 'stun:stun.ekiga.net' },
            { urls: 'stun:stun.fwdnet.net' },
            { urls: 'stun:stun.ideasip.com' },
            { urls: 'stun:stun.iptel.org' },
            { urls: 'stun:stunserver.org' },
            { urls: 'stun:stun.softjoys.com' },
            { urls: 'stun:stun.voiparound.com' },
            { urls: 'stun:stun.voipbuster.com' },
            { urls: 'stun:stun.voipstunt.com' },
            { urls: 'stun:stun.voxgratia.org' },
        ]
    }
}

const PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
const SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
const GET_USER_MEDIA = navigator.getUserMedia ? "getUserMedia" : navigator.mozGetUserMedia ? "mozGetUserMedia" : navigator.webkitGetUserMedia ? "webkitGetUserMedia" : "getUserMedia";
const v = document.createElement("video");
const SRC_OBJECT = 'srcObject' in v ? "srcObject" : 'mozSrcObject' in v ? "mozSrcObject" : 'webkitSrcObject' in v ? "webkitSrcObject" : "srcObject";

</script>
<script setup lang="ts">
import { io } from "socket.io-client";
import { ref } from "vue";
const socket = ref(null) // socket连接
const localStream = ref(null) // 本地stream
const socketId = ref(null) // 本地socket id
const roomId = ref('1') // 房间 id
const userName = ref("用户名称") // 用户名称
const rtcPeerConnects = ref({}) // 对RTCPeerConnection连接进行缓存
const roomUsers = ref({}) // 房间里的用户数据
const leaderId = ref('') // 讲台socket id
const leaderName = ref('') // 主持人名称
const showRoom = ref(false) // 显示房间
const voiceStatus = ref(true) // 声音状态
</script>

<style scoped>
.el-header {
    width: 320px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
    padding: 0;
}
</style>
