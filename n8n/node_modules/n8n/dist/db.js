"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.connectionState = exports.getConnection = void 0;
exports.transaction = transaction;
exports.init = init;
exports.migrate = migrate;
const di_1 = require("@n8n/di");
const typeorm_1 = require("@n8n/typeorm");
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("./constants");
const config_1 = require("./databases/config");
const migration_helpers_1 = require("./databases/utils/migration-helpers");
let connection;
const getConnection = () => connection;
exports.getConnection = getConnection;
exports.connectionState = {
    connected: false,
    migrated: false,
};
let pingTimer;
if (!constants_1.inTest) {
    const pingDBFn = async () => {
        if (connection?.isInitialized) {
            try {
                await connection.query('SELECT 1');
                exports.connectionState.connected = true;
                return;
            }
            catch (error) {
                di_1.Container.get(n8n_core_1.ErrorReporter).error(error);
            }
            finally {
                pingTimer = setTimeout(pingDBFn, 2000);
            }
        }
        exports.connectionState.connected = false;
    };
    pingTimer = setTimeout(pingDBFn, 2000);
}
async function transaction(fn) {
    return await connection.transaction(fn);
}
async function init() {
    if (exports.connectionState.connected)
        return;
    const connectionOptions = (0, config_1.getConnectionOptions)();
    connection = new typeorm_1.DataSource(connectionOptions);
    di_1.Container.set(typeorm_1.DataSource, connection);
    try {
        await connection.initialize();
    }
    catch (e) {
        let error = (0, n8n_workflow_1.ensureError)(e);
        if ((0, config_1.arePostgresOptions)(connectionOptions) &&
            error.message === 'Connection terminated due to connection timeout') {
            error = new n8n_workflow_1.DbConnectionTimeoutError({
                cause: error,
                configuredTimeoutInMs: connectionOptions.connectTimeoutMS,
            });
        }
        throw error;
    }
    exports.connectionState.connected = true;
}
async function migrate() {
    connection.options.migrations.forEach(migration_helpers_1.wrapMigration);
    await connection.runMigrations({ transaction: 'each' });
    exports.connectionState.migrated = true;
}
const close = async () => {
    if (pingTimer) {
        clearTimeout(pingTimer);
        pingTimer = undefined;
    }
    if (connection.isInitialized)
        await connection.destroy();
};
exports.close = close;
//# sourceMappingURL=db.js.map