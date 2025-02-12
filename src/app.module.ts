import { Module } from '@nestjs/common';
import { VideosModule } from './videos/videos.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    VideosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
