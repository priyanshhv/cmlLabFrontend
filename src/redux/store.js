// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import publicationReducer from './publicationSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        publication: publicationReducer,
    },
});

export default store;
