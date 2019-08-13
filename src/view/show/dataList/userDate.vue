<template>
    <div>
            <h1>用户管理页面</h1>
      <el-button type="text" @click="insertOneUser()">添加</el-button>
      用户名:<el-input style="width: 100px" id="like" v-model="pageInfo.likeUserName"></el-input>
      创建时间:<el-input type="date" style="width: 150px" v-model="pageInfo.start"></el-input> --》<el-input type="date" v-model="pageInfo.end" style="width: 150px"></el-input>
      性别:<el-select v-model="pageInfo.sex">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" >
      </el-option>
          </el-select>
      <el-button type="primary" @click="export2Excel()">导出Excel</el-button>
      <el-button type="button"   @click="selectAll()">点击查询</el-button>
      <template>
        <el-table
          :data="dataList"
          stripe
          style="width: 100%">
                <el-table-column
                  prop="userName"
                  label="用户名"
                  width="180">
                </el-table-column>


              <el-table-column
                prop="loginName"
                label="登陆名称"
                width="180">
              </el-table-column>


              <el-table-column
                prop="sex"
                label="性别">
              </el-table-column>

              <el-table-column
                prop="tel"
                label="电话">
              </el-table-column>
              <el-table-column
                prop="imgUrl"
                label="头像"
                width="100"
              >
                <template slot-scope="scope">
                  <el-image
                    class="preview-img"
                    :src="'http://localhost:8090/'+scope.row.imgUrl"
                    @click="open()"></el-image>
                </template>
              </el-table-column>

            <el-table-column
              prop="roleNames"
              label="已经绑定的角色"
              width="180"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.roleNames == null ">还未绑定角色</span>
                <span v-else>{{scope.row.roleNames}}</span>
              </template>
            </el-table-column>

              <el-table-column
                prop="button"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="button" @click="deleteOne(scope.row)">删除</el-button>
                  <el-button type="button" @click="updateOne(scope.row)">编辑</el-button>
                  <el-button type="button" @click="bindingUser(scope.row)">绑定角色</el-button>
                </template>
              </el-table-column>
            </el-table>
      </template>

      <div class="block">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[3, 5, 10, 15]"
          :page-size=this.pageInfo.pageSize
          layout="sizes, prev, pager, next"
          :total=total
        >
        </el-pagination>
      </div>



      <el-dialog title="编辑角色" :visible.sync="dialogFormVisible">
        <el-form :model="entityMol">

          <el-form-item label="用户名" >
            <el-input v-model="entityMol.userName" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="账号" >
            <el-input v-model="entityMol.loginName"

            ></el-input>
          </el-form-item>



          <el-form-item label="性别" >
            <el-radio v-model="entityMol.sex" label="男">男</el-radio>
            <el-radio v-model="entityMol.sex" label="女">女</el-radio>

          </el-form-item>

          <el-form-item label="电话" >
            <el-input v-model="entityMol.tel"></el-input>
          </el-form-item>


          <el-form-item label="头像" >
          <el-upload
            class="avatar-uploader"
            action="http://localhost:10000/business/auth/imgUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
        </div>
      </el-dialog>



      <!-- 绑定角色的弹框 -->

      <el-dialog title="用户绑定角色" :visible.sync="dialogForm">
        <el-form :model="entityMol">

          <el-form-item label="用户名"  >
            <el-input v-model="entityMol.userName"  readonly="readonly"></el-input>
          </el-form-item>

          <el-form-item label="绑定的角色"  >
          <el-select v-model="value">
            <el-option
                  v-for="item in role"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id" >
            </el-option>
          </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogForm = false">取 消</el-button>
          <el-button type="primary" @click="saveBinding()">确 定</el-button>
        </div>
      </el-dialog>







    <!--增加角色 -->

      <el-dialog title="增加角色" :visible.sync="FormVisible">
        <el-form :model="entityMol">

          <el-form-item label="用户名" >
            <el-input v-model="entityMol.userName" autocomplete="off"  ></el-input>
          </el-form-item>

          <el-form-item label="登陆名" >
            <el-input v-model="entityMol.loginName" autocomplete="off"  @blur="selectUserName()"></el-input>
          </el-form-item>



          <el-form-item label="性别" >
            <el-radio v-model="entityMol.sex" label="男">男</el-radio>
            <el-radio v-model="entityMol.sex" label="女">女</el-radio>
          </el-form-item>

          <el-form-item label="电话" >
            <el-input v-model="entityMol.tel"></el-input>
          </el-form-item>

          <el-form-item label="密码">
            <input  style="width: 700px;height: 30px;"   type="password"  id="1pwd"></input>
          </el-form-item>
          <el-form-item label="确认密码" >
            <input style="width: 700px;height: 30px;" type="password" id="2pwd"  ></input>
          </el-form-item>




          <el-form-item label="头像" >
            <el-upload
              class="avatar-uploader"
              action="http://localhost:10000/business/auth/imgUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="FormVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertOne()">确 定</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "userDate",
      data (){
          return{
            dataList:[],//列表全查   集合
            pageInfo:{
              likeUserName:"",//模糊查询名字
              start:"",//区间查询开始日期
              end:"",//区间查询结束日期
              sex:"",//条件查询的性别
              pageSize:3,//每一页显示的数据
              pageNum:0,//当前页
              deleteid:""//删除的id
            },
            pageTotal:1,
            options:[{
                value:'',
                label:'全部',
            }, {
              value: '男',
              label: '男'
            },
              {
              value:'女',
              label:'女'
            }],
            entityMol:{},//对象：编辑回显  添加
            dialogFormVisible:false,
            imageUrl: '',//图片地址
            dialogForm:false,
            FormVisible:false,
            total:1,//总条数
            role:[],//角色
            value:"",//绑定角色时候  v-model
            bool:false//验证账号是否唯一开关
          }
      },
      mounted() {
          console.log("开始加载");
          this.selectAll();
          this.$axios.post(this.domain.ssoserverpath+"selectAllRole").then( (res)=>{
              this.role = res.data;
          } )
      },
      methods:{
          selectAll:function () {
              this.$axios.post(this.domain.ssoserverpath+"selectAll",this.pageInfo).then( (res)=>{
                this.dataList =res.data.list;
                this.total =res.data.total;
              } )
          },//全查方法
        handleCurrentChange(handleCurrentChange){
          this.selectAll(
            this.pageInfo.pageNum = handleCurrentChange
          )
        },//当前页发生变化
        handleSizeChange(handleSizeChange){
            this.pageSize = handleSizeChange;
            alert(handleSizeChange+"每页条数")
          this.selectAll(
            this.pageInfo.pageSize = handleSizeChange
          )
        },//点击每页显示的数据条数
        deleteOne:function(row){
            this.pageInfo.deleteid = row.id
            this.$axios.post(this.domain.ssoserverpath+"deleteOne",this.pageInfo).then( (res)=>{
                  if(res.data.code == 200){
                    this.$message('删除成功');
                    this.selectAll(0);
                  }

            } ).catch((error)=>{
                this.$notify.error({
                  title: '错误',
                  message: '无权限~_~，请联系管理员！'
                });
            })
        },//删除用户
        updateOne:function (list) {
            this.imageUrl = "http://localhost:8090/"+list.imgUrl
            this.entityMol = list;
            this.dialogFormVisible=true;
        },//点击编辑后 需要做的操作
        handleAvatarSuccess(res, file) {
          this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },
        save:function(){
            alert(this.entityMol.id)
            this.$axios.post(this.domain.ssoserverpath+"updateOne",this.entityMol).then( (res)=>{
                  if(res.data.code == 200){
                    this.$message('编辑个人信息成功');
                    this.selectAll(0);
                    this.dialogFormVisible=false;
                    this.entityMol = null;
                  }
            } ).catch((error)=>{
              this.$notify.error({
                title: '错误',
                message: '无权限~_~，请联系管理员！'
              });
            })
        },//修改
        bindingUser:function (list) {
            this.entityMol = list;
            this.dialogForm = true;
        },
        saveBinding:function(){

        },
        insertOne:function () {//添加方法
            let falg  = true;//判断非空的开关
          if(this.entityMol.userName == null){
            this.$notify.error({
              title: '错误',
              message: '名称不可以为空!!!'
            });
            falg  = false
          } else if($("#1pwd").val().length <= 6){
            this.$notify.error({
              title: '错误',
              message: '密码必须大于6位数!!!'
            });
            falg  = false
            }else if(this.entityMol.sex ==null){
                  this.$notify.error({
                    title: '错误',
                    message: '性别为必填项'
                  });
            falg  = false
            }else if(this.entityMol.tel != null){
                var reg = /^1([3-9][0-9]|4[5-9]|5[0-3,5-9]|66|7[0-8]|9[89])[0-9]{8}$/;
                if(!reg.test(this.entityMol.tel)){
                  this.$notify.error({
                    title: '错误',
                    message: '手机号格式不正确'
                  });
                  falg  = false
                }
            }else if(this.entityMol.tel == null){
                  this.$notify.error({
                    title: '错误',
                    message: '手机号不可以为空'
                  });
                   falg  = false
          } else  if($("#1pwd").val() != null && $("#2pwd").val() != null){

              if($("#1pwd").val() == $("#2pwd").val()){
                this.entityMol.password = $("#1pwd").val();
                this.$notify({
                  title: '成功',
                  message: '两次密码一致',
                  type: 'success'
                });
              }else{
                this.$notify.error({
                  title: '错误',
                  message: '两次输入的密码不一致'
                });
                falg  = false
              }

            }else{
              this.$notify.error({
                title: '错误',
                message: '输入密码'
              });
            falg  = false
            }
          if(this.bool){
            if (falg) {
              //  this.$refs.upload.submit();
               this.$axios.post(this.domain.ssoserverpath+"insertOneUser",this.entityMol).then( (res)=>{
                     if(res.data.code == 200){
                       this.$notify({
                         title: '成功',
                         message: '用户添加成功',
                        type: 'success'
                       });
                       this.selectAll();
                       this.FormVisible = false;
                     }
               } ).catch((error)=>{
                 this.$notify.error({
                   title: '错误',
                   message: '无权限~_~，请联系管理员！'
                 });
               })
            }
          }
        },
        insertOneUser:function () {
          this.entityMol={id:0};
          $("#1pwd").val()==null;
          $("#2pwd").val()==null;
          this.FormVisible=true;
        },//添加按钮先做的操作
        saveBinding:function () {
                this.entityMol.roleValue = this.value;
                this.$axios.post(this.domain.ssoserverpath+"insertRoleAndUserCertont",this.entityMol).then( (res)=>{
                  if(res.data.code == 200){
                    this.$notify({
                      title: '成功',
                      message: '绑定成功',
                      type: 'success'
                    });
                    this.dialogForm = false;
                    this.selectAll();
                    this.value =null;
                  }
                } ).catch((error)=>{
                  this.$notify.error({
                    title: '错误',
                    message: '无权限~_~，请联系管理员！'
                  });
                })
        },//绑定角色
        export2Excel() {
            alert("--------Excel---------")
          require.ensure([], () => {
            const { export_json_to_excel } = require('../../../excel/export2Excel');
            const tHeader = ['序号', '名称', '登陆名称','密码','性别','tel',];
            // 上面设置Excel的表格第一行的标题
            const filterVal = ['id', 'userName', 'loginName','password','sex','tel'];
            // 上面的index、phone_Num、school_Name是tableData里对象的属性
            const list = this.dataList;  //把data里的tableData存到list
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, '列表excel');
          })
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        } ,
        selectUserName:function () {
            var reg = /[A-Za-z]+[0-9]+$/;   //正则验证账号
          let flag = false;
            //alert(this.entityMol.loginName.length)

          if(this.entityMol.loginName != null) {
            if (this.entityMol.loginName.length >= 6 && this.entityMol.loginName.length <= 15) {
              flag = true;
              if (reg.test(this.entityMol.loginName)) {
                if (flag) {

                  this.$axios.post(this.domain.serverpath + "selectUserName", this.entityMol.loginName).then((res) => {
                    if (res.data.code == 200) {
                      this.bool = true;
                      this.$message({
                        showClose: true,
                        message: '恭喜你,该用户名可以被使用~',
                        type: 'success'
                      });
                    } else {
                      this.$message({
                        showClose: true,
                        message: '用户名已经被重复不可以使用',
                        type: 'warning'
                      });
                    }
                  }).catch(error => {
                    this.$notify.error({
                      title: '错误',
                      message: '出错了~_~，请联系管理员！'
                    });
                  })
                }

              } else {
                this.$message({
                  showClose: true,
                  message: '请检查！账号中必须有字母,数字结合,不允许有其他非法字符',
                  type: 'error'
                });
              }
            } else {
              this.$message({
                showClose: true,
                message: '账号长度必须要大于等于6!!!小于15长度',
                type: 'error'
              });
            }
          }else {
            this.$message({
              showClose: true,
              message: '输入账号!!!',
              type: 'error'
            });
          }//判断账号是否唯一！

        }






      }
    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
