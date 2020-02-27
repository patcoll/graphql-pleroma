import React from 'react';
import { useQuery } from '@apollo/client';
import logo from './logo.svg';
import './App.css';

import {  queries } from './graphql';
console.log({ queries });
const { currentLogin } = queries;

function SayHello() {
  const { loading, error, data } = useQuery(currentLogin);
  if (loading || error) return <span>Hello!</span>;
  console.log('data', data);
  let {
    currentLogin: login,
  } = data;
  return <span>Hello, {login}!</span>;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          <SayHello />
        </h1>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
