import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const styles = {
  app: {
    padding: '32px'
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { config: {} };
  }

  componentWillMount() {
    fetch('/api/config').then(config => {
      config.json().then(data => {
        this.setState({ config: data });
      });
    });
  }

  handleEditClick(val) {
    const config = this.state.config;
    config[val].isEditing = true;
    this.setState({ config });
  }

  render() {
    const { config } = this.state;
    return (
      <section className="section">
        <div className="container">
          <h1 className="title is-1">Scraper Configuration</h1>
          <div className="content">
            <div className="box">
              <table className="table">
                <thead>
                  <tr>
                    <td>
                      <strong>Setting</strong>
                    </td>
                    <td>
                      <strong>Value</strong>
                    </td>
                    <td>
                      <strong>Edit</strong>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(config).map(val => {
                    let boundEditClick = this.handleEditClick.bind(this, val);
                    return (
                      <tr key={val}>
                        <td>{val}</td>
                        <td>
                          {config[val].isEditing ? (
                            <input type="text" value={config[val].toString()} />
                          ) : (
                            config[val].toString()
                          )}
                        </td>
                        <td>
                          <i
                            className="fa fa-pencil"
                            onClick={boundEditClick}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const root = document.querySelector('#app');
ReactDOM.render(<App />, root);
