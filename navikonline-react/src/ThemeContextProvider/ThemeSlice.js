import { createSlice } from "@reduxjs/toolkit";

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state.isDarkMode);
        localStorage.setItem("theme", serializedState);
    } catch (err) {
        console.error("Error saving state to local storage:", err);
    }
};

const loadState = () => {
    try {
        const serializedState = localStorage.getItem("theme");
        return serializedState !== null ? JSON.parse(serializedState) : false;   
    } catch (err) {
        console.error("Error loading state from local storage:", err);
        return false;   
    }
};

const ThemeSlice = createSlice({
    name: 'theme',
    initialState: {
        isDarkMode: loadState(),   
    },
    reducers: {
        toggleTheme: (state) => {
            state.isDarkMode = !state.isDarkMode;
            document.body.classList.toggle('dark-mode', state.isDarkMode);
            saveState(state);   
        },
    },
});

 if (loadState()) {
    document.body.classList.add('dark-mode');
}

export const { toggleTheme } = ThemeSlice.actions;

export default ThemeSlice.reducer;
