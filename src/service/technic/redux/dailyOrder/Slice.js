import { createSlice } from "@reduxjs/toolkit";
import DailyOrderEnum from "../../../../data/constant/DailyOrderEnum";
import page from '../../../../data/constant/page';

const initialState = {
    orders: [],
    loading: false,
    pageNo: page.pageNo,
    pageSize: page.pageSize,
    loadingOlderData: false,
    filter: {
        status: DailyOrderEnum.ALL.name
    },
    totalElements: 0,
    currentOrderDate: "",
    currentOrder: {},
    OrderDetailVisibility: false,
    loaderVisibility: {
        visible: false,
        text: ""
    },
    homeOrder: [],
    homeOrderLoading: false
}

export const dailyOrderSlice = createSlice({
    name: "dailOrders",
    initialState,
    reducers: {
        setDailyOrders: (state, action) => {
            state.orders = action.payload;
        },

        addDailyOrders: (state, action) => {
            state.orders = state.orders.concat(action.payload)
        },
        setIsDailyOrdersLoading: (state, action) => {
            state.loading = action.payload
        },
        setIsDailyOlderOrdersLoading: (state, action) => {
            state.loadingOlderData = action.payload
        },
        setPageNo: (state, action) => {
            state.pageNo = action.payload
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload
        },
        setFilterStatus: (state, action) => {
            state.filter = {
                ...state.filter,
                status: action.payload
            }
        },
        setTotalElements: (state, action) => {
            state.totalElements = action.payload
        },
        setCurrentOrderDate: (state, action) => {
            state.currentOrderDate = action.payload
        },
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload
        },
        setOrderDetailVisibility: (state, action) => {
            state.OrderDetailVisibility = action.payload
        },
        setLoaderVisibility: (state, action) => {
            state.loaderVisibility = {
                visible: action.payload?.visible,
                text: action.payload?.text
            }
        },
        setHomeOrder: (state, action) => {
            state.homeOrder = action.payload;
        },
        setHomeOrderLoading: (state, action) => {
            state.homeOrderLoading = action.payload;
        }
    }
})

export const {
    setDailyOrders, addDailyOrders, setIsDailyOrdersLoading,
    setPageNo, setPageSize, setIsDailyOlderOrdersLoading,
    setFilterStatus, setTotalElements, setCurrentOrderDate,
    setCurrentOrder, setOrderDetailVisibility, setLoaderVisibility,
    setHomeOrder, setHomeOrderLoading } = dailyOrderSlice.actions;

export default dailyOrderSlice.reducer;