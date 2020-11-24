import IStorageProvider from '../models/IStorageProvider';

class FakeDiskStorageProvider implements IStorageProvider {
  private files: string[] = [];

  public async saveFile(filename: string): Promise<string> {
    this.files.push(filename);
    return filename;
  }

  public async deleteFile(filename: string): Promise<void> {
    const fileIndex = this.files.findIndex(file => file === filename);

    if (fileIndex) {
      this.files.splice(fileIndex, 1);
    }
  }
}

export default FakeDiskStorageProvider;
