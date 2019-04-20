import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import './registerServiceWorker'

Vue.config.productionTip = false;

Vue.mixin({
    methods: {
        post: function (path, postdata = {}) {
            let headers = new Headers();
            headers.append('Authorization', this.$store.getters.auth_header);

            const init = {
                method: 'POST',
                mode: 'cors',
                headers,
                body: JSON.stringify(postdata)
            };
            return fetch(this.$store.getters.api_base + path, init)
                .then((r) => {
                    if (!r.ok) {
                        throw new Error(r.statusText);
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
