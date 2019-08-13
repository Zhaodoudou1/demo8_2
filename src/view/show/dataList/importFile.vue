<template>
    <div>
        <h1>导入EXCEL</h1>
      <div style="float: left;width:50%;height:280px">

        <el-upload
          ref="elupload1"
          class="upload-demo"
          action="http://localhost:8888/test/toImportExcelData"
          :before-upload="beoreupload1"
          :auto-upload="autoupload1"
          :data="mydata1"
          :name="namefile1"
          :show-file-list="showlist"
          multiple
          :limit="1"
          :on-exceed="xianzhiwenjiangeshu"
          :file-list="fileList1">

          <el-button size="small" type="primary">点击选择文件</el-button>
          <el-button type="primary" size="small" plain
                     icon="el-icon-download"
                     @click.stop="xiazaimyban">下载Excel模板</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过10M</div>


        </el-upload>

      </div>
      <div style="width:100%">
        <el-button type="primary" @click="dianjiupload1">提交数据</el-button>

        <el-button type="primary" plain @click="chongzhi">重-置</el-button>
      </div>
    </div>
</template>

<script>
    export default {
        name: "importFile",
      data (){
          return{
            autoupload1:false,
          }
      },
      mounted() {
          console.log("EXCEL开始加载")
      },
      methods:{
        beoreupload1(file){//文件上传之前运行

        }
      }
    }
</script>

<style scoped>

</style>
