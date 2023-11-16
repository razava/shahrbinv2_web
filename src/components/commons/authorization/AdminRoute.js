import React from "react";
import { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import {
  checkLoginState,
  getFromLocalStorage,
  isCustomer,
  removeRecaptcha,
  accessibilityByRoles,
  hasRole,
} from "../../helperFuncs";

export default class AdminRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      admin: false,
      isAuthenticated: false,
      roles: [],
    };
  }

  componentDidMount() {
    this.populateAuthenticationState();
  }

  render() {
    const { ready, admin, isAuthenticated, roles } = this.state;
    var link = document.createElement("a");
    link.href = this.props.path;
    const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
    if (!ready) {
      return <div></div>;
    } else {
      const { component: Component, ...rest } = this.props;
      return (
        <Route
          {...rest}
          render={(props) => {
            if (isAuthenticated) {
              if (admin) {
                const allowedRoles = accessibilityByRoles(this.props.path);
                if (hasRole(allowedRoles, roles) || this.props.path === '/admin/newReports') {
                  return <Component {...props} />;
                } else {
                  return <Redirect to={"/admin/newReports"} />;
                }
              } else {
                return <Redirect to={"/user/home"} />;
              }
            } else {
              return <Redirect to={"/auth/signin"} />;
            }
          }}
        />
      );
    }
  }

  populateAuthenticationState() {
    if (
      this.props.path !== "/auth/signin" ||
      this.props.path !== "/auth/signup"
    ) {
      removeRecaptcha();
    }
    const roles = getFromLocalStorage("bitbaterUserRoles") || [];
    const isAuthenticated = checkLoginState();
    const admin = !isCustomer(roles);
    this.setState({ ready: true, admin, isAuthenticated, roles });
  }
}
