import { Test, TestingModule } from '@nestjs/testing';
import { PdfParserService } from './pdf-parser.service';
import { PdfParserController } from './pdf-parser.controller';

describe('PdfParserService', () => {
  let service: PdfParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfParserService,PdfParserController],
    }).compile();

    service = module.get<PdfParserService>(PdfParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('postprocessText', () => {

    it("Should trim line and remove excess inner  whitespaces and keep a maximum of 3", () => {
      const input = '       a       a       c d        ';
      const expected = 'a   b   c d'
      const actual = service['postProcessText'](input)
      expect(actual).toEqual(expected)
    })


    it("should keep only one empty line if multiple line are empty ", () => {
      const input = 'a\n\n\nb\n\n\n\nc\d\nd';
      const expected = 'a\n\nb\n\n\c\nd';
      const actual = service['postProcessText'](input);
      expect(actual).toEqual(expected)
    })
  })

});
