<template>
    <div id="header">
        <div class="flex-1">
            <router-link to="/">
                <img src="../assets/ipfs.png" alt="placeholder" width="40" height="40"/>
            </router-link>
        </div>

        <div class="flex-1" v-if="$store.getters.show_search">
            <input class="header-input" placeholder="Recherche rapide.."/>
        </div>

        <div class="flex-1 text-right">
            <router-link to="/login">
                <i class="fa fa-user mr-1"></i> Espace personnel
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TheHeader'
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    #header {
        height: 50px;
        position: fixed;
        margin: 0;
        padding: 0 10px;
        top: 0;
        left: 0;
        width: 100vw;
        display: flex;
        align-items: center;
    }

    #header a {
        text-decoration: none;
        color: gray;
    }

    .flex-1 {
        flex: 1;
    }

    .header-input {
        width: 100%;
        padding: 0 10px;
        &::before {
            content: 'lol';
        }
    }
</style>
