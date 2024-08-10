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

const HealthInfoScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {userInfo} = useSelector(state => state.user);
  const {user} = useSelector(state => state.auth);

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [bloodTestResults, setBloodTestResults] = useState([]);

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
      setWeight(userInfo.weight?.toString() || '');
      setHeight(userInfo.height?.toString() || '');
      setMedicalConditions(userInfo.medicalConditions || []);
      setBloodTestResults(userInfo.bloodTestResults || []);
    }
  }, [userInfo]);

  const handleNext = () => {
    const updatedData = {
      weight: parseFloat(weight),
      height: parseFloat(height),
      medicalConditions,
      bloodTestResults,
    };

    if (userInfo && userInfo._id) {
      dispatch(updateUserInfo({userId: userInfo._id, userData: updatedData}));
    }

    navigation.navigate('LifestyleInfo');
  };

  const handleAddMedicalCondition = () => {
    setMedicalConditions([...medicalConditions, '']);
  };

  const handleMedicalConditionChange = (text, index) => {
    const updatedConditions = medicalConditions.map((condition, i) =>
      i === index ? text : condition,
    );
    setMedicalConditions(updatedConditions);
  };

  const handleAddBloodTestResult = () => {
    setBloodTestResults([
      ...bloodTestResults,
      {
        cholesterol: '',
        bloodSugar: '',
        hemoglobin: '',
        date: '',
      },
    ]);
  };

  const handleBloodTestResultChange = (field, value, index) => {
    const updatedResults = bloodTestResults.map((result, i) =>
      i === index ? {...result, [field]: value} : result,
    );
    setBloodTestResults(updatedResults);
  };

  return (
    <ScrollView Style={styles.container}>
      <View style={styles.innerContainer}>
      <Text style={styles.label}>Weight (kg):</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Height (cm):</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Medical Conditions:</Text>
      {medicalConditions.map((condition, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={condition}
          onChangeText={text => handleMedicalConditionChange(text, index)}
          placeholder={`Condition ${index + 1}`}
        />
      ))}
      <Button
        title="Add Medical Condition"
        onPress={handleAddMedicalCondition}
      />

      <Text style={styles.label}>Blood Test Results:</Text>
      {bloodTestResults.map((result, index) => (
        <View key={index} style={styles.bloodTestContainer}>
          <TextInput
            style={styles.input}
            value={result.cholesterol}
            onChangeText={text =>
              handleBloodTestResultChange('cholesterol', text, index)
            }
            placeholder="Cholesterol"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={result.bloodSugar}
            onChangeText={text =>
              handleBloodTestResultChange('bloodSugar', text, index)
            }
            placeholder="Blood Sugar"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={result.hemoglobin}
            onChangeText={text =>
              handleBloodTestResultChange('hemoglobin', text, index)
            }
            placeholder="Hemoglobin"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={result.date}
            onChangeText={text =>
              handleBloodTestResultChange('date', text, index)
            }
            placeholder="Test Date (YYYY-MM-DD)"
          />
        </View>
      ))}
      <Button
        title="Add Blood Test Result"
        onPress={handleAddBloodTestResult}
      />

      <Button title="Next" onPress={handleNext} />
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
  bloodTestContainer: {
    marginBottom: 20,
  },
});

export default HealthInfoScreen;
