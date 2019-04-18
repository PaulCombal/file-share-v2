<template>
    <div>
        <div class="text-center" v-if="loading">
            <i class="fa fa-circle-notch"></i>
        </div>
        <div class="text-center" v-else-if="!loading && error">
            <i class="fa fa-exclamation-triangle mr-1"></i> Une erreur est survenue.. Veuillez réessayer plus tard.
        </div>
        <div class="container" v-else>
            <div class="row">
                <div class="col">
                    <div v-if="showBack" class="my-3 text-info" style="cursor: pointer" @click="$router.go(-1)"><i
                            class="fa fa-arrow-left"></i> Revenir à la recherche
                    </div>
                    <h2 class="title">{{ submission.title }}</h2>
                    <hr/>
                    <div>{{ submission.description }}</div>
                    <div class="mt-4 submission-meta">
                        <strong>Auteur:</strong> <router-link :to="{name: 'show_user', params: {username: submission.author.username}}"> {{ submission.author.username }}</router-link>
                        <br/>
                        <strong>Catégorie:</strong> {{ readableCategories(submission.category) }}
                        <br/>
                        <strong>Date:</strong> {{ submission.date_submitted }}
                        <br/>
                        <strong>Hash:</strong> {{ submission.hash }}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <SubmissionKarmaCounter :submission="submission"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SubmissionKarmaCounter from "../components/SubmissionKarmaCounter";
    export default {
        name: "ShowSubmission",
        components: {SubmissionKarmaCounter},
        data: function () {
            return {
                loading: true,
                error: false,
                submission: {},
                showBack: window.history.length > 2
            }
        },
        mounted: function () {
            this.post('submission/read/' + this.$route.params.id)
                .then((r) => {
                    this.submission = r.submission;
                    if (this.submission.slug !== this.$route.params.slug)
                        this.$router.push({
                            name: 'show_submission',
                            params: {id: this.submission.id, slug: this.submission.slug}
                        });
                })
                .catch(() => {
                    this.error = true;
                })
                .finally(() => {
                    this.loading = false;
                })
        }
    }
</script>

<style scoped lang="scss">
    .submission-meta {
        background: #f9f9fb;
        padding: 10px;
    }

    .title {
        font-family: 'Francois One', monospace;
        text-transform: uppercase;
    }
</style>
