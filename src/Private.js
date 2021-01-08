import React, { Component } from "react";

class Private extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
    };
  }

  componentDidMount() {
    fetch("/private", {
        headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
    })
      .then((response) => {
          console.log(`${response.ok} && ${response}`)
        if (response.ok) return response.json();
        throw new Error("Network response was not ok.");
      })
      .then(response => this.setState({ messge: response.message }))
      .catch(error => this.setState({ message: error.message }));
  }

  render() {
    return <p>
        {this.state.message}
    </p>;
  }
}

export default Private;
