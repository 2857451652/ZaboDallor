import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

var normalRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  

  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Analyze',
  //       meta: { title: '卫星状态分析', icon: 'el-icon-data-analysis', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
]

const adminRoutes = [
  {
    path: '/',  //通配符
    component: Layout,
    redirect: '/sat_orbit',
    children: [
      {
        path: 'sat_orbit',
        component: () => import('@/views/A-control-center/index'),
        name: 'sat_orbit',
        meta: { title: '天算星座', icon: 'guide', affix: true}
      }
    ]
  },
  {
    path: '/orbit',
    component: Layout,
    children: [
      {
        // path: 'http://www.tiansuan.site', // 外部网址
        path: 'orbit',
        component: () => import('@/views/link/orbitIndex'),
        name: 'orbit',
        meta: { title: '航天运管系统', icon: 'el-icon-link', noCache: true }
      }
    ]
  },
  {
    path: '/station',
    component: Layout,
    children: [
      {
        path: 'station',
        component: () => import('@/views/A-station-center/index'),
        name: 'station',
        meta: { title: '地面站信息', icon: 'el-icon-place'}
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    children: [
      {
        path: 'monitor',
        component: () => import('@/views/monitor/index'),
        name: 'monitor',
        meta: { title: '地面站监控', icon: 'el-icon-video-camera-solid'}
      }
    ]
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '卫星状态信息', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/analyze',
    component: Layout,
    children: [
      {
        path: 'analyze',
        component: () => import('@/views/analyze/index'),
        name: 'Analyze',
        meta: { title: '卫星状态分析', icon: 'el-icon-data-line', noCache: true }
      }
    ]
  },
  {
    path: '/upload',
    component: Layout,
    children: [
      {
        path: 'upload',
        component: () => import('@/views/upload/index'),
        name: 'Upload',
        meta: { title: '文件传输模块', icon: 'documentation', noCache: true }
      }
    ]
  },
  {
    path: '/appctl',
    component: Layout,
    children: [
      {
        path: 'appctl',
        // component: () => import('@/views/link/tableIndex'),
        component: () => import('@/views/AppController/index.vue'),
        name: 'appctl',
        meta: { title: '卫星应用部署', icon: 'component', noCache: true }
      }
    ]
  },
  // {
  //   path: '/appctl',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'appctl',
  //       component: () => import('@/views/AppController/index'),
  //       name: 'AppController',
  //       meta: { title: '卫星应用部署', icon: 'component', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/bigdata',
  //   component: Layout,
  //   children: [
  //     {
  //       // path: 'http://www.tiansuan.site', // 外部网址
  //       path: 'bigdata',
  //       component: () => import('@/views/link/bigdataIndex'),
  //       name: 'bigdata',
  //       meta: { title: '卫星大数据平台', icon: 'el-icon-s-data', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/AboutUs',
    component: Layout,
    redirect: '/AboutUs',
    hidden: true,
    children: [
      {
        path: 'AboutUs',
        component: () => import('@/views/profile/index'),
        name: 'AboutUs',
        meta: { title: 'AboutUs', icon: 'user', noCache: true }
      }
    ]
  }
]

const visiterRoutes = [
  {
    path: '/AboutUs',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'AboutUs',
        component: () => import('@/views/profile/index'),
        name: 'AboutUs',
        meta: { title: 'AboutUs', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: Layout,
    redirect: '/upload',
    children: [
      {
        path: 'upload',
        component: () => import('@/views/upload/index'),
        name: 'upload',
        meta: { title: 'Upload Files', icon: 'documentation', noCache: true }
      }
    ]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
// export const asyncRoutes = [
//   {
//     path: '/permission',
//     component: Layout,
//     redirect: '/permission/page',
//     alwaysShow: true, // will always show the root menu
//     name: 'Permission',
//     meta: {
//       title: 'Permission',
//       icon: 'lock',
//       roles: ['admin', 'editor'] // you can set roles in root nav
//     },
//     children: [
//       {
//         path: 'page',
//         component: () => import('@/views/permission/page'),
//         name: 'PagePermission',
//         meta: {
//           title: 'Page Permission',
//           roles: ['admin'] // or you can only set roles in sub nav
//         }
//       },
//       {
//         path: 'directive',
//         component: () => import('@/views/permission/directive'),
//         name: 'DirectivePermission',
//         meta: {
//           title: 'Directive Permission'
//           // if do not set roles, means: this page does not require permission
//         }
//       },
//       {
//         path: 'role',
//         component: () => import('@/views/permission/role'),
//         name: 'RolePermission',
//         meta: {
//           title: 'Role Permission',
//           roles: ['admin']
//         }
//       }
//     ]
//   },

//   {
//     path: '/icon',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/icons/index'),
//         name: 'Icons',
//         meta: { title: 'Icons', icon: 'icon', noCache: true }
//       }
//     ]
//   },

//   /** when your routing map is too long, you can split it into small modules **/
//   componentsRouter,
//   chartsRouter,
//   nestedRouter,
//   tableRouter,

//   {
//     path: '/example',
//     component: Layout,
//     redirect: '/example/list',
//     name: 'Example',
//     meta: {
//       title: 'Example',
//       icon: 'el-icon-s-help'
//     },
//     children: [
//       {
//         path: 'create',
//         component: () => import('@/views/example/create'),
//         name: 'CreateArticle',
//         meta: { title: 'Create Article', icon: 'edit' }
//       },
//       {
//         path: 'edit/:id(\\d+)',
//         component: () => import('@/views/example/edit'),
//         name: 'EditArticle',
//         meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
//         hidden: true
//       },
//       {
//         path: 'list',
//         component: () => import('@/views/example/list'),
//         name: 'ArticleList',
//         meta: { title: 'Article List', icon: 'list' }
//       }
//     ]
//   },

//   {
//     path: '/tab',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/tab/index'),
//         name: 'Tab',
//         meta: { title: 'Tab', icon: 'tab' }
//       }
//     ]
//   },

//   {
//     path: '/error',
//     component: Layout,
//     redirect: 'noRedirect',
//     name: 'ErrorPages',
//     meta: {
//       title: 'Error Pages',
//       icon: '404'
//     },
//     children: [
//       {
//         path: '401',
//         component: () => import('@/views/error-page/401'),
//         name: 'Page401',
//         meta: { title: '401', noCache: true }
//       },
//       {
//         path: '404',
//         component: () => import('@/views/error-page/404'),
//         name: 'Page404',
//         meta: { title: '404', noCache: true }
//       }
//     ]
//   },

//   {
//     path: '/error-log',
//     component: Layout,
//     children: [
//       {
//         path: 'log',
//         component: () => import('@/views/error-log/index'),
//         name: 'ErrorLog',
//         meta: { title: 'Error Log', icon: 'bug' }
//       }
//     ]
//   },

//   {
//     path: '/excel',
//     component: Layout,
//     redirect: '/excel/export-excel',
//     name: 'Excel',
//     meta: {
//       title: 'Excel',
//       icon: 'excel'
//     },
//     children: [
//       {
//         path: 'export-excel',
//         component: () => import('@/views/excel/export-excel'),
//         name: 'ExportExcel',
//         meta: { title: 'Export Excel' }
//       },
//       {
//         path: 'export-selected-excel',
//         component: () => import('@/views/excel/select-excel'),
//         name: 'SelectExcel',
//         meta: { title: 'Export Selected' }
//       },
//       {
//         path: 'export-merge-header',
//         component: () => import('@/views/excel/merge-header'),
//         name: 'MergeHeader',
//         meta: { title: 'Merge Header' }
//       },
//       {
//         path: 'upload-excel',
//         component: () => import('@/views/excel/upload-excel'),
//         name: 'UploadExcel',
//         meta: { title: 'Upload Excel' }
//       }
//     ]
//   },

//   {
//     path: '/zip',
//     component: Layout,
//     redirect: '/zip/download',
//     alwaysShow: true,
//     name: 'Zip',
//     meta: { title: 'Zip', icon: 'zip' },
//     children: [
//       {
//         path: 'download',
//         component: () => import('@/views/zip/index'),
//         name: 'ExportZip',
//         meta: { title: 'Export Zip' }
//       }
//     ]
//   },

//   {
//     path: '/pdf',
//     component: Layout,
//     redirect: '/pdf/index',
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/pdf/index'),
//         name: 'PDF',
//         meta: { title: 'PDF', icon: 'pdf' }
//       }
//     ]
//   },
//   {
//     path: '/pdf/download',
//     component: () => import('@/views/pdf/download'),
//     hidden: true
//   },

//   {
//     path: '/theme',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/theme/index'),
//         name: 'Theme',
//         meta: { title: 'Theme', icon: 'theme' }
//       }
//     ]
//   },

//   {
//     path: '/clipboard',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/clipboard/index'),
//         name: 'ClipboardDemo',
//         meta: { title: 'Clipboard', icon: 'clipboard' }
//       }
//     ]
//   },

//   {
//     path: 'external-link',
//     component: Layout,
//     children: [
//       {
//         path: 'https://github.com/PanJiaChen/vue-element-admin',
//         meta: { title: 'External Link', icon: 'link' }
//       }
//     ]
//   },

//   // 404 page must be placed at the end !!!
//   { path: '*', redirect: '/404', hidden: true }
// ]

function makeRoutes() {
  var userRole = localStorage.getItem('role');
  if(userRole=="admin")
    return normalRoutes.concat(adminRoutes)
  else if(userRole=="visiter")
    return normalRoutes.concat(visiterRoutes)
  else
    return normalRoutes.concat(adminRoutes)
}

export var constantRoutes = makeRoutes()

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
var added_mark = 0

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export function dynamicallyAddRoutes() {
  constantRoutes = makeRoutes()
  const newRouter = new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })
  router.matcher = newRouter.matcher // reset router
}


export default router
