export declare const dbType: "sqlite" | "mariadb" | "mysqldb" | "postgresdb";
export declare const jsonColumnType: string;
export declare const datetimeColumnType: string;
declare class BaseEntity {
}
export declare const WithStringId: {
    new (...args: any[]): {
        id: string;
        generateId(): void;
    };
} & typeof BaseEntity;
export declare const WithTimestamps: {
    new (...args: any[]): {
        createdAt: Date;
        updatedAt: Date;
        setUpdateDate(): void;
    };
} & typeof BaseEntity;
export declare const WithTimestampsAndStringId: {
    new (...args: any[]): {
        id: string;
        generateId(): void;
    };
} & {
    new (...args: any[]): {
        createdAt: Date;
        updatedAt: Date;
        setUpdateDate(): void;
    };
} & typeof BaseEntity;
export {};
