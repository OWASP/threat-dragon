<template>
    <div class="theme-toggle" @click="toggleTheme">
        <div class="toggle-slider" :class="{ 'slider-dark': isDark }">
            <div class="slider-circle" :class="{ 'circle-dark': isDark }"></div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        isDark() {
            return this.$store.getters['theme/currentTheme'] === 'dark';
        }
    },
    methods: {
        toggleTheme() {
            this.$store.commit('theme/toggleTheme');
        }
    }
};
</script>

<style lang="scss" scoped>
.theme-toggle[data-v-51f78a55] {
    margin-top: 4px;
    cursor: pointer;
    border-radius: 20px;
    width: 55px;
    /* This sets the width of the switch */
    height: 30px;
    /* This sets the height of the switch */
    display: flex;
    align-items: center;
    padding: 3px;
    /* Adjust padding if needed */
    transition: background-color 0.2s;
}

.toggle-slider[data-v-51f78a55] {
    background: $white;
    border-radius: 15px;
    width: 100%;
    height: 100%;
    position: relative;
}

.slider-circle[data-v-51f78a55] {
    background-color: $orange;
    border-radius: 50%;
    width: 18px;
    /* Circle size adjusted for padding */
    height: 18px;
    /* Circle size adjusted for padding */
    position: absolute;
    transition: transform 0.2s;
    top: 50%;
    left: 50%;
    transform: translate(-125%, -50%);
    /* Center the circle initially */
}

.slider-dark[data-v-51f78a55] {
    background: #333;
    /* Dark mode color for the slider */
}

.circle-dark[data-v-51f78a55] {
    /* Circle moves to the right edge inside the slider minus the circle width and padding */
    transform: translateX(calc(100% - 14px)) translateY(-50%);
}
</style>