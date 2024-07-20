import { Test, TestingModule } from '@nestjs/testing';
import { PdfParserService } from './pdf-parser.service';
import { PdfParserController } from './pdf-parser.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { buffer } from 'stream/consumers';
import { PdfExtensionError, pdfMagicNumberError } from './exceptions/exceptions';

describe('PdfParserService', () => {
  let service: PdfParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfParserService],
      imports: [ConfigModule.forRoot(), HttpModule],
    }).compile();

    service = module.get<PdfParserService>(PdfParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('postprocessText', () => {

    it("Should trim line and remove excess inner  whitespaces and keep a maximum of 3", () => {
      const input = '     a       b       c d        ';
      const expected = 'a   b   c d'
      const actual = service['postProcessText'](input)
      expect(actual).toEqual(expected)
    })


    it("should keep only one empty line if multiple line are empty ", () => {
      const input = 'a\n\n\nb\n\n\n\nc\nd';
      const expected = 'a\n\nb\n\n\c\nd';
      const actual = service['postProcessText'](input);
      expect(actual).toEqual(expected)
    })
  });


  describe('loadPdfFromUrl() ', () => {
    it("should load the pdf from url and parse it ", async () => {

      const url = 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf';
      const buffer = await service.loadPdfFromUrl(url)

      const expected = 'Dummy PDF file';
      const actual = await service.parsePdf(buffer)

      expect(actual).toEqual(expected)

    });




    it("should throw an error if the file extnsion is not pdf ", async () => {

      const url = 'https://pub-e0c49d057f644ddd8865f82361396859.r2.dev/cute-cat.jpg';

      await expect(service.loadPdfFromUrl(url)).rejects.toThrowError(
        PdfExtensionError,
      )

    });

    //Here the pdfmagic number test case is not working iski mkc

    it("should throw an error if the file does not have the pdf magic number  ", async () => {

      const url = 'https://pub-e0c49d057f644ddd8865f82361396859.r2.dev/cute-cat.jpg.pdf';

      await expect(service.loadPdfFromUrl(url)).rejects.toThrowError(
        pdfMagicNumberError,
      )

    })


  })

});
