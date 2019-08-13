// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
Vue.config.productionTip = false

//VuePreview:引入vue-preview
import VuePreview from 'vue-preview'
Vue.use(VuePreview);

//引入定义的全局变量
import gloable from './store/gloable'

//存入全局备用
Vue.prototype.domain=gloable

//引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//引入axios
import axios from 'axios'
Vue.prototype.$axios=axios
// 允许携带cookie
axios.defaults.withCredentials=true

//引入jQuery
import $ from 'jquery'
Vue.prototype.$=$

//引入cookie插件
import Cookies from 'js-cookie'
Vue.prototype.Cookies=Cookies

//引入VUEX
import store from './store/store'


//请求拦截器
axios.interceptors.request.use((config)=>{

  if(config.url.includes("getCode")){//如果是获取验证码的路径
    //没有Cookie的话添加Cookie
    let aucokie=Cookies.get("authcode")
    if(aucokie==null){
      Cookies.set("authcode","",{path:"/",domain:"localhost",age:-1})
    }
  }
  config.headers['token']=store.state.token;

  return config;
})


//音频文件的使用
import yinpin from '../static/tishiyin/tishiyin.mp3'
import aiya from '../static/tishiyin/aiya.mp3'
import en from '../static/tishiyin/en.mp3'
import qingsong from '../static/tishiyin/dahuaxiyou.mp3'

Vue.prototype.playAudio = (id,yinyue) => {
  let buttonAudio = document.getElementById(id);
  if(yinyue=="yinpin"){
    buttonAudio.setAttribute('src',yinpin)
  }
  if(yinyue=="en"){
    buttonAudio.setAttribute('src',en)
  }
  if(yinyue=="aiya"){
    buttonAudio.setAttribute('src',aiya)
  }
  if(yinyue=="qingsong"){
    buttonAudio.setAttribute('src',qingsong)
  }
}

/* eslint-disable no-new */



//添加路由拦截，拦截路由权限start
router.beforeEach((to,from,next)=>{
  //判断是否登录 to.meta.require是true说明需要进行登录的验证
  if(to.meta.require){
    //获取本地存储中的jwt token
    let token=window.localStorage.getItem("userInfo");
    if(token!=null){
      next();
    }else{
      next({path:"/"});//跳转到登录页面
    }
  }else{
    //否则说明不需要进行登录的验证
    next();
  }
  //判断是否在权限列表中

});
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
