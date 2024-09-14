export const getExercisesForSession = (month, session) => {
  if (month === 1) {
    if (session === 1) {
      return [
        { title: "Corde à sauter", muscleGroup: "cardio" }, // Échauffement 1
        { title: "Vélo", muscleGroup: "cardio" }, // Échauffement 2
        { title: "Développé militaire", muscleGroup: "épaules" }, // Exercice principal 1
        { title: "Curl haltères", muscleGroup: "biceps" }, // Exercice principal 2
        { title: "Dips sur banc", muscleGroup: "triceps" }, // Exercice principal 3
        { title: "Développé couché avec haltères", muscleGroup: "pectoraux" }, // Exercice principal 4
        { title: "Padmasana posture du lotus", muscleGroup: "Postures-de-yoga" },
        { title: "Virabhadrasana II Posture du guerrier 2", muscleGroup: "Postures-de-yoga" }
       ];
    } else if (session === 2) {
      return [
        { title: "Stepper", muscleGroup: "cardio" }, // Échauffement 1
        { title: "Vélo elliptique", muscleGroup: "cardio" }, // Échauffement 2
        { title: "Squats", muscleGroup: "quadriceps" }, // Exercice principal 1
        { title: "Fentes avant", muscleGroup: "fessiers" }, // Exercice principal 2
        { title: "Leg curl allongé", muscleGroup: "ischio-jambiers" }, // Exercice principal 3
        { title: "Extension des mollets à la barre debout", muscleGroup: "mollets" }, // Exercice principal 4
        { title: "Balasana posture de l’enfant", muscleGroup: "Postures-de-yoga" }, // Yoga 1
        { title: "Baddha konasana posture du papillon", muscleGroup: "Postures-de-yoga" } // Yoga 2
      ];
    } else if (session === 3) {
      return [
        { title: "Tapis de course", muscleGroup: "cardio" }, // Échauffement 1
        { title: "Jumping jack", muscleGroup: "cardio" }, // Échauffement 2
        { title: "Crunch avec jambes verticales", muscleGroup: "abdominaux" }, // Exercice principal 1
        { title: "Russian twist avec développé épaules", muscleGroup: "épaules" }, // Exercice principal 2
        { title: "Tirage horizontal à la poulie", muscleGroup: "dos" }, // Exercice principal 3
        { title: "Rowing barre", muscleGroup: "dos" }, // Exercice principal 4
        { title: "Bhujangasana posture du cobra", muscleGroup: "Postures-de-yoga" }, // Yoga 1
        { title: "Marjaryasana posture du chat et de la vache", muscleGroup: "Postures-de-yoga" } // Yoga 2
      ];
    }
  }

    if (month === 2) {
  if (session === 1) {
    return [
      { title: "Rameur", muscleGroup: "cardio" }, // Échauffement 1
      { title: "Tapis de course", muscleGroup: "cardio" }, // Échauffement 2
      { title: "Développé Arnold", muscleGroup: "épaules" }, // Exercice principal 1
      { title: "Curl haltère incliné avec rotation", muscleGroup: "biceps" }, // Exercice principal 2
      { title: "Extensions verticales d’un bras avec haltère", muscleGroup: "triceps" }, // Exercice principal 3
      { title: "Développé incliné avec haltères", muscleGroup: "pectoraux" }, // Exercice principal 4
      { title: "Vrksasana posture de l’arbre", muscleGroup: "Postures-de-yoga" },
      { title: "Natarajasana posture du danseur", muscleGroup: "Postures-de-yoga" }
    ];
  } else if (session === 2) {
    return [
      { title: "Vélo spinning", muscleGroup: "cardio" }, // Échauffement 1
      { title: "Tapis de course", muscleGroup: "cardio" }, // Échauffement 2
      { title: "Leg extension", muscleGroup: "quadriceps" }, // Exercice principal 1
      { title: "Hip thrust à la machine", muscleGroup: "fessiers" }, // Exercice principal 2
      { title: "Soulevé de terre jambes tendues", muscleGroup: "ischio-jambiers" }, // Exercice principal 3
      { title: "Élévations des mollets au Donkey", muscleGroup: "mollets" }, // Exercice principal 4
      { title: "Supta Matsyendrasana posture de la rotation de la colonne vertébrale couchée", muscleGroup: "Postures-de-yoga" }, // Yoga 1
      { title: "Ustrasana posture du chameau", muscleGroup: "Postures-de-yoga" } // Yoga 2
    ];
  } else if (session === 3) {
    return [
      { title: "Elliptique", muscleGroup: "cardio" }, // Échauffement 1
      { title: "Jumping jack", muscleGroup: "cardio" }, // Échauffement 2
      { title: "Planche", muscleGroup: "abdominaux" }, // Exercice principal 1
      { title: "Rotations russes", muscleGroup: "abdominaux" }, // Exercice principal 2
      { title: "Tirage vertical prise inversée", muscleGroup: "dos" }, // Exercice principal 3
      { title: "Bent over row prise disque", muscleGroup: "dos" }, // Exercice principal 4
      { title: "Pavanamuktasana posture de libération des vents", muscleGroup: "Postures-de-yoga" }, // Yoga 1
      { title: "Pincha Mayurasana posture de la plume de paon", muscleGroup: "Postures-de-yoga" } // Yoga 2
    ];
  }
}
if (month === 3) {
  if (session === 1) {
    return [
      { title: "Vélo elliptique", muscleGroup: "cardio" }, // Échauffement 1
      { title: "Corde à sauter", muscleGroup: "cardio" }, // Échauffement 2
      { title: "Élévations latérales", muscleGroup: "épaules" }, // Exercice principal 1
      { title: "Curl haltère prise marteau au pupitre", muscleGroup: "biceps" }, // Exercice principal 2
      { title: "Dips assis à la machine Matrix", muscleGroup: "triceps" }, // Exercice principal 3
      { title: "Écartés décliné avec haltères", muscleGroup: "pectoraux" }, // Exercice principal 4
      { title: "Adho Mukha Svanasana posture du chien tête en bas", muscleGroup: "Postures-de-yoga" },
      { title: "Matsyasana posture du poisson", muscleGroup: "Postures-de-yoga" }
    ];
  } else if (session === 2) {
    return [
      { title: "Skater hops", muscleGroup: "cardio" }, // Échauffement 1
      { title: "Rameur", muscleGroup: "cardio" }, // Échauffement 2
      { title: "Fentes croisées", muscleGroup: "fessiers" }, // Exercice principal 1
      { title: "Squat sauté", muscleGroup: "quadriceps" }, // Exercice principal 2
      { title: "Kettlebell swing", muscleGroup: "ischio-jambiers" }, // Exercice principal 3
      { title: "Extensions des mollets debout à la machine", muscleGroup: "mollets" }, // Exercice principal 4
      { title: "Viparita virabhadrasana posture du guerrier inversé", muscleGroup: "Postures-de-yoga" }, // Yoga 1
      { title: "Parivrtta Utkatasana posture de la chaise retournée", muscleGroup: "Postures-de-yoga" } // Yoga 2
    ];
  } else if (session === 3) {
    return [
      { title: "Machine à escaliers", muscleGroup: "cardio" }, // Échauffement 1
      { title: "Wall ball squat", muscleGroup: "cardio" }, // Échauffement 2
      { title: "Dragon flag", muscleGroup: "abdominaux" }, // Exercice principal 1
      { title: "Planche latérale avec rotation", muscleGroup: "abdominaux" }, // Exercice principal 2
      { title: "Rowing à la barre en T avec machine", muscleGroup: "dos" }, // Exercice principal 3
      { title: "Rowing en pronation assis à la machine Technogym", muscleGroup: "dos" }, // Exercice principal 4
      { title: "Halasana posture de la charrue", muscleGroup: "Postures-de-yoga" }, // Yoga 1
      { title: "Ardha Matsyendrasana posture de la torsion assise", muscleGroup: "Postures-de-yoga" } // Yoga 2
    ];
  }
}

    return [];
  };