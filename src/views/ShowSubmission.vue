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
                            class="fa fa-arrow-left"></i> Page précédente
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
            <div class="row">
                <div class="col">
                    <h2 class="title mb-3">TÉLÉCHARGEMENT</h2>
                    <div>
                        <div class="d-flex mb-2">
                            <button @click="downloadWithDesktop()"><i class="fa fa-desktop mr-1"></i> Ouvrir dans Desktop</button>
                            <div class="text-muted ml-3">Soyez sûr d'avoir téléchargé <a href="https://github.com/ipfs-shipyard/ipfs-desktop" target="_blank">IPFS Desktop</a></div>
                        </div>
                        <div class="d-flex mb-2">
                            <button @click="downloadMirror()"><i class="fa fa-download mr-1"></i> Téléchargement direct</button>
                            <div class="text-muted ml-3">Vous ne contribuerez pas à la conservation du fichier <i class="fa fa-sad-tear"></i> </div>
                        </div>
                        <div class="d-flex">
                            <input placeholder="Normalement il y a un hash ici" @mouseover="mouseOver" @mouseleave="mouseLeave" @click="copyHash()" class="copy-box px-1" readonly :value="submission.hash">
                            <div class="text-muted ml-3" v-if="!copied">Cliquez pour copier. Copiez le hash dans le presse-papiers pour l'utiliser partout!</div>
                            <div class="text-muted ml-3" v-else>Copié!</div>
                        </div>
                    </div>
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
                showBack: window.history.length > 2,
                copied: false
            }
        },
        methods: {
            downloadWithDesktop: function () {
                document.location = 'ipfs://' + this.submission.hash;
            },
            downloadMirror: function () {
                window.open('https://ipfs.io/ipfs/' + this.submission.hash, '_blank');
            },
            copyHash: function () {
                document.execCommand('copy');
                this.copied = true;
                setTimeout(() => { this.copied = false}, 3000);
            },
            mouseOver: function (evt) {
                evt.target.select();
            },
            mouseLeave: function () {
                document.getSelection().empty();
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

                    this.$store.dispatch('fetchCategories');
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

    .copy-box {
        font-family: monospace;
        user-select: all;
    }
</style>
