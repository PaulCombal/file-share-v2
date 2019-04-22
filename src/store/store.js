import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        jwt_token: localStorage.getItem('jwt'),
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
        doLogin({commit, getters, dispatch}, credentials) {
            let headers = new Headers();
            headers.append('content-type', 'application/json');
            const init = {
                method: 'POST',
                mode: 'cors',
                headers,
                body: JSON.stringify(credentials)
            };
            return fetch(getters.api_base + 'login', init)
                .then(r => r.json())
                .then((r) => {
                    if (!r.token) {
                        throw new Error(JSON.stringify(r));
                    }

                    // TODO: Security. Do not Set the token in localStorage but in a HTTP Cookie.
                    localStorage.jwt = r.token;
                    commit('changeToken', r.token);
                    dispatch('updateUserProfile');
                    return true;
                })
                .catch((e) => {
                    alert('Une erreur est survenue. Vérifiez votre saisie, réessayez plus tard, ou inscrivez-vous si ce n\'est pas déjà fait!');
                    console.log(e);
                    return false;
                })
        },
        doLogout({commit}) {
            localStorage.jwt = '';
            commit('setUser', {});
        },
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
            const jwt = localStorage.getItem('jwt');
            if (!jwt || jwt.length === 0) {
                return new Promise((resolve) => {
                    resolve({});
                })
            }

            let headers = new Headers();
            headers.append('Authorization', getters.auth_header);
            const init = {
                method: 'POST',
                mode: 'cors',
                headers
            };

            return fetch(getters.api_base + 'profile/readmine', init)
                .then(r => r.json())
                .then((r) => {
                    if (r.code === 401) {
                        if (r.message === "JWT Token not found") {
                            throw new Error("Server said JWT token not found.");
                        }
                        // JWT is not valid anymore
                        // TODO: make a refresh token schema or something clever
                        commit('changeToken', '');
                        localStorage.jwt = '';
                        throw new Error(JSON.stringify(r));
                    }
                    return r;
                })
                .then((r) => {
                    commit('setUser', r.user);
                    return r.user;
                })
                .catch((e) => {
                    console.log(e);
                    return {};
                });
        }
    }
});
