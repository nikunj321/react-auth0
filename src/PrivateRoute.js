import React from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext";

function PrivateRoute({ component: Component, scopes, ...rest }) {
  return (
    <AuthContext.Consumer>
      {(auth) => (
        <Route
          {...rest}
          render={(props) => {
            // 1. redirect to login if not loged in
            if (!auth.isAuthenticated()) return auth.login();

            // 2. Display message if user laged scope[s]
            if (scopes.length > 0 && !auth.userHasScopes(scopes)) {
              return (
                <h1>
                  unauthorised: you need following scope to view this page:{" "}
                  {scopes.join(",")}
                </h1>
              );
            }

            return <Component auth={auth} {...props} />;
          }}
        />
      )}
    </AuthContext.Consumer>
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  scopes: PropTypes.array,
};

PrivateRoute.defaultProps = {
  scopes: [],
};

export default PrivateRoute;
