import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import swal from 'sweetalert2';
import ConfigTable from './ConfigTable';
import './app.css';

const styles = {
  app: {
    padding: '32px'
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedKey: '', configKeys: [], selectedConfig: {} };
  }

  componentDidMount() {
    fetch('/api/config/keys')
      .then(response => response.json())
      .then(configKeys => {
        const selectedKey = configKeys[0];
        fetch(`api/config/${selectedKey}`)
          .then(response => response.json())
          .then(config => {
            const selectedConfig = config;
            this.setState({ configKeys, selectedConfig, selectedKey });
          });
      });
  }

  onConfigSave = (val) => {
    console.log(val);
  };

  handleTabClick = key => {
    fetch(`api/config/${key}`)
      .then(response => response.json())
      .then(config => {
        this.setState({ selectedKey: key, selectedConfig: config });
      });
  };

  handleAddClick = () => {
    swal({
      title: 'New config',
      text: 'What do you want to name this config?',
      input: 'text',
      type: 'question',
      buttonsStyling: false,
      confirmButtonClass: 'button is-primary',
      confirmButtonText: 'Add'
    }).then(result => {
      const keys = this.state.configKeys;
      keys.push(result.value);
      this.setState({
        configKeys: keys,
        selectedKey: result.value,
        isAdding: true
      });
    });
  };

  handleDeleteClick = () => {
    swal({
      title: 'Are you sure?',
      text: `Are you sure you want to delete the '${
        this.state.selectedKey
      }' config? This action is irreversible!`,
      type: 'warning',
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonText: 'Yep, delete it!',
      confirmButtonClass: 'button is-primary',
      cancelButtonClass: 'button is-danger'
    }).then(result => {
      if (result.value) {
        fetch(`/api/config/${this.state.selectedKey}`, {
          method: 'DELETE'
        }).then(() => {
          let newKeys = this.state.configKeys.filter(
            x => x !== this.state.selectedKey
          );
          let newSelectedKey = newKeys[0];
          this.setState({
            configKeys: newKeys,
            selectedKey: newSelectedKey
          });

          swal({
            title: 'success!',
            text: 'Config successfully deleted',
            type: 'success',
            toast: true,
            position: 'top-right',
            timer: '3000',
            showConfirmButton: false
          });
        });
      }
    });
  };

  render() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title is-1">Scraper Configuration</h1>
          <div className="tabs">
            <ul>
              {this.state.configKeys.map(key => (
                <li
                  key={key}
                  onClick={this.handleTabClick.bind(this, key)}
                  className={this.state.selectedKey === key ? 'is-active' : ''}
                >
                  <a>{key}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="content">
            <div className="box">
              <ConfigTable
                configKey={this.state.selectedKey}
                config={this.state.selectedConfig}
                onConfigSave={this.onConfigSave}
                isAdding={this.state.isAdding}
              />
            </div>
            <div className="buttons">
              <button
                className="button is-primary"
                onClick={this.handleAddClick}
              >
                Add new config
              </button>
              <button
                className={`button is-danger ${
                  this.state.selectedKey === 'default' ? 'hidden' : ''
                }`}
                onClick={this.handleDeleteClick}
              >
                Delete this config
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const root = document.querySelector('#app');
ReactDOM.render(<App />, root);
