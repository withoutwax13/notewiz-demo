// store/digitizerSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const digitizerSlice = createSlice({
    name: 'digitizer',
    initialState: {
        digitizedData: {},
        generatedOutput: {},
    },
    reducers: {
        setDigitizedData: (state, action) => {
            state.digitizedData = action.payload;
        },
        setGeneratedOutput: (state, action) => {
            state.generatedOutput = action.payload;
        },
    },
});

export const { setDigitizedData, setGeneratedOutput } = digitizerSlice.actions;

export default digitizerSlice.reducer;