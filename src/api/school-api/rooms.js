export default (axios)=>({
    downloadColumnTemplate(schoolId){
        return axios.get(`/schools/${schoolId}/download-rooms`, { showLoading: false })
    },
    uploadFile(schoolId, data){
        return axios.post(`/schools/${schoolId}/upload-rooms`, data, { showLoading: false })
    },
    listRooms(schoolId){
        return axios.get(`/schools/${schoolId}/rooms`)
    },
    createRoom(schoolId, data){
        return axios.post(`/schools/${schoolId}/rooms`, data)
    },
    updateRoom(schoolId, data, ID){
        return axios.put(`/schools/${schoolId}/rooms/${ID}`, data)
    },
    getRoom(schoolId, ID){
        return axios.get(`/schools/${schoolId}/rooms/${ID}`)
    },
    deleteRoom(schoolId, ID){
        return axios.delete(`/schools/${schoolId}/rooms/${ID}`)
    }
})