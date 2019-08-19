<template>
  <div class="login-wrap" :style="divimg">

    <div>
      <p class="p-title">LCG我爱编码,欢迎点评</p>
    </div>
    <div class="ms-login">
      <div class="ms-title">
        欢迎使用
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="账号登录" name="first" >
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
            <el-form-item prop="username">
              <el-input v-model="ruleForm.username" placeholder="请输入用户名">
                <el-button slot="prepend" icon="iconfont icon-guanliyuanrenzheng"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item  prop="password">
              <el-input type="password" placeholder="请输入认证密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                <el-button slot="prepend" icon="iconfont icon-yuechi"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <div class="form-inline-input">
                <div class="code-box" id="code-box">
                  <input ref="coderef" type="text" name="code" class="code-input" />
                  <p></p>
                  <span style="color:#909399">
                     拖动验证
                  </span>
                </div>
              </div>
            </el-form-item>

            <el-form-item>
<!--              <el-checkbox v-model="checked"><span style="color:red">七天免登录</span></el-checkbox>-->
            </el-form-item>

            <div class="login-btn">
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            </div>
            <!-- 登录进度 -->
            <el-progress ref="jindu" :style="jindustyle"  :text-inside="true"
                         :stroke-width="18"
                         :percentage="percent"
                         status="success"></el-progress>

          </el-form>
        </el-tab-pane>
        <el-tab-pane label="手机验证登录" name="second">
          <el-form :model="ruleForm"  ref="ruleForm" label-width="0px" class="ms-content">
            <el-form-item prop="tel">
              <el-input v-model="ruleForm.tel" placeholder="请输入手机号码">
                <el-button slot="prepend" icon="iconfont icon-guanliyuanrenzheng"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item  prop="authcode">
              <el-input  placeholder="请输入验证码" v-model="ruleForm.authcode" @keyup.enter.native="submitForm('ruleForm')">
                <el-button slot="prepend" icon="iconfont icon-yuechi"></el-button>
              </el-input>
              <el-button v-show="show"   @click="getTelCode()">获取验证码</el-button>
              <el-button v-show="!show"  class="count" disabled="disabled">{{count}} 秒后重试</el-button>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="phonelogin('ruleForm')">登录</el-button>

              <el-checkbox v-model="checked">七天免登录</el-checkbox>
            </div>
          </el-form>
        </el-tab-pane>
        <div>
          <el-button type="button" @click="findPassword()">忘记密码?邮箱找回</el-button>
        </div>
      </el-tabs>

      <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="width: 900px;">
          <div class="modal-header">
          <el-steps :active="active" finish-status="success">
                <el-step title="步骤 1">
                </el-step>

                <el-step title="步骤 2">

                </el-step>

                <el-step title="步骤 3">
                </el-step>

              </el-steps>

            <div class="info" v-if="active==0">
              <el-input v-model="ruleForm.username" placeholder="输入账号"></el-input>
            </div>
            <div class="info" v-if="active==1">
              <el-input placeholder="输入邮箱" v-model="ruleForm.email"></el-input>
              <el-input  placeholder="请输入验证码" v-model="ruleForm.authcode"></el-input>
              <el-button v-show="show"   @click="getEmailCode()">获取验证码</el-button>
              <el-button v-show="!show"  class="count" disabled="disabled">{{count}} 秒后重试</el-button>
            </div>
            <div class="info" v-if="active==2">
              密码:<input type="password" id="1pwd"></input>
              确认密码:<input type="password" id="2pwd"></input>
            </div>
      </div>
        <div class="modal-body">
            <el-button style="margin-top: 12px;" @click="next">验证</el-button>
      </div>
      </div>
    </div>
  </div>

</template>

