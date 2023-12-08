// 

import Students from './students';
import Trainers from './trainers';
import Cleaners from './cleaners';
export default axios =>({
    student:()=>{
        return Students(axios)
    },
    trainer:()=>{
        return Trainers(axios)
    },
    cleaner:()=>{
        return Cleaners(axios)
    },
})