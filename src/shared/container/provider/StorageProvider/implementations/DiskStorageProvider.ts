import upload from '@config/upload';
import fs from 'fs';
import path from 'path';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(filename: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(upload.tmpFolder, filename),
      path.resolve(upload.uploadFolder, filename),
    );
    return filename;
  }

  public async deleteFile(filename: string): Promise<void> {
    const fullFileName = path.resolve(upload.uploadFolder, filename);
    try {
      await fs.promises.stat(fullFileName);
    } catch {
      return;
    }
    fs.promises.unlink(fullFileName);
  }
}

export default DiskStorageProvider;
