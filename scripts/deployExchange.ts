import { ethers } from "hardhat";

async function main() {
  const [deployer, owner] = await ethers.getSigners();

  const Greeter = await ethers.getContractFactory("Exchange");

  const Token = await ethers.getContractFactory("YToken");
  const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";
  const token = await Token.deploy();
  const greeter = await Greeter.deploy(
    "0xAf9Cb9a4775ffDd8A15E3101169f9c2046999950",
    "10"
  );

  await token.transfer(
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    ethers.parseEther("10000"),
    { from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" }
  );

  const b = await token.balanceOf("0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
  console.log("hardhat2 balance", ethers.formatUnits(b));

  await greeter.depositEther({
    from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    value: ethers.parseUnits("999"),
  });

  await token.approve(greeter.target, ethers.parseUnits("12000"), {
    from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  });

  await greeter.depositToken(token.target, ethers.parseUnits("12000"), {
    from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  });

  // 添加流动性

  const res1 = await greeter.makeOrder(
    token.target,
    ethers.parseUnits("1000"),
    ETHER_ADDRESS,
    ethers.parseUnits("0.1"),
    { from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" }
  );
  console.log("rrrr", res1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
