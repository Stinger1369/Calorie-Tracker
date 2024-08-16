export function calculateCaloricNeeds(
  sex: 'male' | 'female' | 'other',
  weight: number,
  height: number,
  age: number,
): number {
  let caloricNeeds = 0;

  // Conversion de la taille en mètres pour la formule
  const heightInMeters = height / 100;

  if (sex === 'male') {
    caloricNeeds =
      13.707 * weight + 492.3 * heightInMeters - 6.673 * age + 77.607;
  } else if (sex === 'female') {
    caloricNeeds =
      9.74 * weight + 172.9 * heightInMeters - 4.737 * age + 667.051;
  } else if (sex === 'other') {
    // Pour "other", on fait une moyenne des formules homme/femme
    const maleCalories =
      13.707 * weight + 492.3 * heightInMeters - 6.673 * age + 77.607;
    const femaleCalories =
      9.74 * weight + 172.9 * heightInMeters - 4.737 * age + 667.051;
    caloricNeeds = (maleCalories + femaleCalories) / 2;
  }

  return parseFloat(caloricNeeds.toFixed(2)); // Arrondir à deux décimales
}
