
import { Module } from '@nestjs/common';
import { PdfParserController } from './pdf-parser/pdf-parser.controller';
import { PdfParserService } from './pdf-parser/pdf-parser.service';
import { ParsersController } from './parsers.controller';



@Module({
    imports: [],
    controllers: [ParsersController, PdfParserController],
    providers: [PdfParserService]
})

export class ParsersModule { }