import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ApiKeyAuthGuard extends AuthGuard('api-key'){}