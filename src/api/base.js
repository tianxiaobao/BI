import axios from 'axios'
import qs from 'qs'

export function fetch(method = 'GET', url, params = {}, data) {
    return new Promise((resolve, reject) => {
        if(method === 'get') {
            params.timer = new Date().getTime();
        }
        let options = {
            url: url,
            method: method,
            data: data,
            params: params,
            withCredentials: true,
            // timeout: 5000,
            headers: { 'Content-Type': 'application/json' },
            // transformRequest: [function(data) {
            //     return qs.stringify(data)
            // }],
        };
        axios(options)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                reject(error)
            });
    })
}