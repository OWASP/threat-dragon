import crypto from 'crypto';

import { Env, getEnv } from '../env/Env';
import { Logger } from './Logger';

export class EncryptedData {
    iv: string;
    keyId: string;
    cipherText: string;
}

export class EncryptionService {
    private readonly env: Env;
    private readonly logger: Logger;

    private readonly inputEncoding: BufferEncoding = 'ascii';
    private readonly outputEncoding: BufferEncoding = 'base64';
    private readonly keyEncoding: BufferEncoding = 'ascii';
    private readonly algorithm: string = 'aes256';

    constructor() {
        this.env = getEnv();
        this.logger = new Logger('service/EncryptionService.ts');
    }

    decrypt(encrypted: EncryptedData): string {
        const iv = Buffer.from(encrypted.iv, this.keyEncoding);
        const key = this.getKeyById(encrypted.keyId);
        const decryptor = crypto.createDecipheriv(this.algorithm, key.value, iv);
        const plaintext = decryptor.update(encrypted.cipherText, this.outputEncoding, this.inputEncoding);
        return `${plaintext}${decryptor.final(this.inputEncoding)}`;
    }

    encrypt(plaintext: string): { keyId: string, iv: string, data: string } {
        const key = this.getPrimaryKey();
        const iv = crypto.randomBytes(16);
        const encryptor = crypto.createCipheriv(this.algorithm, key.value, iv);
        let cipherText = encryptor.update(plaintext, this.inputEncoding, this.outputEncoding);
        cipherText += encryptor.final(this.outputEncoding);

        return {
            keyId: key.id,
            iv: iv.toString(this.keyEncoding),
            data: cipherText
        };
    }

    private getKeys(): { id: string, value: string, isPrimary: boolean }[] {
        return JSON.parse(this.env.config.ENCRYPTION_KEYS);
    }

    private getKeyById(id: string): { id: string, value: Buffer } {
        const key = this.getKeys().find((k) => k.id === id);

        if (!key) {
            const message = `Missing encryption key id: ${id}`;
            this.logger.error(message);
            throw new Error(message);
        }

        return {
            id: key.id,
            value: Buffer.from(key.value, this.keyEncoding)
        };
    }

    private getPrimaryKey(): { id: string, value: Buffer } {
        const primaryKey = this.getKeys().find((key) => key.isPrimary);

        if (!primaryKey) {
            const message = 'missing primary encryption key';
            this.logger.error(message);
            throw new Error(message);
        }
        
        return {
            id: primaryKey.id,
            value: Buffer.from(primaryKey.value, this.keyEncoding)
        };
    }
}
