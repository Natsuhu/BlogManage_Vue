import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
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
      component: () => import('@/views/dashboard/index'),
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
        component: () => import('@/views/dashboard/index'),
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
        name: 'MomentTable',
        component: () => import('@/views/dashboard/index'),
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
        name: 'CommentTable',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '评论管理', icon: 'el-icon-s-comment' }
      }
    ]
  },
  {
    path: '/page',
    name: 'Page',
    redirect: '/page/site',
    component: Layout,
    meta: { title: '页面管理', icon: 'el-icon-document-copy' },
    children: [
      {
        path: 'site',
        name: 'SiteSetting',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '站点设置', icon: 'el-icon-setting' }
      },
      {
        path: 'friend',
        name: 'FriendList',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '友链管理', icon: 'el-icon-link' }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '关于我', icon: 'el-icon-tickets' }
      }
    ]
  },
  {
    path: '/pictureHosting',
    name: 'PictureHosting',
    redirect: '/pictureHosting/setting',
    component: Layout,
    meta: { title: '图床管理', icon: 'el-icon-picture' },
    children: [
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '配置', icon: 'el-icon-setting' }
      },
      {
        path: 'github',
        name: 'GithubManage',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'GitHub', icon: 'el-icon-folder-opened' }
      },
      {
        path: 'upyun',
        name: 'UpyunManage',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '又拍云', icon: 'el-icon-folder-opened' }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    redirect: '/system/job',
    component: Layout,
    meta: { title: '系统管理', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'job',
        name: 'JobList',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '定时任务', icon: 'el-icon-alarm-clock' }
      }
    ]
  },
  {
    path: '/log',
    name: 'Log',
    redirect: '/log/job',
    component: Layout,
    meta: { title: '日志管理', icon: 'el-icon-document' },
    children: [
      {
        path: 'job',
        name: 'JobLog',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '任务日志', icon: 'el-icon-alarm-clock' }
      },
      {
        path: 'login',
        name: 'LoginLog',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '登录日志', icon: 'el-icon-finished' }
      },
      {
        path: 'operation',
        name: 'OperationLog',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '操作日志', icon: 'el-icon-document-checked' }
      },
      {
        path: 'exception',
        name: 'ExceptionLog',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '异常日志', icon: 'el-icon-document-delete' }
      },
      {
        path: 'visit',
        name: 'VisitLog',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '访问日志', icon: 'el-icon-data-line' }
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

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
