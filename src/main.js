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
                body: JSON.stringify(postdata),
                credentials: this.$store.getters.fetchCredentials
            };
            return fetch(this.$store.getters.api_base + path, init)
                .then((r) => {
                    if (!r.ok) {
                        throw new Error('Generic .post error: ' + r.statusText);
                    }
                    return r.json();
                });
        },
        readableCategories: function (category, parent_category = null) {
            let ret = '';
            if (category !== parent_category && parent_category !== null) {
                let cat = this.$store.getters.categories.find(x => x.id === parent_category);
                if (cat)
                    ret += cat.name + ' / ';
                else
                    ret += '??? / ';
            }

            let cat = this.$store.getters.categories.find(x => x.id === category);
            if (cat)
                ret += cat.name;
            else
                ret += '???';

            return ret;
        }
    }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
