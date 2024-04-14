<template>
    <button @click="toggleTheme">Toggle Theme</button>
</template>
  
<script>
export default {
    methods: {
        toggleTheme() {
            // Corrected to use the namespaced mutation
            this.$store.commit('theme/toggleTheme');
        }
    }
};
</script>