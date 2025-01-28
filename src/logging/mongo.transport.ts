import * as Transport from 'winston-transport';
import { MongoClient } from 'mongodb';
import { Logger } from '@nestjs/common';

interface MongoTransportOptions extends Transport.TransportStreamOptions {
  db: string;
  collection: string;
}

export class MongoTransport extends Transport {
  private client: MongoClient;
  private collection: string;
  private readonly logger = new Logger('MongoTransport');
  private isConnected = false;

  constructor(opts: MongoTransportOptions) {
    super(opts);
    this.collection = opts.collection;
    this.client = new MongoClient(opts.db, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    this.connectToMongo().catch(err => {
      this.logger.error('Failed to connect to MongoDB for logging:', err);
    });
  }

  private async connectToMongo() {
    try {
      await this.client.connect();
      this.isConnected = true;
      this.logger.log('Successfully connected to MongoDB for logging');
    } catch (err) {
      this.isConnected = false;
      this.logger.error('Failed to connect to MongoDB for logging:', err);
    }
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (!this.isConnected) {
      this.logger.warn('MongoDB logging connection not available');
      callback();
      return;
    }

    try {
      const db = this.client.db();
      await db.collection(this.collection).insertOne({
        timestamp: new Date(),
        level: info.level,
        message: info.message,
        ...info,
      });
    } catch (err) {
      this.logger.error('Failed to write log to MongoDB:', err);
    }

    callback();
  }
}