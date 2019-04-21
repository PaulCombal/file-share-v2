<template>
    <div v-if="loading" class="text-center">
        <i class="fa fa-circle-notch fa-spin"></i>
    </div>
    <div v-else-if="!loading && error" class="text-center">
        <i class="fa fa-exclamation-triangle mr-1"></i> Une erreur est survenue.. Veuillez réessayer plus tard.
    </div>
    <div v-else>
        <div v-if="submissions.length === 0" class="text-center text-muted">
            <i class="fa fa-box-open mr-1"></i> Aucun résultat!
        </div>
        <div v-for="r in submissions" :key="r.id" class="search-result">
            <router-link :to="'/' + r.id + '/' + r.slug">
                {{ r.title }} <i v-if="r.verified" class="fa fa-check ml-1"
                                 title="Manuellement vérifié comme étant valide"></i>
            </router-link>
            <div class="text-muted">
                {{ r.description }}
            </div>
            <div class="text-muted-muted">
                <small>
                    <strong>{{ r.karma }}</strong> karma - Dans {{ readableCategories(r.category, r.parent_category) }}
                </small>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SubmissionList",
        props: {
            submissions: Array,
            loading: Boolean,
            error: Boolean
        }
    }
</script>

<style scoped lang="scss">
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
