import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './app.css';

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
    this.setEditingState(val);
  }

  handleCancelClick(val) {
    this.setDisplayState(val);
  }

  handleSaveClick(val) {
    const { config } = this.state,
      input = document.getElementById(`${val}-input`);

    config[val] = input.value;
    this.setState({ config });
    fetch('/api/config', {
      body: JSON.stringify(config),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => {
      this.setDisplayState(val);
    });
  }

  setEditingState(val) {
    const input = document.getElementById(`${val}-input`),
      display = document.getElementById(`${val}-display`),
      editButton = document.getElementById(`${val}-edit-button`),
      saveButton = document.getElementById(`${val}-save-button`),
      cancelButton = document.getElementById(`${val}-cancel-button`);

    input.classList.remove('hidden');
    saveButton.classList.remove('hidden');
    cancelButton.classList.remove('hidden');
    display.classList.add('hidden');
    editButton.classList.add('hidden');
  }

  setDisplayState(val) {
    const input = document.getElementById(`${val}-input`),
      display = document.getElementById(`${val}-display`),
      editButton = document.getElementById(`${val}-edit-button`),
      saveButton = document.getElementById(`${val}-save-button`),
      cancelButton = document.getElementById(`${val}-cancel-button`);

    input.classList.add('hidden');
    saveButton.classList.add('hidden');
    cancelButton.classList.add('hidden');
    display.classList.remove('hidden');
    editButton.classList.remove('hidden');
  }

  render() {
    const { config } = this.state;
    return (
      <section className="section">
        <div className="container">
          <h1 className="title is-1">Scraper Configuration</h1>
          <div className="content">
            <div className="box">
              <table className="table is-fullwidth">
                <thead>
                  <tr>
                    <td width='25%'>
                      <strong>Setting</strong>
                    </td>
                    <td width='60%'>
                      <strong>Value</strong>
                    </td>
                    <td width='40%'>
                      <strong>Edit</strong>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(config).map(key => {
                    const boundEditClick = this.handleEditClick.bind(this, key),
                      boundSaveClick = this.handleSaveClick.bind(this, key),
                      boundCancelClick = this.handleCancelClick.bind(this, key),
                      value = config[key].toString();
                    return (
                      <tr key={key}>
                        <td width='25%'>{key}</td>
                        <td width='60%'>
                          <input
                            id={`${key}-input`}
                            className="input hidden"
                            type="text"
                            style={{ width: '75%' }}
                            defaultValue={value}
                          />
                          <span id={`${key}-display`}>{value}</span>
                        </td>
                        <td width='40%'>
                          <i
                            id={`${key}-edit-button`}
                            className="far fa-edit"
                            onClick={boundEditClick}
                          />
                          <i
                            className="far fa-save hidden"
                            onClick={boundSaveClick}
                            id={`${key}-save-button`}
                          />
                          <i
                            className="fas fa-times hidden"
                            onClick={boundCancelClick}
                            id={`${key}-cancel-button`}
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
