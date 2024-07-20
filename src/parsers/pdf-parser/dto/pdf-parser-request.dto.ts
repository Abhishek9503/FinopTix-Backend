import { ApiProperty } from "@nestjs/swagger";
import { IsUrl } from "class-validator";


export class pdfParserRequestDto {
    @ApiProperty({
        description: 'URL of the PDF filet to parse',
    })
    @IsUrl()
    url: string;
}
