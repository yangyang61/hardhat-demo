import { Divider } from "antd";
import { useSelector } from "react-redux";

const Balance = () => {
  const balance = useSelector((state: any) => state.balance);
  return (
    <div>
      <Divider>Balance</Divider>
      <h3>钱包中的ETH：{balance.EtherWallet}</h3>
      <h3>钱包中的YT {balance.TokenWallet}</h3>
      <h3>交易所中的ETH：{balance.EtherExchange}</h3>
      <h3>交易所中的YT：{balance.TokenExchange}</h3>
    </div>
  );
};
export default Balance;
