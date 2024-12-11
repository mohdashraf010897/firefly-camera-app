// src/components/ErrorBoundary/index.jsx
import React, { Component } from "react";
import { ErrorContext } from "../../context/ErrorContext";
import "./index.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
  }
  static contextType = ErrorContext;
  componentDidCatch(error) {
    this.context.setError(error.message);
  }

  render() {
    if (this.context.error) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>{this.context.error}</p>
          <button onClick={this.context.clearError}>Dismiss</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
