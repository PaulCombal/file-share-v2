<template>
    <select>
        <option>

        </option>
    </select>
</template>

<script>
    export default {
        name: "CategorySelector",
        data: function() {
            return {
                formattedCats: []
            }
        },
        mounted: function (){
            const cats = this.$store.getters.categories;
            let middle = []; // Avoid multiple renders
            cats.forEach((e) => {
                // TODO
            })
        }
    }
</script>

<style scoped lang="scss">

</style>
