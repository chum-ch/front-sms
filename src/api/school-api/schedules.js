export default (axios)=>({
    downloadColumnTemplate(schoolId, showLoading = {}){
        return axios.get(`/schools/${schoolId}/download-schedules`, showLoading)
    },
    uploadFile(schoolId, data, showLoading = {}){
        return axios.post(`/schools/${schoolId}/upload-schedules`, data, showLoading)
    },
    listSchedules(schoolId, showLoading = {}){
        return axios.get(`schools/${schoolId}/schedules`, showLoading)
    },
    createSchedule(schoolId, data){
        return axios.post(`schools/${schoolId}/schedules`, data)
    },
    updateSchedule(schoolId, data, ID){
        return axios.put(`schools/${schoolId}/schedules/${ID}`, data)
    },
    getSchedule(schoolId, ID){
        return axios.get(`schools/${schoolId}/schedules/${ID}`)
    },
    deleteSchedule(schoolId, ID){
        return axios.delete(`schools/${schoolId}/schedules/${ID}`)
    }
})