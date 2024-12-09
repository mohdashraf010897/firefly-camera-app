// withLoading.jsx
import React from "react";
import Loading from "../Loading";

const withLoading = (WrappedComponent) => {
  const WithLoadingComponent = ({ isLoading, ...props }) => {
    if (isLoading) {
      return <Loading message="Enhancing your image, please wait..." />;
    }
    return <WrappedComponent {...props} />;
  };

  WithLoadingComponent.displayName = `WithLoading(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithLoadingComponent;
};

export default withLoading;
