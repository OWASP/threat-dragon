<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center setdark" :class="{ 'dark-mode': currentTheme === 'dark' }">
                    <h4>
                        {{ $t('demo.select') }}
                    </h4>
                </b-jumbotron>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=6 offset=3>
                <b-list-group>
                    <b-list-group-item
                        v-for="(model, idx) in models"
                        :key="idx"
                        href="javascript:void(0)"
                        @click="onModelClick(model)"
                        :data-model-name="model.name"
                        class="setdark" 
                        :class="{ 'dark-mode': currentTheme === 'dark' }"
                    >{{ model.name }}</b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<style lang="scss" scoped>
.dark .setdark{
  background-color: $dark-card-bg;
  color: $dark-text;
  border-color: $dark-border;
}
</style>

<script>
import demo from '@/service/demo/index.js';
import isElectron from 'is-electron';
import tmActions from '@/store/actions/threatmodel.js';
import { mapGetters } from 'vuex';

export default {
    name: 'SelectDemoModel',
    data() {
        return {
            models: demo.models
        };
    },
    mounted() {
        this.$store.dispatch(tmActions.clear);
        this.$store.dispatch(tmActions.fetchAll);
    },
    methods: {
        onModelClick(model) {
            this.$store.dispatch(tmActions.selected, model.model);
            if (isElectron()) {
                // tell any electron server that the model has changed
                window.electronAPI.modelOpened(model.name);
            }
            const params = Object.assign({}, this.$route.params, { threatmodel: model.name });
            this.$router.push({ name: 'localThreatModel' , params });
        }
    },
    computed: {
        ...mapGetters({
            themeClass: 'theme/currentTheme' // Accessing the 'currentTheme' getter from the 'theme' module
        })
    }
};

</script>
