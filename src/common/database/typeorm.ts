import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  addTransactionalDataSource,
  getDataSourceByName,
} from 'typeorm-transactional';
import { AppConfig, DatabaseConfig } from '../config';

export const ConfiguredTypeOrmModule = () => {
  return TypeOrmModule.forRootAsync({
    inject: [AppConfig, DatabaseConfig],
    useFactory(appConfig: AppConfig, databaseConfig: DatabaseConfig) {
      return {
        ...databaseConfig.connectionOption,
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
        logging: !appConfig.isProduction,
        synchronize: !appConfig.isProduction,
      };
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async dataSourceFactory(options) {
      if (!options) {
        throw new Error('DataSource options is required');
      }
      const dataSource = new DataSource(options);
      return (
        getDataSourceByName('default') || addTransactionalDataSource(dataSource)
      );
    },
  });
};
