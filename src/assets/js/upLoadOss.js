import axios from 'axios'
let apis = process.env.API_ROOT

export const getPolicy = () => {
    return axios.get(apis + `oss/policy`)
};

export const stsToken = () => {
    return axios.get(apis + `oss/stsToken`)
};
