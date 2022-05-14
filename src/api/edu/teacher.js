import request from '@/utils/request'
export default {
    //1 讲师列表（条件查询分页）
    //current当前页 limit每页记录数 teacherQuery条件对象
    getTeacherListPage(current,limit,teacherQuery) {
        return request({
            //url: '/eduservice/edu-teacher/pageTeacherCondition/'+current+"/"+limit,
            url: `/eduservice/edu-teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json进行传递到接口里面
            data: teacherQuery
          })
    },
   
    //添加讲师
    addTeacher(teacher) {
        return request({
            url: `/eduservice/edu-teacher/save`,
            method: 'post',
            data: teacher
          })
    },
     //根据id删除讲师
     removeById(id){
        return request({
            url: `/eduservice/edu-teacher/deleteTeacherById/${id}`,
            method: 'delete',
        })
    },
    //根据id查询讲师
        getTeacherInfo(id){
            return request({
                url: `/eduservice/edu-teacher/getById/${id}`,
                method: `get`,
    })
},
//修改讲师信息
updateTeacherInfo(teacher){
    return request({
        url: `/eduservice/edu-teacher/updateById`,
        method: `post`,
        data: teacher
    })
},



}
