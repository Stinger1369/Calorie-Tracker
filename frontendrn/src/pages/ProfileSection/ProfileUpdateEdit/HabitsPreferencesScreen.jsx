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

const HabitsPreferencesScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {userInfo} = useSelector(state => state.user);
  const {user} = useSelector(state => state.auth);

  const [smokingHabits, setSmokingHabits] = useState('');
  const [alcoholConsumption, setAlcoholConsumption] = useState('');
  const [stressLevel, setStressLevel] = useState('');
  const [sleepDuration, setSleepDuration] = useState('');
  const [waterIntake, setWaterIntake] = useState('');
  const [dailyStepCount, setDailyStepCount] = useState('');
  const [dailyActiveMinutes, setDailyActiveMinutes] = useState('');
  const [foodAllergies, setFoodAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [supplements, setSupplements] = useState('');

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
        smokingHabits: userInfo.smokingHabits || '',
        alcoholConsumption: userInfo.alcoholConsumption || '',
        stressLevel: userInfo.stressLevel || '',
        sleepDuration: userInfo.sleepDuration?.toString() || '',
        waterIntake: userInfo.waterIntake?.toString() || '',
        dailyStepCount: userInfo.dailyStepCount?.toString() || '',
        dailyActiveMinutes: userInfo.dailyActiveMinutes?.toString() || '',
        foodAllergies: userInfo.foodAllergies?.join(', ') || '',
        medications: userInfo.medications?.join(', ') || '',
        supplements: userInfo.supplements?.join(', ') || '',
      };
      setSmokingHabits(initialData.smokingHabits);
      setAlcoholConsumption(initialData.alcoholConsumption);
      setStressLevel(initialData.stressLevel);
      setSleepDuration(initialData.sleepDuration);
      setWaterIntake(initialData.waterIntake);
      setDailyStepCount(initialData.dailyStepCount);
      setDailyActiveMinutes(initialData.dailyActiveMinutes);
      setFoodAllergies(initialData.foodAllergies);
      setMedications(initialData.medications);
      setSupplements(initialData.supplements);
      setInitialValues(initialData);
      setIsSaved(true);
    }
  }, [userInfo]);

  const hasChanges = () => {
    return (
      smokingHabits !== initialValues.smokingHabits ||
      alcoholConsumption !== initialValues.alcoholConsumption ||
      stressLevel !== initialValues.stressLevel ||
      sleepDuration !== initialValues.sleepDuration ||
      waterIntake !== initialValues.waterIntake ||
      dailyStepCount !== initialValues.dailyStepCount ||
      dailyActiveMinutes !== initialValues.dailyActiveMinutes ||
      foodAllergies !== initialValues.foodAllergies ||
      medications !== initialValues.medications ||
      supplements !== initialValues.supplements
    );
  };

  const handleSave = () => {
    const updatedData = {
      smokingHabits,
      alcoholConsumption,
      stressLevel,
      sleepDuration: Number(sleepDuration),
      waterIntake: Number(waterIntake),
      dailyStepCount: Number(dailyStepCount),
      dailyActiveMinutes: Number(dailyActiveMinutes),
      foodAllergies: foodAllergies.split(',').map(item => item.trim()),
      medications: medications.split(',').map(item => item.trim()),
      supplements: supplements.split(',').map(item => item.trim()),
    };

    if (userInfo && userInfo._id) {
      dispatch(updateUserInfo({userId: userInfo._id, userData: updatedData}));
      setInitialValues(updatedData);
      setIsSaved(true);
    }
  };

  const handleNext = () => {
    navigation.navigate('AdditionalInfo');
  };

  const handleInputChange = (value, setter) => {
    setter(value);
    setIsSaved(false);
  };

  return (
    <ScrollView Style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Smoking Habits:</Text>
        <TextInput
          style={styles.input}
          value={smokingHabits}
          onChangeText={value => handleInputChange(value, setSmokingHabits)}
        />
        <Text style={styles.label}>Alcohol Consumption:</Text>
        <TextInput
          style={styles.input}
          value={alcoholConsumption}
          onChangeText={value =>
            handleInputChange(value, setAlcoholConsumption)
          }
        />
        <Text style={styles.label}>Stress Level:</Text>
        <TextInput
          style={styles.input}
          value={stressLevel}
          onChangeText={value => handleInputChange(value, setStressLevel)}
        />
        <Text style={styles.label}>Sleep Duration (hours):</Text>
        <TextInput
          style={styles.input}
          value={sleepDuration}
          onChangeText={value => handleInputChange(value, setSleepDuration)}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Water Intake (liters):</Text>
        <TextInput
          style={styles.input}
          value={waterIntake}
          onChangeText={value => handleInputChange(value, setWaterIntake)}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Daily Step Count:</Text>
        <TextInput
          style={styles.input}
          value={dailyStepCount}
          onChangeText={value => handleInputChange(value, setDailyStepCount)}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Daily Active Minutes:</Text>
        <TextInput
          style={styles.input}
          value={dailyActiveMinutes}
          onChangeText={value =>
            handleInputChange(value, setDailyActiveMinutes)
          }
          keyboardType="numeric"
        />
        <Text style={styles.label}>Food Allergies (comma separated):</Text>
        <TextInput
          style={styles.input}
          value={foodAllergies}
          onChangeText={value => handleInputChange(value, setFoodAllergies)}
        />
        <Text style={styles.label}>Medications (comma separated):</Text>
        <TextInput
          style={styles.input}
          value={medications}
          onChangeText={value => handleInputChange(value, setMedications)}
        />
        <Text style={styles.label}>Supplements (comma separated):</Text>
        <TextInput
          style={styles.input}
          value={supplements}
          onChangeText={value => handleInputChange(value, setSupplements)}
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
    justifyContent: 'center',
    padding: 20,
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

export default HabitsPreferencesScreen;
