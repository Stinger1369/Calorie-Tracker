import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLikeOrUnlike } from '../../redux/features/exerciseApi/exerciseApiSlice';

const useLikeUnlike = () => {
  const dispatch = useDispatch();
  const { gender, _id: reduxUserId } = useSelector((state) => state.user.userInfo);
  const [userId, setUserId] = useState(reduxUserId || null);

  const likeExercise = (exerciseId) => {
    if (userId) {
      console.log(`User ${userId} is liking exercise: ${exerciseId}`);
      return dispatch(toggleLikeOrUnlike({
        exerciseId,
        actionType: 'like',
        userId,
        gender
      })).unwrap()
        .then(response => {
          console.log("Like response: ", response);
          return response;
        })
        .catch(error => {
          console.error("Like error: ", error);
        });
    } else {
      console.warn("No userId found for liking exercise");
    }
  };

  const unlikeExercise = (exerciseId) => {
    if (userId) {
      console.log(`User ${userId} is unliking exercise: ${exerciseId}`);
      return dispatch(toggleLikeOrUnlike({
        exerciseId,
        actionType: 'unlike',
        userId,
        gender
      })).unwrap()
        .then(response => {
          console.log("Unlike response: ", response);
          return response;
        })
        .catch(error => {
          console.error("Unlike error: ", error);
        });
    } else {
      console.warn("No userId found for unliking exercise");
    }
  };

  return { likeExercise, unlikeExercise };
};

export default useLikeUnlike;
