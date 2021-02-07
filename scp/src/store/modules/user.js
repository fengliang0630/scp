import api from '@/api';

const state = () => ({
    userInfo: null
});

const getters = {
    getUserInfo: (state, getters, rootState) => {
        return state.userInfo;
    }
}

const mutations = {
    setUserInfo(_state, _userInfo) {
        _state.userInfo = _userInfo;
    }
}

const actions = {
    login({ dispatch, state, commit }, _params) {
        window.$http.post(api.login.url, _params).then( data => {
            commit("setUserInfo", data.userInfo);
        });
    },
    logout({ dispatch, state, commit }) {
        commit("setUserInfo", null);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
};