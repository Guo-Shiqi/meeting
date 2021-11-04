<template>
    <el-container>
        <el-header>
            <h2>帐号密码登录</h2>
        </el-header>
        <el-main>
            <el-form :label-position="labelPosition" label-width="100px" :model="formData">
                <el-form-item label="名称">
                    <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="formData.password" show-password placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">登录</el-button>
                </el-form-item>
                <el-form-item style="margin-top: -15px;">
                    <el-checkbox label="记住密码"></el-checkbox>

                    <el-link type="primary" :underline="false" @click="toSignUp">新用户注册</el-link>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>
<script>
import 'whatwg-fetch'
import router from '../router';
export default {
    data() {
        return {
            labelPosition: 'top',
            formData: {
                name: '',
                password: '',
            }
        }
    },
    methods: {
        submit: () => {
            fetch("http://127.0.0.1:3001/api/user/signin", {
                method: "POST",
                body: JSON.stringify(this.formData),
                headers: {
                    'content-type': 'application/json'
                },
            }).then(res => {
                console.log(res);
                alert(JSON.stringify(res));
            }).catch(err => {
                console.log(err)
                alert("登录失败")
            })
        },
        toSignUp: () => {
            router.push("/signup")
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

.el-footer {
    color: var(--el-text-color-primary);
    text-align: left;
    line-height: 60px;
}

.el-main {
    margin-top: -20px;
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
    margin-top: 40px;
}

.el-link {
    margin-top: -8px;
    margin-left: 170px;
}
</style>