import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'

import login from '@/view/login/login'
import show from '@/view/show/show'
import datamenu from '@/view/show/datamenu'
import datamain from '@/view/show/datamain'
import system from '@/view/show/system'


//业务
import userDate from '@/view/show/dataList/userDate'
//角色管理
import menu from '@/view/show/dataList/menu'
//权限管理
import menuList from '@/view/show/dataList/menuList'
//导入EXCEL
import  importFile  from  '@/view/show/dataList/importFile'
//登陆信息折线图
import  LoginDate  from  '@/view/show/dataList/LoginDate'
Vue.use(Router)


export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
  component: login,
  meta:{
  require: false
}
},
{
  path: '/view/show/show',
    name: 'show',
  component: show,
  meta:{
  require:true//该路径的访问需要登录
},
  children:[
    {
      path: "/datamain",
      component: datamain,
      children: [
        {path:'/system',component:system,meta:{require:true}},
        {path:'/dataList/userDate',component:userDate,meta:{require:true}},
        {path:'/dataList/menu',component:menu,meta:{require:true}},
        {path:'/dataList/menuList',component:menuList,meta:{require:true}},
        {path:'/dataList/importFile',component:importFile,meta:{require:true}},
        {path:'/dataList/LoginDate',component:LoginDate,meta:{require:true}}
      ]
    }
  ]
},
{
  path:"/datamenu",
    component:datamenu,
  meta:{require:true}
}

]
})
