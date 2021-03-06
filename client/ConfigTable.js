import React, { Component } from 'react';
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

  onPropertyChange = (property, value) => {
    let config = this.state.config;
    config['property'] = value;
    this.setState({ config });

    this.props.onConfigChange(property, value);
  };

  render() {
    const { config } = this.state;
    return (
      <form className="card config-form">
        <div className="field">
          <label className="label">apiUrl</label>
          {this.state.editMode ? (
            <input
              className="input"
              placeholder="https://my.indexer.com"
              onChange={e => {
                this.onPropertyChange('apiUrl', e.target.value);
              }}
              type="text"
              defaultValue={config.apiUrl}
            />
          ) : (
            <span>{config.apiUrl || <em>empty</em>}</span>
          )}
          <p className="help">The url where enqueue requests will be sent to</p>
        </div>
        <div className="field">
          <label className="label">username</label>
          {this.state.editMode ? (
            <input
              className="input"
              placeholder="indexerUser"
              onChange={e => {
                this.onPropertyChange('username', e.target.value);
              }}
              type="text"
              defaultValue={config.username}
            />
          ) : (
            <span>{config.username || <em>empty</em>}</span>
          )}
          <p className="help">Username to authenticate to the above API with</p>
        </div>
        <div className="field">
          <label className="label">password</label>
          {this.state.editMode ? (
            <input
              className="input"
              placeholder="supersecretpassword"
              onChange={e => {
                this.onPropertyChange('password', e.target.value);
              }}
              type="text"
              defaultValue={config.password}
            />
          ) : (
            <span>{config.password ? '*****' : <em>empty</em>}</span>
          )}
          <p className="help">Password to authenticate to the above API with</p>
        </div>
        <div className="field">
          <label className="label">collection</label>
          {this.state.editMode ? (
            <input
              className="input"
              placeholder="VSE Collection Name"
              onChange={e => {
                this.onPropertyChange('collection', e.target.value);
              }}
              type="text"
              defaultValue={config.collection}
            />
          ) : (
            <span>
              {config.collection ? config.collection : <em>empty</em>}
            </span>
          )}
          <p className="help">VSE Collection Name (from Admin Panel)</p>
        </div>
        <div className="field">
          <label className="label">autoEnqueueTypes</label>
          {this.state.editMode ? (
            <input
              className="input"
              placeholder=".pdf,.csv"
              onChange={e => {
                this.onPropertyChange('autoEnqueueTypes', e.target.value);
              }}
              type="text"
              defaultValue={config.autoEnqueueTypes}
            />
          ) : (
            <span>{config.autoEnqueueTypes || <em>empty</em>}</span>
          )}
          <p className="help">
            Comma delimited list (INCLUDING the period) of file extensions to
            automatically send enqueue requests for
          </p>
        </div>
        <div className="field">
          <label className="label">usernameFieldSelector</label>
          {this.state.editMode ? (
            <input
              placeholder="#username_input"
              className="input"
              type="text"
              onChange={e => {
                this.onPropertyChange('usernameFieldSelector', e.target.value);
              }}
              defaultValue={config.usernameFieldSelector}
            />
          ) : (
            <span>{config.usernameFieldSelector || <em>empty</em>}</span>
          )}
          <p className="help">
            The selector to use when emulating a browser login for the username
            field
          </p>
        </div>
        <div className="field">
          <label className="label">passwordFieldSelector</label>
          {this.state.editMode ? (
            <input
              placeholder="#password_input"
              className="input"
              type="text"
              onChange={e => {
                this.onPropertyChange('passwordFieldSelector', e.target.value);
              }}
              defaultValue={config.passwordFieldSelector}
            />
          ) : (
            <span>{config.passwordFieldSelector || <em>empty</em>}</span>
          )}
          <p className="help">
            The selector to use when emulating a browser login for the password
            field
          </p>
        </div>
        <div className="field">
          <label className="label">submitInputSelector</label>
          {this.state.editMode ? (
            <input
              placeholder={`input[type="submit"]`}
              className="input"
              type="text"
              onChange={e => {
                this.onPropertyChange('submitInputSelector', e.target.value);
              }}
              defaultValue={config.submitInputSelector}
            />
          ) : (
            <span>{config.submitInputSelector || <em>empty</em>}</span>
          )}
          <p className="help">
            The selector to use when emulating a browser login for the submit
            input
          </p>
        </div>
        <div className="field">
          <label className="label">loginUrl</label>
          {this.state.editMode ? (
            <input
              placeholder="https://site.com/login"
              className="input"
              type="text"
              onChange={e => {
                this.onPropertyChange('loginUrl', e.target.value);
              }}
              defaultValue={config.loginUrl}
            />
          ) : (
            <span>{config.loginUrl || <em>empty</em>}</span>
          )}
          <p className="help">
            The url of the login page for the site to scrape
          </p>
        </div>
        <div className="field">
          <label className="label">siteUsername</label>
          {this.state.editMode ? (
            <input
              placeholder="myusername"
              className="input"
              type="text"
              onChange={e => {
                this.onPropertyChange('siteUsername', e.target.value);
              }}
              defaultValue={config.siteUsername}
            />
          ) : (
            <span>{config.siteUsername || <em>empty</em>}</span>
          )}
          <p className="help">
            The username to use when emulating a login for the site
          </p>
        </div>
        <div className="field">
          <label className="label">sitePassword</label>
          {this.state.editMode ? (
            <input
              placeholder="supersecretpassword"
              className="input"
              type="text"
              onChange={e => {
                this.onPropertyChange('sitePassword', e.target.value);
              }}
              defaultValue={config.sitePassword}
            />
          ) : (
            <span>{config.sitePassword ? '*****' : <em>empty</em>}</span>
          )}
          <p className="help">
            The password to use when emulating a login for the site
          </p>
        </div>
        <div className="field">
          <label className="label">useAuth</label>
          {this.state.editMode ? (
            <input
              placeholder="true"
              className="input"
              type="text"
              onChange={e => {
                this.onPropertyChange('useAuth', e.target.value);
              }}
              defaultValue={config.useAuth}
            />
          ) : (
            <span>{config.useAuth || <em>empty</em>}</span>
          )}
          <p className="help">
            If true, the scraper will use the given credentials and login url to
            attempt to login to the site first
          </p>
        </div>
        <div className="field">
          <label className="label">proxyServer</label>
          {this.state.editMode ? (
            <input
              placeholder="https://www.myproxy.com"
              className="input"
              type="text"
              onChange={e => {
                this.onPropertyChange('proxyServer', e.target.value);
              }}
              defaultValue={config.proxyServer}
            />
          ) : (
            <span>{config.proxyServer || <em>empty</em>}</span>
          )}
          <p className="help">
            If supplied, the scraper will use a proxy server to perform the web scraping.
          </p>
        </div>
        <div className="field">
          <label className="label">proxyUsername</label>
          {this.state.editMode ? (
            <input
              placeholder="username"
              className="input"
              type="text"
              onChange={e => {
                this.onPropertyChange('proxyUsername', e.target.value);
              }}
              defaultValue={config.proxyUsername}
            />
          ) : (
            <span>{config.proxyUsername || <em>empty</em>}</span>
          )}
          <p className="help">
            The username to use to authenticate to the given proxy server. If there is no authentication, simply leave this blank.
          </p>
        </div>
        <div className="field">
          <label className="label">proxyPassword</label>
          {this.state.editMode ? (
            <input
              placeholder="password"
              className="input"
              type="text"
              onChange={e => {
                this.onPropertyChange('proxyPassword', e.target.value);
              }}
              defaultValue={config.proxyPassword}
            />
          ) : (
            <span>{config.proxyPassword ? '*****' : <em>empty</em>}</span>
          )}
          <p className="help">
            The password to use to authenticate to the given proxy server. If there is no authentication, simply leave this blank.
          </p>
        </div>
      </form>
    );
  }
}

export default ConfigTable;
