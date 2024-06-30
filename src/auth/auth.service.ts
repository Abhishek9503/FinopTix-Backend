import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    validateApiKey(apiKey: string): boolean {
        const validApiKeys = ['123', '321'];

        return validApiKeys.includes(apiKey)
    }
}
