<template>
    <el-container>
        <el-header>
            <h1>新用户注册</h1>
        </el-header>
        <el-main>
            <el-form :label-position="labelPosition" label-width="100px" :model="formData">
                <el-form-item label="名称">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="formData.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input v-model="formData.password2" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">注册</el-button>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer hidden>Footer</el-footer>
    </el-container>
</template>
<script>
import axios from 'axios'
import 'whatwg-fetch'
export default {
    data() {
        return {
            labelPosition: 'top',
            formData: {
                name: '',
                password: '',
                password2: '',
            }
        }
    },
    methods: {
        submit: function () {
            console.log(this)
            if (this.formData.password != this.formData.password2) {
                alert("两次密码不同")
            } else {
                axios.post("http://127.0.0.1:3001/api/user/signup", this.formData)
                    .then(res => {
                        console.log(res);
                        alert("注册成功!\nId:" + res.data.id)
                    }).catch(err =>
                        console.log(err)
                    )
            }
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
    margin-top: 3vh;
    width: 320px;
    height: 40px;
}
</style>