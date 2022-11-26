import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CdrModule } from './cdr/cdr.module';
import configuration from './config/config.provider';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    CdrModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const { username, password, database, host } =
          configService.get('mongo');

        return {
          uri: `mongodb://${username}:${password}@${host}/${database}`,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [ConfigModule],
})
export class AppModule {}
