export const calculateIMC = (weight, height) => {
  if (height > 0) {
    const heightInMeters = height / 100; // Convertir la taille en mètres
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  }
  return 0;
};
