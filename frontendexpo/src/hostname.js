// Configuration explicite des variables, sans dépendre d'un fichier .env
const LOCALHOST_IP = 'http://10.0.2.2'; // Adresse localhost pour l'émulateur Android
const DEFAULT_PORT = '3000'; // Port par défaut

let settings = {
  devRunMode: 100, // Modifiez en 100 pour développement local
  withConsole: true, // Activer ou désactiver les logs de la console
};

let hostname = '';

switch (settings.devRunMode) {
  case 1: // Production
    hostname = 'https://production.yourdomain.com';
    break;
  case 2: // Staging
    hostname = 'https://staging.yourdomain.com';
    break;
  default: // Développement local
    if (settings.devRunMode >= 100) {
      hostname = `${LOCALHOST_IP}:${DEFAULT_PORT}`;
    } else {
      hostname = 'https://default.yourdomain.com';
    }
    break;
}

export function getHostname() {
  return hostname;
}

export function isProduction() {
  return settings.devRunMode < 100;
}

export default hostname;
