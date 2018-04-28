import * as types from '../mutation-types'

const state = {
    sheetElement: [],
    tableData: {
        header: [
        // {
        //     sheetId: 'SHEET_2CFV2JYWY_20170512182234',
        //     columnName: 'aaa',
        //     columnAlias: 'aaa',
        //     edited: false,
        // }, {
        //     sheetId: 'SHEET_2CFV2JYWY_20170512182234',
        //     columnName: 'bbb',
        //     columnAlias: 'bbb',
        //     edited: false,
        // }
        ],
        value: [
        ]
    },
    activeSheet: {
        id: null,
        name: null,
        type: null,
        dependSheetId : null
    },
    conditions: [],
};

const getters = {
    tableData: state => state.tableData,
    sheetElement: state => state.sheetElement,
    activeSheet: state => state.activeSheet,
    conditions: state => state.conditions,
};

const mutations = {
    [types.SET_TABLE_DATA](state, payload) {
        state.tableData = payload;
    },
    [types.SET_SHEET_ELEMENT](state, payload) {
        state.sheetElement = payload;
    },
    [types.SET_ACTIVE_SHEET](state, payload) {
        state.activeSheet = payload;
    },
    [types.SET_CONDITIONS](state, payload) {
        state.conditions = payload;
    }
};

const actions = {
    setTableData({ commit }, payload) {
        commit(types.SET_TABLE_DATA, payload);
    },
    setSheetElement({ commit }, payload) {
        commit(types.SET_SHEET_ELEMENT, payload);
    },
    setActiveSheet({ commit }, payload) {
        commit(types.SET_ACTIVE_SHEET, payload);
    },
    setConditions({ commit }, payload) {
        commit(types.SET_CONDITIONS, payload);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};