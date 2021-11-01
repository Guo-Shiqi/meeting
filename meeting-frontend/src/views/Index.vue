<template>
	<el-container>
		<el-header>
			<img alt="Meeting logo" src="../assets/logo2.png" />
		</el-header>
		<el-main>
			<el-button type="primary" @click="join">加入会议</el-button>
			<br />
			<el-button @click="signin">注册/登录</el-button>
		</el-main>
	</el-container>
</template>

<script setup lang="ts">import router from '@/router';

function join() {
	router.push('/join');
}

function signin() {
	router.push('/signin');
}
</script>

<style scoped>
.el-button {
	height: 40px;
	width: 320px;
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