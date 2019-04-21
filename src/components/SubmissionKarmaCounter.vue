<template>
    <div class="d-flex align-items-center my-1" style="height: 100px">
        <div v-if="loading" class="square text-center">
            <i class="fa fa-circle-notch fa-spin"></i>
        </div>
        <div class="square d-flex justify-content-center" v-else>
            <div :class="'align-self-center cursor-pointer ' + (upvoted ? 'upvote-active' : '')" @click="doUpvote()"><i class="fa fa-arrow-alt-circle-up"></i></div>
            <div class="karma-count mx-1 align-self-center text-bold">{{ cachedKarma }}</div>
            <div :class="'align-self-center cursor-pointer ' + (downvoted ? 'downvote-active' : '')" @click="doDownvote()"><i class="fa fa-arrow-alt-circle-down"></i></div>
        </div>
        <div>
            Voter sert à signaler que le fichier partagé correspond bien à sa description et n'est pas dangereux.
            <span v-if="report === false">
                <span class="text-info" style="cursor: pointer" @click="doReport()">Cliquez ici</span> pour faire étudier le fichier par la modération.
            </span>
            <span v-else>
                Vous avez déjà envoyé vos commentaires concernant cette soumission. Nous l'examinerons dès que possible. Merci!
            </span>
            <br/>
            Merci et bon surf :)
        </div>
    </div>
</template>

<script>
    export default {
        name: "SubmissionKarmaCounter",
        data: function () {
            return {
                cachedKarma: 0,
                loading: true,
                upvoted: false,
                downvoted: false,
                report: false
            }
        },
        props: {
            submission: {
                submission: Object
            }
        },
        methods: {
            doUpvote: function () {
                if (!this.$store.getters.user.id) {
                    alert('Veuillez-vous connecter pour voter. Merci!');
                    return;
                }

                this.loading = true;
                this.post('reaction/create/upvote/' + this.submission.id).then((r) => {

                    if (r.vote === 'addition') {
                        // New upvote
                        this.upvoted = true;
                        this.cachedKarma = this.cachedKarma + 1;
                    } else {
                        // Removed upvote
                        this.upvoted = false;
                        this.cachedKarma = this.cachedKarma - 1;
                    }

                    if (this.downvoted) {
                        // Downvote removed
                        this.cachedKarma = this.cachedKarma + 1;
                    }

                    this.loading = false;
                    this.downvoted = false;
                })
            },
            doDownvote: function () {
                if (!this.$store.getters.user.id) {
                    alert('Veuillez-vous connecter pour voter. Merci!');
                    return;
                }

                this.loading = true;
                this.post('reaction/create/downvote/' + this.submission.id).then((r) => {
                    if (r.vote === 'addition') {
                        this.downvoted = true;
                        this.cachedKarma = this.cachedKarma - 1;
                    } else {
                        this.downvoted = false;
                        this.cachedKarma = this.cachedKarma + 1;
                    }

                    if (this.upvoted) {
                        // Upvote removed
                        this.cachedKarma = this.cachedKarma - 1;
                    }

                    this.upvoted = false;
                    this.loading = false;
                })
            },
            doReport: function () {
                if (!this.$store.getters.user.id) {
                    alert('Connectez-vous pour signaler un fichier, ou signalez-le à todo@todo.todo');
                    return;
                }

                const data = prompt('Pourquoi ce fichier devrait-il être modéré?').substring(0, 255);
                const postdata = {
                    user_report_file: {
                        data
                    }
                };
                this.post('reaction/create/report/' + this.submission.id, postdata).then(() => {
                    this.report = data;
                }).catch((e) => {
                    alert('Une erreur s\'est produite lors de l\'enregistrement de votre signalement. Veuillez réessayer plus tard');
                    console.log(e);
                });
            },
            fetchMine: function () {
                if (this.$store.getters.user.id) {
                    this.loading = true;
                    this.post('reaction/request/mine/' + this.submission.id).then((r) => {
                        this.upvoted = r.upvote;
                        this.downvoted = r.downvote;
                        this.report = r.report;
                        this.loading = false;
                    }).catch((e) => {
                        alert('Le système de votes ne semble pas foctionner pour le moment. Veuillez réessayer plus tard');
                        this.loading = false;
                        console.log(e);
                    })
                    ;
                } else {
                    // Not logged in
                    this.upvoted = false;
                    this.downvoted = false;
                    this.report = false;
                    this.loading = false;
                }
            }
        },
        computed: {
            currentUser() {
                return this.$store.getters.user;
            }
        },
        watch: {
            // Takes new and old as args, but removed for lint
            currentUser() {
                this.fetchMine();
            }
        },
        mounted: function () {
            this.cachedKarma = this.submission.karma;
            this.fetchMine();
        }
    }
</script>

<style scoped lang="scss">
    .square {
        flex: 0 0 100px;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .text-bold {
        font-weight: bold;
    }

    .upvote-active {
        color: orangered;
    }

    .downvote-active {
        color: darkslateblue;
    }
</style>
