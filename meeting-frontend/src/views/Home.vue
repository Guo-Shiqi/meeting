<template>
    <el-container>
        <el-header></el-header>
        <el-main>
            <!-- <span>名称</span>s -->
            <!-- <el-icon>
                <setting />
            </el-icon>-->
            <br />
            <el-row :size="50">
                <el-col :span="8">
                    <div @click="join('join')">
                        <img src="../assets/btn_join.png" style="width: 44px;height: 44px;" />
                    </div>
                    <span>加入会议</span>
                </el-col>
                <el-col :span="8">
                    <div @click="join('home')">
                        <img src="../assets/btn_fast.png" style="width: 44px;height: 44px;" />
                    </div>
                    <span>快速会议</span>
                </el-col>
                <el-col :span="8">
                    <div @click="join('bookMeeting')">
                        <img src="../assets/btn_book.png" style="width: 44px;height: 44px;" />
                    </div>
                    <span>预定会议</span>
                </el-col>
            </el-row>
            <hr width="320px" color="#dddddd" size="1px" />
            <div class="no_meeting">
                <img src="../assets/no_meeting.png" style="width: 120px;height:84.8px ;" />
                <br>
                <span>暂无会议</span>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import router from "../router";
export default {
    methods: {
        join: (page) => {
            router.push('/' + page);
        },
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

.no_meeting{
    margin-top: 100px;
}
</style>