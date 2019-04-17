<template>
    <div class="container">
        <div class="row">
            <div class="col text-center mt-4">
                <div class="title">
                    IPFS SHARE
                </div>
                <div>
                    <input class="w-50 mt-4" title="Rechercer un fichier IPFS" autofocus @change="onSubmit"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .title {
        font-family: 'Francois One', monospace;
        font-size: xx-large;
    }
</style>

<script>
    export default {
        name: 'home',
        methods: {
            onSubmit: function (event) {
                const value = event.target.value;
                if (value)
                    this.$router.push({path: '/search', query: {q: value}})
            }
        }
    }
</script>