<script>
  import '../../bootstrap-3.3.7-dist/js/jquery-3.4.1.min.js'
  import '../../bootstrap-3.3.7-dist/css/bootstrap.min.css'
  import '../../bootstrap-3.3.7-dist/js/bootstrap.min.js'

    export default {
      name: "login",
      data(){
        return{
          divimg:{//背景图片的使用
            activeName: 'second',
            backgroundImage:"url(" + require('../../assets/yun.jpg') + ")",
            backgroundRepeat: "no-repeat",
            height:"100%",
            width:"100%",
            overflow:"hidden",
            backgroundSize:"cover"
          },
          percent:0,
          jindustyle:{
            display:'none'
          },
          ruleForm: {
            username:'zhangsan',
            password:'123456',
            tel:"",
            email:""
          },
          rules: {
            username: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' }
            ]
          },
          activeName: 'first',
          sendAuthCode:true,/*布尔值，通过v-show控制显示‘获取按钮'还是‘倒计时' */
          auth_time: 0, /*倒计时 计数器*/
          verification1:"",//绑定输入验证码框,
          checked:false,
          checkCode:"",
          show:true,
          count:'',
          active: 0
        }
      },
      methods:{
        getEmailCode:function(){
          var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
          if(!reg.test(this.ruleForm.email)){
            this.$notify.error({
              title: '错误',
              message: '邮箱格式有误'
            });
              return;
          }
          const TIME_COUNT = 60;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000)
          }
          this.$axios.post(this.domain.ssoserverpath+"getsendEmail",this.ruleForm).then(response=>{
            if(response.data.code==200){
              this.$message({
                message: '验证码获取成功',
                type: 'success'
              });
            }else if (response.data.code==500){
              /*alert(response.data.error);*/
              this.$message({
                message: '验证码获取失败',
                type: 'warning'
              });
            }
          }).catch(error=>{
            alert("获取code失败");
          })

        },
        next() {
          let flag = true;
          let uri;
          if(this.active == 0){
              uri = "findUserByLoginName";
          }
          if(this.active == 1){
            uri = "sendEmail";
          }
          if(this.active == 2){
            if($("#1pwd").val() != null){
              if($("#1pwd").val().length >6){
                if($("#2pwd").val() != null){
                  if($("#1pwd").val() == $("#2pwd").val()){
                    uri = "updatePasswordByLoginName";
                    this.ruleForm.password = $("#1pwd").val();
                  }else{
                    this.$notify.error({
                      title: '错误',
                      message: '两次密码不一致'
                    });
                  }
                }else {
                  this.$notify.error({
                    title: '错误',
                    message: '确认密码不可以为空'
                  });
                  flag = false;
                }
              }else{
                this.$notify.error({
                  title: '错误',
                  message: '密码长度必须大于6位!'
                });
                flag = false;
              }
            }else{
              this.$notify.error({
                title: '错误',
                message: '密码不可以为空'
              });
              flag = false;
            }

          }
          if(flag){
              this.$axios.post(this.domain.ssoserverpath+uri,this.ruleForm).then( (res)=>{
                    if(res.data.code == 200){
                      if (this.active++ == 2){
                        $("#myModal").modal("hide");
                      }
                      this.$notify({
                        title: '成功',
                        message: res.data.success,
                        type: 'success'
                      });

                    }else{
                      this.$notify.error({
                        title: '错误',
                        message: res.data.error
                      });
                    }
              } )
          }

        },
        findPassword:function(){
          $("#myModal").modal("show");
        },
        getTelCode(){
          if(this.ruleForm.tel==""){
            alert("手机号码不能为空");
            return;
          }
          const TIME_COUNT = 60;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000)
          }
          let t = this.ruleForm.tel;
          this.$axios.post(this.domain.serverpath+"selphone",{tel:t}).then(response=>{
            if(response.data.code==200){
              /*alert(response.data.success);*/
              this.$message({
                message: '验证码获取成功',
                type: 'success'
              });
            }else if (response.data.code==500){
              /*alert(response.data.error);*/
              this.$message({
                message: '验证码获取失败',
                type: 'warning'
              });
            }
          })
        },
        phonelogin:function(ruleForm){

          let par = {}
          par.tel = this.ruleForm.tel;
          par.authcode = this.ruleForm.authcode;
          if (this.ruleForm.tel == null || this.ruleForm.tel == "") {
            this.$message({
              message: '请输入手机号',
              type: 'warning'
            });
          } else if (this.ruleForm.authcode == null || this.ruleForm.authcode == "") {
            this.$message({
              message: '请输入验证码',
              type: 'warning'
            });
          } else {
            par.code = this.$refs.coderef.value;
            par.codekey = this.Cookies.get("authcode")
            this.$axios.post(this.domain.serverpath + "loginphone", par).then((response) => {
              let respo=response.data;
              console.log("0000000");

              if(respo.code==200){
                //存储token到vuex中，

                this.$store.state.token=respo.token
                this.$store.state.userInfo=respo.result;
                window.sessionStorage.setItem("userInfo",[JSON.stringify(respo.result)]);
                window.sessionStorage.setItem("userid",respo.result.id);//将userid 存入到浏览器的session(相当于后台的session)中
                window.sessionStorage.setItem("username",respo.result.userName);
                console.log(window.sessionStorage.getItem("userid"))




                //跳转到首页界面
                //将用户ID存入到全局的VUE对象中
                this.$router.push({path:'/view/show/show',query:{
                    username:response.data.result.userName,userid:response.data.result.id}
                });

              }else if(respo.error!=null){
                //关闭加载窗
                this.$data.percent=100
                //隐藏进度条
                this.$data.jindustyle.display='none'
                //关闭定时
                clearInterval(timer)
                this.$notify.error({
                  title: '提示',
                  duration:1000,
                  message: respo.error
                });
              }

            }).catch((error) => {
              this.$notify.error({
                title: '错误',
                message: '出错了~_~，请联系管理员！'
              });
            })

          }

        },
        handleClick(tab, event) {
          console.log(tab, event);
        },
        submitForm(ruleid){

          let code=this.$refs.coderef.value;
          if(code==null||code==""){
            const h = this.$createElement;
            this.$notify({
              title: '提示信息：',
              message: h('i', { style: 'font-style:normal'}, '请进行拖动校验！'),
              type: 'warning',
              duration:1500 //延时时间
            });
          }else{
            //登陆操作
            let par={};
            par.loginname=this.ruleForm.username;
            par.password=this.ruleForm.password;
            if(this.ruleForm.username==""||this.ruleForm.username==null){
              this.$notify.info({
                title: '提示',
                message: '请填写用户名'
              });
              return;
            }
            if(this.ruleForm.password==""||this.ruleForm.password==null){
              this.$notify.info({
                title: '提示',
                message: '请填写密码'
              });
              return;
            }
            par.code=this.$refs.coderef.value;
            //转JSON串
            //let canshu=this.toAes.encrypt(JSON.stringify(par));
            // let params={canshu:canshu};
            //let qs=require("qs");
            //打开登陆进度条
            this.$data.jindustyle.display='block';
            //每0.1秒更新一下进度
            var timer=setInterval(()=>{
              let pp=this.$data.percent+10;
              if(pp>=100){
                pp=99;
              }
              this.$data.percent=pp;
            },100)
            //从cookie中取出某一个名称的Cookie的值
            par.codekey=this.Cookies.get("authcode")
            this.$axios.post(this.domain.serverpath+"login",par).then((response)=>{

              let respo=response.data;
              console.log(respo.result);
              console.log("0000000");

              if(respo.code==200){
                //存储token到vuex中，


                if(this.checked){
                  setCookie("jian","zhi",7)
                }

                this.$store.state.token=respo.token
                this.$store.state.userInfo=respo.result;
                window.sessionStorage.setItem("userInfo",[JSON.stringify(respo.result)]);
                window.sessionStorage.setItem("userid",respo.result.id);//将userid 存入到浏览器的session(相当于后台的session)中
                window.sessionStorage.setItem("username",respo.result.userName);
                console.log(window.sessionStorage.getItem("userid"))



                //关闭加载窗
                this.$data.percent=100
                //隐藏进度条
                this.$data.jindustyle.display='none'
                //关闭定时
                clearInterval(timer)

                //跳转到首页界面
                //将用户ID存入到全局的VUE对象中
                this.$router.push({path:'/view/show/show',query:{
                         username:response.data.result.userName,userid:response.data.result.id}
                });

              }else if(respo.error!=null){
                //关闭加载窗
                this.$data.percent=100
                //隐藏进度条
                this.$data.jindustyle.display='none'
                //关闭定时
                clearInterval(timer)
                this.$notify.error({
                  title: '提示',
                  duration:1000,
                  message: respo.error
                });
              }

            })
          }

        },
        //拖动验证start
        getOffset(box,direction){
          var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
          var offset = box[setDirection];
          var parentBox = box.offsetParent;
          while(parentBox){
            offset+=parentBox[setDirection];
            parentBox = parentBox.offsetParent;
          }
          parentBox = null;
          return parseInt(offset);
        },
        moveCode(code,_this){
          var fn = {codeVluae : code};
          var box = document.querySelector("#code-box"),
            progress = box.querySelector("p"),
            codeInput = box.querySelector('.code-input'),
            evenBox = box.querySelector("span");
          //默认事件
          var boxEven = ['mousedown','mousemove','mouseup'];
          //改变手机端与pc事件类型
          if(typeof document.ontouchstart == 'object'){
            boxEven = ['touchstart','touchmove','touchend'];
          }
          var goX,offsetLeft,deviation,evenWidth,endX;
          function moveFn(e){
            e.preventDefault();
            e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
            endX = e.clientX - goX;
            endX = (endX > 0) ? (endX > evenWidth) ? evenWidth : endX : 0;
            if(endX > evenWidth * 0.7){
              progress.innerText = '松开验证';
              progress.style.backgroundColor = "#66CC66";
            }else{
              progress.innerText = '';
              progress.style.backgroundColor = "#FFFF99";
            }
            progress.style.width = endX+deviation+'px';
            evenBox.style.left = endX+'px';
          }
          function removeFn() {
            document.removeEventListener(boxEven['2'],removeFn,false);
            document.removeEventListener(boxEven['1'],moveFn,false);
            if(endX > evenWidth * 0.7){
              progress.innerText = '验证成功';
              progress.style.width = evenWidth+deviation+'px';
              evenBox.style.left = evenWidth+'px'
              codeInput.value = fn.codeVluae;
              evenBox.onmousedown = null;
              _this.ruleForm.verification = true;

              //alert( codeInput.value);

            }else{
              progress.style.width = '0px';
              evenBox.style.left = '0px';
            }
          };
          function getOffset(box,direction){
            var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
            var offset = box[setDirection];
            var parentBox = box.offsetParent;
            while(parentBox){
              offset+=parentBox[setDirection];
              parentBox = parentBox.offsetParent;
            }
            parentBox = null;
            return parseInt(offset);
          };
          evenBox.addEventListener(boxEven['0'], function(e) {
            e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
            goX = e.clientX,
              offsetLeft = getOffset(box,'left'),
              deviation = this.clientWidth,
              evenWidth = box.clientWidth - deviation,
              endX;
            document.addEventListener(boxEven['1'],moveFn,false);
            document.addEventListener(boxEven['2'],removeFn,false);
          },false);
          fn.setCode = function(code){
            if(code)
              fn.codeVluae = code;
          }
          fn.getCode = function(){
            return fn.codeVluae;
          }
          fn.resetCode = function(){
            evenBox.removeAttribute('style');
            progress.removeAttribute('style');
            codeInput.value = '';
          };
          return fn;
        }//拖动验证end

      },
      mounted(){
        var _this = this;
        var code = "";
        //从后台获取滑动验证码
        //参数 url 访问参数
        this.$axios.post(this.domain.serverpath+'getCode').then((response)=>{
          code=response.data.result;
          console.log(code);
          //向浏览器写一个Cookie
          //document.cookie = 'testCookies' + "=" + response.data.token + "; " + -1;
          _this.moveCode(code,_this);
        })

//});
      }
    }
