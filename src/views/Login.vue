<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <h2 class="title">CONNEXION</h2>
                <div>
                    <input class="my-1 px-2" placeholder="Username" :disabled="disabled" autofocus/>
                    <br/>
                    <input class="my-1 px-2" placeholder="Mot de passe" :disabled="disabled"/>
                    <br/>
                    <input class="mt-2" type="submit" value="Connexion" :disabled="disabled"/>
                </div>
                <div class="my-3">- OU -</div>
                <GoogleLogin class="btn google-button d-flex align-items-center" :onSuccess="onSignIn" :params="params"><img src="../assets/g-logo.png" height="20" width="20" class="mr-2"/> Connexion avec Google</GoogleLogin>
            </div>
            <div class="col-md-6">
                <h2 class="title">INSCRIPTION</h2>
                <div class="text-muted">
                    Votre adresse email ne sera jamais communiquée à un parti tiers, et ne sert qu'à des fins de récupération de compte
                </div>
                <div>
                    En créant un compte, vous déclarez être d'accord avec nos conditions d'utilisation
                </div>
                <div class="mt-2">
                    <input class="my-1 px-2" placeholder="Username" :disabled="disabled"/>
                    <br/>
                    <input class="my-1 px-2" placeholder="Email (facultatif)" type="email" :disabled="disabled"/>
                    <br/>
                    <input class="my-1 px-2" placeholder="Mot de passe" type="password" :disabled="disabled"/>
                    <br/>
                    <input class="my-1 px-2" placeholder="Confirmation mot de passe" type="password" :disabled="disabled"/>
                    <br/>
                    <input class="mt-2" type="submit" value="Créer mon compte" :disabled="disabled"/>
                </div>
                <div class="my-2">- OU -</div>
                <input class="mb-2 px-2" placeholder="Username" maxlength="25" v-model="googleRegisterUsername" :disabled="disabled"/>
                <br/>
                <GoogleLogin class="btn google-button d-flex align-items-center" :onSuccess="onRegister" :params="params"><img src="../assets/g-logo.png" height="20" width="20" class="mr-2"/> Inscription avec Google</GoogleLogin>
            </div>
        </div>
    </div>
</template>

<script>
    import GoogleLogin from "vue-google-login/src/GoogleLogin";
    import {mapActions} from 'vuex';

    export default {
        name: "Login",
        components: {GoogleLogin},
        methods: {
            ...mapActions(['doRequestLoginGoogle']),
            onSignIn: function (googleUser) {
                this.disabled = true;
                let profile = googleUser.getBasicProfile();
                const jwt = googleUser.getAuthResponse().id_token;
                console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
                console.log('Jwt: ', jwt);

                const postdata = {
                    'google-jwt': jwt
                };

                this.doRequestLoginGoogle(postdata).then((success) => {
                    if (success) {
                        this.$router.go(-1);
                    }
                });
            },
            onRegister: function (googleUser) {
                this.disabled = true;
                let profile = googleUser.getBasicProfile();
                const jwt = googleUser.getAuthResponse().id_token;
                console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
                console.log('Jwt: ', jwt);

                const postdata = {
                    'google-jwt': jwt,
                    username: this.googleRegisterUsername
                };

                const nameLength = postdata.username.length;

                if (nameLength === 0) {
                    alert('Veuillez inscrire un  nom d\'utilisateur, même si vous vous inscrivez avec Google!');
                    return;
                } else if (nameLength < 3 || nameLength > 25) {
                    alert('Votre nom d\'utilisateur doit faire entre 3 et 25 lettres');
                    return;
                }
                // TODO check for illegal characters: <, >, ,,, ", ',...

                this.post('register/with-google', postdata).then((r) => {
                    this.disabled = false;
                    if (r.success) {
                        this.googleRegisterUsername = '';
                        alert('Votre compte a été créé! Vous pouvez dès maintenant vous connecter avec le bouton de connexion Google!');
                        return;
                    }
                    if (r.error === 5) {
                        alert('Il semblerait que ce nom d\'utilisateur ou compte Google soit déjà utilisé. Essayez de vous connecter, ou choisissez un autre pseudo!');
                        return;
                    }
                    console.log(r);
                })
            }
        },
        data: function () {
            return {
                params: {
                    client_id: "69926499564-ahrpirp0anl3fjlqlppkmq53ou2tkobk.apps.googleusercontent.com",
                },
                googleRegisterUsername: '',
                disabled: false
            }
        },
        mounted: function () {
            if (this.$store.getters.user.id) {
                this.$router.push({name: 'show_user', params: {username: this.$store.getters.user.username}});
            }
        }
    }
</script>

<style scoped>
    .title {
        font-family: 'Francois One', monospace;
    }

    .google-button {
        box-shadow: 0 1px 2px 0 #cccccc;
    }
</style>
