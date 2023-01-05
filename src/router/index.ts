import { createRouter, createWebHashHistory } from "vue-router";

// 路由表
const routes = [
    {
        path: "/",
        component: () => import("../views/Index.vue"),
        name: "Index",
        meta: {
            position: "首页",
        },
        redirect: () => {
            return {
                name: "Query",
            };
        },
        children: [
            // 查询页
            {
                path: "/query",
                component: () => import("../views/Query.vue"),
                name: "Query",
                meta: {
                    position: "查询",
                },
            },
            // 查询页通过SQL查
            {
                path: "/query_by_sql",
                component: () => import("../views/QueryBySql.vue"),
                name: "QueryBySql",
                meta: {
                    position: "SQL查询",
                },
            },
            // 数据供应
            {
                path: "/supply_data",
                component: () => import("../views/SupplyData.vue"),
                name: "SupplyData",
                meta: {
                    position: "数据供应",
                },
            },
        ],
    },
    // 404 页
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("../share/error_page/404.vue"),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// 路由守卫
// router.beforeEach((to, from) => {

// });

export { router };
