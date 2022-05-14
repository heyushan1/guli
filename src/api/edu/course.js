import request from '@/utils/request' //引入已经封装好的axios 和 拦截器


export default{
    //添加课程信息功能
    addCourseInfo(courseInfo){
        return request({
            url:"/eduservice/edu-course/addCourseInfo",
            method: 'post',
            data: courseInfo,
        })
    },
    //查询所有讲师
    getAllTeacher(){
    return request({
        url:"/eduservice/edu-teacher/findAll",
        method: 'get',
    })
},
    //根据课程id 查询课程基本信息
    getCourseInfoById(courseId){
        return request({
            url:`/eduservice/edu-course/getCourseInfoById/${courseId}`,
            method: 'get',
        })
    },
    //修改课程信息
    updateCourseInfo(courseInfoForm){
        return request({
            url:"/eduservice/edu-course/updateCourseInfo",
            method: 'post',
            data: courseInfoForm,
        })
    },

    //课程确认信息显示
    getPublishCourseInfo(courseId){
        return request({
            url:"/eduservice/edu-course/getpublishCourseInfo/"+courseId,
            method: 'get',
        })
    },
    //课程最终发布
    publishCourse(courseId) {
        return request({
            url: "/eduservice/edu-course/publishCourse/" + courseId,
            method: 'post',
        })
    },
     //1 课程列表（条件查询分页）
    //current当前页 limit每页记录数 courseQuery
    getCourListPage(current,limit,courseQuery) {
        return request({
            //url: '/eduservice/edu-teacher/pageTeacherCondition/'+current+"/"+limit,
            url: `/eduservice/edu-course/pageCourseCondition/${current}/${limit}`,
            method: 'post',
            //courseQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json进行传递到接口里面
            data: courseQuery
          })
    },
    //课程列表数据查询
    getCourseList() {
        return request({
            url: "/eduservice/edu-course/getCourseList/",
            method: 'get',
        })
    },

}
