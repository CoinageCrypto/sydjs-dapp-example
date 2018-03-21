import React, { PureComponent } from "react";
import Loader from "react-loader-spinner";

import ContractManager from "./ContractManager";

import SydJSLogo from "./logo.png";

import "./App.css";

class App extends PureComponent {
  state = {
    error: false,
    loading: true,
    string: "",
    price: 0,
    newString: "",
    newPrice: 0
  };

  componentDidMount = async () => {
    try {
      // Listen for future updates;
      await ContractManager.subscribeForUpdates(this.updateStringAndPrice);

      // And prime our first one.
      await this.updateStringAndPrice();

      this.setState({ loading: false });
    } catch (error) {
      this.setState({ error });
    }
  };

  updateStringAndPrice = async () => {
    const [price, string] = await Promise.all([
      ContractManager.getLastAmountPaid(),
      ContractManager.getMessage()
    ]);

    this.setState({ price, string });
  };

  onChange = (field, value) => {
    this.setState({ [field]: value });
  };

  onSubmit = async event => {
    event.preventDefault();
    const { newString, newPrice } = this.state;

    if (!newString) {
      return alert("Please add your message.");
    }

    if (!newPrice) {
      return alert("Please add your new price.");
    }

    await ContractManager.updateMessage(newString, newPrice);
  };

  render() {
    const { error, loading, string, price, newString, newPrice } = this.state;

    if (error) {
      return (
        <div className="app">
          <div className="error">
            <p>{error.toString()}</p>
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              You can install Metamask here.
            </a>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="app">
          <Loader type="Rings" color="#00BFFF" height="150" width="150" />
        </div>
      );
    }

    return (
      <div className="app">
        <h1 className="title">Stuff SydJS Says</h1>
        <div>
          <p className="quote">"{string}"</p>
          <div className="credit">
            <img src={SydJSLogo} alt="SydJS" />
            <p>-</p>
          </div>
        </div>
        <div>
          <p className="instructions">Last price was {price}ETH.</p>
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              className="newMessage"
              placeholder="I can't wait to see that picture of Sharkie's kid again."
              onChange={e => this.onChange("newString", e.target.value)}
              value={newString}
            />
            <input
              type="number"
              placeholder="Make it rain!"
              min="0"
              max="100000000000"
              step=".01"
              onChange={e => this.onChange("newPrice", e.target.value)}
              value={newPrice}
            />
            <button type="submit">Update Message</button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
