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

  render() {
    const { config } = this.state;
    return (
      <div style={styles.app}>
        <h1 className="title is-1">Scraper Configuration</h1>
        <div className="content">
          <div className="box">
            <table className="table">
              <thead>
                <tr>
                  <td>Setting</td>
                  <td>Value</td>
                </tr>
              </thead>
              <tbody>
                {Object.keys(config).map(val => (
                  <tr key={val}>
                    <td>{val}</td>
                    <td>{config[val].toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const root = document.querySelector('#app');
ReactDOM.render(<App />, root);
