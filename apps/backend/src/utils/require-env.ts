export default function requireEnv(name: string) {
  if (!process.env[name]) throw new Error(`${name} is not set`);
  return process.env[name];
}
