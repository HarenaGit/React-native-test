import { configureStore } from "@reduxjs/toolkit";
import dailyOrderReducer from "./dailyOrder/Slice";
import foodReducer from "./food/Slice";
import authReducer from "./auth/Slice";
import notificationReducer from "./notification/Slice";
import historicReducer from "./historic/Slice";

export const store = configureStore({
    reducer: {
        dailyOrders: dailyOrderReducer,
        food: foodReducer,
        auth: authReducer,
        notification: notificationReducer,
        actionHistoric: historicReducer
    }
});
