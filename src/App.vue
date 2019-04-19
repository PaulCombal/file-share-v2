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
            this.post('category/read').then((r) => {
                this.$store.commit('setCategories', r.categories);
            })

            let jwt = localStorage.getItem('jwt');
            if (jwt) {
                this.$store.commit('changeToken', jwt);
            }
        }
    }
</script>
