import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        jwt_token: '',
        show_search: false
    },
    mutations: {
        changeToken(state, token) {
            state.jwt_token = token;
        }
    },
    getters: {
        token: state => state.jwt_token,
        auth_header: state => 'Bearer ' + state.jwt_token,
        show_search: state => state.show_search,
        api_base: () => 'http://localhost:8000/api/v1/'
    },
    actions: {
        // LOGIN/LOGOUT TODO
    }
});
