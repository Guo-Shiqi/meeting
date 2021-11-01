<template>
	<el-config-provider :locale="locale">
		<div id="nav" hidden>
			<router-link to="/">{{ $t("nav.home") }}</router-link> |
			<router-link to="/about">{{ $t("nav.about") }}</router-link> |
			<router-link to="/example">{{ $t("nav.example") }}</router-link>|
			<router-link to="/signin">{{ $t("nav.signin") }}</router-link>|
			<router-link to="/signup">{{ $t("nav.signup") }}</router-link>
		</div>
		<router-view />
	</el-config-provider>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { i18n } from "./i18n";
import { version, buildTime } from "../build/info.json"

console.log(`%c Release Build Info 
%cVersion			v${version}
BuildTime		${buildTime}`
, "background:#000;color:#FFF;font-weight:bold;"
, "background:#FFF;color:#000;"
)

let locale = computed(() => (i18n.global.messages as any)![i18n.global.locale]);
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav { padding: 30px; }
#nav a { font-weight: bold; color: #2c3e50; }
#nav a.router-link-exact-active { color: #42b983; }
</style>
