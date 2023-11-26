// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import digitizerReducer from './digitizerSlice';

export default configureStore({
    reducer: {
        digitizer: digitizerReducer,
    },
});