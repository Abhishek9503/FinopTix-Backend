import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './strategy/apiKey.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/database/entities/application.entity';
import {  ApiKey } from 'src/database/entities/api-key.entity';

@Module({
  imports: [PassportModule,TypeOrmModule.forFeature([ApiKey, Application])],
  providers: [AuthService, ApiKeyStrategy],
  exports: [AuthService],
})
export class AuthModule {}
