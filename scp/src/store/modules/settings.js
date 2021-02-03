
const state = () => ({
    collapse: false
});

const getters = {
    collapse: (state) => state.collapse 
}

const mutations = {
    changeCollapse: (state) => {
        state.collapse = !state.collapse
    }
}

const actions = {
    changeCollapse({ commit }) {
        commit('changeCollapse')
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};