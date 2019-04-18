import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        jwt_token: '',
        show_search: false,
        categories: []
    },
    mutations: {
        changeToken(state, token) {
            state.jwt_token = token;
        },
        setCategories(state, categories) {
            state.categories = categories;
        }
    },
    getters: {
        token: state => state.jwt_token,
        auth_header: state => 'Bearer ' + state.jwt_token,
        show_search: state => state.show_search,
        api_base: () => 'http://localhost:8000/api/v1/',
        categories: state => state.categories
    },
    actions: {
        // LOGIN/LOGOUT TODO
    }
});
