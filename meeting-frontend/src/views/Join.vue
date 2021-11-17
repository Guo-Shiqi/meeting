<template>
  <el-container>
    <el-header>
      <h2>加入会议</h2>
    </el-header>
    <el-main>
      <el-form :label-position="labelPosition" label-width="100px" :model="formData">
        <el-form-item label="会议号">
          <el-input v-model="formData.meetingID" placeholder="请输入会议号" :disabled="isFixedId"></el-input>
        </el-form-item>
        <el-form-item label="您的名称">
          <el-input v-model="formData.name" placeholder="请输入您的名称"></el-input>
        </el-form-item>
        <el-form-item label="会议设置" style="text-align: left">
          <el-checkbox label="自动连接音频"></el-checkbox>
          <br />
          <el-checkbox label="入会开启摄像头"></el-checkbox>
          <br />
          <el-checkbox label="入会开启麦克风"></el-checkbox>
        </el-form-item>
        <el-form-item style="margin-top: 100px">
          <el-button type="primary" @click="submit">加入会议</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import axios from "axios";
import "whatwg-fetch";
// import axios from "axios";
export default {
  data() {
    return {
      labelPosition: "top",
      formData: {
        name: "",
        meetingID: "",
      },
      isFixedId: false,
    };
  },
  methods: {
    submit() {
      if (this.formData.meetingID == "") {
        alert("请输入会议号");
      } else if (this.formData.name == "") {
        alert("请输入您的名称");
      } else {
        this.check(this.formData.meetingID)
      }
    },
    go() {
      this.$router.push({
        name: "Meeting",
        params: {
          meetingID: this.formData.meetingID,
          name: this.formData.name,
        },
      });
    },
    check(meetingId) {
      axios.get(`https://localhost:3001/api/meeting/${meetingId}`)
        .then(res => {
          if (res.status == 200) {
            if (res.data.passwold) {
              this.$prompt('请输入会议密码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\d+/,
                inputErrorMessage: '会议密码格式不正确'
              }).then(({ value }) => {
                if (value == res.data.passwold) {
                  this.go()
                } else {
                  this.$message.error("会议密码错误");
                }
              }).catch(() => {
                this.$message.info('取消输入')
              })

            } else {
              this.go();
            }
          } else if (res.status == 204) {
            this.$message.warning('会议号不存在');
          }
        })
        .catch(e => {
          console.log(e)
          this.$message.error('系统错误')
        })
    },
  },
  mounted() {
    if (this.$route.params.meetingID) {
      this.formData.meetingID = this.$route.params.meetingID
      this.isFixedId = true
    }

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

.el-form-item {
  margin-top: -10px;
}
</style>