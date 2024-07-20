export class PdfExtensionError extends Error{

    constructor(){
        super('The file is not .pdf');
    }
}


export class PdfSizeError extends Error{

    constructor(){
        super('The PDf file is larzer than 5MB');
    }
}



export class pdfMagicNumberError extends Error{

    constructor(){
        super('The file does not start with the PDF magic number %PDF');
    }
}



export class PdfNotParsedError extends Error{

    constructor(){
        super('The file could not be parsed');
    }
}
