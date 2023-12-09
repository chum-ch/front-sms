export default (axios)=>({
    listGenerations(schoolId){
        return axios.get(`/schools/${schoolId}/generations`)
    },
    createGeneration(schoolId, data){
        return axios.post(`/schools/${schoolId}/generations`, data)
    },
    updateGeneration(schoolId, data, ID){
        return axios.put(`/schools/${schoolId}/generations/${ID}`, data)
    },
    getGeneration(schoolId, ID){
        return axios.get(`/schools/${schoolId}/generations/${ID}`)
    },
    deleteGeneration(schoolId, ID){
        return axios.delete(`/schools/${schoolId}/generations/${ID}`)
    }
})