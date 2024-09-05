import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    fillOrder: [],
    cancelOrders: [],
    allOrder: [],
  },
  reducers: {
    setFillOrder(state, action) {
      state.fillOrder = action.payload;
    },
    setAllOrder(state, action) {
      state.allOrder = action.payload;
    },
    setCancelOrders(state, action) {
      state.cancelOrders = action.payload;
    },
  },
});

export default orderSlice.reducer;

export const { setCancelOrders, setAllOrder, setFillOrder } =
  orderSlice.actions;

export const loadCancelOrderData: any = createAsyncThunk(
  "order/fetchCancelOrderData",
  async (data: any, { dispatch }) => {
    const { exchangeContract } = data;

    const res = await exchangeContract.getPastEvents("Cancel", {
      fromBlock: 0,
      toBlock: "latest",
    });

    const cancelOrders = res.map((item: any) => item.returnValues);
    dispatch(setCancelOrders(cancelOrders));
  }
);

export const loadFillOrderData: any = createAsyncThunk(
  "order/fetchFillOrderData",
  async (data: any, { dispatch }) => {
    const { exchangeContract } = data;

    const res = await exchangeContract.getPastEvents("Trade", {
      fromBlock: 0,
      toBlock: "latest",
    });

    const fillOrder = res.map((item: any) => item.returnValues);
    dispatch(setFillOrder(fillOrder));
  }
);
export const loadAllOrderData: any = createAsyncThunk(
  "order/fetchAllOrderData",
  async (data: any, { dispatch }) => {
    const { exchangeContract } = data;

    const res = await exchangeContract.getPastEvents("NewOrder", {
      fromBlock: 0,
      toBlock: "latest",
    });

    const allOrder = res.map((item: any) => item.returnValues);
    dispatch(setAllOrder(allOrder));
  }
);
