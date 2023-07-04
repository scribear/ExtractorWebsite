import React from 'react';
import './App.css';
import {convert} from "./pdfParser";

const { Octokit } = require("@octokit/rest");
// const fs = require("fs");

async function uploadFile(owner: any, repo: any, path: any, content: any) {
  const octokit = new Octokit({
    auth: "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"
  });

  // const base64Content = Buffer.from(content).toString("base64");
  const base64Content = content;

  const response = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: "Uploading a file using Octokit",
    content: base64Content,
    branch: "main"
  });

  console.log(response.data);
}

// const content = fs.readFileSync("/defaultPDF.pdf", "utf-8");
const content = "test github action"
uploadFile("JoniLi99", "DomainWordExtractor", "/defaultPDF.pdf", content);
console.log(content);









function App() {
  const [subjectName, setSubjectName] = React.useState('');
  // This will serve as a boolean that determines the user view
  const [currentPageView, setCurrentPageView] = React.useState<number>(0);
  
  const onSubmit = async () => {
    console.log("submitted!");
    console.log(document.getElementById("subjectName")!.innerHTML.valueOf());
    setCurrentPageView(1);
    console.log(currentPageView);
  }

  const onInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSubjectName(event.target.value);
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
        // const fs = require('fs');
        // fs.writeFile('filename.pdf', reader.result, (err: any) => {
        //   if (err) throw err;
        //   console.log('The file has been saved!');
        // });
      }
    }
    console.log(34, event.target.files[0]);

    reader.readAsDataURL(event.target.files[0]);
  }

  if (currentPageView === 0) {
    return (
      <div className="App">
        <div className="Upload-buttons">
          <label htmlFor="subjectName">Subject Name: </label>
          <input type="text" id="subjectName" name="subjectName" onChange={onInputChange} value={subjectName}></input><br></br>
          <label htmlFor = "wordPdf"> Choose PDF File: </label>
          <input type = "file" onChange={onFileChange}
                 id = "wordPdf" name = "wordPdf"
                 accept = "image/pdf"></input> <br></br>
          <input type="submit" onClick={onSubmit} value="Upload"></input>
          <input id="pdffile" name="pdffile" type="file" />
          <button id="btn" onClick= {convert}>Process</button>
          <div id="result"></div>
        </div>``
  
        <img src="" id="uploaded_pdf"/>
      </div>
    );
  } else {
    return (
      <div className="App">
        <form onSubmit={onSubmit} className="Upload-buttons">
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
}

export default App;
