export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

export function generatePassword(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&*_';
  let password = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    password += characters[index];
  }
  return password;
}
