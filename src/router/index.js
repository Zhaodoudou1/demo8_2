import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import login from '@/view/login/login'
export default new Router({
  routes: [{
      path:'/',
      name:"login",
      component:login
    },
    {
      path:'/view/show/show',
      name:"show",
      component:show
    }
  ]


 })
