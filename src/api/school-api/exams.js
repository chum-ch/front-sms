export default (axios)=>({
    listExams(schoolId){
        return axios.get(`/schools/${schoolId}/exams`)
    },
    submitExam(schoolId, examId, data){
        return axios.post(`/schools/${schoolId}/exams/${examId}/submits`, data)
    },
    createExam(schoolId, data){
        return axios.post(`/schools/${schoolId}/exams`, data)
    },
    updateExam(schoolId, data, ID){
        return axios.put(`/schools/${schoolId}/exams/${ID}`, data)
    },
    getExam(schoolId, ID){
        return axios.get(`/schools/${schoolId}/exams/${ID}`)
    },
    deleteExam(schoolId, ID){
        return axios.delete(`/schools/${schoolId}/exams/${ID}`)
    }
})