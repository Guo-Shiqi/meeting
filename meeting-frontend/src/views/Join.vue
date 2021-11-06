<template>
    <el-container>
        <el-header>
            <h2>加入会议</h2>
        </el-header>
        <el-main>
            <el-form :label-position="labelPosition" label-width="100px" :model="formData">
                <el-form-item label="会议号">
                    <el-input v-model="formData.meetingID" placeholder="请输入会议号"></el-input>
                </el-form-item>
                <el-form-item label="您的名称">
                    <el-input v-model="formData.name" placeholder="请输入您的名称"></el-input>
                </el-form-item>
                <el-form-item label="会议设置" style="text-align: left;">
                    <el-checkbox label="自动连接音频"></el-checkbox>
                    <br />
                    <el-checkbox label="入会开启摄像头"></el-checkbox>
                    <br />
                    <el-checkbox label="入会开启麦克风"></el-checkbox>
                </el-form-item>
                <el-form-item style="margin-top: 100px;">
                    <el-button type="primary" @click="submit">加入会议</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>
<script>
import 'whatwg-fetch'
import axios from 'axios'
export default {
    data() {
        return {
            labelPosition: 'top',
            formData: {
                name: '',
                meetingID: '',
            }
        }
    },
    methods: {
        submit: () => {
            // fetch("http://127.0.0.1:3001/api/user/signin", { method: "POST" })
            //     .then(res => {
            //         console.log(res);
            //         alert(JSON.stringify(res));
            //     })
            //     .catch(err => {
            //         console.log(err)
            //         alert("登录失败")
            //     })

            axios({
                url: "http://127.0.0.1:3001/api/user/signin",
                method: "post",
                data: {
                    "name" : "admin",
                    "password" : "admin"
                }
            }).then(res => {
                alert(JSON.stringify(res));
            }).catch(err => {
                console.log(err);
                alert("登陆失败");
            })
        }
    }
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