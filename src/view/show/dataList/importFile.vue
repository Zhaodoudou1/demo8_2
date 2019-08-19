<template>
    <div>
        <h1>导入EXCEL</h1>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="https://localhost:9999/auth/business/addExcel"
        :before-upload="beforeUpload"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <el-button type = "button" @click="exportChooseExcel()">下载模板</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过一个</div>

      </el-upload>


    </div>
</template>

<script>
    export default {
        name: "importFile",
      data (){
          return{
            autoupload1:false,
            dataList:[]
          }
      },
      mounted() {
          console.log("EXCEL开始加载")
      },
      methods:{
        //判断上传格式
        beforeUpload(file) {
          var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
          const extension = testmsg === 'xls'
          const extension2 = testmsg === 'xlsx'
          if(!extension && !extension2) {
            this.$message({
              message: '上传文件只能是 xls、xlsx格式!',
              type: 'warning'
            });
          }
          return extension || extension2
        },
        //手动上传服务器
        submitUpload(){
          this.$refs.upload.submit();
        },
        exportChooseExcel() {
          require.ensure([], () => {
            const { export_json_to_excel } = require('../../../excel/export2Excel');
            const tHeader = [ '序号','名称', '登陆名称','密码','性别','tel',];
            // 上面设置Excel的表格第一行的标题
            const filterVal = ['id','userName', 'loginName','password','sex','tel'];
            // 上面的index、phone_Num、school_Name是tableData里对象的属性
            const list = this.dataList;  //把data里的tableData存到list
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, '列表excel');
          })
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        } ,
      }
    }
</script>

<style scoped>

</style>
