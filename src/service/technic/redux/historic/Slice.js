import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoadingHistoric: false,
    isLoadingOlderHistoric: false,
    historics: [],
    pageNo: 0,
    pageSize: 20,
    isHistoricScreen: false,
    totalElements: 0
}

export const HistoricSlice = createSlice({
    name: "actionHistoric",
    initialState,
    reducers: {
        setHistorics: (state, action) => {
            state.historics = action.payload;
        },
        setIsLoadingHistoric: (state, action) => {
            state.isLoadingHistoric = action.payload;
        },
        setPageNo: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
        },
        setHistoricScreen: (state, action) => {
            state.isHistoricScreen = action.payload;
        },
        setTotalElements: (state, action) => {
            state.totalElements = action.payload;
        },
        addHistorics: (state, action) => {
            state.historics = state.historics.concat(action.payload)
        },
        setIsLoadingOlderHistoric: (state, action) => {
            state.isLoadingOlderHistoric = action.payload
        }
    }
})

export const { setHistorics, setIsLoadingHistoric, setPageNo, setPageSize, setHistoricScreen, setTotalElements, addHistorics, setIsLoadingOlderHistoric } = HistoricSlice.actions;

export default HistoricSlice.reducer;