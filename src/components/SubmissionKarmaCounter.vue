<template>
    <div class="d-flex align-items-center my-1" style="height: 100px">
        <div v-if="loading" class="square text-center">
            <i class="fa fa-circle-notch fa-spin"></i>
        </div>
        <div class="square" v-else>
            <div class="arrow-upvote" @click="doUpvote()"></div>
            <div class="karma-count"></div>
            <div class="arrow-downvote" @click="doDownvote()"></div>
        </div>
        <div>
            Voter sert à signaler que le fichier partagé correspond bien à sa description et n'est pas dangereux.
            <span class="text-info" style="cursor: pointer" @click="doReport()">Cliquez ici</span> pour faire étudier le fichier par la modération.
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
                loading: true,
                loggedin: false,
                data: {}
            }
        },
        methods: {
            doUpvote: function () {
                if (!this.loggedin) {
                    alert('Veuillez-vous connecter pour voter. Merci!');
                    return;
                }
            },
            doDownvote: function () {
                if (!this.loggedin) {
                    alert('Veuillez-vous connecter pour voter. Merci!');
                    return;
                }
            },
            doReport: function () {
                if (!this.loggedin) {
                    alert('Connectez-vous pour signaler un fichier, ou signalez-le à todo@todo.todo');
                    return;
                }
            }
        },
        mounted: function () {
            if (localStorage.getItem('jwt')) {
                this.loggedin = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    .square {
        flex: 0 0 100px;
    }
</style>
