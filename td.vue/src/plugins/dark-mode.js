export async function toggleDarkMode() {
    if (window.darkMode) {
        const isDark = await window.darkMode.toggle();
        document.body.className = isDark ? 'dark' : 'light';
        return isDark;
    } else {
        console.error('Dark mode API is not available.');
        return null;
    }
}

export async function setSystemTheme() {
    if (window.darkMode) {
        await window.darkMode.system();
        const theme = await window.darkMode.get();
        document.body.className = theme.shouldUseDarkColors ? 'dark' : 'light';
        return theme;
    } else {
        console.error('Dark mode API is not available.');
        return null;
    }
}
