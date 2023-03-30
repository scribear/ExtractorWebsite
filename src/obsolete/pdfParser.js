import pdfjsLib from 'pdfjs-dist'
// import { GetDocumentParameters } from 'pdfjs-dist/types/src/display/api';

if (document.getElementById('btn') != null) {
    document.getElementById('btn').addEventListener('click', convert);
}

export const convert = () => {
    console.log(document.getElementById('btn'));
    let fr = new FileReader();
    let pdfToText = Pdf2TextClass();
    fr.onload = () => {
        pdfToText(fr.result, null, (text) => { document.getElementById('result').innerText += text; });
    }
    fr.readAsDataURL(document.getElementById('pdffile').files[0])
    
}

export function Pdf2TextClass() {
    let complete = 0;

    return (data, callbackPageDone, callbackAllDone) => {
        console.assert(data instanceof ArrayBuffer || typeof data == 'string');
        var loadingTask = pdfjsLib.getDocument(data);
        loadingTask.promise.then(function (pdf) {


            var total = pdf._pdfInfo.numPages;
            //callbackPageDone( 0, total );        
            var layers = {};
            for (let i = 1; i <= total; i++) {
                pdf.getPage(i).then(function (page) {
                    var n = page.pageNumber;
                    page.getTextContent().then(function (textContent) {

                        //console.log(textContent.items[0]);0
                        if (null != textContent.items) {
                            var page_text = "";
                            var last_block = null;
                            for (var k = 0; k < textContent.items.length; k++) {
                                var block = textContent.items[k];
                                if (last_block != null && last_block.str[last_block.str.length - 1] != ' ') {
                                    if (block.x < last_block.x)
                                        page_text += "\r\n";
                                    else if (last_block.y != block.y && (last_block.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) == null))
                                        page_text += ' ';
                                }
                                page_text += block.str;
                                last_block = block;
                            }

                            textContent != null && console.log("page " + n + " finished."); //" content: \n" + page_text);
                            layers[n] = page_text + "\n\n";
                        }
                        ++complete;
                        //callbackPageDone( self.complete, total );
                        if (complete == total) {
                            window.setTimeout(function () {
                                var full_text = "";
                                var num_pages = Object.keys(layers).length;
                                for (var j = 1; j <= num_pages; j++)
                                    full_text += layers[j];
                                callbackAllDone(full_text);
                            }, 1000);
                        }
                    }); // end  of page.getTextContent().then
                }); // end of page.then
            } // of for
        });
    }; // end of pdfToText()
}; // end of class

export const test = () => {

}