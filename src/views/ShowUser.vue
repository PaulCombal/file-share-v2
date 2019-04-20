<template>
    <div class="text-center" v-if="loading">
        <i class="fa fa-circle-notch fa-spin"></i>
    </div>
    <div class="container" v-else>
        <div class="row">
            <div class="col">
                <h2 class="title d-inline-block">{{ user.username }}</h2>
                <span class="float-right" v-if="isCurrentUser"><button @click="$store.dispatch('doLogout')"><i class="fa fa-door-open"></i> Déconnection</button></span>
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
    </div>
</template>

<script>
    export default {
        name: "ShowUser",
        data: function () {
            return {
                loading: true,
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
            startEditBio: function () {
                this.editingBio = true;
            },
            endEditBio: function () {
                this.lockEdition = true;
                this.post('profile/edit').then((r) => {
                    console.log(r);
                    this.lockEdition = false;
                    this.editingBio = false;
                }).catch((e) => {
                    console.log(e);
                    alert('Une erreur est survenue lors de l\'enregistrement de vos modifications.. Veuillez réésayer plus tard');
                    this.lockEdition = false;
                })
            }
        },
        watch: {
            currentUser(theNew/*, theOld*/) {
                this.isCurrentUser = this.user.id === theNew.id;
            }
        },
        mounted: function () {
            this.post('profile/read/' + this.$route.params.username).then((r) => {
                this.user = r.user;
                this.submissions = r.submissions;
                if (r.user.id === this.currentUser.id) {
                    this.isCurrentUser = true;
                }
                this.loading = false;
            })
        }
    }
</script>

<style scoped>
    .title {
        text-transform: uppercase;
        font-family: 'Francois One', monospace;
    }
</style>
