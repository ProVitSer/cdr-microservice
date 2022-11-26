import { Module } from '@nestjs/common';
import { CdrService } from './cdr.service';
import { CdrController } from './cdr.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Cdr, CdrSchema } from './cdr.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Cdr.name, schema: CdrSchema }]),
  ],
  controllers: [CdrController],
  providers: [
    {
      provide: 'CDR',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('rabbitMQ.user');
        const password = configService.get('rabbitMQ.password');
        const host = configService.get('rabbitMQ.host');
        const queueName = configService.get('rabbitMQ.queueName');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    CdrService,
  ],
})
export class CdrModule {}
