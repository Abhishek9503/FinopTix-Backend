import { ApiProperty } from "@nestjs/swagger";
import { IsUrl } from "class-validator";


export class pdfParserRequestDto {
    @ApiProperty()
    @IsUrl()
    url: string;
}
