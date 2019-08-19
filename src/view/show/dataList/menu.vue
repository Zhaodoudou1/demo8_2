<template>
    <div>
      <h1>角色管理</h1>
      <el-button type="button" @click="insertOneRole()">添加角色</el-button>
      <template>
        <el-table
          :data="dataList"
          style="width: 100%">
          <el-table-column

            prop="roleName"
            label="角色名称"
            width="480">
          </el-table-column>

          <el-table-column
            prop="miaoShu"
            label="角色描述"
            width="480">
          </el-table-column>

          <el-table-column
            prop="button"
            label="操作">
            <template slot-scope="scope">
              <span v-if="scope.row.leval <= user.leval"><el-button><span style="color: #ff4373;">无权利进行操作</span></el-button></span>
              <span v-else>
                   <el-button type="button" @click="deleteOne(scope.row)">删除</el-button>
                   <el-button type="button" @click="bindingUser(scope.row)">绑定权限</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-dialog title="添加角色" :visible.sync="dialogForm">
        <el-form :model="entityMol">

          <el-form-item label="用户名"  >
            <el-input v-model="entityMol.roleName"></el-input>
          </el-form-item>

          <el-form-item label="角色描述"  >
            <el-input v-model="entityMol.miaoShu" ></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogForm = false">取 消</el-button>
          <el-button type="primary" @click="saveBinding()">确 定</el-button>
        </div>
      </el-dialog>


      <!-- 绑定权限弹框-->
      <el-dialog title="绑定角色权限" :visible.sync="updatedialogForm">
        <el-form :model="entityMol">

          <el-form-item label="用户名"  >
            <el-input v-model="entityMol.roleName" readonly="readonly"></el-input>
          </el-form-item>

          <el-form-item label="角色描述"  >
            <el-input v-model="entityMol.miaoShu" readonly="readonly"></el-input>
          </el-form-item>


          <!-- 树-->



          <el-tree
            :data="menuData"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updatedialogForm = false">取 消</el-button>
          <el-button type="primary" @click="Binding()">确 定</el-button>
        </div>
      </el-dialog>

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
</template>

<script>
    export default {
        name: "menu",
        data (){
          return {
            dataList:[],
            total:1,
            pageInfo:{
              pageSize:3,
              pageNum:0,
              deleteid:""
            },
            dialogForm:false,
            entityMol:{},
            updatedialogForm:false,
            menuData:[],
            defaultProps:{
              id:'id',
              children: 'menuInfoList',
              label: 'menuName',
              code:'leval',
            },
            mids:[],
            total:1,
            username:"",//用户名称==》用于删除时是否被绑定名称
            entity:{},//载体
            userid:window.sessionStorage.getItem("userid"),//浏览器session 取出当前登陆的userid
            user:{}//这是一个用户和角色关联查询的sql、主要查询角色的等级，id，名称
          }
        },
      mounted() {
          console.log("角色列表开始加载");


            this.entity.userid = this.userid;
            this.$axios.post(this.domain.ssoserverpath+"findRoleByUserId",this.entity).then( (res)=>{

                    this.user = res.data.result;
            } )

        this.selectAll();
      },
      methods:{
         selectAll:function () {
            this.$axios.post(this.domain.ssoserverpath+"selectAllRoleAndMenu",this.pageInfo).then( (res)=>{
              this.dataList =res.data.list;
              this.total =res.data.total;
            } ).catch((error)=>{
              this.$notify.error({
                title: '错误',
                message: '无权限~_~，请联系管理员！'
              });
            })
         },
        deleteOne:function (row) {
          this.pageInfo.deleteid = row.id
          this.$axios.post(this.domain.ssoserverpath+"deleteOneRole",this.pageInfo).then( (res)=>{
            if(res.data.code == 200){
              this.$message('删除成功');
              this.selectAll(0);
            }else{
              this.username = res.data.result;
              console.log( res.data.result);
              this.$notify.error({
                title: '错误',
                message: '不可删除该角色:该角色正在有'+res.data.result+'绑定中！'
              });
            }
          } ).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: '无权限~_~，请联系管理员！'
            });
          })
        },
        insertOneRole:function () {
          this.dialogForm=true;
          this.entityMol={id:0}
        },
        saveBinding:function () {
           this.entityMol.roleids = this.user.roleids;
           this.entityMol.leval = this.user.leval;
           this.$axios.post(this.domain.ssoserverpath+"insertOneRole",this.entityMol).then( (res)=>{
             if(res.data.code == 200){
               this.$notify({
                 title: '成功',
                 message: '用户添加成功',
                 type: 'success'
               });
               this.dialogForm=false;
               this.selectAll();
             }
           } ).catch((error)=>{
             this.$notify.error({
               title: '错误',
               message: '无权限~_~，请联系管理员！'
             });
           })
        },
        bindingUser:function (list) {


          this.$axios.post(this.domain.ssoserverpath+"findMenu",this.user).then((res)=>{//查询权限=》树状
            this.menuData = res.data.result;
            console.log(res.data.result);
          } )




              this.mids = null;
              this.updatedialogForm = true;
              this.entityMol = list;
                this.mids = list.ids;
              setTimeout(()=>{
                this.$refs.tree.setCheckedKeys(this.mids);
              })

        },
        Binding:function () {
          let mid=this.$refs.tree.getHalfCheckedKeys()+','+this.$refs.tree.getCheckedKeys();
          this.entityMol.mids = mid;
          this.$axios.post(this.domain.ssoserverpath+"insertRoleAndMenuAndCentre",this.entityMol).then( (res)=>{
            if(res.data.code == 200){
              this.$notify({
                title: '成功',
                message: '角色权限绑定成功',
                type: 'success'
              });
              this.mids = null;
              this.selectAll();
              this.updatedialogForm = false;
            }
          } ).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: '无权限~_~，请联系管理员！'
            });
          })

        },
      handleCurrentChange(handleCurrentChange){
        this.selectAll(
          this.pageInfo.pageNum = handleCurrentChange
        )
      },
      handleSizeChange(handleSizeChange){
        this.pageSize = handleSizeChange;
        this.selectAll(
          this.pageInfo.pageSize = handleSizeChange
        )
      },//点击每页显示的数据条数
      }
    }
</script>

<style scoped>

</style>
