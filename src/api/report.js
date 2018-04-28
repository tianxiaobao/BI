import { fetch } from './base'
import axios from 'axios'

function fetch_post(method = 'GET', url, params) {
    return new Promise((resolve, reject) => {
        let options = {
            withCredentials: true,
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' }
        };
        axios.post(url, params, options)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                reject(error)
            });
    })
}

export default {
    /**
     * 报表列表
     * @param {Object} params
     */
    getCount(params) {
        return fetch('get', 'share/getCount', params)
    },

    resetCount(params) {
        return fetch('post', 'share/resetCount', params)
    },

    updateCount(params) {
        return fetch('post', 'share/updateCount', params)
    },

    reportList(params) {
        return fetch('get', 'report/list', params)
    },
    getUserName(params) {
        return fetch('get', 'system/user', params)
    },
    reportCreate(params) {
        return fetch('post', 'report/create', params)
    },
    createNewFolder(params) {
        return fetch_post('post', 'folder/create', params)
    },
    deleteFolder(params) {
        return fetch('get', 'folder/delete', params)
    },
    modifyFolderName(params) {
        return fetch_post('post', 'folder/modifyName', params)
    },
    createReport(params) {
        return fetch_post('post', 'report/create', params)
    },
    renameReport(params) {
        return fetch_post('post', 'report/modifyName/' + params.id, params);
    },
    copyReport(params) {
        return fetch_post('post', 'report/copy/' + params.id, params);
    },
    moveReport(params) {
        var obj = {
            folderId: params.folderId
        }
        return fetch_post('post', 'report/move/' + params.id, obj);
    },
    deleteReport(params) {
        return fetch('get', 'report/delete/' + params.id, params);
    },

    reportDetail(params) {
        return fetch('get', 'report/detail/' + params.id, params);
    },
    updateReport(params) {
        return fetch_post('post', 'report/update/' + params.id, params);
    },
    getData(params) {
        return fetch('get', 'chart/getData/' + params.id, params);
    },
    deleteChart(params) {
        return fetch('get', 'chart/delete/' + params.id, params);
    },
    shareGenerate(params) {
        return fetch_post('post', 'share/generate', params)
    },
    shareUpdate(params) {
        return fetch_post('post', 'share/update', params)
    }
}