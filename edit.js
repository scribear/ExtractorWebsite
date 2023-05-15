// import { text } from "stream/consumers";

const setWords = new Set();
let debug1, debug2, debug3;

function isNumber(char) {
    return /^\d$/.test(char);
}

let display_text = "";

//  Testing
// function getPassedValues() {
//     const classname = sessionStorage.getItem('classname');
//     const owner = sessionStorage.getItem('owner');
//     const repository = sessionStorage.getItem('repository');
//     const branch = sessionStorage.getItem('branch');
//     const token = sessionStorage.getItem('token');

//     // Do whatever you need with these values, for example:
//     console.log(classname, owner, repository, branch, token);
// }

// getPassedValues();
//
// async function processPdfFile() {
//     const pdfFile = sessionStorage.getItem('pdfFile');
    
//     if (!pdfFile) {
//         return;
//     }
    
//     const pdfBytes = Uint8Array.from(atob(pdfFile), c => c.charCodeAt(0));
//     const pdfDoc = await pdfjsLib.getDocument({data: pdfBytes}).promise;

//     const setWords = new Set();
    
//     for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
//         const page = await pdfDoc.getPage(pageNum);
//         const content = await page.getTextContent();
//         const strings = content.items.map(item => item.str);

//         strings.forEach(word => setWords.add(word));
//     }

//     const display_text = Array.from(setWords).sort().join("\n");
//     // console.log(display_text);
//     sessionStorage.setItem('pdfContent', display_text);
// }


// Check if the file exists in the GitHub repository
async function checkFileExists(filename, repo, owner, branch, token) {
    try {
        await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/contents/${filename}?ref=${branch}`,
            { headers: { Authorization: `Token ${token}` } }
        );
        return true;
    } catch (error) {
        if (error.response.status === 404) {
            return false;
        }
        throw error;
    }
}

// Get the contents of a file from the GitHub repository
async function getFileContents(filename, repo, owner, branch, token) {
    const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filename}?ref=${branch}`,
        { headers: { Authorization: `Token ${token}` } }
    );
    const contentBase64 = response.data.content;
    const content = atob(contentBase64);
    return content;
}

