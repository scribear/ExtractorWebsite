import React from 'react';
import logo from './logo.svg';
import './App.css';


import pdfjsLib from 'pdfjs-dist';

function App() {
  const [subjectName, setSubjectName] = React.useState('');
  // const [selectedFile, setSelectedFile] = React.useState(File);
  
  const onSubmit = async () => {
    console.log("submitted!");
    console.log(document.getElementById("subjectName")!.innerHTML.valueOf());
  }

  const onInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    // setSubjectName(event.target.value);
    // console.log(document.getElementById("subjectName")!.value);
  }

  function onFileChange(event: { target: { files: any; }; }) {
    // document.querySelector('#wordPdf')!.addEventListener('change', function (e) {
    //   const file = (e.target as HTMLInputElement).files![0];
    //   console.log(file);
    // });

    const reader = new FileReader();
    // reader.addEventListener('load', () => {
    //   console.log(27, reader.result);
    // });
    reader.onload = () => {
      if (reader.readyState === 2) {
        console.log(31, reader.result);

        // save to local storage
        localStorage.setItem('file', reader.result as string);

        // get from local storage, display to uploaded_pdf
        const file : string = localStorage.getItem('file')!;
        document.querySelector('#uploaded_pdf')!.setAttribute('src', file);

        // write pdf file to filaname
        const fs = require('fs');
        // fs.writeFile('filename.pdf', reader.result, (err: any) => {
        //   if (err) throw err;
        //   console.log('The file has been saved!');
        // });
      }
    }
    console.log(34, event.target.files[0]);

    reader.readAsDataURL(event.target.files[0]);
    // reader.readAsText(event.target.files[0]);

    
  }


  // console.log('subjectName: ', subjectName);

  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <label htmlFor="subjectName">Subject Name: </label>
        <input type="text" id="subjectName" name="subjectName" onChange={onInputChange} value={subjectName}></input><br></br>
        <label htmlFor = "wordPdf"> Choose PDF File: </label>
        <input type = "file" onChange={onFileChange}
               id = "wordPdf" name = "wordPdf"
               accept = "image/pdf"></input> <br></br>
        <input type="submit" value="Upload"></input>
      </form>

      <img src="" id="uploaded_pdf"/>
    </div>
  );
}

export default App;