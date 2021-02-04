const fixedTab = [
    {
        "name": "首页",
        "icon": "home",
        "path": "home",
        "isClosed": false
    }
];

const state = () => ({
    tabs: {
        data: [...fixedTab],
        activeTab: fixedTab[0]
    }
});

const getters = {
    getTabs: (_state, getters, rootState) => {
        return _state.tabs;
    }
}

const mutations = {
    // 添加tab页签
    addTab(_state, _tab) {
        const one = _state.tabs.data.find((tab) => tab.path === _tab.path);
        if (!one) {
            _state.tabs.data.push(Object.assign(_tab, {isClosed: true}));
        }
        _state.tabs.activeTab = _tab;
    },
    // 删除右侧tab页签
    deleteRight(_state) {
        const one = _state.tabs.data.find(tab => _state.tabs.activeTab.path === tab.path);
        const index = _state.tabs.data.indexOf(one);
        _state.tabs.data.splice(index + 1);
    },
    // 删除左侧tab页签
    deleteLeft(_state) {
        const one = _state.tabs.data.find(tab => _state.tabs.activeTab.path === tab.path);
        const index = _state.tabs.data.indexOf(one);
        // 删除左侧
        if (index >= 2) {
            _state.tabs.data.splice(1, index-1);
        }
    },
    // 删除其他页签
    deleteOther(_state) {
        const one = _state.tabs.data.find(tab => _state.tabs.activeTab.path === tab.path);
        const index = _state.tabs.data.indexOf(one);
        // 先把右侧删除
        _state.tabs.data.splice(index + 1);
        // 删除左侧
        if (index >= 2) {
            _state.tabs.data.splice(1, index-1);
        }
    },
    // 删除所有页签
    deleteAll(_state) {
        _state.tabs.activeTab = _state.tabs.data[0];
        _state.tabs.data.splice(1);
    },
    // 删除指定页签
    deleteOne(_state, _path) {
        const one = _state.tabs.data.find(tab => _path === tab.path);
        const index = _state.tabs.data.indexOf(one);
        // 如果是当前激活页签
        if (_state.tabs.activeTab.path === _path) {
            _state.tabs.activeTab = _state.tabs.data[index-1];
        }
        _state.tabs.data.splice(index, 1);
    },
    toggleActive(_state, _tabPath) {
        const one = _state.tabs.data.find(_tab => _tab.path === _tabPath);
        if (one) {
            _state.tabs.activeTab = one
        }
    }
}

const actions = {
    addTab({ dispatch, state, commit }, _tab) {
        commit("addTab", _tab);
    },
    toggleActive({ dispatch, state, commit }, _tabPath) {
        commit("toggleActive", _tabPath);
    },
    deleteRight({ dispatch, state, commit }) {
        commit("deleteRight");
    },
    deleteLeft({ dispatch, state, commit }) {
        commit("deleteLeft");
    },
    deleteOther({ dispatch, state, commit }) {
        commit("deleteOther");
    },
    deleteAll({ dispatch, state, commit }) {
        commit("deleteAll");
    },
    deleteOne({ dispatch, state, commit }, _path) {
        commit("deleteOne", _path);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
};