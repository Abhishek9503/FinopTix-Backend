import { ApiProperty } from "@nestjs/swagger";
import { IsJSON } from "class-validator";



enum Model {
    GPT_3_5 = "gpt-3.5-turbo",
    GPT_4 = "gpt-4",
}


export class JsonExtractRequestDto {
    @ApiProperty({
        description: "text to extreact data from",

    })
    text: string;

    @ApiProperty({
        description: "model available for data extraction",
        enum: Model,
    })
    model: Model;

    @ApiProperty({
        description: "json schema to use for data extraction",
    })
    @IsJSON()
    jsonSchema: string;

    @ApiProperty({
        description: "whether to refine the extracted data",
        default: false,
    })
    refine?: boolean;
}