import React from 'react';
import logo from './logo.svg';
import './App.css';
import AddButton from './components/AddButton';
import { Button } from 'reactstrap';
import ModalsProvider from './contexts/ModalsContext';

function App() {

  return (
    <ModalsProvider>
      <div className="App">
        <header className="App-header">
          <AddButton resource={"users"}>
            <Button color={"primary"}>Prueba</Button>
          </AddButton>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    </ModalsProvider>
  );
}

export default App;
