// import { text } from "stream/consumers";

const setWords = new Set();
let debug1, debug2, debug3;

function isNumber(char) {
    return /^\d$/.test(char);
}

// Get the contents of a file from the GitHub repository
async function getFileContent(filename, repo, owner, branch, token) {
    const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filename}?ref=${branch}`,
        { headers: { Authorization: `Token ${token}` } }
    );
    const contentBase64 = response.data.content;
    const content = atob(contentBase64);
    return content;
}

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

async function convert() {
    sessionStorage.setItem('classname', document.getElementById('classname').value);
    sessionStorage.setItem('owner', document.getElementById('owner').value);
    sessionStorage.setItem('repository', document.getElementById('repository').value);
    sessionStorage.setItem('branch', document.getElementById('branch').value);
    sessionStorage.setItem('token', document.getElementById('token').value);
    let fr = new FileReader();
    fr.readAsDataURL(document.getElementById('pdfFile').files[0]);
    fr.onload = function () {
        sessionStorage.setItem('pdfFile', fr.result);
        // window.location.href = 'edit.html';
        checkAndRedirect();
    };

    async function checkAndRedirect() {
        const owner = document.getElementById("owner").value;
        const repository = document.getElementById("repository").value;
        const branch = document.getElementById("branch").value;
        const token = document.getElementById("token").value;
        const className = sessionStorage.getItem('classname');
        const classFile = className + ".txt";
        const fileExists = await checkFileExists(classFile, repository, owner, branch, token);
        if (fileExists) {
            const existingContent = await getFileContent(classFile, repository, owner, branch, token);
            sessionStorage.setItem('existingContent', existingContent);
        } else {
            sessionStorage.setItem('existingContent', null);
        }
        window.location.href = 'edit.html';
    }

    // const owner = document.getElementById("owner").value;
    // const repository = document.getElementById("repository").value;
    // const branch = document.getElementById("branch").value;
    // const token = document.getElementById("token").value;
    // const pdfFileBase64 = fr.result

    // const className = sessionStorage.getItem('classname');
    // const classFile = className + ".txt";
    // const fileExists = await checkFileExists(classFile, repository, owner, branch, token);

    // if (fileExists) {
    //     const existingContent = await getFileContent(classFile, repository, owner, branch, token);
    //     sessionStorage.setItem('existingContent', existingContent);
    // } else {
    //     sessionStorage.setItem('existingContent', null);
    // }

    // window.location.href = 'edit.html';


    // const owner = document.getElementById("owner").value;
    // const repository = document.getElementById("repository").value;
    // const branch = document.getElementById("branch").value;
    // const token = document.getElementById("token").value;

    // let fr = new FileReader();
    // console.debug("Start converting...")

    // fr.readAsDataURL(document.getElementById('pdfFile').files[0])
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
}

async function download() {
    const owner = document.getElementById("owner").value;
    const repository = document.getElementById("repository").value;
    const branch = document.getElementById("branch").value;
    const token = document.getElementById("token").value;
    const className = document.getElementById('classname').value;
    const classFile = className + ".txt";
    const fileExists = await checkFileExists(classFile, repository, owner, branch, token);
    if (fileExists) {
        const existingContent = await getFileContent(classFile, repository, owner, branch, token);
        createTxtFile(existingContent);
    } else {
        console.log("File does not exist!")
    }
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
    const className = document.getElementById("classname").value;
    const blob = new Blob([text],
            { type: "text/plain;charset=utf-8" });
            saveAs(blob, className + ".txt");
}

async function uploadFile(content, repo, owner, branch, token) {
    const className = document.getElementById("classname").value;
    const classFile =  className + ".txt";
    // Encode the contents of the file as a base64 string
    // const encodedContent = Buffer.from(content).toString("base64");

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
// "Ayan.txt",
// "Tester",
// "highheat4",
// "main",
// "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"
// );
