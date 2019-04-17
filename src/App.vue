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
        margin-top: 50px;
    }
</style>

<script>
    import TheHeader from "./components/TheHeader";

    export default {
        components: {TheHeader}
    }
</script>
