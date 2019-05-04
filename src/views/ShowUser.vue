<template>
    <div class="text-center" v-if="loading">
        <i class="fa fa-circle-notch fa-spin"></i>
    </div>
    <div class="container" v-else>
        <div class="row">
            <div class="col">
                <h2 class="title d-inline-block">{{ user.username }}</h2>
                <span class="float-right" v-if="isCurrentUser">
                    <i class="fa fa-spin fa-circle-notch" v-if="loadingLogout"></i>
                    <button @click="queryDisconnect()" v-else><i class="fa fa-door-open"></i> Déconnection</button>
                </span>
                <hr/>
            </div>
        </div>
        <div class="row">
            <div class="col" v-if="!editingBio">
                <div class="text-muted">
                    {{ user.bio || 'Aucune bio renseignée' }}
                </div>
                <div v-if="isCurrentUser" class="mt-2">
                    <button @click="startEditBio()"><i class="fa fa-edit"></i> Modifier ma bio</button>
                </div>
            </div>
            <div class="col" v-else>
                <textarea maxlength="50" class="w-100" placeholder="À quoi pensez-vous?" v-model="user.bio" :disabled="lockEdition"></textarea>
                <button @click="endEditBio()"><i class="fa fa-save"></i> Enregistrer</button>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col">
                <h2 class="title">Médailles</h2>
                <div class="text-muted">
                    <i class="fa fa-clock"></i> Cette fonctionnalité sera prochainement disponible!
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col">
                <h2 class="title">Publications</h2>
                <div class="text-muted" v-if="submissions.length === 0">
                    <i class="fa fa-box-open"></i> Aucune publication pour cet utilisateur
                </div>
                <SubmissionList :error="false" :loading="loading" :submissions="submissions" v-else/>
            </div>
        </div>
        <div class="row mt-4" v-if="isCurrentUser">
            <div class="col">
                <h2 class="title">PARAMÈTRES</h2>
                <div class="text-muted">Bientôt: saisir votre adresse mail, et suppression du compte!</div>
            </div>
        </div>
    </div>
</template>

<script>
    import SubmissionList from "../components/SubmissionList";
    export default {
        name: "ShowUser",
        components: {SubmissionList},
        data: function () {
            return {
                loading: true,
                loadingLogout: false,
                lockEdition: false,
                user: {},
                submissions: [],
                isCurrentUser: false,
                editingBio: false
            }
        },
        computed: {
            currentUser() {
                return this.$store.getters.user;
            }
        },
        methods: {
            refreshData: function() {
                this.post('profile/read/' + this.$route.params.username).then((r) => {
                    this.user = r.user;
                    this.submissions = r.submissions;
                    if (r.user.id === this.currentUser.id) {
                        this.isCurrentUser = true;
                        this.$store.commit('setUser', r.user);
                    }
                    this.loading = false;
                })
            },
            startEditBio: function () {
                this.editingBio = true;
            },
            endEditBio: function () {
                this.lockEdition = true;
                const postdata = {
                    bio: this.user.bio
                };
                this.post('profile/editmine', postdata).then((r) => {
                    if (!r.success) {
                        throw new Error('response doesnt have r.success');
                    }

                    this.editingBio = false;
                }).catch((e) => {
                    console.log(e);
                    alert('Une erreur est survenue lors de l\'enregistrement de vos modifications.. Veuillez réésayer plus tard');
                }).finally(() => {
                    this.lockEdition = false;
                })
            },
            queryDisconnect: function () {
                this.loadingLogout = true;
                this.post('logout').then((r) => {
                    if (!r.success) {
                        alert('ATTENTION: À cause de mesures de sécurité, nous n\'avons pas pu vous déconnecter. Effacez les données de navigation pour éviter tout vol de compte.')
                    } else {
                        this.$store.dispatch('doLogout');
                    }
                }).finally(() => {
                    this.loadingLogout = false;
                })
            }
        },
        watch: {
            currentUser(theNew/*, theOld*/) {
                this.isCurrentUser = this.user.id === theNew.id;
            },
            '$route.params.username': function () {
                this.refreshData();
            }
        },
        mounted: function () {
            this.refreshData();
        }
    }
</script>

<style scoped>
    .title {
        text-transform: uppercase;
        font-family: 'Francois One', monospace;
    }
</style>
