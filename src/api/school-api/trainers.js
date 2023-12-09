export default (axios)=>({
    listTrainers(schoolId){
        return axios.get(`/schools/${schoolId}/trainers`)
    },
    createTrainer(schoolId, data){
        return axios.post(`/schools/${schoolId}/trainers`, data)
    },
    updateTrainer(schoolId, data, ID){
        return axios.put(`/schools/${schoolId}/trainers/${ID}`, data)
    },
    getTrainer(schoolId, ID){
        return axios.get(`/schools/${schoolId}/trainers/${ID}`)
    },
    deleteTrainer(schoolId, ID){
        return axios.delete(`/schools/${schoolId}/trainers/${ID}`)
    }
})