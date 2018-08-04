import React from "react";
import { Loading } from "../components/Loading";

// HOC Sample - Prepend "with"
// Conditional Rendering is a good use case for HOCs
// -- 'rest' destructuring

export const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;
