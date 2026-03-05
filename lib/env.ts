export function getEnv(key: string, required = true): string | undefined {
  const val = process.env[key];
  if ((val === undefined || val === "") && required) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return val;
}

export function getEnvNumber(key: string, required = true): number | undefined {
  const v = getEnv(key, required);
  if (v === undefined) return undefined;
  const n = Number(v);
  if (Number.isNaN(n) && required) {
    throw new Error(`Environment variable ${key} is not a number: ${v}`);
  }
  return n;
}
