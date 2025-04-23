import type { DataSourceOptions } from '@n8n/typeorm';
import type { PostgresConnectionOptions } from '@n8n/typeorm/driver/postgres/PostgresConnectionOptions';
export declare const getOptionOverrides: (dbType: "postgresdb" | "mysqldb") => {
    database: string;
    host: string;
    port: number;
    username: string;
    password: string;
};
export declare function getConnectionOptions(): DataSourceOptions;
export declare function arePostgresOptions(options: DataSourceOptions): options is PostgresConnectionOptions;
