
const setWords = new Set();

function isNumber(char) {
    return /^\d$/.test(char);
}

function convert() {
    let fr = new FileReader();
    let entire_text = "";

    //why do we NEED the fr.onload function to run the inner bit of code?
    fr.onload=function(){
        //output is stored in result
        pdfToText(fr.result, null, (text) => { 
            entire_text += text;
            document.getElementById('result').innerText += text;
            
            let tempString = "";
            for (const token of entire_text) {
                if (!isNumber(token)) {
                    tempString += token
                } else {
                    //console.log(tempString)
                    if (tempString.length > 2) {
                        setWords.add(tempString.trim())
                        tempString = "";
                    }
                }
            }
            
            const outString = JSON.stringify(Array.from(setWords));
            uploadFile(
                outString,
                "DomainWordExtractor",
                "JoniLi99",
                "main",
                "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"
            )
            console.log(outString)
            createTxtFile(outString) 
        });
    }
    //why doesn't the order matter?
    fr.readAsDataURL(document.getElementById('pdffile').files[0])

    console.log(document.getElementById('result').innerText)
    
}

function pdfToText(data, callbackPageDone, callbackAllDone) {
    console.assert(data instanceof ArrayBuffer || typeof data == 'string');

    let loadingTask = pdfjsLib.getDocument(data);
    loadingTask.promise.then(function (pdf) {

        const num_pages = pdf._pdfInfo.numPages;
        let layers = {};
        let num_completed_pages = 0;

        for (let page_index = 1; page_index <= num_pages; page_index++) {
            pdf.getPage(page_index).then(function (page) {
                const n = page.pageNumber; // Shouldn't i and n be equal?
                if (page_index != n) console.log("Page number i and n not equal!")
                
                page.getTextContent().then(function (textContent) {
                    //console.log(textContent.items[0]);0
                    if (textContent.items) {
                        let page_text = "";
                        let last_block = null;
                        for (const text_block of textContent.items) {
                            if (last_block != null && last_block.str[last_block.str.length - 1] != ' ') {
                                if (text_block.x < last_block.x)
                                    page_text += "\r\n";
                                else if (last_block.y != text_block.y && (last_block.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) == null))
                                    page_text += ' ';
                            }
                            page_text += text_block.str;
                            last_block = text_block;
                        }

                        console.log("page " + page_index + " finished."); //" content: \n" + page_text);
                        layers[page_index] = page_text + "\n";
                    }
                    // Only call callback once all pages have been completely parsed
                    ++num_completed_pages;
                    if (num_completed_pages == num_pages) {
                        window.setTimeout(function () {
                            let full_text = "";
                            for (const layer of layers)
                                full_text += layer;
                            callbackAllDone(full_text);
                        }, 1000);
                    }
                }); // end  of page.getTextContent().then
            }); // end of page.then
        } // of for
    });
};

function Pdf2TextClass() {
    let self = this;
    this.complete = 0;

    this.pdfToText = function (data, callbackPageDone, callbackAllDone) {
        console.assert(data instanceof ArrayBuffer || typeof data == 'string');

        let loadingTask = pdfjsLib.getDocument(data);
        loadingTask.promise.then(function (pdf) {

            const num_pages = pdf._pdfInfo.numPages;
            let layers = {};
            let num_completed_pages = 0;

            for (let page_index = 1; page_index <= num_pages; page_index++) {
                pdf.getPage(page_index).then(function (page) {
                    const n = page.pageNumber; // Shouldn't i and n be equal?
                    if (page_index != n) console.log("Page number i and n not equal!")
                    
                    page.getTextContent().then(function (textContent) {
                        //console.log(textContent.items[0]);0
                        if (textContent.items) {
                            let page_text = "";
                            let last_block = null;
                            for (const text_block of textContent.items) {
                                if (last_block != null && last_block.str[last_block.str.length - 1] != ' ') {
                                    if (text_block.x < last_block.x)
                                        page_text += "\r\n";
                                    else if (last_block.y != text_block.y && (last_block.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) == null))
                                        page_text += ' ';
                                }
                                page_text += text_block.str;
                                last_block = text_block;
                            }

                            console.log("page " + page_index + " finished."); //" content: \n" + page_text);
                            layers[page_index] = page_text + "\n";
                        }
                        // Only call callback once all pages have been completely parsed
                        ++num_completed_pages;
                        if (num_completed_pages == num_pages) {
                            window.setTimeout(function () {
                                let full_text = "";
                                for (const layer of layers)
                                    full_text += layer;
                                callbackAllDone(full_text);
                            }, 1000);
                        }
                    }); // end  of page.getTextContent().then
                }); // end of page.then
            } // of for
        });
    }; // end of pdfToText()
}; // end of class

function createTxtFile(text) {
    const className = document.getElementById("classname").value;
    const blob = new Blob([text],
            { type: "text/plain;charset=utf-8" });
            saveAs(blob, className + ".txt");
}

async function uploadFile(content, repo, owner, branch, token) {
    
    // Encode the contents of the file as a base64 string
    // const encodedContent = Buffer.from(content).toString("base64");
    console.log("isaac", content)

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
            path: "Joni.txt",
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
