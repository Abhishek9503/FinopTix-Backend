import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import Poppler from 'node-poppler';
import { PdfExtensionError, pdfMagicNumberError, PdfNotParsedError, PdfSizeError } from './exceptions/exceptions';

@Injectable()
export class PdfParserService {

    constructor(
        private configService: ConfigService,
        private httpService: HttpService
    ) { }

    async parsePdf(file: Buffer) {
        const poppler = new Poppler(this.configService.get('POPPLER_BIN_PATH'));


        const output = await poppler.pdfToText(file, null, {
            maintainLayout: true,
            quiet: true,
        }) as any
        if (output instanceof Error || output.length === 0) {
            throw new PdfNotParsedError();

        }
        return this.postProcessText(output);

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


    async loadPdfFromUrl(url: string) {
        const extension = url.split('.').pop();
        if (extension !== 'pdf') {
            throw new PdfExtensionError();
        }
        const response = await this.httpService.axiosRef({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
        });

        this.checkResponse(response);



        return Buffer.from(response.data, 'binary');
    }

    private checkResponse(response: AxiosResponse) {

        if (parseInt(response.headers['Content-Type'] as string) > 5 * 1024 * 1024) {
            throw new PdfSizeError();
        }

        const pdfMagicNumber = Buffer.from([0x25, 0x50, 0x44, 0x46]);
        const bufferStart = response.data.subarray(0, 4);

        if (!bufferStart.equals(pdfMagicNumber)) {
            throw new pdfMagicNumberError();
        }
    }



}




