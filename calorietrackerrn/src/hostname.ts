// src/hostname.ts

const LOCALHOST_IP = 'http://10.0.2.2'; // Android Emulator localhost
const DEFAULT_PORT = '3000';

let settings = {
  devRunMode: 2, // Mode 2 correspond au serveur de test
  withConsole: true, // Activer ou désactiver les logs console
};

let hostname = '';

switch (settings.devRunMode) {
  case 1:
    hostname = 'https://production.yourdomain.com';
    break;
  case 2:
    hostname = 'https://staging.yourdomain.com';
    break;
  default:
    if (settings.devRunMode >= 100) {
      hostname = `${LOCALHOST_IP}:${DEFAULT_PORT}`;
    } else {
      hostname = 'https://default.yourdomain.com';
    }
    break;
}

export function getHostname(): string {
  return hostname;
}

export function isProduction(): boolean {
  return settings.devRunMode < 100;
}

export default hostname;
