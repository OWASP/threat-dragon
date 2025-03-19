<template>
    <b-container fluid>
        <div class="welcome-jumbotron">
            <b-row class="text-center mb-2">
                <b-col md="12">
                    <h1 class="display-3 text-center">{{ $t("tos.title") }}</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="12">
                    <p class="td-description mt-5">
                        {{ $t("tos.content") }}
                    </p>
                </b-col>
            </b-row>
        </div>
    </b-container>
</template>

<style lang="scss" scoped>
/* Recreating BootstrapVue's b-jumbotron styling */
.welcome-jumbotron {
    background-color: #f8f9fa; /* Light grey background like BootstrapVue jumbotron */
    padding: 3rem 2rem; /* Increase padding to match BootstrapVue */
    border-radius: 0.3rem; /* Add rounded corners */
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* Light shadow */
    margin-bottom: 1.5rem; /* Space below jumbotron */
    text-align: center; /* Ensure text alignment */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.td-description {
    font-size: 20px;
    max-width: 80%;
    margin: 10px auto; /* Ensure description stays centered */
}
</style>

<script>
export default {
    name: 'ToSPage'
};
</script>