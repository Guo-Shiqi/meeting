<template>
    <div class="room">
        <div class="video-box" ref="video-box">
            <video class="video-mine" autoplay controls ref="video-mine"></video>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'myroom',
        data() {
            return {
                roomid: '',
                peer: null,
                peerList: {},
                candidate: null,
                localStream: null
            }
        },
        methods: {
            getUserMedia() {
                //兼容浏览器的getUserMedia写法
                let myVideo = this.$refs['video-mine'];
                let getUserMedia = (navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia);
                //获取本地的媒体流，并绑定到一个video标签上输出，并且发送这个媒体流给其他客户端
                return new Promise((resolve, reject) => {
                    getUserMedia.call(navigator, {
                        "audio": true,
                        "video": true
                    }, (stream) => {
                        //绑定本地媒体流到video标签用于输出
                        myVideo.srcObject = stream;
                        this.localStream = stream;
                        resolve();
                    }, function(error){
                        reject(error);
                        // console.log(error);
                        //处理媒体流创建失败错误
                    });
                })
            },
            
        },
        mounted() {
            this.$nextTick(() => {
                this.getUserMedia();
            });
        }
    };
</script>
