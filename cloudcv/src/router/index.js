import {createRouter, createWebHistory} from "vue-router";

// const routes = [
//     { path: '/user/login', component: LoginVue },
//     { path: '/student', component: LayoutVue, redirect: '/student/home', children:[
//             { path: '/student/home', component: HomeVue },
//             { path: '/student/curriculum', component: CurriculumVue },
//             { path: '/student/homework', component: HomeworkVue },
//             { path: '/student/inform', component: InformVue },
//             { path: '/student/document', component: DocumentVue },
//             { path: '/student/collection', component: CollectionVue },
//             { path: '/student/setting', component: SettingVue },
//             { path: '/student/subscribe', component: SubscribeVue },
//         ]},
// ]
const routes = [

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router