<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>
                        {{ $t('demo.select') }}
                    </h4>
                </b-jumbotron>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=12 offset=0 >
                <b-list-group class="demo-model-list-group-parent">
                    <b-list-group-item
                        class="demo-model-list-group"
                        v-for="(model, idx) in models"
                        :key="idx"
                        href="javascript:void(0)"
                        @click="onModelClick(model)"
                        :data-model-name="model.name"
                    >{{ model.name }}</b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>
<style>
.demo-model-list-group-parent{
display:flex;
flex-direction:row;
justify-content:center;
align-items:center;
}
.demo-model-list-group {
    height: 40vh;
    width: 20vw;
    margin: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #E9ECEF !important;
    border-radius: 5px !important;
}

.demo-model-list-group:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
</style>
<script>
import demo from '@/service/demo/index.js';
import isElectron from 'is-electron';
import tmActions from '@/store/actions/threatmodel.js';

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
    }
};

</script>
