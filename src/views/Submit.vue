<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h2 class="title mb-3">SOUMETTRE UN FICHIER</h2>
                <div class="text-muted mb-4">
                    <i class="fa fa-info-circle"></i> Votre fichier ne sera disponible que lorsqu'une personne le distribue.
                    Au début, sa diffusion ne ne sera assurée que par vous même, assurez vous alors de laisser IPFS Desktop ouvert!
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="form-group">
                    <label for="hash-input">Titre de votre fichier</label>
                    <br/>
                    <input placeholder="Ubuntu, Blender..." id="hash-input" class="w-50"/>
                </div>

                <div class="form-group">
                    <label for="description-input" class="mt-3">Description longue <span class="text-muted">(Optionnel)</span></label>
                    <br/>
                    <textarea id="description-input" class="w-50" placeholder="Blender est un logiciel de modélisation 3D..."></textarea>
                </div>

                <div class="form-group">
                    <label>Catégorie</label>
                    <br/>
                    <CategorySelector/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CategorySelector from "../components/CategorySelector";
    export default {
        name: "Submit",
        components: {CategorySelector},
        data: function () {
            return {};
        }
    }
</script>

<style scoped>
    .title {
        font-family: 'Francois One', monospace;
    }

    label {
        font-weight: bolder;
    }
</style>
