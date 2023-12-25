export default (axios)=>({
    listProgresses(){
        return axios.get(`/progresses`)
    },
    createProgress(data){
        return axios.post(`/progresses`, data)
    },
    updateProgress(data, ID){
        return axios.put(`/progresses/${ID}`, data)
    },
    getProgress(ID){
        return axios.get(`/progresses/${ID}`)
    },
    deleteProgress(ID){
        return axios.delete(`/progresses/${ID}`)
    }
})
