import express from 'express';
import { BinaryDataService } from 'n8n-core';
import { BinaryDataRequest } from '../requests';
export declare class BinaryDataController {
    private readonly binaryDataService;
    constructor(binaryDataService: BinaryDataService);
    get(req: BinaryDataRequest, res: express.Response): Promise<import("stream").Readable | express.Response<any, Record<string, any>>>;
}
