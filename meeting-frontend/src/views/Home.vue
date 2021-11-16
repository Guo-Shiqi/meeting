<template>
    <el-container>
        <el-header>
            <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="6">
                    <el-avatar>{{ avatar_name }}</el-avatar>
                    <span>{{ user.name }}</span>
                </el-col>
                <el-col :span="6">
                    <el-button type="text" icon="el-icon-setting" circle></el-button>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row :size="50">
                <el-col :span="8">
                    <div @click="go('join')">
                        <img src="../assets/btn_join.png" style="width: 44px;height: 44px;" />
                    </div>
                    <span>加入会议</span>
                </el-col>
                <el-col :span="8">
                    <div @click="fast">
                        <img src="../assets/btn_fast.png" style="width: 44px;height: 44px;" />
                    </div>
                    <span>快速会议</span>
                </el-col>
                <el-col :span="8">
                    <div @click="go('bookMeeting')">
                        <img src="../assets/btn_book.png" style="width: 44px;height: 44px;" />
                    </div>
                    <span>预定会议</span>
                </el-col>
            </el-row>
            <hr width="320px" color="#dddddd" size="1px" />
            <div class="no_meeting">
                <img src="../assets/no_meeting.png" style="width: 120px;height:84.8px ;" />
                <br />
                <span>暂无会议</span>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import router from "../router";
import { mapState } from "vuex";
export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapState([
            'user'
        ]),
        avatar_name: function () { return this.user.name.substr(this.user.name.length - 2) }
    },
    methods: {
        go: (page) => {
            router.push('/' + page);
        },
        fast() {
            router.push({
                name: "Meeting",
                params: {
                    meetingID: this.user.id,
                    name: this.user.name,
                },
            });
        }
    }
}

</script>

<style scoped>
.el-row {
    width: 320px;
    margin-left: auto;
    margin-right: auto;
}

hr {
    margin-top: 20px;
}

.no_meeting {
    margin-top: 100px;
}
</style>