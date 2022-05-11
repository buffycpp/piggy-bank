import './AccountData.scss';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import APIConsumer from '../classes/api-consumer';
import EventBus from '../classes/event-bus';
import { formatCurrency, handleServerError } from '../classes/helpers';
import { toast } from 'react-toastify';
import CurrencyInput from 'react-currency-input-field';

class AccountData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      balance: 0,
      savingsGoal: 0,
      balanceInputValue: '',
      savingsGoalInputValue: ''
    };

    this.onBalanceInputChanged = this.onBalanceInputChanged.bind(this);
    this.onSavingsGoalInputChanged = this.onSavingsGoalInputChanged.bind(this);
  }

  componentDidMount() {
    this.refreshData();
  }

  async refreshData() {
    try {
      const response = await APIConsumer.getAccountData();
      this.setState(response.data.body);
  
      EventBus.broadcast(EventBus.CHANNELS.Global, 'refreshAccountHistory');
    } catch(error) {
      handleServerError(error);
    }
  }

  onBalanceInputChanged(value) {
    this.setState({
      balanceInputValue: value
    });
  }

  onSavingsGoalInputChanged(value) {
    this.setState({
      savingsGoalInputValue: value,
    });
  }

  async onDepositClicked() {
    console.log("Depositing: " + this.state.balanceInputValue);

    if (this.state.balanceInputValue === '') {
      toast.error("You have not entered a valid deposit value");
      return;
    }

    try {
      const response = await APIConsumer.deposit(this.state.balanceInputValue);
      
      if (response.data.body.hitSavingsGoal) {
        // toast.success("Congratulations! You have hit your savings goal!", {
        //   position: "top-right",
        //   theme: "rainbow"
        // });
      }

      toast.success("Funds deposited succesfully");

      this.resetBalanceInput();
      this.refreshData();
    } catch (error) {
      console.log("failed");
      handleServerError(error);
    }
  }

  async onWithdrawClicked() {
    console.log("Withdrawing: " + this.state.balanceInputValue);

    if (this.state.balanceInputValue === '') {
      toast.error("You have not entered a valid withdraw value");
      return;
    }

    try {
      await APIConsumer.withdraw(this.state.balanceInputValue);

      toast.success("Funds withdrawn succesfully");

      this.resetBalanceInput();
      this.refreshData();
    } catch (error) {
      handleServerError(error);
    }

  }

  async onUpdateSavingsGoalClicked() {
    console.log("Updating savings goal: " + this.state.savingsGoalInputValue);

    if (this.state.savingsGoalInputValue === '') {
      toast.error("You have not entered a valid savings goal");
      return;
    }

    try {
      await APIConsumer.updateSavingsGoal(this.state.savingsGoalInputValue);
  
      toast.success("Savings goal updated");
  
      this.resetSavingsGoalInput();
      this.refreshData();
    } catch(error) {
      handleServerError(error);
    }
  }

  resetBalanceInput() {
    this.setState({
      balanceInputValue: ''
    });
  }

  resetSavingsGoalInput() {
    this.setState({
      savingsGoalInputValue: ''
    });
  }

  render() {
    let amountNeeded = this.state.savingsGoal - this.state.balance;
    if (amountNeeded < 0) {
      amountNeeded = 0;
    }

    const intlConfig = { locale: 'en-GB', currency: 'GBP' };

    return (
      <div className="account-data">
        <div className="large-currency-display">
          <div className="amount">{formatCurrency(this.state.balance)}</div>
          <div className="label">balance</div>
        </div>

        <div className="large-currency-display">
          <div className="amount">{formatCurrency(this.state.savingsGoal)}</div>
          <div className="label">savings goal</div>
        </div>

        <p className="savings-goal-info">
          {(amountNeeded === 0 ? `You've hit your savings goal` : `You need ${formatCurrency(amountNeeded)} more to hit your savings goal`)}!
        </p>

        <div className="form-controls">
          <CurrencyInput
            intlConfig={intlConfig}
            value={this.state.balanceInputValue}
            placeholder="amount"
            defaultValue={0}
            decimalsLimit={2}
            onValueChange={value => this.onBalanceInputChanged(value)}
          />

          <div className="button-group">
            <button className="red" onClick={() => this.onWithdrawClicked()}>Withdraw</button>
            <button className="green" onClick={() => this.onDepositClicked()}>Deposit</button>
          </div>
        </div>

        <div className="form-controls">
          <CurrencyInput
            intlConfig={intlConfig}
            value={this.state.savingsGoalInputValue}
            placeholder="amount"
            defaultValue={0}
            decimalsLimit={2}
            onValueChange={value => this.onSavingsGoalInputChanged(value)}
          />

          <button className="green" onClick={() => this.onUpdateSavingsGoalClicked()}>
            Set Savings Goal (0 = inactive)
          </button>
        </div>
      </div>
    );
  }
}

export default AccountData;