import { fetch } from './base'

export default {
	getSheetById(params) {
        return fetch('get', 'sheet/getSheetElements', params)
    },
    runView(params) {
        return fetch('post', 'sheet/design','',params)
    },
    saveView(params) {
        return fetch('post', 'sheet/saveView', '',params)
    },
    editView(params){
    	return fetch('get', 'sheet/detail', params, '')
    }
}