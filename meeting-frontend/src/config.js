// WebRTC配置文件
const WebRTCConfig = {
  // 信令服务器
  signalServer: 'wss://172.21.160.1:8443',
  // Offer/Answer模型请求配置
  offerOptions: {
    offerToReceiveAudio: true, // 请求接收音频
    offerToReceiveVideo: true, // 请求接收视频
  },
  // ICE服务器
  iceServers: {
    iceServers: [
      { urls: 'stun:stun.xten.com' }, // Safri兼容：url -> urls
    ]
  }
}


module.exports = WebRTCConfig