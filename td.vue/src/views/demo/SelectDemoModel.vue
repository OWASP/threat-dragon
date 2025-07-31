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
            <b-col md=6 offset=3>
                <b-list-group>
                    <b-list-group-item
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

<script>
import demo from '@/service/demo/index.js';
import isElectron from 'is-electron';
import tmActions from '@/store/actions/threatmodel.js';
import schema from '@/service/schema/ajv';
import tmBom from '@/service/migration/tmBom/tmBom';

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
            if (schema.isTmBom(model.model)) {
                this.$store.dispatch(tmActions.selected, tmBom.read(model.model));
            } else {
                this.$store.dispatch(tmActions.selected, model.model);
            }
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
