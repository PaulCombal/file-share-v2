import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        logged: Boolean(localStorage.getItem('logged')),
        show_search: false,
        user: {},
        categories: []
    },
    mutations: {
        changeLogged(state, bool) {
            state.logged = bool;
            if (bool) {
                localStorage.logged = 'true';
            } else {
                localStorage.removeItem('logged');
            }
        },
        setCategories(state, categories) {
            state.categories = categories;
        },
        setUser(state, user) {
            state.user = user;
        }
    },
    getters: {
        show_search: state => state.show_search,
        api_base: () => 'http://localhost:8000/api/v1/',
        categories: state => state.categories,
        user: state => state.user,
        logged: state => state.logged,
        fetchCredentials: state => state.logged ? 'include' : 'omit'
    },
    actions: {
        doLogin({commit, getters, dispatch}, credentials) {
            const init = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(credentials),
                credentials: 'include'
            };
            return fetch(getters.api_base + 'login', init)
                .then((r) => {
                    if (!r.ok) {
                        throw new Error('Login attempted resulted in HTTP ' + r.status);
                    }
                    return r.json();
                })
                .then(() => {
                    // LOGIN is successful
                    commit('changeLogged', true);
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
            commit('changeLogged', false);
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
            if (!getters.logged) {
                return new Promise((resolve) => {
                    resolve({});
                })
            }

            const init = {
                method: 'POST',
                mode: 'cors',
                credentials: 'include'
            };

            return fetch(getters.api_base + 'profile/readmine', init)
                .then(r => r.json())
                .then((r) => {
                    if (r.code === 401) {
                        // Expired cookie, or expired JWT
                        commit('changeLogged', false);
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
