import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import configService from './config.service';
import Configuration from './Configuration';
import swal from 'sweetalert2';
import notificationService from './notification.service';
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      password: ''
    };
  }

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  onPasswordSubmit = async e => {
    e.preventDefault();
    let isAuthenticated = await configService.authenticate(this.state.password);
    if (!isAuthenticated) {
      notificationService.showToast('ERROR', 'Invalid password', 'error');
    }

    this.setState({ isAuthenticated });
  };

  render() {
    const passwordInputForm = (
      <div className="password-wrapper">
        <form className="password-form" onSubmit={this.onPasswordSubmit}>
          <label>Password</label>
          <input className="input" type="password" onChange={this.handlePasswordChange} />
          <button className="button is-primary" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
    return (
      <section className="app-wrapper">
        {/* {this.state.isAuthenticated ? <Configuration /> : passwordInputForm} */}
        <Configuration />
      </section>
    );
  }
}

const root = document.querySelector('#app');
ReactDOM.render(<App />, root);
