<template>
    <el-container>
        <el-header>
            <h2>预定会议</h2>
        </el-header>
        <el-main>
            <el-form :label-position="labelPosition" label-width="100px" :model="formData">
                <el-form-item label="会议主题">
                    <el-input v-model="formData.title" placeholder="请输入会议主题"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                        v-model="formData.beginTime"
                        type="datetime"
                        placeholder="选择开始时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="formData.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="入会密码" style="text-align: left">
                    <el-checkbox label="开启入会密码" v-model="usePwd"></el-checkbox>
                    <el-input v-if="usePwd" v-model="formData.password"></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 100px">
                    <el-button type="primary" @click="submit">预定</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
    data() {
        return {
            labelPosition: "top",
            usePwd: false,
            formData: {
                name: "",
                password: null,
                title: null,
                beginTime: null,
                endTime: null,
                userId: null,
                note: null,
            },
        };
    },
    methods: {
        submit() {
            axios({
                url: "https://localhost:3001/api/meeting",
                method: "post",
                data: this.formData,
            }).then((res) => {
                alert(JSON.stringify(res));
            }).catch((err) => {
                console.log(err);
                alert("登陆失败");
            });
        },
    },
    mounted() {
        this.formData.userId = this.user.id;
        this.formData.title = this.user.name + "预定的会议"
        var begin = new Date()
        var end = new Date(begin.getTime() + (1 * 60 * 60 * 1000))
        this.formData.beginTime = begin
        this.formData.endTime = end
    },
    computed: mapState(['user']),
    watch: {
        usePwd(val, oldVal) {
            if (val) {
                this.formData.password = Math.floor(Math.random() * 100000).toString();
            } else {
                this.formData.password = null
            }
            console.log(`usePwd: ${oldVal} => ${val}`)

        },
    }
};
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

/* .el-form-item {
    margin-top: -10px;
} */

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 320px;
}

label #app > section > main > form > div:nth-child(4) > label {
    padding-bottom: 0 !important;
}
</style>