// Add this new function to populate the textareas when the page is loaded
async function populateTextareas() {
    const owner = sessionStorage.getItem('owner');
    const repository = sessionStorage.getItem('repository');
    const branch = sessionStorage.getItem('branch');
    const token = sessionStorage.getItem('token');
    // await processPdfFile();
    
    const existingContent = sessionStorage.getItem('existingContent');
    if (existingContent) {
        document.getElementById('exist').value = existingContent;
        document.getElementById('exist').readOnly = true;
    }

    const pdfContent = sessionStorage.getItem('pdfContent');
    if (pdfContent) {
        document.getElementById('merge').value = pdfContent;
        document.getElementById('merge').readOnly = false;
    }

    const pdfFileBase64 = sessionStorage.getItem('pdfFile');
    // Convert Base64 to ArrayBuffer
    const binaryString = atob(pdfFileBase64.split(',')[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const pdfArrayBuffer = bytes.buffer;
    console.debug("Start converting...")
    pdfToWords(pdfArrayBuffer, () => {}, (words) => { 
        words
        .filter(word => word.length > 1)
        .map(word => setWords.add(word.charAt(0).toUpperCase() + word.slice(1)))
        // const display_text = Array.from(setWords).sort().join("\n")
        // console.log(display_text)
        // document.getElementById('result').innerText = display_text;

        // Update the 'merge' textarea with the words from the PDF file
        // document.getElementById('merge').value = display_text;
        // document.getElementById('merge').readOnly = false;
        const existingContent = sessionStorage.getItem('existingContent');
        let existingContent_arr = existingContent.split('\n');
        existingContent_arr.map(word => setWords.add(word));
        
        // display_text = JSON.stringify(Array.from(setWords).map((word) => {
        //     if (word.length === 1) {
        //         return "";
        //     }
        //     else {
        //         return word.charAt(0).toUpperCase() + word.slice(1);
        //     }
        // }).sort());
        display_text = Array.from(setWords).filter(word => word.length > 1).sort().join("\n")
        display_text = display_text.replace(/[\[\]"]/g, "");
        display_text = display_text.replace(/,/g, "\n");
        // words.map(word => setWords.add(word))
        // const display_text = Array.from(setWords).filter(word => word.length > 1).sort().join("\n")
        // console.log(display_text)
        // document.getElementById('result').innerText = display_text;
        // Update the 'merge' textarea with the words from the PDF file
        document.getElementById('merge').value = display_text;
        document.getElementById('merge').readOnly = false;
        // const outString = JSON.stringify(Array.from(setWords));
        // uploadFile(
        //     outString,
        //     // "DomainWordExtractor",
        //     repository,
        //     // "JoniLi99",
        //     owner,
        //     // "main",
        //     branch,
        //     // "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"
        //     token
        // ).then(() => {
        //     console.log(outString);
        // });
    });
}

async function convert() {
    const owner = sessionStorage.getItem('owner');
    const repository = sessionStorage.getItem('repository');
    const branch = sessionStorage.getItem('branch');
    const token = sessionStorage.getItem('token');
    const pdfFileBase64 = sessionStorage.getItem('pdfFile');

    // const className = sessionStorage.getItem('classname');
    // const classFile = className + ".txt";
    // const fileExists = await checkFileExists(classFile, repository, owner, branch, token);
    // if (fileExists) {
    //     const existingContent = await getFileContents(classFile, repository, owner, branch, token);
    //     document.getElementById('exist').value = existingContent;
    //     document.getElementById('exist').readOnly = true;
    //     document.getElementById('merge').readOnly = false;
    // }

    const existingContent = sessionStorage.getItem('existingContent');
    if (existingContent) {
        document.getElementById('exist').value = existingContent;
        document.getElementById('exist').readOnly = true;
    }
    // // Merge the content of the PDF file and the existing file
    // if (existingContent) {
    //     const mergedContent = mergeContent(existingContent, Array.from(setWords));
    //     document.getElementById('merge').value = mergedContent.join("\n");
    //     document.getElementById('merge').readOnly = false;
    // }
    
    // Convert Base64 to ArrayBuffer
    // const binaryString = atob(pdfFileBase64.split(',')[1]);
    // const len = binaryString.length;
    // const bytes = new Uint8Array(len);
    // for (let i = 0; i < len; i++) {
    //     bytes[i] = binaryString.charCodeAt(i);
    // }
    // const pdfArrayBuffer = bytes.buffer;

    // console.debug("Start converting...")
    uploadFile(
        display_text,
        // "DomainWordExtractor",
        repository,
        // "JoniLi99",
        owner,
        // "main",
        branch,
        // "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"
        token
    ).then(() => {
        createTxtFile(display_text);
        // window.location.href = 'index.html';
        window.location.href = '/';
    });
    // pdfToWords(pdfArrayBuffer, () => {}, (words) => { 
    //     words.map(word => setWords.add(word))
    //     // const display_text = Array.from(setWords).sort().join("\n")
    //     // console.log(display_text)
    //     // document.getElementById('result').innerText = display_text;

    //     // Update the 'merge' textarea with the words from the PDF file
    //     // document.getElementById('merge').value = display_text;
    //     // document.getElementById('merge').readOnly = false;
    //     const existingContent = sessionStorage.getItem('existingContent');
    //     let existingContent_arr = existingContent.split('\n');
    //     existingContent_arr.map(word => setWords.add(word));
        
    //     let outString = JSON.stringify(Array.from(setWords).map((word) => {
    //         if (word.length === 1) {
    //             return "";
    //         }
    //         else {
    //             return word.charAt(0).toUpperCase() + word.slice(1);
    //         }
    //     }).sort());
    //     outString = outString.replace(/[\[\]"]/g, "");
    //     outString = outString.replace(/,/g, "\n");
    //     uploadFile(
    //         outString,
    //         // "DomainWordExtractor",
    //         repository,
    //         // "JoniLi99",
    //         owner,
    //         // "main",
    //         branch,
    //         // "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"
    //         token
    //     ).then(() => {
    //         // console.log(outString);
    //         createTxtFile(outString);
    //         window.location.href = 'index.html';
    //     });
    // });

    // Inside the convert() function, after converting the PDF to words:
    // const display_text = Array.from(setWords).sort().join("\n");
    // console.log(display_text);
    // sessionStorage.setItem('pdfContent', display_text);

    // // fr.readAsDataURL(document.getElementById('pdfFile').files[0])
    // fr.onload = function(){ // this function is executed asynchronously when the pdf file has been loaded 
    //     //output is stored in result
    //     pdfToWords(fr.result, () => {}, (words) => { 
    //         words.map(word => setWords.add(word))
    //         const display_text = Array.from(setWords).sort().join("\n")
    //         console.log(display_text)
    //         document.getElementById('result').innerText = display_text;
            
    //         const outString = JSON.stringify(Array.from(setWords));
    //         uploadFile(
    //             outString,
    //             // "DomainWordExtractor",
    //             repository,
    //             // "JoniLi99",
    //             owner,
    //             // "main",
    //             branch,
    //             // "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"
    //             token
    //         )
    //         console.log(outString)
    //         createTxtFile(outString) 
    //     });
    // }
    // window.location.href = 'index.html';
}

/**
 * Structure of textContent:
 * {
 *      items: [
 *          {
 *              str: string, // content of the text block
 *              width: float, // width of the text block
 *              height: float, // height of the text block
 *              dir: string, // "ltr" indicates horizontal text block
 *              font_name: string, // key in styles dictionary
 *              hasEOL: bool, 
 *              transform: float[6] // meaning unknown
 *          },
 *          ...
 *      ]
 *      styles: {
 *          font_name_1: {fontFamily: string, ascent: float, descent: float, vertical: bool},
 *          font_name_2: {fontFamily: string, ascent: float, descent: float, vertical: bool},
 *          ...
 *      }
 * }
 */
function textContentToWords(textContent) {
    if (!textContent.items) {
        return []
    }
    let words = []
    // Legal characters: latin letters, greek letters, ', -, ()
    // Phrases are space separated strings of legal characters
    // const word_regex = /(\s*([^\d\s\W]|[α-ωΑ-Ω\'\-\(\)])+\s*)+/
    const word_regex = /(\s*([^\d\s\W]|[\u03B1-\u03C9\u0391-\u03A9\'\-\(\)])+\s*)+/;
    // a pair of brackets and arbitray string in between them
    const brackets_regex = /\(.*?\)/g
    // 1+ contiguous spaces
    const spaces_regex = /\s+/g
    for (const text_block of textContent.items) {
        const text = text_block.str
        if (text.search(word_regex) == -1) {
            continue
        }
        let word = text.match(word_regex)[0]
        // TODO: remove extra spaces around brackets
        word = word.replaceAll(brackets_regex, "") // remove brackets
        word = word.replaceAll(spaces_regex, " ") // replace multiple spaces with single space
        word = word.trim()
        words.push(word)
    }
    debug1 = words
    debug2 = textContent.items.map(item => item.str)
    return words
}

function pdfToWords(data, callbackPageDone, callbackAllDone) {
    console.assert(data instanceof ArrayBuffer || typeof data == 'string');

    let loadingTask = pdfjsLib.getDocument(data);
    loadingTask.promise.then(function (pdf) {

        const num_pages = pdf._pdfInfo.numPages;
        let words = []
        let num_completed_pages = 0;

        for (let page_index = 1; page_index <= num_pages; page_index++) {
            pdf.getPage(page_index).then(function (page) {
                page.getTextContent().then(function (textContent) {

                    words = words.concat(textContentToWords(textContent))

                    // Only call callback once all pages have been completely parsed
                    ++num_completed_pages;
                    console.log("page " + page_index + " finished.");
                    // TODO: replace this with something like a barrier sync primitive
                    if (num_completed_pages == num_pages && callbackAllDone) {
                        setTimeout(function () {
                            callbackAllDone(words);
                        }, 1000);
                    }

                }); // end of page.getTextContent().then
            }); // end of page.then
        } // of for
    });
};

function createTxtFile(text) {
    // const className = document.getElementById("classname").value;
    const className = sessionStorage.getItem('classname');
    const blob = new Blob([text],
            { type: "text/plain;charset=utf-8" });
            saveAs(blob, className + ".txt");
}

// async function uploadFile(content, repo, owner, branch, token) {
//     const className = sessionStorage.getItem('classname');
//     const classFile = className + ".txt";
//     const fileExists = await checkFileExists(classFile, repo, owner, branch, token);

//     // Get the SHA of the latest commit on the branch
//     const latestCommitResponse = await axios.get(
//         `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
//         { headers: { Authorization: `Token ${token}` } }
//     );
//     const latestCommitSha = latestCommitResponse.data.object.sha;

//     // Create a new tree with the updated file content
//     const newTreeResponse = await axios.post(
//         `https://api.github.com/repos/${owner}/${repo}/git/trees`,
//         {
//             base_tree: latestCommitSha,
//             tree: [
//                 {
//                     path: classFile,
//                     mode: "100644",
//                     type: "blob",
//                     content: content,
//                 },
//             ],
//         },
//         { headers: { Authorization: `Token ${token}` } }
//     );
//     const newTreeSha = newTreeResponse.data.sha;

//     // Create a new commit with the new tree
//     const newCommitResponse = await axios.post(
//         `https://api.github.com/repos/${owner}/${repo}/git/commits`,
//         {
//             message: fileExists ? "Update file" : "Add file",
//             tree: newTreeSha,
//             parents: [latestCommitSha],
//         },
//         { headers: { Authorization: `Token ${token}` } }
//     );
//     const newCommitSha = newCommitResponse.data.sha;

//     // Update the branch to point to the new commit
//     await axios.patch(
//         `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
//         { sha: newCommitSha },
//         { headers: { Authorization: `Token ${token}` } }
//     );
// }

async function uploadFile(content, repo, owner, branch, token) {
    // const className = document.getElementById("classname").value;
    const className = sessionStorage.getItem('classname');
    const classFile =  className + ".txt";
    // Encode the contents of the file as a base64 string
    // const encodedContent = Buffer.from(content).toString("base64");
    // console.log("isaac", content)

    // Get the SHA of the latest commit on the branch
    const latestCommitResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
        { headers: { Authorization: `Token ${token}` } }
    );
    const latestCommitSha = latestCommitResponse.data.object.sha;

    // Create a new tree with the file
    const newTreeResponse = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/git/trees`,
        {
        base_tree: latestCommitSha,
        tree: [
            {
            // path: "Joni99.txt",
            path: classFile,
            mode: "100644",
            type: "blob",
            content: content
            }
        ]
        },
        { headers: { Authorization: `Token ${token}` } }
    );
    const newTreeSha = newTreeResponse.data.sha;

    // Create a new commit with the new tree
    const newCommitResponse = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/git/commits`,
        {
        message: "Add file",
        tree: newTreeSha,
        parents: [latestCommitSha]
        },
        { headers: { Authorization: `Token ${token}` } }
    );
    const newCommitSha = newCommitResponse.data.sha;

    // Update the branch to point to the new commit
    await axios.patch(
        `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
        { sha: newCommitSha },
        { headers: { Authorization: `Token ${token}` } }
    );
}

// uploadFile(
//     outString,
//     // "DomainWordExtractor",
//     repository,
//     // "JoniLi99",
//     owner,
//     // "main",
//     branch,
//     // "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"
//     token
// )