import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JsonService } from './json.service';

@ApiSecurity('api_key')
@ApiTags("organized-data")
@Controller({path: "organized-data/json", version: "1"})
export class JsonController {


    constructor(private readonly jsonService: JsonService) {} 
}
