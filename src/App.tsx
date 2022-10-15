import React from 'react';
import logo from './logo.svg';
// import fetch from 'node-fetch';
import './App.css';

function App() {
  const [subjectName, setSubjectName] = React.useState('');
  
  const checkExist = async () => {
    console.log("submitted!");
    console.log(document.getElementById("subjectName")!.innerHTML.valueOf());
  }

  const onInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSubjectName(event.target.value);
    // console.log(document.getElementById("subjectName")!.value);
  }

  console.log('subjectName: ', subjectName);

  return (
    <div className="App">
      <form onSubmit={checkExist}>
        <label htmlFor="subjectName">Subject Name: </label>
        <input type="text" id="subjectName" name="subjectName" onChange={onInputChange} value={subjectName}></input><br></br>
        <label htmlFor = "wordPdf"> Choose PDF File: </label>
        <input type = "file"
               id = "wordPdf" name = "wordPdf"
               accept = "image/pdf"></input> <br></br>
        {/* <label htmlFor="wordPdf">PDF: </label>
        <input type="image" id="wordPdf" name="wordPdf"></input><br></br> */}
        <input type="submit" value="Upload"></input>
      </form>


    </div>
  );
}

export default App;
