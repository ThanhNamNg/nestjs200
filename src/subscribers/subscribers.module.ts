import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber } from 'rxjs';
import { subscriberSchema } from './schemas/subscriber.sechma';

@Module({
  controllers: [SubscribersController],
  providers: [SubscribersService],
  imports: [
    MongooseModule.forFeature([
      { name: Subscriber.name, schema: subscriberSchema },
    ]), // Import MongooseModule with Subscriber model
  ],
})
export class SubscribersModule {}
