import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Poppler from 'node-poppler';

@Injectable()
export class PdfParserService {

    constructor(
        private configService: ConfigService,
        private httpService: HttpService
    ) { }

    async parsePdf(file: Buffer) {
        const poppler = new Poppler(this.configService.get('POPPLER_BIN_PATH'));


        let text = await poppler.pdfToText(file, null, {
            maintainLayout: true,
            quiet: true,
        });

        if (typeof text === 'string') {
            text = this.postProcessText(text)

        }
        return text;

    }


    private postProcessText(text: string) {

        const processedText = text
            //trim each line 
            .split("\n")

            //keep only one line if multiple line are empty
            .map((line) => line.trim())

            //remove whitespaced in lines if there are more then  3 spaces
            .filter((line, index, arr) => line !== '' || arr[index - 1] !== '')


            .map((line) => line.replace(/\s{3,}/g, '   '))
            .join('\n')


        return processedText;
    }


    async loadPdfFromUrl(url: string){
        const response = await this.httpService.axiosRef({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
    });


    if(!response.headers['content-type'].includes('application/pdf')){
        throw new BadRequestException("The provided URL is not  a PDf123");
    }

    if(parseInt(response.headers['Content-Type'] as string )> 5*1024*1024){
        throw new BadRequestException("Pdf file is large than 5 MB");
    }

    return Buffer.from(response.data,'binary');
    }

}

