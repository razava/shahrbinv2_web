import React from "react";
import { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import {
  accessibilityByRoles,
  checkLoginState,
  constants,
  getFromLocalStorage,
  getLoginDestination,
  hasRole,
} from "../../../helperFuncs";

export default class AuthorizeRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      authenticated: false,
    };
  }
  componentDidMount() {
    this.populateAuthenticationState();
  }

  render() {
    const { ready, authenticated } = this.state;
    var link = document.createElement("a");
    link.href = this.props.path;
    const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
    const redirectUrl = `${"/"}?${"returnUrl"}=${encodeURIComponent(
      returnUrl
    )}`;
    const userRoles = getFromLocalStorage(
      constants.SHAHRBIN_MANAGEMENT_USER_ROLES
    ) || [];
    if (!ready) {
      return <div></div>;
    } else {
      const { component: Component, ...rest } = this.props;
      return (
        <Route
          {...rest}
          render={(props) => {
            const allowedRoles = accessibilityByRoles(this.props.path);
            if (authenticated) {
              if (hasRole(userRoles, allowedRoles)) {
                return <Component {...props} />;
              } else {
                return <Redirect to={getLoginDestination()} />;
              }
            } else {
              return <Redirect to={redirectUrl} />;
            }
          }}
        />
      );
    }
  }

  populateAuthenticationState() {
    const authenticated = checkLoginState();
    this.setState({ ready: true, authenticated });
  }
}
