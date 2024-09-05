import { useEffect } from "react";
import json from "../build/contracts/YToken.sol/YToken.json";
import exchangeJson from "../build/contracts/Exchange.sol/Exchange.json";

import Web3 from "web3";
import { useDispatch } from "react-redux";
import { loadBalanceData } from "../redux/slices/balanceSlice";
import {
  loadAllOrderData,
  loadCancelOrderData,
  loadFillOrderData,
} from "../redux/slices/orderSlice";

function Content() {
  const dispatch = useDispatch();
  async function init() {
    const web3 = new Web3(window.ethereum || "http://localhost:8545");

    const accounts = await web3.eth.requestAccounts();

    const tokenContract = await new web3.eth.Contract(
      json.abi,
      "0x5fbdb2315678afecb367f032d93f642f64180aa3"
    );
    const exchangeContract = await new web3.eth.Contract(
      exchangeJson.abi,
      "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
    );

    window.web = {
      web3,
      account: accounts[0],
      tokenContract,
      exchangeContract,
    };
    dispatch(
      loadBalanceData({
        web3,
        account: accounts[0],
        tokenContract,
        exchangeContract,
      })
    );

    dispatch(
      loadAllOrderData({
        web3,
        account: accounts[0],
        tokenContract,
        exchangeContract,
      })
    );
    dispatch(
      loadFillOrderData({
        web3,
        account: accounts[0],
        tokenContract,
        exchangeContract,
      })
    );

    exchangeContract.events.Cancel().on("data", (event) => {
      dispatch(
        loadCancelOrderData({
          web3,
          account: accounts[0],
          tokenContract,
          exchangeContract,
        })
      );
    });
    exchangeContract.events.NewOrder().on("data", (event) => {
      dispatch(
        loadAllOrderData({
          web3,
          account: accounts[0],
          tokenContract,
          exchangeContract,
        })
      );
    });
    exchangeContract.events.Trade().on("data", (event) => {
      dispatch(
        loadBalanceData({
          web3,
          account: accounts[0],
          tokenContract,
          exchangeContract,
        })
      );
      dispatch(
        loadFillOrderData({
          web3,
          account: accounts[0],
          tokenContract,
          exchangeContract,
        })
      );
    });
  }
  useEffect(() => {
    init();
  }, []);
  return <div>content</div>;
}

export default Content;
