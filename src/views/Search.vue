<template>
    <div class="container">
        <div class="row">
            <div class="col">
                SEARCH BAR + FILTERS HERE
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div v-if="loading" class="text-center">
                    <i class="fa fa-circle-notch fa-spin"></i>
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
                results: []
            };
        },
        mounted: function () {
            const query = this.$route.query.q;
            if (!query)
                this.$router.push('/');

            const postdata = {
                query
            };
            this.post('submission/search', postdata);
        }
    }
</script>

<style scoped>

</style>
