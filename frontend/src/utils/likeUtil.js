import { toggleLikeOrUnlike } from "../redux/features/exerciseApi/exerciseApiSlice";

// Fonction générique pour gérer le like
export const handleLikeExercise = (exerciseId, userId, gender, dispatch, setExercises) => {
  const dataToSend = { exerciseId, actionType: "like", userId, gender };

  dispatch(toggleLikeOrUnlike(dataToSend))
    .unwrap()
    .then(() => {
      // Mise à jour locale de l'état des exercices
      setExercises((prevExercises) =>
        prevExercises.map((exercise) =>
          exercise._id === exerciseId
            ? { ...exercise, isLiked: true, isUnliked: false }
            : exercise
        )
      );
    })
    .catch((error) => {
      console.error("Like failed:", error);
    });
};

// Fonction générique pour gérer le unlike
export const handleUnlikeExercise = (exerciseId, userId, gender, dispatch, setExercises) => {
  const dataToSend = { exerciseId, actionType: "unlike", userId, gender };

  dispatch(toggleLikeOrUnlike(dataToSend))
    .unwrap()
    .then(() => {
      // Mise à jour locale de l'état des exercices
      setExercises((prevExercises) =>
        prevExercises.map((exercise) =>
          exercise._id === exerciseId
            ? { ...exercise, isLiked: false, isUnliked: true }
            : exercise
        )
      );
    })
    .catch((error) => {
      console.error("Unlike failed:", error);
    });
};
