import { Test, TestingModule } from '@nestjs/testing';
import { PdfParserController } from './pdf-parser.controller';
import { PdfParserService } from './pdf-parser.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';

describe('PdfParserController', () => {
  let controller: PdfParserController;
  let service: PdfParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfParserController],
      providers: [PdfParserService],
      imports: [ConfigModule.forRoot(), HttpModule],
    }).compile();

    controller = module.get<PdfParserController>(PdfParserController);
    service = module.get<PdfParserService>(PdfParserService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("should return a PdfParserUploadResultDto from an uploaded PDF file", async () => {
    const text = "test";
    const mockFile: Express.Multer.File = {
      buffer: Buffer.from(text),
      originalname: "test.pdf",
      encoding: 'utf-8',
      mimetype: 'application/pdf',
      size: 5 * 1024 * 1024,
      fieldname: 'file',
      destination: '',
      filename: '',
      path: '',
      stream: null as any, // Adjust as needed
    };

    const parseResult = Promise.resolve(text);

    const responseResult = {
      originalFileName: mockFile.originalname,
      content: text,
    };

    jest.spyOn(service, 'parsePdf').mockImplementation(async () => parseResult);

    expect(await controller.parsePdfFromUpload(mockFile)).toEqual(responseResult);
  });

  it("should throw a error UnprocessableEntityException from an invalid uploaded PDF file", async () => {
    const text = "test"
    const mockFile: Express.Multer.File = {
      buffer: Buffer.from(text),
      originalname: "test.pdf",
      encoding: 'utf-8',
      mimetype: 'application/pdf',
      size: 5 * 1024 * 1024,
      fieldname: 'file',
      destination: '',
      filename: '',
      path: '',
      stream: null,
    };

    await expect(controller.parsePdfFromUpload(mockFile)).rejects.toThrow(
      UnprocessableEntityException,
    )

  });

  it("should return a PdfParserUrlResultDto from a PDF file given from URl", async () => {
    const url = 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf';
    const responseResult = {
      originalUrl: url,
      content: "Dummy PDF file",
    }

    expect(await controller.parsedPdfFromUrl({ url: url })).toEqual(responseResult,);
  });



  // it("should return a UnprocessableEntityException form a unsearchable PDF file from URl", async () => {
  //   const url = 'https://pub-e0c49d057f644ddd8865f82361396859.r2.dev/test_scanned.pdf';

  //   expect(await controller.parsedPdfFromUrl({ url: url })).rejects.toThrow(
  //     UnprocessableEntityException,
  //   );
  // });

  // it("should throw a BadRequestExecption form a invalid file extension", async () => {
  //   const url = 'https://pub-e0c49d057f644ddd8865f82361396859.r2.dev/cute-cat.jpg';

  //   expect(await controller.parsedPdfFromUrl({ url: url })).rejects.toThrow(
  //     BadRequestException,
  //   );
  // });

  // it("should throw a BadRequestExecption for a filw with .pdf  not having  its magic number", async () => {
  //   const url = 'https://pub-e0c49d057f644ddd8865f82361396859.r2.dev/cute-cat.jpg.pdf';

  //   expect(await controller.parsedPdfFromUrl({ url: url })).rejects.toThrow(
  //     BadRequestException,
  //   );
  // });



});
