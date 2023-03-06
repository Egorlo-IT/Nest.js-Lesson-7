import * as bcrypt from 'bcrypt';

// хэширование строки
export function hash(text: string | Buffer): Promise<string> {
  return new Promise((resolve) => {
    bcrypt.hash(text, 10, (_err, hash) => {
      resolve(hash);
    });
  });
}
// метод сравнения захэшированной строки с незахэшированной
export function compare(text: string | Buffer, hash: string): Promise<boolean> {
  return new Promise((resolve) => {
    bcrypt.compare(text, hash, (_err, result) => {
      resolve(result);
    });
  });
}
