import { Module } from '@nestjs/common';
import { ShoppingConciergeController } from './controller/shopping-concierge.controller';
import { ConciergeService } from './service/shopping-concierge.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisModule } from '../redis/redis.module';

@Module({
    imports:[RedisModule],
    controllers:[ShoppingConciergeController],
    providers:[ConciergeService, PrismaService]
})
export class ShoppingConciergeModule {

}
