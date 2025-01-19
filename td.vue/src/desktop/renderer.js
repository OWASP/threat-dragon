document.addEventListener('DOMContentLoaded', async () => {
    const toggleButton = document.getElementById('toggle-dark-mode');
    const systemButton = document.getElementById('system-dark-mode');
    const themeStatus = document.getElementById('theme-status');

    // Initial theme check
    const currentTheme = await window.darkMode.get();
    updateThemeStatus(currentTheme);

    if (toggleButton) {
        toggleButton.addEventListener('click', async () => {
            const theme = await window.darkMode.toggle();
            updateThemeStatus(theme);
        });
    }

    if (systemButton) {
        systemButton.addEventListener('click', async () => {
            const theme = await window.darkMode.system();
            updateThemeStatus(theme);
        });
    }

    function updateThemeStatus(theme) {
        if (themeStatus) {
            themeStatus.textContent = `Current Theme: ${
                theme.shouldUseDarkColors ? 'Dark' : 'Light'
            } (Source: ${theme.themeSource})`;
        }
    }
});
