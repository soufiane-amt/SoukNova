import { Module } from '@nestjs/common';
import { ShoppingConciergeController } from './controller/shopping-concierge.controller';
import { ConciergeService } from './service/shopping-concierge.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers:[ShoppingConciergeController],
    providers:[ConciergeService, PrismaService]
})
export class ShoppingConciergeModule {

}
