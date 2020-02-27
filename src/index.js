import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
import App from './App';
import * as serviceWorker from './serviceWorker';

const uri = 'http://localhost:4000/graphql';
// const token = process.env.REACT_APP_GITHUB_TOKEN;
const link = new HttpLink({
  uri,
  // headers: {
  //   authorization: token ? `Bearer ${token}` : '',
  // },
});
const cache = new InMemoryCache();
const client = new ApolloClient({ link, cache });

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
