export default (axios)=>({
    listSchools(){
        return axios.get(`/schools`)
    },
    createSchool(data){
        return axios.post(`/schools`, data)
    },
    updateSchool(data, ID){
        return axios.put(`/schools/${ID}`, data)
    },
    getSchool(ID){
        return axios.get(`/schools/${ID}`)
    },
    deleteSchool(ID){
        return axios.delete(`/schools/${ID}`)
    }
})
