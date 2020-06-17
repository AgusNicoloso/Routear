import React from 'react';
import logo from './logo.svg';
import './App.css';
import AddButton from './components/AddButton';
import { Button } from 'reactstrap';
import ModalsProvider from './contexts/ModalsContext';
import { Modals } from './modals/index'
import Home from './views/Home';

function App() {

  return (
    <ModalsProvider>
      <div className="App">
        <header className="App-header">
          <Modals/>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Home/>
      </div>
    </ModalsProvider>
  );
}

export default App;
