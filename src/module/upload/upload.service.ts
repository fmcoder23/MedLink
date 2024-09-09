import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { config } from '@config';

@Injectable()
export class UploadService {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    this.client = new S3Client({
      endpoint: config.r2.endpoint,
      region: 'auto',
      credentials: {
        accessKeyId: config.r2.accessKey,
        secretAccessKey: config.r2.secretKey,
      },
    });
    this.bucket = config.r2.bucket;
    this.publicUrl = config.r2.publicUrl; // Load the public URL from env
  }

  async createMultiple(files: Express.Multer.File[]): Promise<{ url: string }[]> {
    const uploadPromises = files.map(async (file) => {
      const name = `${randomUUID()}${extname(file.originalname)}`;

      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: name,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      // Construct the full public URL using the base URL from env and the file name
      const url = `${this.publicUrl}/${name}`;

      return { url };
    });

    return Promise.all(uploadPromises);
  }
}
