import React, { Component } from 'react';

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: props.keys ? props.keys : [],
      selectedKey: null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      keys: nextProps.keys,
      selectedKey: nextProps.selectedKey ? nextProps.selectedKey : nextProps.keys[0]
    });
  }

  handleTabClick(key) {
    this.props.onTabClick(key);
  }

  render() {
    return (
      <div className="tabs">
        <ul>
          {this.state.keys.map(key => (
            <li
              key={key}
              onClick={this.handleTabClick.bind(this, key)}
              className={this.state.selectedKey === key ? 'is-active' : ''}
            >
              <a>{key}</a>
            </li>
          ))}
          <i className="far fa-plus-square" onClick={this.props.onAddClick} />
        </ul>
      </div>
    );
  }
}

export default Tabs;
