import { fetch } from './base'

export default {
	getWorksheetList(params) {
        return fetch('get', 'sheet/list', params)
    },
    runSql(params) {
        return fetch('post', 'sheet/runSql', '', params)
    },
    saveSql(params) {
        return fetch('post', 'sheet/saveSql', '', params)
    },
    editSql(params){
    	return fetch('get', 'sheet/detail', params, '')
    },
    listForSql(params){
        return fetch('get', 'sheet/listForSql', params, '')
    }
}