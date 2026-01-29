import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from './modules/network/entities/edge.entitity';
import { Network } from './modules/network/entities/network.entity';
import { Node } from './modules/network/entities/node.entity';
import { NetworkModule } from './modules/network/network.module';
import { RouteModule } from './modules/routes/route.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Network, Node, Edge],
      synchronize: true,
    }),
    NetworkModule,
    RouteModule,
  ],
})
export class AppModule {}
