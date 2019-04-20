import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        jwt_token: '',
        show_search: false,
        user: {},
        categories: []
    },
    mutations: {
        changeToken(state, token) {
            state.jwt_token = token;
        },
        setCategories(state, categories) {
            state.categories = categories;
        },
        setUser(state, user) {
            state.user = user;
        }
    },
    getters: {
        token: state => state.jwt_token,
        auth_header: state => 'Bearer ' + state.jwt_token,
        show_search: state => state.show_search,
        api_base: () => 'http://localhost:8000/api/v1/',
        categories: state => state.categories,
        user: state => state.user
    },
    actions: {
        doRequestLoginGoogle({commit, getters, dispatch}, postdata) {
            const init = {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(postdata)
            };

            return fetch(getters.api_base + 'login/with-google', init)
                .then(r => r.json())
                .then((r) => {
                    if (!r.token) {
                        alert('Une erreur est survenue. Réessayez plus tard, ou inscrivez-vous si ce n\'est pas déjà fait!');
                        return false;
                    }

                    console.log('Logged in with Google');

                    // TODO: Security. Do not Set the token in localStorage but in a HTTP Cookie.
                    localStorage.jwt = r.token;
                    commit('changeToken', r.token);
                    dispatch('updateUserProfile');
                    return true;
                })
            ;
        },
        updateUserProfile({commit, getters}) {
            let headers = new Headers();
            headers.append('Authorization', getters.auth_header);
            const init = {
                method: 'POST',
                mode: 'cors',
                headers
            };

            return fetch(getters.api_base + 'profile/readmine', init)
                .then((r) => {
                    if (r.status === 401) {
                        // JWT is not valid anymore
                        // TODO: make a refresh token schema or something clever
                        commit('changeToken', '');
                        throw new Error('JWT token has expired');
                    }
                    return r;
                })
                .catch((e) => {
                    console.log(e);
                })
                .then(r => r.json())
                .then((r) => {
                    commit('setUser', r.user);
                    return r.user;
                });
        }
    }
});
