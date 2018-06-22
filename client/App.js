import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import configService from './config.service';
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
    this.state = {
      selectedKey: '',
      configKeys: [],
      selectedConfig: {},
      editMode: false,
      isAdding: false
    };
  }

  async componentDidMount() {
    await this.refreshData();
  }

  handleTabClick = async key => {
    const config = await configService.getConfig(key);
    this.setState({ selectedKey: key, selectedConfig: config });
  };

  handleAddClick = async () => {
    let shouldCloneFromDefault = false;
    const addDialog = await swal({
      title: 'New config',
      html: `<div>
      What do you want to name this config?
      </div>
      <div>
      <label class="checkbox">
        <input id="swal-input-1" type="checkbox">
          Clone from default
      </label>
      </div>`,
      input: 'text',
      type: 'question',
      buttonsStyling: false,
      preConfirm: name => {
        return {
          checked: document.getElementById('swal-input-1').checked,
          name
        };
      },
      confirmButtonClass: 'button is-primary',
      confirmButtonText: 'Add'
    });
    const keys = this.state.configKeys;
    keys.push(addDialog.value.name);
    const newConfig = addDialog.value.checked
      ? await configService.getConfig('default')
      : configService.getBlankConfig();
    this.setState({
      configKeys: keys,
      selectedKey: addDialog.value.name,
      isAdding: true,
      selectedConfig: newConfig
    });
  };

  handleSaveClick = async () => {
    let updatedConfig = this.state.selectedConfig;
    Object.keys(this.state.selectedConfig).forEach(key => {
      const val = document.getElementById(`${key}-input`).value;
      updatedConfig[key] = val;
    });

    this.state.isAdding
      ? await configService.createConfig(this.state.selectedKey, updatedConfig)
      : await configService.updateConfig(this.state.selectedKey, updatedConfig);

    this.setState({
      selectedConfig: updatedConfig,
      isAdding: false,
      editMode: false
    });
  };

  handleEditClick = () => {
    this.setState({ editMode: true });
  };

  handleDeleteClick = async () => {
    await configService.deleteConfig(this.state.selectedKey);
    await this.refreshData();
  };

  refreshData = async () => {
    const keys = await configService.getKeys();
    const config = await configService.getConfig(keys[0]);
    this.setState({
      selectedKey: keys[0],
      configKeys: keys,
      selectedConfig: config
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
              <i className="far fa-plus-square" onClick={this.handleAddClick} />
            </ul>
          </div>
          <div className="content">
            <div className="box">
              <ConfigTable
                configKey={this.state.selectedKey}
                config={this.state.selectedConfig}
                onConfigSave={this.onConfigSave}
                editMode={this.state.editMode || this.state.isAdding}
              />
            </div>
            <div className="buttons">
              {this.state.editMode || this.state.isAdding ? (
                <button
                  className="button is-primary"
                  onClick={this.handleSaveClick}
                >
                  Save
                </button>
              ) : (
                <button
                  className="button is-primary"
                  onClick={this.handleEditClick}
                >
                  Edit
                </button>
              )}

              <button
                className={`button is-danger ${
                  this.state.selectedKey === 'default' ? 'hidden' : ''
                }`}
                onClick={this.handleDeleteClick}
              >
                Delete
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
