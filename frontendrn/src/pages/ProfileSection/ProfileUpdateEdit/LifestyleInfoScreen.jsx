import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateUserInfo,
  fetchUserInfo,
} from '../../../redux/features/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LifestyleInfoScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {userInfo} = useSelector(state => state.user);
  const {user} = useSelector(state => state.auth);

  const [maritalStatus, setMaritalStatus] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState('');
  const [occupation, setOccupation] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [dailyCalorieIntake, setDailyCalorieIntake] = useState('');
  const [dailyExercise, setDailyExercise] = useState('');

  const [initialValues, setInitialValues] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      let userId = user?._id;

      if (!userId) {
        const storedUser = await AsyncStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        userId = parsedUser?._id;
      }

      if (userId) {
        dispatch(fetchUserInfo(userId));
      }
    };

    loadUserData();
  }, [dispatch, user]);

  useEffect(() => {
    if (userInfo) {
      const initialData = {
        maritalStatus: userInfo.maritalStatus || '',
        numberOfChildren: userInfo.numberOfChildren?.toString() || '',
        occupation: userInfo.occupation || '',
        activityLevel: userInfo.activityLevel || '',
        dietaryPreferences: userInfo.dietaryPreferences || '',
        dailyCalorieIntake: userInfo.dailyCalorieIntake?.toString() || '',
        dailyExercise: userInfo.dailyExercise || '',
      };
      setMaritalStatus(initialData.maritalStatus);
      setNumberOfChildren(initialData.numberOfChildren);
      setOccupation(initialData.occupation);
      setActivityLevel(initialData.activityLevel);
      setDietaryPreferences(initialData.dietaryPreferences);
      setDailyCalorieIntake(initialData.dailyCalorieIntake);
      setDailyExercise(initialData.dailyExercise);
      setInitialValues(initialData);
      setIsSaved(true);
    }
  }, [userInfo]);

  const hasChanges = () => {
    return (
      maritalStatus !== initialValues.maritalStatus ||
      numberOfChildren !== initialValues.numberOfChildren ||
      occupation !== initialValues.occupation ||
      activityLevel !== initialValues.activityLevel ||
      dietaryPreferences !== initialValues.dietaryPreferences ||
      dailyCalorieIntake !== initialValues.dailyCalorieIntake ||
      dailyExercise !== initialValues.dailyExercise
    );
  };

  const handleSave = () => {
    const updatedData = {
      maritalStatus,
      numberOfChildren: Number(numberOfChildren),
      occupation,
      activityLevel,
      dietaryPreferences,
      dailyCalorieIntake: Number(dailyCalorieIntake),
      dailyExercise,
    };

    if (userInfo && userInfo._id) {
      dispatch(updateUserInfo({userId: userInfo._id, userData: updatedData}));
      setInitialValues(updatedData);
      setIsSaved(true);
    }
  };

  const handleNext = () => {
    navigation.navigate('HabitsPreferences');
  };

  const handleInputChange = (value, setter) => {
    setter(value);
    setIsSaved(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Marital Status:</Text>
        <TextInput
          style={styles.input}
          value={maritalStatus}
          onChangeText={value => handleInputChange(value, setMaritalStatus)}
        />
        <Text style={styles.label}>Number of Children:</Text>
        <TextInput
          style={styles.input}
          value={numberOfChildren}
          onChangeText={value => handleInputChange(value, setNumberOfChildren)}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Occupation:</Text>
        <TextInput
          style={styles.input}
          value={occupation}
          onChangeText={value => handleInputChange(value, setOccupation)}
        />
        <Text style={styles.label}>Activity Level:</Text>
        <TextInput
          style={styles.input}
          value={activityLevel}
          onChangeText={value => handleInputChange(value, setActivityLevel)}
        />
        <Text style={styles.label}>Dietary Preferences:</Text>
        <TextInput
          style={styles.input}
          value={dietaryPreferences}
          onChangeText={value =>
            handleInputChange(value, setDietaryPreferences)
          }
        />
        <Text style={styles.label}>Daily Calorie Intake:</Text>
        <TextInput
          style={styles.input}
          value={dailyCalorieIntake}
          onChangeText={value =>
            handleInputChange(value, setDailyCalorieIntake)
          }
          keyboardType="numeric"
        />
        <Text style={styles.label}>Daily Exercise:</Text>
        <TextInput
          style={styles.input}
          value={dailyExercise}
          onChangeText={value => handleInputChange(value, setDailyExercise)}
        />
        <Button title="Save" onPress={handleSave} disabled={!hasChanges()} />
        <Button title="Next" onPress={handleNext} disabled={!isSaved} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
  },
});

export default LifestyleInfoScreen;
