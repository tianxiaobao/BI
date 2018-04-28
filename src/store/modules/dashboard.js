import * as types from '../mutation-types'

const state = {
    folders: [],
    reports: [],

    currentReport: {
        reportId: 0,
        reportName: '',
        charts: false,
    },
    selectReport: {},

    newFolder: {
        id: '',
        status: false,
        verfiy: false,
        value: '',
    },

    reNameFolderId: '',

    newReport: {
        verfiy: false,
        status: false,
        currentName: '',
        reprotName: '',
        reprotId: '',
        folderName: '默认文件夹',
        folderId: '',
        active: 'create'
    },
    gridster: null,
    resizeCount: 0,
    sheets: [],
    selectSheet: {},

    chartStatus: 0
}

const getters = {
    folders: state => state.folders,
    reports: state => state.reports,
    currentReport: state => state.currentReport,
    newFolder: state => state.newFolder,
    newReport: state => state.newReport,
    reNameFolderId: state => state.reNameFolderId,
    selectReport: state => state.selectReport,
    gridster: state => state.gridster,
    resizeCount: state => state.resizeCount,
    sheets: state => state.sheets,
    selectSheet: state => state.selectSheet,
    chartStatus: state => state.chartStatus
}

const mutations = {
    ['set_folders'](state, payload) {
        state.folders = payload
    },
    ['set_reports'](state, payload) {
        state.reports = payload
    },
    [types.SET_NEW_FOLDER](state, payload) {
        state.newFolder = payload
    },
    [types.SET_NEW_REPORT](state, payload) {
        state.newReport = {
            verfiy: false,
            status: false,
            currentName: '',
            reprotName: '',
            reprotId: '',
            folderName: '默认文件夹',
            folderId: '',
            active: 'create'
        }
    },
    [types.SET_RENAME_FOLDERID](state, payload) {
        state.reNameFolderId = payload
    },
    ['set_report_key'](state, payload) {
        var keys = Object.keys(payload);
        for (var i = 0; i < keys.length; i++) {
            state.newReport[keys[i]] = payload[keys[i]];
        }
    },
    ['set_currentReport_key'](state, payload) {
        var keys = Object.keys(payload);
        for (var i = 0; i < keys.length; i++) {
            state.currentReport[keys[i]] = payload[keys[i]];
        }
    },
    [types.SET_SELECT_REPORT](state, payload={layout: {}, charts: [], table: {a: 1}}) {
        const charts = payload.charts;
        const layout = payload.layout;

        if(typeof layout == 'string') {
            payload.layout = JSON.parse(payload.layout);
        }
        if(charts && charts.length) {
            charts.forEach(item => {
                item.layout = JSON.parse(item.layout);
                item.columns = JSON.parse(item.columns);
            });
        }
        state.selectReport = payload
    },
    [types.SET_GRIDSTER](state, payload) {
        state.gridster = payload;
    },
    setSheets(state, payload) {
        state.sheets = payload;
    },
    selectSheet(state, payload) {
        state.selectSheet = payload;
    },
    setResizeCount (state, payload) {
        state.resizeCount = payload;
    },
    setChartStatus (state, payload) {
        state.chartStatus = payload;
    }
}

const actions = {
    setNewFolder({ commit }, payload) {
        commit(types.SET_NEW_FOLDER, payload)
    },
    setNewReport({ commit }, payload) {
        commit(types.SET_NEW_REPORT, payload)
    },
    setRenameFolderID({ commit }, payload) {
        commit(types.SET_RENAME_FOLDERID, payload)
    },
    selectReport({ commit }, payload) {
        commit(types.SET_SELECT_REPORT, payload)
    },
    setGridster({ commit }, payload) {
        commit(types.SET_GRIDSTER, payload);
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}