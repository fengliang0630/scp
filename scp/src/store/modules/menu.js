import api from '@/api';

const state = () => ({
    menuTree: []
});

const getters = {
    getMenuTree: (state, getters, rootState) => {
        return state.menuTree;
    }
}

const mutations = {
    setMenuTree(_state, _menuTree) {
        _state.menuTree = _menuTree;
    }
}

const actions = {
    queryMenuData({ dispatch, state, commit }, _params) {
        window.$http.post(api.common.queryMenuData.url, _params).then( data => {
            commit("setMenuTree", data.menuData);
        });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
};