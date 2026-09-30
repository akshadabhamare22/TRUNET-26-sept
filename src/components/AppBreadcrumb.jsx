import React from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import routes from '../routes'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const { t } = useTranslation()

  const getRouteName = (pathname, routeList) => {
    const currentRoute = routeList.find(
      (route) => route.path === pathname,
    )

    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []

    location
      .split('/')
      .reduce((prev, curr, index, array) => {
        const currentPathname = `${prev}/${curr}`

        const routeName = getRouteName(
          currentPathname,
          routes,
        )

        if (routeName) {
          breadcrumbs.push({
            pathname: currentPathname,
            name: routeName,
            active:
              index + 1 === array.length,
          })
        }

        return currentPathname
      })

    return breadcrumbs
  }

  const breadcrumbs =
    getBreadcrumbs(currentLocation)

  // Breadcrumb UI is currently disabled
  // in the original implementation.
  return null
}

export default React.memo(AppBreadcrumb)