
import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";

const reducers = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
});

export default reducers;