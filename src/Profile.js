import React, { Component } from "react";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: null,
      error: "",
    };
  }

  componentDidMount() {
    this.loadUserProfile();
  }

  loadUserProfile = () => {
    this.props.auth.getProfile((profile, error) => {
      this.setState({ profile, error });
      // console.log(profile);
    });
  };

  render() {
    const { profile } = this.state;
    console.log(profile);
    if(!profile) {
        return null;
    }
    return (
      <div>
        <h1>Profile</h1>
        <p>{profile.nickname}</p>
        <img
          style={{ maxWidth: "50", maxHeight: "50" }}
          src={profile.picture}
          alt="profile pic"
        />
        <pre>{JSON.stringify(profile,2, null)}</pre>
      </div>
    );
  }
}

export default Profile;
