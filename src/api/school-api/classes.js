export default (axios)=>({
    listClasses(schoolId){
        return axios.get(`/schools/${schoolId}/classes`)
    },
    createClass(schoolId, data){
        return axios.post(`/schools/${schoolId}/classes`, data)
    },
    updateClass(schoolId, data, ID){
        return axios.put(`/schools/${schoolId}/classes/${ID}`, data)
    },
    getClass(schoolId, ID){
        return axios.get(`/schools/${schoolId}/classes/${ID}`)
    },
    deleteClass(schoolId, ID){
        return axios.delete(`/schools/${schoolId}/classes/${ID}`)
    }
})