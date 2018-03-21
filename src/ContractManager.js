import { abi } from "./abi";
import Web3 from "web3";

class ContractManager {
  contract = null;

  ensureContractInitialised = async () => {
    // Maybe we've already intialised
    if (this.contract) return;

    if (
      typeof window.web3 === "undefined" ||
      typeof window.web3.currentProvider === "undefined"
    ) {
      throw new Error(
        "You must install Metamask and log in in order to use this application."
      );
    }

    this.web3 = new Web3(window.web3.currentProvider);

    const network = await this.web3.eth.net.getNetworkType();
    if (network !== "rinkeby") {
      throw new Error(
        "Switch Metamask to the Rinkeby network to use this application."
      );
    }

    this.contract = new this.web3.eth.Contract(
      abi,
      "0xbF62A9067217309D3DBd7Aed42f6F3E3a72cAF71"
    );
  };

  getMessage = async () => {
    await this.ensureContractInitialised();

    return await this.contract.methods.message().call();
  };

  updateMessage = async (newMessage, price) => {
    await this.ensureContractInitialised();

    const value = this.web3.utils.toWei(price, "ether");

    const from = await new Promise((resolve, reject) => {
      // Specifically need to talk to Metamask's web3 here.
      // It's an older version of web3 so it doesn't have the promise API.
      window.web3.eth.getAccounts((err, accounts) => {
        if (err) return reject(err);
        resolve(accounts[0]);
      });
    });

    await this.contract.methods.updateMessage(newMessage).send({
      from,
      value
    });
  };

  getLastAmountPaid = async () => {
    await this.ensureContractInitialised();

    const result = await this.contract.methods.lastAmountPaid().call();

    return this.web3.utils.fromWei(result, "ether");
  };

  subscribeForUpdates = async callback => {
    await this.ensureContractInitialised();

    this.contract.events.MessageUpdated(callback);
  };
}

export default new ContractManager();
