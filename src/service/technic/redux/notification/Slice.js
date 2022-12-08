import { createSlice } from '@reduxjs/toolkit';
import page from '../../../../data/constant/page';

const initialState = {
    isLoadingNotification: false,
    notifications: [],
    numberOfNotification: 0,
    pageNo: 0,
    pageSize: page.pageSize,
    isNotificationScreen: false,
    totalElements: 0
}

export const NotificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        setIsLoadingNotification: (state, action) => {
            state.isLoadingNotification = action.payload;
        },
        setNumberOfNotification: (state, action) => {
            state.numberOfNotification = action.payload;
        },
        setPageNo: (state, action) => {
            state.pageNo = action.payload;
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
        },
        setNotificationScreen: (state, action) => {
            state.isNotificationScreen = action.payload;
        },
        setTotalElements: (state, action) => {
            state.totalElements = action.payload;
        }
    }
})

export const { setNotifications, setIsLoadingNotification, setNumberOfNotification, setPageNo, setPageSize, setNotificationScreen, setTotalElements } = NotificationSlice.actions;

export default NotificationSlice.reducer;