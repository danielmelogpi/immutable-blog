import React from "react";
import { Component } from "react";

export default class Post extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="post" key={this.props.post.id}>
        <div className="content">{this.props.post.content}</div>
        <small className="footer">
          <small className="option" title="not implemented yet" style={{cursor: 'not-allowed'}}>LIKE</small>
          <small className="option" style={{textAlign: 'right', opacity: '0.5'}}>(#{this.props.post.id})</small>
        </small>
      </div>
    )
  }
}