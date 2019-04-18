<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div>
                    <input :value="$route.query.q" placeholder="Rechercher.." class="w-100 my-2"/>
                </div>
                <div class="d-flex align-items-center mt-2">
                    <div style="flex: 1;">
                        <select title="Filter sur la catégorie" v-model="category">
                            <option :value="null" selected>Toutes catégories</option>
                            <option v-for="c in $store.getters.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                        </select>
                    </div>
                    <div style="flex: 1;">
                        <label class="mr-1" for="veronlychk">Soumissions vérifiées seulement</label>
                        <input v-model="verifiedOnly" id="veronlychk" type="checkbox"/>
                    </div>
                    <div style="flex: 1;">
                        <button class="btn btn-outline-info float-right" @click="doSearch()"><i class="fa fa-search mr-1"></i> Rechercher</button>
                    </div>
                </div>
                <hr />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div v-if="loading" class="text-center">
                    <i class="fa fa-circle-notch fa-spin"></i>
                </div>
                <div v-if="!loading && error" class="text-center">
                    <i class="fa fa-exclamation-triangle mr-1"></i> Une erreur est survenue.. Veuillez réessayer plus
                    tard.
                </div>
                <div v-if="!loading && !error">
                    <div v-if="results.length === 0" class="text-center text-muted">
                        <i class="fa fa-box-open mr-1"></i> Aucun résultat!
                    </div>
                    <div v-for="r in results" :key="r.id" class="search-result">
                        <router-link :to="'/' + r.id + '/' + r.slug">
                            {{ r.title }} <i v-if="r.verified" class="fa fa-check ml-1"
                                             title="Manuellement vérifié comme étant valide"></i>
                        </router-link>
                        <div class="text-muted">
                            {{ r.description }}
                        </div>
                        <div class="text-muted-muted">
                            <small>
                                <strong>{{ r.karma || '??' }}</strong> karma - {{ readableCategories(r.category, r.parent_category) }}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Search",
        data: function () {
            return {
                loading: true,
                error: false,
                query: this.$route.query.q,
                category: this.$route.query.category || null,
                verifiedOnly: this.$route.query.verifiedOnly || false,
                results: []
            };
        },
        methods: {
            readableCategories: function (category, parent_category) {
                let ret = 'Dans '
                if (category !== parent_category) {
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
            },
            doSearch: function () {
                this.loading = true;
                this.error = false;

                const query = this.query;
                const category = this.category;
                const verifiedOnly = this.verifiedOnly;

                const postdata = {
                    query,
                    category,
                    verifiedOnly
                };

                this.post('submission/search', postdata).catch(() => {
                    this.error = true;
                }).then((r) => {
                    this.results = r.results;
                }).finally(() => {
                    this.loading = false;
                });
            }
        },
        mounted: function () {
            if (!this.query)
                this.$router.push('/');

            this.doSearch();
        }
    }
</script>

<style lang="scss" scoped>
    .search-result {
        &:nth-child(odd) {
            background: #f9f9fb;

        }

        padding: 10px;
        margin-bottom: 10px;
    }

    .text-muted-muted {
        color: #ada8bb;
    }
</style>
