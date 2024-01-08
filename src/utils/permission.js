import router from "@/router";
import {asyncRoutes} from "@/router";

// 注意：这个文件是设置动态路由的,permissions是一个资源的数组
//Note: This file is for setting dynamic routing, and permissions is an array of resources
export function activeRouter() {
    const userStr = sessionStorage.getItem("user")
    if (userStr) {
        const user = JSON.parse(userStr)
        const role = user.role == 0 ? "admin" : "user";
        console.log('role:',role)
        const res = filterAsyncRoutes(asyncRoutes,[role]);
        router.addRoutes(res);
    }
}


export function filterAsyncRoutes(routes, roles) {
    const res = []
  
    routes.forEach(route => {
      const tmp = { ...route }
      if (hasPermission(roles, tmp)) {
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles)
        }
        res.push(tmp)
      }
    })
  
    return res
  }

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}