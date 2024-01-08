import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home'
Vue.use(Router);


export const constantRoutes = [
    {
        path: '/',
        name: 'Home',
        component:Home,
        redirect: '/dashboard',
        meta: { title: 'Main frame' },
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('@/page/Dashboard.vue'),
                meta: { title: 'Homepage', icon:'el-icon-s-home' }
            },
            {
              path: 'admin/profile',
              name: 'AdminProfile',
              hidden: true,
              component: () => import("@/page/AdminProfile"),
              meta:{
                title: 'Personal data',
                icon: 'fa fa-home',
              }
            },
            {
              path: 'user/profile',
              name: 'UserProfile',
              hidden: true,
              component: () => import("@/page/UserProfile"),
              meta:{
                title: 'Personal data',
                icon: 'fa fa-home',
              }
            },
            {
              path: 'password',
              name: 'Password',
              hidden: true,
              component: () => import("@/page/Password"),
              meta:{
                title: 'Change password',
                icon: 'el-icon-s-home',
              }
            }
        ]
    },
    {
        path: '/login',
        hidden:true,
        component: () => import('@/page/Login.vue'),
        meta: { title: 'Login' }
    },
    
]


// 动态路由，根据角色权限动态加载
//Dynamic routing, dynamically loaded based on role permissions
export const asyncRoutes = [
  {
    path: '/user',
    component: Home,
    name: "User",
    meta: {
      title: 'Student Infor',
      icon: 'el-icon-user',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import("@/page/User"),
        meta: {
          title: 'Student Infor',
          icon: 'el-icon-user',
          roles: ['admin']
        }
      }
    ]
  },
    {
        path: '/category',
        component: Home,
        name: "Category",
        meta: {
          title: 'Book Category',
          icon: 'el-icon-money',
          roles: ['admin']
        },
        children: [
          {
            path: 'list',
            name: 'CollegeList',
            component: () => import("@/page/Category"),
            meta: {
              title: 'Book Category',
              icon: 'el-icon-money',
              roles: ['admin']
            }
          },
        ]
      },
      {
        path: '/book',
        component: Home,
        name: "Book",
        meta: {
          title: 'Book infor',
          icon: 'el-icon-collection',
          roles: ['admin','user']
        },
        children: [
          {
            path: 'list',
            name: 'StudentList',
            component: () => import("@/page/Book"),
            meta: {
              title: 'Book infor',
              icon: 'el-icon-collection',
              roles: ['admin','user']
            }
          }
        ]
      },
      {
        path: '/borrow',
        component: Home,
        name: "Borrow",
        meta: {
          title: 'Borrow manage',
          icon: 'el-icon-postcard',
          roles: ['admin','user']
        },
        children: [
          {
            path: 'list',
            name: 'BorrowList',
            component: () => import("@/page/Borrow"),
            meta: {
              title: 'Borrow records',
              icon: 'el-icon-postcard',
              roles: ['admin','user']
            }
          },
        ]
      },
      {
        path: '/feedback',
        component: Home,
        name: "Feedback",
        meta: {
          title: 'Feedback',
          icon: 'el-icon-chat-dot-square',
          roles: ['admin','user'] 
        },
        children: [
          {
            path: 'list',
            name: 'FeedbackList',
            component: () => import("@/page/Feedback"),
            meta: {
              title: 'Feedback',
              icon: 'el-icon-chat-dot-square',
              roles: ['admin','user'] 
            }
          },
        ]
      },
      {
        path: '/notice',
        component: Home,
        name: "Notice",
        meta: {
          title: 'Announcement ',
          icon: 'el-icon-bell',
          roles: ['admin','user'] 
        },
        children: [
          {
            path: 'list',
            name: 'NoticeList',
            component: () => import("@/page/Notice"),
            meta: {
              title: 'Announcement ',
              icon: 'el-icon-bell',
              roles: ['admin','user'] 
            }
          },
        ]
      },
      {
        path: '/configs',
        component: Home,
        name: "Configs",
        meta: {
          title: 'System config',
          icon: 'el-icon-setting',
          roles: ['admin'] 
        },
        children: [
          {
            path: 'list',
            name: 'ConfigsList',
            component: () => import("@/page/Configs"),
            meta: {
              title: 'System config',
              icon: 'el-icon-setting',
              roles: ['admin'] 
            }
          },
        ]
      }
]


export const Route404 = {
  path: '*',
  hidden: true,
  component:Home,
  redirect: '/404',
  meta: {
    title: '404',
  },
  children:[
    {
      path: '/404',
      hidden:true,
      component: () => import('@/page/404.vue'),
      meta: { title: '404' }
    }
  ]
}

const createRouter = () =>
new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  //重置路由器
  // reset router
  router.matcher = newRouter.matcher 
}

export default router