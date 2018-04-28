import { fetch } from './base'
import axios from 'axios'


function fetch_post(method = 'GET', url, params) {
    return new Promise((resolve, reject) => {
        let options = {
            withCredentials: true,
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' }
        };
        axios.post(url,params,options)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                reject(error)
            });
    })
}

export default {
    preview(params) {
        return fetch('get', 'sheet/preview', params)
    },

    chart_design(params) {
        return fetch('post', 'chart/design','',params)
    },

    sheetList(params) {
        return fetch('get', 'sheet/list', params)
    },

    chartSave(params){
    	return fetch_post('post','chart/save',params)
    },

    getChart(params){
    	return fetch('get', 'chart/detail/' + params.id, params);
    },

    getShare(params){
        return fetch('get', 'share/getInfo', params);
    }

}