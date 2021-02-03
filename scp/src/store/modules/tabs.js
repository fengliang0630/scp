import api from '@/api';

const state = () => ({
    tabs: {
        data: [],
        activeTab: null
    }
});

const getters = {
    getActived: (state, getters, rootState) => {
        const tabObj = state.tabs || JSON.parse(sessionStorage.getItem('tabs'));
        return tabObj.activeTab;
    },
    getTabs: (state, getters, rootState) => {
        const tabObj = state.tabs || JSON.parse(sessionStorage.getItem('tabs'));
        return tabObj.data;
    }
}

const mutations = {
    // 添加tab页签
    addTab(_state, _tab) {
        _state.tabs.data.push(_tab);
        _state.tabs.activeTab = _tab;
        sessionStorage.setItem('tabs', JSON.stringify(_state.tabs));
    },
    // 删除右侧tab页签
    deleteRight(_state, _index) {

    },
    // 删除左侧tab页签
    deleteLeft(_state, _index) {
        _state.tabs.slice(0,_index + 1);
        sessionStorage.setItem('tabs', JSON.stringify(_state.tabs));
    },
    // 删除其他页签
    deleteOther(_state, _index) {

    },
    // 删除所有页签
    deleteAll(_state, _index) {

    }
}

const actions = {
    addTab({ dispatch, state, commit }, _tab) {
        commit("addTab", _tab);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};