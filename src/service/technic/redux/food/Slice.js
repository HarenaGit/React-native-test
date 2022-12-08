import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    popularFood: [],
    isLoadingPopularFood: false
}

export const foodSlice = createSlice({
    name: "food",
    initialState,
    reducers: {
        setPopularFood: (state, action) => {
            state.popularFood = action.payload;
        },
        setIsLoadingPopularFood: (state, action) => {
            state.isLoadingPopularFood = action.payload
        }
    }
})

export const { setPopularFood, setIsLoadingPopularFood } = foodSlice.actions;

export default foodSlice.reducer;