</script>

<style scoped>
  .ms-title{
    width:100%;
    line-height: 50px;
    text-align: left;
    font-size:20px;
    color: #fff;
    font-style:italic;
    border-bottom: 1px solid #ddd;
  }
  .ms-login{
    position: absolute;
    left:70%;
    top:50%;
    width:350px;
    margin:-190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255,255,255, 0.3);
    overflow: hidden;
  }
  .ms-content{
    padding: 30px 30px;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
    margin-bottom: 10px;
  }
  .login-tips{
    font-size:12px;
    line-height:30px;
    color:#fff;
  }

  /** 滑动验证start **/
  .form-inline-input{
    border:1px solid #dadada;
    border-radius:5px;
  }
  .form-inline-input input,
  .code-box{
    padding: 0 3px;
    width: 290px;
    height: 40px;
    color: #fff;
    text-shadow: 0px 0px 0px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }
  .code-box{
    position: relative;
  }
  .code-box p,
  .code-box span{
    display:block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding:0;
    margin:0;
  }
  .code-box span{
    width: 40px;
    background-color:#fff;
    font-size: 16px;
    cursor: pointer;
    margin-right:1px;
  }
  .code-box p{
    width: 0;
    background-color: #FFFF99;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }
  .code-box .code-input{
    display: none;
  }
  .code-box .code-input{
    display: none;
  }
  .form-inline-input{
    border:1px solid #dadada;
    border-radius:5px;
  }
  .form-inline-input input,
  .code-box{
    padding: 0 3px;
    width: 285px;
    height: 40px;
    color: #fff;
    text-shadow: 0px 0px 0px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }
  .code-box{
    position: relative;
  }
  .code-box p,
  .code-box span{
    display:block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding:0;
    margin:0;
  }
  .code-box span{
    width: 70px;
    background-color:#fff;
    font-size: 12px;
    cursor: pointer;
    margin-right:1px;
  }
  .code-box p{
    width: 0;
    background-color: #F5F7FA;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }
  .code-box .code-input{
    display: none;
  }
  .code-box .code-input{
    display: none;
  }
  .p-title{
    color: white;
    font-size: 16px;
    text-align: left;
    padding-left: 20px;
    font-style:italic
  }
  /** 滑动验证end **/
</style>
