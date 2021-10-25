import permissionRoutes from './module/main-routes'
import NProgress from "nprogress";
import store from "@/store";
import router from "@/route/index";
import { inCloudRoute } from "@/tools/router";

/** 路由信息 */
export const generateRoute = (menus) => {
  const userRoutes = menus.map(menu => {
    const { parent, icon, childMenus = [], menuPath, hidden = false, menuName, i18n, id, redirect, pathName } = menu
    const currentMenu = { path: menuPath ?? '', component: pathName ?? null, hidden, parent, redirect, meta: { key: id, title: menuName, i18n, icon }, children: childMenus.length === 0 ? [] : generateRoute(childMenus) }
    if (childMenus.length <= 0) {
      delete currentMenu.children
    }
    return currentMenu
  })
  return userRoutes
}

/** 权限信息 */
export const generatePower = (powers) => {
  const userPowers = powers.map(power => {
     return power.code
  })
  return userPowers;
}


export const setUserRouteComponent = routes => {
  routes.forEach(r => {
    r.component = r.parent == '0' ? permissionRoutes.Layout : permissionRoutes[r.component]
    if (r.children && r.children.length > 0) {
      setUserRouteComponent(r.children)
    }
  })
}

const setDocumentTitle = title => {
  document.title = `基建RGAC - ${title}`
}

/**
 * 前置拦截器
 *
 * @param from
 * @param next
 */
export const permissionController = async (to, from, next) => {
  const { user } = store.state // 读取状态
  NProgress.start();
  const { meta: { title = '' } } = to
  setDocumentTitle(title)
  await store.dispatch('app/execCancelToken')
  if (!to.path.includes('login') && !localStorage.getItem('token') && !localStorage.getItem('token_key')) {
    next({path: '/login'})

  } else {
    // 如果没有用户信息则获取
    if (!user.userInfo && user.token) {
      await store.dispatch('user/getUserInfo')
    }
    if (!router.getRoutes().map(it => it.path).includes(to.path)) {
      await store.dispatch('user/addRoute')
      await store.dispatch('user/addPower')
      const userRoutes = JSON.parse(JSON.stringify(store.getters.menu))
      const hasRoute = inCloudRoute(userRoutes, to.path) // 筛选是否包含的路由
      if (hasRoute) {
        setUserRouteComponent(userRoutes)
        userRoutes.forEach(r => { 
          router.addRoute(r) 
        })
        next(to.fullPath)
      } else {
        next('/error/404')
      }
    } else {
      next()
    }
  }
}
