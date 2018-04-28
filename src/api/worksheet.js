/**
 * 工作表相关接口
 * 接口文档链接：http://192.168.149.92:9000/index.html
 */

import { fetch } from './base'

export default {
    worksheet: {
        getWorksheetList() {
            return fetch('get', 'sheet/list');
        },
        newFolder(folderName) {
            return fetch('post', 'folder/create', {}, { 'folderName': folderName, 'type': 0 });
        },
        deleteSheet(id) {
            return fetch('get', 'sheet/delete', { 'id': id });
        },
        deleteFolder(id) {
            return fetch('get', 'folder/delete', { 'id': id });
        },
        moveSheet(id, folderId) {
            return fetch('post', 'sheet/move', {}, { 'id': id, 'folderId': folderId });
        },
        copySheet(id, name, folderId) {
            return fetch('post', 'sheet/copy', {}, { 'id': id, 'sheetName': name, 'folderId': folderId });
        },
        renameSheet(id, name) {
            return fetch('post', 'sheet/modifyName', {}, { 'id': id, 'newName': name });
        },
        renameFolder(id, name) {
            return fetch('post', 'folder/modifyName', {}, { 'id': id, 'newName': name });
        },
        worksheetPreview(id, forceRefresh) {
            // 所有都强制刷新
            forceRefresh = true;
            return fetch('get', 'sheet/preview', { 'id': id, 'maxSize': 100, 'forceRefresh':forceRefresh});
        },
        runJoined(req) {
            return fetch('post', 'sheet/runJoined', {}, req);
        },
        saveJoined(req) {
            return fetch('post', 'sheet/saveJoined', {}, req);
        },
        getSheetDetail(id) {
            return fetch('get', 'sheet/detail', { 'id': id });
        },
        getSheetElements(id) {
            return fetch('get', 'sheet/getSheetElements', { 'sheetId': id });
        }
    }
}