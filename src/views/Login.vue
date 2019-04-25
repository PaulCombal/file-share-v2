<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <h2 class="title">CONNEXION</h2>
                <div>
                    <input class="my-1 px-2" placeholder="Username" :disabled="disabled" v-model="loginUsername" autofocus/>
                    <br/>
                    <input type="password" class="my-1 px-2" placeholder="Mot de passe" v-model="loginPassword" :disabled="disabled"/>
                    <br/>
                    <input class="mt-2" type="submit" value="Connexion" :disabled="disabled" @click="onManualLogin()"/>
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
                    <input class="my-1 px-2" placeholder="Username" v-model="registerUsername" :disabled="disabled"/>
                    <br/>
                    <input class="my-1 px-2" placeholder="Email (facultatif)" type="email" v-model="registerEmail" :disabled="disabled"/>
                    <br/>
                    <input class="my-1 px-2" placeholder="Mot de passe" type="password" v-model="registerPassword" :disabled="disabled"/>
                    <br/>
                    <input class="my-1 px-2" placeholder="Confirmation mot de passe" type="password" v-model="registerPasswordConfirm" :disabled="disabled"/>
                    <br/>
                    <input class="mt-2" type="submit" value="Créer mon compte" @click="onManualRegister()" :disabled="disabled"/>
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

    // Checks if a username is suitable for the site
    function correctUsername(username) {
        switch (true) {
            case username.length < 3:
            case username.length > 25:
                alert('Votre nom d\'utilisateur doit faire entre 3 et 25 caractères');
                return false;

            case !/^([a-z0-9]|[_-])+$/i.test(username):
                alert('Votre nom d\'utilisateur contient des lettres non autorisées. Seuls les lettres non accentuées, chiffres, underscores et tirets sont admis.');
                return false;

            default:
                return true;
        }
    }

    function correctPasswords(one, two) {
        switch (true) {
            case one.length < 5:
            case one.length > 25:
                alert('Votre mot de passe doit faire entre 5 et 25 caractères.');
                return false;

            case one !== two:
                alert('Votre saisie dans la confirmation de mot de passe ne correspond pas à celle du mot de passe.');
                return false;

            default:
                return true;
        }
    }

    export default {
        name: "Login",
        components: {GoogleLogin},
        methods: {
            ...mapActions(['doRequestLoginGoogle', 'doLogin']),
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
                }).finally(() => {
                    this.disabled = false;
                });
            },
            onRegister: function (googleUser) {
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
                }

                if (!correctUsername(postdata.username)) {
                    return;
                }

                this.disabled = true;
                this.post('register/with-google', postdata).then((r) => {
                    if (r.success) {
                        this.googleRegisterUsername = '';
                        alert('Votre compte a été créé! Vous pouvez dès maintenant vous connecter avec le bouton de connexion Google!');
                    } else if (r.error === 5) {
                        alert('Il semblerait que ce nom d\'utilisateur ou compte Google soit déjà utilisé. Essayez de vous connecter, ou choisissez un autre pseudo!');
                    }
                }).finally(() => {
                    this.disabled = false;
                })
            },
            onManualLogin: function() {
                this.disabled = false;
                this.doLogin({username: this.loginUsername, password: this.loginPassword}).then((success) => {
                    this.disabled = false;
                    if (success) {
                        this.$router.go(-1);
                    }
                });
            },
            onManualRegister: function () {
                // Validate
                if (!correctUsername(this.registerUsername)) {
                    return;
                }

                if (this.registerEmail.length > 0 && !/\S+@\S+\.\S+/.test(this.registerEmail))  {
                    alert('Votre adresse mail ne semble pas être au bon format. Vous n\'êtes pas obligé(e) de la renseigner.');
                    return;
                }

                if (!correctPasswords(this.registerPassword, this.registerPasswordConfirm)) {
                    return;
                }

                const postdata = {
                    user_registration: {
                        username: this.registerUsername,
                        email: this.registerEmail,
                        plainPassword: {
                            first: this.registerPassword,
                            second: this.registerPasswordConfirm
                        }
                    }
                };

                this.disabled =  true;
                this.post('register', postdata).then((r) => {
                    if (!r.success) {
                        alert('Une erreur s\'est produite lors de la création de votre compte. Vérifiez le formulaire ou réésayez plus tard.');
                        console.log(r);
                        return;
                    }

                    alert('Votre compte a été créé avec succès! Vous pouvez vous connecter dès maintenant.')
                }).catch((e) => {
                    alert('Une erreur s\'est produite lors de la création de votre compte. Veuillez réésayer plus tard.');
                    console.log(e);
                }).finally(() => {
                    this.disabled = false;
                })
            }
        },
        data: function () {
            return {
                params: {
                    client_id: "69926499564-ahrpirp0anl3fjlqlppkmq53ou2tkobk.apps.googleusercontent.com",
                },
                googleRegisterUsername: '',
                loginUsername: '',
                loginPassword: '',
                registerUsername: '',
                registerEmail: '',
                registerPassword: '',
                registerPasswordConfirm: '',
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
