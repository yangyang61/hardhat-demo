import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    TokenWallet: "0",
    TokenExchange: "0",
    EtherWallet: "0",
    EtherExchange: "0",
  },
  reducers: {
    setTokenWallet(state, action) {
      state.TokenWallet = action.payload;
    },
    setTokenExchange(state, action) {
      state.TokenExchange = action.payload;
    },
    setEtherWallet(state, action) {
      state.EtherWallet = action.payload;
    },
    setEtherExchange(state, action) {
      state.EtherExchange = action.payload;
    },
  },
});

export const {
  setEtherExchange,
  setTokenWallet,
  setTokenExchange,
  setEtherWallet,
} = balanceSlice.actions;

export default balanceSlice.reducer;

export const loadBalanceData: any = createAsyncThunk(
  "balance/fetchBalanceData",
  async (data: any, { dispatch }) => {
    const { web3, account, tokenContract, exchangeContract } = data;

    const TokenWallet = await tokenContract.methods.balanceOf(account).call();

    console.log("TokenWallet", TokenWallet);

    dispatch(setTokenWallet(web3.utils.fromWei(TokenWallet, "ether")));

    const TokenExchange = await exchangeContract.methods
      .balanceOf(tokenContract.options.address, account)
      .call();

    dispatch(setTokenExchange(web3.utils.fromWei(TokenExchange, "ether")));

    const EtherWallet = await web3.eth.getBalance(account);
    const EtherExchange = await exchangeContract.methods
      .balanceOf("0x0000000000000000000000000000000000000000", account)
      .call();
    dispatch(setEtherWallet(web3.utils.fromWei(EtherWallet, "ether")));
    dispatch(setEtherExchange(web3.utils.fromWei(EtherExchange, "ether")));
  }
);
