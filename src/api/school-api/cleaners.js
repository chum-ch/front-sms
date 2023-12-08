export default (axios)=>({
    listCleaners(){
        return axios.get(`/cleaners`)
    },
    createCleaner(data){
        return axios.post(`/cleaners`, data)
    },
    updateCleaner(data, ID){
        return axios.put(`/cleaners/${ID}`, data)
    },
    getCleaner(ID){
        return axios.get(`/cleaners/${ID}`)
    },
    deleteCleaner(ID){
        return axios.delete(`/cleaners/${ID}`)
    }
})