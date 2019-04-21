<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div>
                    <input v-model="query" placeholder="Rechercher.." class="w-100 my-2" @change="doSearch()"/>
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
                <SubmissionList :loading="loading" :error="error" :submissions="results"/>
            </div>
        </div>
    </div>
</template>

<script>
    import SubmissionList from "../components/SubmissionList";
    export default {
        name: "Search",
        components: {SubmissionList},
        data: function () {
            return {
                loading: true,
                error: false,
                query: this.$route.query.q,
                category: this.$route.query.category || null,
                verifiedOnly: this.$route.query.verifiedOnly === "false" || false,
                results: []
            };
        },
        methods: {
            doSearch: function () {
                const query = this.query;
                const category = this.category;
                const verifiedOnly = this.verifiedOnly;

                if (!query || query.length === 0) return;

                this.loading = true;
                this.error = false;

                if (query !== this.$route.query.q || category !== this.$route.query.category || verifiedOnly !== this.$route.query.verifiedOnly) {
                    this.$router.push({path: '/search', query: {q: query, category, verifiedOnly}});
                    this.doSearch();
                    return;
                }

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

</style>
