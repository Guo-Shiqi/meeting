<template>
    <el-container>
        <el-header></el-header>
        <el-main>
            <span>名称</span>
            <el-icon>
                <setting />
            </el-icon>
            <br />
            <el-space :size="50">
                <div>
                    <el-button type="primary" @click="join">
                        <el-icon>
                            <plus />
                        </el-icon>
                    </el-button>
                    <br />
                    <span>加入会议</span>
                </div>
                <div>
                    <el-button type="primary">
                        <el-icon>
                            <bottom-right />
                        </el-icon>
                    </el-button>
                    <br />
                    <span>快速会议</span>
                </div>
                <div>
                    <el-button type="primary">
                        <el-icon>
                            <calendar />
                        </el-icon>
                    </el-button>
                    <br />
                    <span>预定会议</span>
                </div>
            </el-space>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import router from '@/router';
import { Setting, Plus, Calendar, BottomRight } from '@element-plus/icons'
// import { Setting } from '@element-plus/icons'
function join() {
    router.push('/join');
}
</script>

<style scoped>
.el-button {
    height: 45px;
    width: 45px;
    padding: -10;
}
.el-header {
    margin-top: 100px;
}
.el-main {
    margin-top: 100px;
}

.el-button {
    margin-top: 30px;
}
</style>