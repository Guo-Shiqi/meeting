import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    {
		path: '/',
		name: 'Index',
		component: () => import('../views/Index.vue')
	},
	{
		path: "/about",
		name: "About",
		component: () => import("../views/About.vue")
	},
	{
		path: "/example",
		name: "Example",
		component: () => import("../views/Example.vue")
	},
	{
		path: "/signin",
		name: "SignIn",
		component: () => import("../views/SignIn.vue")
	},
	{
		path: "/signup",
		name: "SignUp",
		component: () => import("../views/SignUp.vue")
	},
	{
		path: "/join",
		name: "Join",
		component: () => import("../views/Join.vue")
	},
	{
		path: "/home",
		name: "Home",
		component: () => import("../views/Home.vue")
	}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// router.beforeEach((to, from, next) => {
// 	next()
// })

export default router;