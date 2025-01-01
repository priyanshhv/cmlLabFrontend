// redux/publicationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    publications: [],
};

const publicationSlice = createSlice({
    name: 'publication',
    initialState,
    reducers: {
        setPublications(state, action) {
            state.publications = action.payload;
        },
    },
});

export const { setPublications } = publicationSlice.actions;
export default publicationSlice.reducer;
