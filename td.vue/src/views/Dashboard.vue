<template>
    <div>
        <b-row>
            <b-col>
                <b-jumbotron header="Welcome!">
                    <p>
                        You;re ready to start making your application designs more secure.
                        You can open an existing threat model or create a new one by choosing
                        one of the options below.
                    </p>
                </b-jumbotron>
            </b-col>
        </b-row>
        <b-row>
            <!-- TODO: Make these components -->
            <b-col lg>
                <b-jumbotron class="text-center">
                    <span>
                        <font-awesome-icon
                        :icon="['fab', 'github']"
                        size="4x"
                        class="action-icon"
                        ></font-awesome-icon>
                    </span>
                    <br />
                    <span>
                        Open an existing threat model from a GitHub repo
                    </span>
                </b-jumbotron>
            </b-col>
            <b-col lg>
                <b-jumbotron class="text-center">
                    <span>
                        <font-awesome-icon
                        icon="plus"
                        size="4x"
                        class="action-icon"
                        ></font-awesome-icon>
                    </span>
                    <br />
                    <span>
                        Create a completely new, empty threat model
                    </span>
                </b-jumbotron>
            </b-col>
            <b-col lg>
                <b-jumbotron class="text-center">
                    <span>
                        <font-awesome-icon
                        icon="cloud-download-alt"
                        size="4x"
                        class="action-icon"
                        ></font-awesome-icon>
                    </span>
                    <br />
                    <span>
                        Download and explore a sample threat model
                    </span>
                </b-jumbotron>
            </b-col>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
.action-icon {
    color: $theme-primary;
    margin-bottom: 15px;
}
</style>

<script>
export default {
    name: 'Dasboard'
};
</script>
