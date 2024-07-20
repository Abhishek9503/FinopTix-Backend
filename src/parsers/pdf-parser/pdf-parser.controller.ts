import { BadRequestException, Body, Controller, Get, HttpCode, ParseFilePipe, ParseFilePipeBuilder, Post, UnprocessableEntityException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { PdfParserService } from './pdf-parser.service';
import { PdfParserUploadResultDto, PdfParserUrlResultDto } from './dto/pdf-parser-result.dto';
import { pdfParserRequestDto } from './dto/pdf-parser-request.dto';
import {  PdfNotParsedError } from './exceptions/exceptions';


const uploadSchema = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      format: 'binary',
    }
  }
};

const pdfPipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: 'pdf',
  })
  .addMaxSizeValidator({
    maxSize: 1024 * 1024 * 5  //5 mb
  })
  .build({
    fileIsRequired: true,
  })

  @ApiUnauthorizedResponse({
    description: 'The API key in request header is missing or invalid',
  })
  @ApiBadRequestResponse({
    description: 'The request body of the uploaded file is invalid or missing',
  })
  @ApiUnprocessableEntityResponse({
    description: 'The PDF file is not searchable'
  })
@ApiSecurity('apiKey')
@ApiTags('parsers')
@Controller({ path: 'parsers/pdf', version: '1' })

export class PdfParserController {
  constructor(private readonly pdfParserService: PdfParserService) { }
  @ApiOperation({
    summary: 'Returns text from uploaded PDf file',
    description:`This end point retrives the content of an uploaded pdf file and return it as text.\n
    The file must be a searchable PDF, with a maximum size of 5MB.\n
    Its buffer need to start with  its magic number "%PDF"  to be parsed `

  })
  @ApiOkResponse({
    type: pdfParserRequestDto,
    description: 'The PDF was parsed and post-processed successfully . Its content is returned as text.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: uploadSchema,description: "PDF file to be parsed" })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  @HttpCode(200)
 
  async parsePdfFromUpload(@UploadedFile(pdfPipe) file: Express.Multer.File): Promise<PdfParserUploadResultDto> {

    try {
      const text = await this.pdfParserService.parsePdf(file.buffer);
      return {
        originalFileName: file.originalname,
        content: text,
      }
    }

    catch (e) {
      throw new UnprocessableEntityException(e.message)

    }


  }


  @ApiOperation({
    summary: 'Returns text from  PDf file provided by URL',
    description:`This end point retrives the content of an  pdf file availabe throuugh and URL and return it as text.\n
    The file must be a searchable PDF, with a maximum size of 5MB.\n
    Its buffer need to start with  its magic number "%PDF"  to be parsed `

  })
  @ApiOkResponse({
    type: pdfParserRequestDto,
    description: 'The PDF was parsed and post-processed successfully . Its content is returned as text.'
  })
  @Post('url')
  @HttpCode(200)
  async parsedPdfFromUrl(
    @Body() requestDto: pdfParserRequestDto
  ): Promise<PdfParserUrlResultDto> {

    try {
      
    const file = await this.pdfParserService.loadPdfFromUrl(requestDto.url);
    const text = await this.pdfParserService.parsePdf(file)
  
    return {
      originalUrl: requestDto.url,
      content: text,
    }
    } catch (e) {
     if(e instanceof PdfNotParsedError) {
      throw new UnprocessableEntityException(e.message)
     }

     throw new BadRequestException(e.message)

    }

  }
}
