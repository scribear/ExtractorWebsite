import React from 'react';
import logo from './logo.svg';
import fetch from 'node-fetch';
import './App.css';

function App() {
  const checkExist = async () => {
    console.log("submitted!");
    const response = await fetch('https://api.github.com/');
    // const body = await response.text();

    // console.log(body);
  }

  return (
    <div className="App">
      <form onSubmit={checkExist}>
        <label htmlFor="subjectName">Subject Name: </label>
        <input type="text" id="subjectName" name="subjectName"></input><br></br>
        <label htmlFor = "wordPdf"> Choose PDF File: </label>
        <input type = "file"
               id = "wordPdf" name = "wordPdf"
               accept = "image/pdf"></input> <br></br>
        {/* <label htmlFor="wordPdf">PDF: </label>
        <input type="image" id="wordPdf" name="wordPdf"></input><br></br> */}
        <input type="submit" value="Upload"></input>
      </form>




      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
