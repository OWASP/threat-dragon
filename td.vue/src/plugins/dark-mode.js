export async function toggleDarkMode() {
    if (window.darkMode) {
        const isDark = await window.darkMode.toggle();
        document.body.className = isDark ? 'dark' : 'light';
        console.log('Darkmode status: ' + isDark);
        return isDark;
    } else {
        console.error('Dark mode API is not available.');
        return null;
    }
}
