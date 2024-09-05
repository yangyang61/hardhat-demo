import { Button, Card, Col, Divider, Row, Table } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import web3 from "web3";

function covert(n: string) {
  if (!n) return;
  return web3.utils.fromWei(n, "ether");
}
const Order = () => {
  const state = useSelector((state: any) => state.order);
  console.log(state);

  const columns = [
    {
      title: "时间",
      dataIndex: "timestamp",
      render: (value: any) => {
        return value
          ? moment(value.toString() * 1000).format("YYYY-MM-DD HH:mm:ss")
          : "";
      },
    },
    {
      title: "YT",
      dataIndex: "amountGet",
      render: (value: any) => {
        return value && covert(value);
      },
    },
    {
      title: "ETH",
      dataIndex: "amountGive",
      render: (value: any) => {
        return value && covert(value);
      },
    },
  ];

  const columns1 = [
    ...columns,
    {
      title: "操作",
      dataIndex: "options",
      render: (value: any, record: any) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              window.web.exchangeContract.methods
                .cancelOrder(record.id)
                .send({ from: window.web.account });
            }}>
            取消
          </Button>
        );
      },
    },
  ];

  const columns2 = [
    ...columns,
    {
      title: "操作",
      dataIndex: "options",
      render: (value: any, record: any) => {
        return (
          <Button
            danger
            onClick={() => {
              window.web.exchangeContract.methods
                .fillOrder(record.id)
                .send({ from: window.web.account });
            }}>
            买入
          </Button>
        );
      },
    },
  ];

  const getRenderOrder = (order: any, type: number) => {
    if (!window.web) return [];
    // 1. 排除已完成一级取消订单;
    let filterIds = [...order.cancelOrders, ...order.fillOrder].map((item) =>
      item.id.toString()
    );
    let pendingOrders = order.allOrder.filter(
      (item: any) => !filterIds.includes(item.id.toString())
    );
    console.log("aaaa", window.web.account);

    if (type === 1) {
      return pendingOrders.filter(
        (item: any) =>
          item.user.toLowerCase() === window.web.account.toLowerCase()
      );
    } else {
      return pendingOrders.filter(
        (item: any) =>
          item.user.toLowerCase() !== window.web.account.toLowerCase()
      );
    }
  };

  const addLiquidity = async () => {
    const tokenGet = window.web.exchangeContract.options.address;
    console.log("tokenGet", tokenGet);
    const amountGet = window.web.web3.utils.toWei("0.1", "ether");
    const tokenGive = window.web.tokenContract.options.address;
    const amountGive = window.web.web3.utils.toWei("10000", "ether");

    await window.web.exchangeContract.methods
      .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
      .send({ from: window.web.account });
  };
  return (
    <div>
      <Divider>Order</Divider>
      <Row gutter={10}>
        <Col span="8">
          <Card title="Completed Orders">
            <Table
              rowKey={(record: any) => record.id.toString()}
              dataSource={state.fillOrder}
              columns={columns}
            />
          </Card>
        </Col>
        <Col span="8">
          <Card
            title="Trading(Create) Orders"
            extra={
              <Button
                type="primary"
                onClick={addLiquidity}>
                ADD
              </Button>
            }>
            <Table
              rowKey={(record: any) => record.id}
              dataSource={getRenderOrder(state, 1)}
              columns={columns1}
            />
          </Card>
        </Col>
        <Col span="8">
          <Card title="Trading(List) Orders">
            <Table
              rowKey={(record: any) => record.id}
              dataSource={getRenderOrder(state, 2)}
              columns={columns2}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Order;
