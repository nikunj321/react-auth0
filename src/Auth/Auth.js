import auth0 from "auth0-js";

export default class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.requestedScope = "openid profile email read:courses"
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: "token id_token",
      scope: this.requestedScope,
    });
  }

  login = () => {
    this.auth0.authorize();
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.history.push("/");
      } else if (err) {
        this.history.push("/");
        alert(`Error: ${err.error}. Check the console for further details.`);
        console.log(err);
      }
    });
  };

  setSession = (authResult) => {
    const expireAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    // if there is a value on the 'scope' param from the authResult
    // use it to set scope in the session for the user. Otherwise
    // use the scope as requested. If no scope were requested ,
    // set it to nothing.
    const scope = authResult.scope || this.requestedScope || "";

    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expireAt);
    localStorage.setItem("scope", JSON.stringify(scope));
  };

  isAuthenticated = () => {
    const expireAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expireAt;
  };

  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("scope");
    this.userProfile = null;
    // this.history.push('/')
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: "http://localhost:3000",
    });
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("No Access token found.");
    }
    return accessToken;
  };
  
  getProfile = (cb) => {
    if (this.userProfile) return cb(this.userProfile);
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile;
      cb(profile, err);
    });
  };

  userHasScope(scope) {
    const grantedScope = (
      JSON.parse(localStorage.getItem("scope")) || ""
    ).split(" ");
    return scope.every(scope => grantedScope.includes(scope));
  }
}
