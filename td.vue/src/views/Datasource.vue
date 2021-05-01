<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>Select a GitHub repository from the list below</h4>
                </b-jumbotron>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=6 offset=3>
                <b-list-group>
                    <b-list-group-item
                        v-for="(repository, idx) in repositories"
                        :key="idx"
                        to="/"
                    >{{ repository.name }}</b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
// TODO: This same page can be used for selecting a Github repository, 
// a branch, or any other data sources.  For now, it is only GitHub
// As new datasources are added, this page can be made dynamic to accept those
// and store the selections in the vuex store
export default {
    name: 'Datasource',
    data: () => {
        return {
            repositories: [
                { name: 'test1', value: 'test1' },
                { name: 'test2', value: 'test2' },
                { name: 'test3', value: 'test3' },
                { name: 'test4', value: 'test4' },
                { name: 'test5', value: 'test5' },
                { name: 'test6', value: 'test6' },
                { name: 'test7', value: 'test7' },
                { name: 'test8', value: 'test8' }
            ]
        };
    }
};
</script>
