<template>
    <select>
        <optgroup :label="p" v-for="p in Object.keys(formattedCats)" :key="'main-' + p">
            <option v-for="c in formattedCats[p]" :key="'sub' + c.id">
                {{ c.name }}
            </option>
        </optgroup>
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
            this.$store.dispatch('fetchCategories').then((cats) => {
                console.log('cats', cats);
                let middle = {}; // Avoid multiple renders

                // Init parent categories
                cats.filter(x => x.parent === 0).forEach((c) => {
                    middle[c.name] = [];
                    middle[c.name].push(c);
                });

                // Fill children categories
                cats.filter(x => x.parent > 0).forEach((c) => {
                    const parent = cats.find(x => x.id = c.parent);
                    middle[parent.name].push(c);
                });

                this.formattedCats = middle;
            });
        }
    }
</script>

<style scoped lang="scss">

</style>
