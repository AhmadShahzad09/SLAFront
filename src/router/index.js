import Vue from 'vue'
import Router from 'vue-router'
import _ from 'lodash'
import Profile from '../views/Profile/Profile.vue'
import Login from '../views/Login'
import ChangePassword from '../views/User/ChangePassword.vue'
import Private from '../views/Private'

import UserDashboard from '../views/User/Dashboard'
import UserChangePassword from '../views/User/ChangePassword'

import Dashboard from '../views/Dashboard/Dashboard.vue'
import CalculationMethod from '../views/CalculationMethod/Dashboard.vue'
import DataEntry from '../views/DataEntry/Dashboard.vue'
import MonitoringExecution from '../views/MonitoringExecution/Dashboard.vue'
import DataExtraction from '../views/DataExtraction/Dashboard.vue'
import DailyCalculationResult from '../views/DailyCalculationResult/Dashboard.vue'
import MonthlyCalculationResult from '../views/MonthlyCalculationResult/Dashboard.vue'
import Reports from '../views/Report/Dashboard.vue'

import storage from '../utils/storage'

Vue.use(Router)

const route = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Private,
      children: [
        {
          path: '/',
          redirect: '/dashboard'
        },
        {
          path: '/dailyCalculation',
          name: 'DailyCalculationResult',
          component: DailyCalculationResult
        },
        {
          path: '/monthlyCalculation',
          name: 'MonthlyCalculationResult',
          component: MonthlyCalculationResult
        },
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: '/calculationMethods',
          name: 'CalculationMethod',
          component: CalculationMethod
        },
        {
          path: '/dataEntry',
          name: 'DataEntry',
          component: DataEntry
        },
        {
          path: '/monitoringExecution',
          name: 'MonitoringExecution',
          component: MonitoringExecution
        },
        {
          path: '/dataExtraction',
          name: 'DataExtraction',
          component: DataExtraction
        },
        {
          path: '/reports',
          name: 'Reports',
          component: Reports
        },
        {
          path: '/users',
          component: UserDashboard,
          name: 'UserDashboard'
        },
        {
          path: '/users/:id/change-password',
          name: 'UserChangePassword',
          component: UserChangePassword
        },
        // {
        //   path: '/profile',
        //   name: 'Profile',
        //   component: Profile
        // }
      ]
    },
    {
      path: '/auth/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/reset-password/:token',
      name: 'ChangePassword',
      component: ChangePassword
    },
    { path: "*", redirect: '/dailyCalculation' }
  ]

})

route.beforeEach((to, from, next) => {
  const loggedIn = !!_.get(storage.get(), 'user.data.token')

  if (to.name === 'ChangePassword') {
    return next()
  } else if (to.name !== 'Login' && !loggedIn) {
    return next({ name: 'Login' })
  } else {
    return next()
  }
})

export default route
