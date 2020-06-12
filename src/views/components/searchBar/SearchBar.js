// Libs & utils
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// CSS
import './SearchBar.css';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ''
    };
  }
  static propTypes = {
    search: PropTypes.object.isRequired,
    handleSearch: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.searchBar.addEventListener(
      'transitionend',
      () => {
        if (this.props.search.expanded) this.input.focus();
      },
      false
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const inputValue = this.state.input.trim();
    this.props.handleSearch(inputValue, 'any');
  };

  render() {
    const cssClasses = classNames('search-bar', {
      open: this.props.search.expanded
    });

    return (
      <div className={cssClasses} ref={(e) => (this.searchBar = e)}>
        <form className="search-form" onSubmit={this.handleSubmit} noValidate>
          <input
            ref={(e) => (this.input = e)}
            autoComplete="off"
            className="input"
            maxLength="60"
            placeholder="Search Videos / Movies"
            tabIndex="0"
            type="text"
            value={this.state.input}
            onChange={(e) => {
              this.setState({ input: e.target.value });
            }}
          />
        </form>
      </div>
    );
  }
}
