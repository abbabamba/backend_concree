import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';



@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'], // Ajoute des logs pour mieux comprendre les opérations
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Erreur de connexion à la base de données:', error);
      // Vous pouvez ajouter une logique pour réessayer la connexion après un certain délai
    }
  }
  
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
