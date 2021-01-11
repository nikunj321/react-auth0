import { Redirect, Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Auth from "./Auth/Auth";
import React, { Component } from "react";
import Callback from "./Callback";
import Public from "./Public";
import Private from "./Private";
import Courses from "./Courses";
import PrivateRoute from "./PrivateRoute";
import AuthContext from "./AuthContext";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: new Auth(this.props.history)  
    }
    
  }


  
  render() {
    const { auth} = this.state;
    return (
      <AuthContext.Provider value={auth}>
        <Nav  />
        <div className="body">
          <Route
            path="/"
            exact
            render={(props) => <Home  {...props} />}
          />
          <Route
            path="/callback"
            exact
            render={(props) => <Callback  {...props} />}
          />
          <PrivateRoute path="/profile" component={Profile} />
          <Route path="/public" component={Public} />
          <PrivateRoute path="/private" component={Private} />
          <PrivateRoute
            path="/course"
            component={Courses}
            scopes={["read:courses"]}
          />
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
