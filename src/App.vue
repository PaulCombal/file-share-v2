<template>
    <div id="app">
        <TheHeader/>
        <router-view/>
    </div>
</template>

<style lang="scss">
    * {
        font-family: 'PT Sans', sans-serif;
    }

    #app {
        margin-top: 50px; // header height
    }
</style>

<script>
    import TheHeader from "./components/TheHeader";

    export default {
        components: {TheHeader},
        mounted: function () {
            let logged = localStorage.getItem('logged');
            if (logged) {
                this.$store.commit('changeLogged', true);
                this.$store.dispatch('updateUserProfile');
            }
        }
    }
</script>
