// Fonction pour calculer l'IMC (Indice de Masse Corporelle)
export function calculateBMI(weight: number, height: number): number {
  if (height > 0) {
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  }
  return 0;
}
