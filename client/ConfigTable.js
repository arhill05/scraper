import React, { Component } from 'react';
import swal from 'sweetalert2';
import configService from './config.service';
class ConfigTable extends Component {
  constructor(props) {
    super(props);
    this.state = { configKey: '', config: {}, editMode: false };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.setState({
      configKey: nextProps.configKey,
      config: nextProps.config,
      editMode: nextProps.editMode
    });
  }

  render() {
    const { config } = this.state;
    console.log(config);
    return (
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <td width="25%">
              <strong>Setting</strong>
            </td>
            <td width="60%">
              <strong>Value</strong>
            </td>
            <td width="40%">
              <strong>Edit</strong>
            </td>
          </tr>
        </thead>
        <tbody>
          {Object.keys(config).map(key => {
            if (this.state.editMode) {
              return (
                <tr key={key}>
                  <td width="25%">{key}</td>
                  <td width="60%">
                    <input
                      id={`${key}-input`}
                      className="input"
                      type="text"
                      defaultValue={
                        config[key] != null ? config[key].toString() : ''
                      }
                    />
                  </td>
                  <td width="40%">&nbsp;</td>
                </tr>
              );
            } else {
              return (
                <tr key={key}>
                  <td width="25%">{key}</td>
                  <td width="60%">
                    {config[key] != null ? config[key].toString() : ''}
                  </td>
                  <td width="40%">&nbsp;</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    );
  }
}

export default ConfigTable;
