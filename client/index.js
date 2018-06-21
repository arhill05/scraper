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
    const input = document.getElementById(`${val}-input`),
      display = document.getElementById(`${val}-display`),
      editButton = document.getElementById(`${val}-edit-button`),
      saveButton = document.getElementById(`${val}-save-button`);

    input.classList.remove('is-invisible');
    saveButton.classList.remove('is-invisible');
    display.classList.add('is-invisible');
    editButton.classList.add('is-invisible');
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
                  {Object.keys(config).map(key => {
                    const boundEditClick = this.handleEditClick.bind(this, key),
                      value = config[key].toString();
                    return (
                      <tr key={key}>
                        <td >{key}</td>
                        <td>
                          <input id={`${key}-input`} className='is-invisible' type='text' style={{ width: '75%' }} defaultValue={value} />
                          <span id={`${key}-display`}>{value}</span>
                        </td>
                        <td>
                          <i id={`${key}-edit-button`}
                            className='far fa-edit'
                            onClick={boundEditClick}
                          />
                          <i
                            className='far fa-save is-invisible'
                            hidden='true'
                            id={`${key}-save-button`}
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
