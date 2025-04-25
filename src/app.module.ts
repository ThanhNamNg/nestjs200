import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { YModule } from './y/y.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    //MongooseModule.forRoot('mongodb+srv://namjkl11:Nam%4028052004@cluster0.2lhf28c.mongodb.net/'),
    
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,}),

    YModule,

    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
