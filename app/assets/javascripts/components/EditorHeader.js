'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';

import AppName from './AppName';
import MainMenu from './MainMenu';
import GitModal from './git_modal';

const maybeCallMethod = (obj, method, ...args) => {
  obj[method] && obj[method](...args);
};

export default class EditorHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gitModalIsVisible: null,
      isMenuOpen: false
    };
  }

  onMenuToggle() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  }

  onUpdateName = (e) => {
    e.preventDefault();
    maybeCallMethod(this.props, 'onUpdateName', e.target.value);
  }

  handleOnSubmit = (e)  => {
    e.preventDefault();
    e.preventPropagation();
  }

  onSave = (e) => {
    e.preventDefault();
    maybeCallMethod(this.props, 'onSave');
  }

  onFork = (e) => {
    e.preventDefault();
    maybeCallMethod(this.props, 'onFork');
  }

  onPick = (e) => {
    e.preventDefault();
    maybeCallMethod(this.props, 'onPick');
  }

  onUpdateBuild = (value) => {
    maybeCallMethod(this.props, 'onUpdateBuild', value);
  }

  currentUserIsAdmin() {
    const { currentUser } = this.props;
    return currentUser && currentUser.admin;
  }

  isUserLoggedIn() {
    const { currentUser } = this.props;
    return !!currentUser;
  }

  showGitModal = (e) => {
    e.preventDefault();
    this.setState({gitModalIsVisible: true});
  }

  hideGitModal = (e) => {
    e.preventDefault();
    this.setState({gitModalIsVisible: false});
  }

  renderGitModal = () => {
    if (this.props.belongsToCurrentUser()) {
      return (
        <GitModal app={this.props.app}
                  token={this.props.currentUser.authentication_token}
                  onClickBackdrop={this.hideGitModal}
                  isOpen={this.state.gitModalIsVisible} />
      )
    }
  }

  renderGitButton() {
    if ( ! this.props.belongsToCurrentUser()) {
      return (
        <button
          onClick={this.showGitModal}
          className="editor-header__button">
          Clone
        </button>
      );
    }
  }

  renderForkButton() {
    return (
      <button
        onClick={this.onFork}
        type="button"
        className="editor-header__button">
        <i className="fa fa-code-fork"></i> Fork
      </button>
    );
  }

  renderPickButton() {
    if (this.currentUserIsAdmin()) {

      const icon = this.props.appIsPicked ? 'fa-star' : 'fa-star-o';
      const iconClasses = `fa ${icon}`;

      return (
        <button
          onClick={this.onPick}
          className="editor-header__button">
          <i className={iconClasses}></i> {this.props.appIsPicked ? 'Unpick' : 'Pick'}
        </button>
      );
    }
  }

  getAppName() {
    const { name } = this.props;
    return name && name.length > 0 ? name : 'Unnamed App';
  }

  render() {
    const disabled = ! this.props.belongsToCurrentUser();
    const { creator } = this.props;

    const classes = classNames({
      'editor-header__bar': true,
      'editor-header': true,
    });

    return (
      <div className={classes}>

        <MainMenu
          isOpen={this.state.isMenuOpen}
          isUserLoggedIn={this.isUserLoggedIn()}
          onMenuToggle={this.onMenuToggle.bind(this)} />

        <button
          className="editor-header__button editor-header__menu-toggle"
          onClick={this.onMenuToggle.bind(this)}
          title="Open Menu">
          <i className="fa fa-bars"></i>
        </button>

        <AppName
          isDisabled={disabled}
          appName={this.getAppName()}
          onUpdateName={this.onUpdateName.bind(this)}
          creator={creator} />

        <div className="editor-header__actions">
          {this.renderForkButton()}
          {this.renderPickButton()}
        </div>

        {this.renderGitModal()}
      </div>
    );
  }
}
