import './App.scss';
import React from 'react';
import AccountData from './components/AccountData';
import AccountHistory from './components/AccountHistory';
import { ToastContainer } from 'react-toastify';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="max-width-container">
          <AccountData />
          <AccountHistory />

          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </div>
    );
  }
}

export default App;
