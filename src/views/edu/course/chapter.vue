<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

<el-button type="text" @click="openChapterDialog()">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
        <li
            v-for="chapter in chapterVideoList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}

                <span class="acts">
                    <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                    <el-button style="" type="text" @click="openEditChatper(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                </span>
            </p>

            <!-- 视频 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}

                <span class="acts">
                    
                    <el-button style="" type="text" @click="openEditVideo(video.id)">编辑</el-button>
                    <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>
    <div>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
<el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
  <el-form :model="video" label-width="120px">
    <el-form-item label="课时标题">
      <el-input v-model="video.title"/>
    </el-form-item>
    <el-form-item label="课时排序">
      <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
    </el-form-item>
    <el-form-item label="是否免费">
      <el-radio-group v-model="video.free">
        <el-radio :label="true">免费</el-radio>
        <el-radio :label="false">默认</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="上传视频">
      <!-- TODO -->
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
    <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from "@/api/edu/video.js";

export default {
    data() {
        return {
            saveBtnDisabled:false,
            courseId:'',//课程id
            chapterVideoList:[],
            chapter:{ //封装章节数据
                title: '',
                sort: 0
            },
            video: {
                title: '',
                sort: 0,
                free: 0,
                videoSourceId: ''
            },
            //章节弹框
            dialogChapterFormVisible:false,
            //小节弹框
            dialogVideoFormVisible:false, 
            saveVideoBtnDisabled:false
        }
    },
  created() {
    //获取路由里的id值
    if(this.$route.params && this.$route.params.id){
      this.courseId = this.$route.params.id
    }
    //根据课程id查询对应的课程章节和小结
    this.getChapterVideoByCourseId();
  },

    methods:{
//小节设置///////////////////////////////////////////     
        openVideo (chapterId){
          //清空之前的数据
           this.video = {};
          //弹框
            this.dialogVideoFormVisible = true;  
          //设置章节id
          this.video.chapterId = chapterId
        },
    //添加小节
    addVideo() {
      //设置课程id
      this.video.courseId = this.courseId;
      video.addVideo(this.video).then((resp) => {
        //关闭弹框
        this.dialogVideoFormVisible = false;
        //提示信息
        this.$message({
          message: "添加小节成功",
          type: "success",
        });
        //刷新页面
        this.getChapterVideoByCourseId();
      });
    },
    //删除小节
    removeVideo(videoId) {
      this.$confirm("此操作将永久删除小节信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //点击确定，执行then方法
        video.deleteById(videoId).then((resp) => {
          //删除成功
          //提示信息
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          //刷新页面
          this.getChapterVideoByCourseId();
        });
      });
    },
      openEditVideo(videoId){
          //修改小节表单回显
          
            //弹出小节弹窗
            this.dialogVideoFormVisible = true;
            video.getVideoById(videoId).then((resp) => {
              this.video = resp.data.video;
            });
          

      },
    //小节修改
    updateVideorById(videoId) {
      //设置小节id到video对象中
      this.video.courseId = this.courseId;
      video.updateVideo(this.video).then((resp) => {
        //关闭弹框
        this.dialogVideoFormVisible = false;
        //提示信息
        this.$message({
          message: "修改小节成功",
          type: "success",
        });
        //刷新页面
        this.getChapterVideoByCourseId();
      });
    },



        saveOrUpdateVideo(){
            //判断video中是否有id值
        if (this.video.id) {
            //有id值，为修改
            this.updateVideorById();
        } else {
            //没id值，为添加
            this.addVideo();
        }
        },
//章节设置///////////////////////////////////////////        
            //删除章节
            removeChapter(chapterId) {
            this.$confirm("此操作将永久删除章节信息, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                //点击确定，执行then方法
                chapter.deleteById(chapterId).then((resp) => {
                //删除成功
                //提示信息
                this.$message({
                    type: "success",
                    message: "删除成功!",
                });
                //刷新页面
                this.getChapterVideoByCourseId();
                });
            });
            },

        //修改章节弹框数据回显
        openEditChatper(chapterId) {
            //弹框
            this.dialogChapterFormVisible = true
            //调用接口
            chapter.updateChapterById(chapterId)   
                .then(response => {
                    this.chapter = response.data.chapter
                })
        },
        //弹出添加章节页面
        openChapterDialog() {
            //弹框
            this.dialogChapterFormVisible = true
            //表单数据清空
            this.chapter.title = ''
            this.chapter.sort = 0
        },

        //添加章节
    saveChapter() {
      //设置课程id到chapter里
        this.chapter.courseId = this.courseId
          chapter.addChapter(this.chapter)
                .then(response =>{
                    //关闭弹框
                    this.dialogChapterFormVisible =false
                    //提示
                    this.$message({
                        type:"success",
                        message:'添加章节成功'

                    })
                    //刷新页面
                    this.getChapterVideoByCourseId()
                })
    },
    //修改章节
    updateChapter(){
    //设置课程id到chapter里
        this.chapter.courseId = this.courseId
          chapter.updateChapter(this.chapter)
                .then(response =>{
                    //关闭弹框
                    this.dialogChapterFormVisible =false
                    //提示
                    this.$message({
                        type:"success",
                        message:'修改章节成功'

                    })
                    //刷新页面
                    this.getChapterVideoByCourseId()
    })
    },
    //判断是修改还是新增
        saveOrUpdate() {
        //判断chapter中是否有id值
        if (this.chapter.id) {
            //有id值，为修改
            this.updateChapter();
        } else {
            //没id值，为添加
            this.saveChapter();
        }
        },

   //根据课程id查询对应的课程章节和小结
    getChapterVideoByCourseId(){
        chapter.getChapterVideoByCourseId(this.courseId)
          .then(resp=>{
            this.chapterVideoList =  resp.data.allChapterVideo
          })
    },

        previous() {
            this.$router.push({path:'/course/info/'+this.courseId})
        },
        next() {
            //跳转到第二步
            this.$router.push({path:'/course/publish/'+this.courseId})
        }

        },

        
     
    }

</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>