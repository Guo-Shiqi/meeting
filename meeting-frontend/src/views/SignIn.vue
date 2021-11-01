<template>
    <el-container>
        <el-header>
            <h1>登录</h1>
        </el-header>
        <el-main>
            <el-form :label-position="labelPosition" label-width="100px" :model="formData">
                <el-form-item label="名称">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="formData.password" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">登录</el-button>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer>Footer</el-footer>
    </el-container>
</template>
<script lang='ts' setup>
import { ref } from "vue";
import Base from '@/lib/ts/Base'
let labelPosition = ref('top');
let formData = ref({
    name: '',
    password: '',
    password2: '',
});
function submit() {
    Base.NetBase.spost<AnyObject>("http://127.0.0.1:3001/api/user/signin", formData.value)
        .then(res => {
            console.log(res);
            alert(JSON.stringify(res));
        })
        .catch(err => {
            console.log(err)
            alert("登录失败")
        })
}
</script>
<style>
.el-header {
    height: 10vh;
}

.el-footer {
    color: var(--el-text-color-primary);
    text-align: center;
    line-height: 60px;
}

.el-main {
    text-align: center;
    line-height: 160px;
    margin-top: 8vh;
}

.el-form {
    margin-left: auto;
    margin-right: auto;
    width: 260px;
}

.el-button {
    margin-top: 3vh;
    width: 260px;
    height: 35px;
}
</style>