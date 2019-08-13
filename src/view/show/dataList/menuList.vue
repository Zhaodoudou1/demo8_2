<template>
    <div>
        <h1>权限管理</h1>

      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>


      <el-tree
        :data="menuData"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        accordion
        highlight-current
        :filter-node-method="filterNode"
        :props="defaultProps"
        @current-change="checkedCurrent"
      >
      </el-tree>






      <!-- Form -->

      <<el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="entityMol" label-width="200px" size="mini">
        <el-button type="primary" @click="toAdd()" icon="el-icon-plus" plain circle></el-button>
        <el-button type="primary" @click="toUpdate()" icon="el-icon-edit" circle></el-button>
        <el-button type="danger" @click="toDelete()" icon="el-icon-delete" circle></el-button>
        <el-button type="warning" icon="el-icon-star-off" circle></el-button>
        <el-divider></el-divider>

        <el-form-item label="当前菜单等级：">
          {{entityMol.leval}}
        </el-form-item>
        <el-form-item label="当前菜单名称：">
          {{entityMol.menuName}}
        </el-form-item>
        <el-form-item label="当前菜单ID：">
          {{entityMol.id}}
        </el-form-item>

        <el-form-item :hidden="addHidden" v-if="entityMol.leval!=4" label="新添加子菜单名称">
          <el-input v-model="entityModel.menuName"></el-input>
        </el-form-item>
        <el-form-item :hidden="addHidden" label="菜单访问URL">
          <el-input  v-model="entityModel.url"></el-input>
        </el-form-item>
        <el-form-item :hidden="updateHidden" label="修改菜单名称">
          <el-input v-model="entityMol.menuName"></el-input>
        </el-form-item>
        <el-form-item :hidden="updateHidden" label="菜单访问URL">
          <el-input v-model="entityMol.url"></el-input>
        </el-form-item>
        <el-form-item :hidden="deleteHidden" label="">
          你确定删除此条数据吗？
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "menuData",
        data (){
          return{
            filterText: '',
            menuData:[],
            defaultProps:{
              id:'id',
              children: 'menuInfoList',
              label: 'menuName',
              code:'leval'
            },
            dialogFormVisible:false,
            addHidden:false,
            updateHidden:true,
            deleteHidden:true,
            entityMol:{},
            entityModel:{},
            rolename:""
          }
        },
      watch: {
        filterText(val) {
          this.$refs.tree.filter(val);
        }
      },
      mounted() {
          console.log("权限列表开始加载")
          this.selectAll();
      },
      methods:{
          selectAll:function(){
            this.$axios.post(this.domain.ssoserverpath+"selectAllMenu").then((res)=>{
              this.menuData = res.data;
            } )
          },
        filterNode(value, data) {
          if (!value) return true;
          return data.menuName.indexOf(value) !== -1;
        },
        checkedCurrent:function (data) {
          this.dialogFormVisible = true;
          // 共两个参数，依次为：当前节点的数据，当前节点的 Node 对象
          this.entityMol = data;
        },
        save(){

          let uri = "";
          alert(this.entityModel.id)
          if(this.entityModel.id == 0){
            alert("进入添加方法")
            uri = this.domain.ssoserverpath + 'insertMenu';
            this.entityModel.id = this.entityMol.id;
            this.entityModel.leval = this.entityMol.leval;
          }else if(this.entityModel.id == 35){
            alert("进入删除")
            uri = this.domain.ssoserverpath+"deleteMenu";
            this.entityModel.id=this.entityMol.id;
          } else if(this.entityMol.id > 0){
            alert("进入修改方法")
            uri = this.domain.ssoserverpath+"updateMenu"
            this.entityModel = this.entityMol
          }

          this.$axios.post(uri,this.entityModel).then( (res)=>{
            if(res.data.code == 200){
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success'
              })
              }else{
              this.rolename = res.data.result;
              console.log(res.data.result);
              this.$notify.error({
                title: '错误',
                message: '该权限正在被'+res.data.result+'绑定中'
              });
              this.selectAll();
              this.dialogFormVisible = false;
              uri =null;
            }
          } ).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: '无权限~_~，请联系管理员！'
            });
          })
        },
        close(){
          this.entityMol={};
          this.dialogFormVisible=false;
        },
        toDelete(){
          this.entityModel={id:35}
          this.updateHidden=true;
          this.deleteHidden=false;
          this.addHidden=true;
        },
        toUpdate(){
          this.entityModel.id = this.entityMol.id;
          this.entityMol.menuName=this.entityMol.menuName;
          this.entityMol.url=this.entityMol.url;
          this.updateHidden=false;
          this.deleteHidden=true;
          this.addHidden=true;
        },
        toAdd(){
          this.entityModel={id:0};
          this.initCRUD();
        },
        initCRUD(){
          if(this.entityMol.leval==4){
            this.updateHidden=false;
            this.deleteHidden=true;
            this.addHidden=true;
            this.toUpdate();
          }else {
            this.entityMol.menuName = this.entityMol.menuName;
            this.updateHidden=true;
            this.deleteHidden=true;
            this.addHidden=false;
          }
        }
      }
    }
</script>

<style scoped>

</style>
