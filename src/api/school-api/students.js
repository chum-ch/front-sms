export default (axios)=>({
    uploadImage(studentId, data){
        return axios.post(`/students/${studentId}/upload-images`, data)
    },
    allStudentInSchool(schoolId){
        return axios.get(`/schools/${schoolId}/students`)
    },
    listStudents(schoolId, generationId){
        return axios.get(`/schools/${schoolId}/generations/${generationId}/students`)
    },
    createStudent(schoolId, generationId, data){
        return axios.post(`/schools/${schoolId}/generations/${generationId}/students`, data)
    },
    updateStudent(schoolId, generationId, data, ID){
        return axios.put(`/schools/${schoolId}/generations/${generationId}/students/${ID}`, data)
    },
    getStudent(schoolId, generationId, ID){
        return axios.get(`/schools/${schoolId}/generations/${generationId}/students/${ID}`)
    },
    deleteStudent(schoolId, generationId, ID){
        return axios.delete(`/schools/${schoolId}/generations/${generationId}/students/${ID}`)
    },
    
})