import Vue from 'vue'
import Router from 'vue-router'
import getPageTitle from '@/utils/get-page-title'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/Login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/Dashboard'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },

  {
    path: '/blog',
    name: 'Blog',
    redirect: '/blog/write',
    component: Layout,
    meta: { title: '博客管理', icon: 'el-icon-menu' },
    children: [
      {
        path: 'write',
        name: 'WriteBlog',
        component: () => import('@/views/blog/WriteArticle'),
        meta: { title: '写文章', icon: 'el-icon-edit' }
      },
      {
        path: 'moment/write',
        name: 'WriteMoment',
        component: () => import('@/views/blog/WriteMoment'),
        meta: { title: '写动态', icon: 'el-icon-edit' }
      },
      {
        path: 'manage',
        name: 'ArticleManage',
        component: () => import('@/views/blog/ArticleManage'),
        meta: { title: '文章管理', icon: 'el-icon-s-order' }
      },
      {
        path: 'moment/manage',
        name: 'MomentManage',
        component: () => import('@/views/blog/MomentManage'),
        meta: { title: '动态管理', icon: 'el-icon-chat-dot-round' }
      },
      {
        path: 'category/manage',
        name: 'CategoryManage',
        component: () => import('@/views/blog/CategoryManage'),
        meta: { title: '分类管理', icon: 'el-icon-s-grid' }
      },
      {
        path: 'tag/manage',
        name: 'TagManage',
        component: () => import('@/views/blog/TagManage'),
        meta: { title: '标签管理', icon: 'el-icon-paperclip' }
      },
      {
        path: 'comment/manage',
        name: 'CommentManage',
        component: () => import('@/views/blog/CommentManage'),
        meta: { title: '评论管理', icon: 'el-icon-s-comment' }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    redirect: '/friend/manage',
    component: Layout,
    meta: { title: '系统管理', icon: 'el-icon-s-platform' },
    children: [
      {
        path: 'friend/manage',
        name: 'FriendManage',
        component: () => import('@/views/system/FriendManage'),
        meta: { title: '友链管理', icon: 'el-icon-link' }
      },
      {
        path: 'about/manage',
        name: 'AboutMe',
        component: () => import('@/views/system/AboutMe'),
        meta: { title: '关于本站', icon: 'el-icon-tickets' }
      },
      {
        path: 'site/manage',
        name: 'SiteSetting',
        component: () => import('@/views/system/SiteSetting'),
        meta: { title: '网站设置', icon: 'el-icon-setting' }
      },
      {
        path: 'file/manage',
        name: 'FileManage',
        component: () => import('@/views/system/FileManage'),
        meta: { title: '文件管理', icon: 'el-icon-folder' }
      },
      {
        path: 'job/manage',
        name: 'JobManage',
        component: () => import('@/views/system/JobManage'),
        meta: { title: '定时任务', icon: 'el-icon-alarm-clock' }
      },
      {
        path: 'user/manage',
        name: 'UserManage',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '用户管理', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/log',
    name: 'Log',
    redirect: '/visit',
    component: Layout,
    meta: { title: '日志管理', icon: 'el-icon-document' },
    children: [
      {
        path: 'visit',
        name: 'VisitLog',
        component: () => import('@/views/log/VisitLog'),
        meta: { title: '访问日志', icon: 'el-icon-data-line' }
      },
      {
        path: 'operation',
        name: 'OperationLog',
        component: () => import('@/views/log/OperationLog'),
        meta: { title: '操作日志', icon: 'el-icon-thumb' }
      },
      {
        path: 'job',
        name: 'JobLog',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '任务日志', icon: 'el-icon-alarm-clock' }
      },
      {
        path: 'exception',
        name: 'ExceptionLog',
        hidden: true,
        component: () => import('@/views/dashboard/index'),
        meta: { title: '异常日志', icon: 'el-icon-document-delete' }
      }
    ]
  },
  {
    path: '/statistics',
    name: 'Statistics',
    redirect: '/statistics/visitor',
    component: Layout,
    meta: { title: '数据统计', icon: 'el-icon-s-data' },
    children: [
      {
        path: 'visitor',
        name: 'Visitor',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '访客统计', icon: 'el-icon-s-marketing' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

//挂载路由守卫
router.beforeEach((to, from, next) => {
  document.title = getPageTitle(to.meta.title)
  next()
})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
