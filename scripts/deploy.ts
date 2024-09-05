import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Greeter = await ethers.getContractFactory("YToken");

  const greeter = await Greeter.deploy({
    from: "",
  });

  const balanceOf = await greeter.balanceOf(deployer.address);

  console.log("balanceOf: ", ethers.formatUnits(balanceOf));

  const wei = ethers.parseUnits("100");

  const res = await greeter.transfer(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    wei,
    {
      from: deployer.address,
    }
  );

  console.log(
    "to 9950 balance:",
    ethers.formatUnits(
      await greeter.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    )
  );
  console.log("Greeter deployed to:", await greeter.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
