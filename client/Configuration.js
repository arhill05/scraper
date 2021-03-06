import React, { Component } from 'react';
import configService from './config.service';
import swal from 'sweetalert2';
import ConfigTable from './ConfigTable';
import Tabs from './Tabs';
import './app.css';

class Configuration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKey: '',
      configKeys: [],
      selectedConfig: {},
      previousConfig: {},
      editMode: false,
      isAdding: false,
      unsavedChanges: false
    };
  }

  async componentDidMount() {
    await this.refreshData();
  }

  handleTabClick = async key => {
    if (this.state.unsavedChanges) {
      const shouldLeave = await this.promptForUnsavedChanges();
      if (shouldLeave) {
        await this.removeUnsavedConfigKeys();
        const config = await configService.getConfig(key);
        this.setState({ selectedKey: key, selectedConfig: config });
      }
    } else {
      const config = await configService.getConfig(key);
      this.setState({ selectedKey: key, selectedConfig: config });
    }
  };

  newConfigNameValidator = value => {
    return new Promise(resolve => {
      if (!this.state.configKeys.includes(value)) {
        resolve();
      } else {
        resolve(
          `There is already a configuration named ${value}. Please give this new configuration a unique name!`
        );
      }
    });
  };

  handleAddClick = async () => {
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
      inputValidator: this.newConfigNameValidator,
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
      selectedConfig: newConfig,
      unsavedChanges: true
    });
  };

  handleSaveClick = async () => {
    let updatedConfig = this.state.selectedConfig;

    this.state.isAdding
      ? await configService.createConfig(this.state.selectedKey, updatedConfig)
      : await configService.updateConfig(this.state.selectedKey, updatedConfig);

    this.setState({
      selectedConfig: updatedConfig,
      isAdding: false,
      editMode: false,
      unsavedChanges: false
    });
  };

  removeUnsavedConfigKeys = async () => {
    const keys = await configService.getKeys();
    let currentKeys = this.state.configKeys;
    currentKeys = currentKeys.filter(x => keys.includes(x));
    this.setState({ configKeys: currentKeys });
  };

  onConfigChange = (property, value) => {
    let config = this.state.selectedConfig;
    config[property] = value;
    this.setState({ selectedConfig: config });
  };

  handleEditClick = () => {
    this.setState({
      editMode: true,
      unsavedChanges: true,
      previousConfig: JSON.parse(JSON.stringify(this.state.selectedConfig))
    });
  };

  handleCancelClick = () => {
    this.setState({
      selectedConfig: this.state.previousConfig,
      previousConfig: {},
      editMode: false,
      isAdding: false
    });
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
      selectedConfig: config,
      editMode: false,
      isAdding: false
    });
  };

  promptForUnsavedChanges = async () => {
    const result = await swal({
      title: 'Unsaved changes',
      text:
        'You have unsaved changes on this configuration. They will be lost if you leave!',
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'button is-primary',
      cancelButtonClass: 'button is-danger',
      confirmButtonText: 'Yes'
    });

    return result.value;
  };

  render() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title is-1">Scraper Configuration</h1>
          <Tabs
            keys={this.state.configKeys}
            selectedKey={this.state.selectedKey}
            onTabClick={this.handleTabClick}
            onAddClick={this.handleAddClick}
          />
          <div className="content">
            <div className="box">
              <ConfigTable
                configKey={this.state.selectedKey}
                config={this.state.selectedConfig}
                selectedKey={this.state.selectedKey}
                onConfigChange={this.onConfigChange}
                editMode={this.state.editMode || this.state.isAdding}
              />
            </div>
            <div className="buttons">
              {this.state.editMode || this.state.isAdding ? (
                <div>
                  <button
                    className="button is-primary"
                    onClick={this.handleSaveClick}
                  >
                    Save
                  </button>
                  <button
                    className="button is-warning"
                    onClick={this.handleCancelClick}
                  >
                    Cancel
                  </button>
                </div>
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

export default Configuration;
