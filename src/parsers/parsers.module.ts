
import { Module } from '@nestjs/common';
import { PdfParserController } from './pdf-parser/pdf-parser.controller';
import { PdfParserService } from './pdf-parser/pdf-parser.service';
import { HttpModule } from '@nestjs/axios';



@Module({
    imports: [HttpModule],
    controllers: [ PdfParserController],
    providers: [PdfParserService]
})

export class ParsersModule { }