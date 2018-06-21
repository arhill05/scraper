import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
    this.state = { selectedKey: '', configKeys: [] };
  }

  componentDidMount() {
    fetch('/api/config/keys')
      .then(response => response.json())
      .then(data => {
        this.setState({ configKeys: data, selectedKey: data[0] });
      });
  }

  handleTabClick = key => {
    console.log(key);
    this.setState({ selectedKey: key });
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
              <ConfigTable configKey={this.state.selectedKey} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const root = document.querySelector('#app');
ReactDOM.render(<App />, root);
