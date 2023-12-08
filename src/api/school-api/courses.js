export default (axios)=>({
    listCourses(schoolId){
        return axios.get(`schools/${schoolId}/courses`)
    },
    createCourse(schoolId, data){
        return axios.post(`schools/${schoolId}/courses`, data)
    },
    updateCourse(schoolId, data, ID){
        return axios.put(`schools/${schoolId}/courses/${ID}`, data)
    },
    getCourse(schoolId, ID){
        return axios.get(`schools/${schoolId}/courses/${ID}`)
    },
    deleteCourse(schoolId, ID){
        return axios.delete(`schools/${schoolId}/courses/${ID}`)
    }
})