import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import './registerServiceWorker'

Vue.config.productionTip = false;

Vue.mixin({
    methods: {
        post: function (path, postdata = {}) {
            const init = {
                method: 'POST',
                mode: 'cors',
                headers: (new Headers()).append('Authorization', this.$store.getters.auth_header),
                body: JSON.stringify(postdata)
            };
            return fetch(this.$store.getters.api_base + path, init)
                .then((r) => {
                    if (!r.ok) {
                        throw new Error(r.statusText);
                    }
                    return r.json();
                });
        }
    }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
