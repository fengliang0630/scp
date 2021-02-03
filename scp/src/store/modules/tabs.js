const state = () => ({
    tabs: {
        data: [],
        activeTab: {}
    }
});

const getters = {
    getTabs: (state, getters, rootState) => {
        return state.tabs;
    }
}

const mutations = {
    // 添加tab页签
    addTab(_state, _tab) {
        const one = _state.tabs.data.find((tab) => tab.path === _tab.path);
        if (!one) {
            _state.tabs.data.push(_tab);
        }
        _state.tabs.activeTab = _tab;
    },
    // 删除右侧tab页签
    deleteRight(_state, _index) {

    },
    // 删除左侧tab页签
    deleteLeft(_state, _index) {
        _state.tabs.slice(0,_index + 1);
    },
    // 删除其他页签
    deleteOther(_state, _index) {

    },
    // 删除所有页签
    deleteAll(_state, _index) {

    },
    toggleActive(_state, _tabPath) {
        const tabs = _state.tabs.data;
        _state.tabs.activeTab = tabs.find(_tab => _tab.path === _tabPath);
    }
}

const actions = {
    addTab({ dispatch, state, commit }, _tab) {
        commit("addTab", _tab);
    },
    toggleActive({ dispatch, state, commit }, _tabPath) {
        commit("toggleActive", _tabPath);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
};