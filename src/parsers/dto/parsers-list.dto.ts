import { ApiProperty } from "@nestjs/swagger";

export class ParsersListDto{

    @ApiProperty({type:[String]})
    avaialabeParesers: string[];
}