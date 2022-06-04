import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null,userValue:0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
   // await contract.methods.set(10).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  submit_to_bc = async() =>{
    const { accounts, contract } = this.state;
    await contract.methods.set(this.state.userValue).send({ from: accounts[0] });
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  }
  updateInputValue(evt) {
    const val = evt.target.value;
    // ...       
    this.setState({
      userValue: val
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
       
        <div>
          <h1>Excited to write new value on Contract</h1>
          <p>Set your favourate number in this contract</p>
          <input value={this.state.userValue} onChange={evt => this.updateInputValue(evt)}/>
          <button type="button" onClick={this.submit_to_bc}>Write this value on Smart Contract</button>
        </div>
        <h2>Current favourate number on contract is: {this.state.storageValue}</h2>
        <br></br>
        <i>If number above not updated instantly, then please wait for ETH(Ropsten) network to complete the transaction </i>
       
       <br></br> <p>Contract address - 0xf0A63b64E168298E0d4D941F57fe2c447491acf9</p>
       <br></br> <b>Thanks - <a href="http://khanfaraaz.com/">Faraaz Khan</a></b>
      </div>
    );
  }
}

export default App;
