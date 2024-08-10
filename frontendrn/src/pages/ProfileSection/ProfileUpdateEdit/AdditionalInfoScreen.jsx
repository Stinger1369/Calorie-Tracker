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

const AdditionalInfoScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {userInfo} = useSelector(state => state.user);
  const {user} = useSelector(state => state.auth);

  const [ethnicity, setEthnicity] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });
  const [livingEnvironment, setLivingEnvironment] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [mentalHealthStatus, setMentalHealthStatus] = useState('');

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
        ethnicity: userInfo.ethnicity || '',
        address: userInfo.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
        },
        livingEnvironment: userInfo.livingEnvironment || '',
        fitnessGoals: userInfo.fitnessGoals || '',
        hobbies: userInfo.hobbies?.join(', ') || '',
        mentalHealthStatus: userInfo.mentalHealthStatus || '',
      };
      setEthnicity(initialData.ethnicity);
      setAddress(initialData.address);
      setLivingEnvironment(initialData.livingEnvironment);
      setFitnessGoals(initialData.fitnessGoals);
      setHobbies(initialData.hobbies);
      setMentalHealthStatus(initialData.mentalHealthStatus);
      setInitialValues(initialData);
      setIsSaved(true);
    }
  }, [userInfo]);

  const hasChanges = () => {
    return (
      ethnicity !== initialValues.ethnicity ||
      JSON.stringify(address) !== JSON.stringify(initialValues.address) ||
      livingEnvironment !== initialValues.livingEnvironment ||
      fitnessGoals !== initialValues.fitnessGoals ||
      hobbies !== initialValues.hobbies ||
      mentalHealthStatus !== initialValues.mentalHealthStatus
    );
  };

  const handleSave = () => {
    const updatedData = {
      ethnicity,
      address,
      livingEnvironment,
      fitnessGoals,
      hobbies: hobbies.split(',').map(item => item.trim()),
      mentalHealthStatus,
    };

    if (userInfo && userInfo._id) {
      dispatch(updateUserInfo({userId: userInfo._id, userData: updatedData}));
      setInitialValues(updatedData);
      setIsSaved(true);

      // Naviguer vers le profil après la sauvegarde
      navigation.navigate('ProfileTab');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Ethnicity:</Text>
        <TextInput
          style={styles.input}
          value={ethnicity}
          onChangeText={value => handleInputChange(value, setEthnicity)}
        />
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          placeholder="Street"
          value={address.street}
          onChangeText={value => handleAddressChange('street', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={address.city}
          onChangeText={value => handleAddressChange('city', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="State"
          value={address.state}
          onChangeText={value => handleAddressChange('state', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Country"
          value={address.country}
          onChangeText={value => handleAddressChange('country', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Postal Code"
          value={address.postalCode}
          onChangeText={value => handleAddressChange('postalCode', value)}
        />
        <Text style={styles.label}>Living Environment:</Text>
        <TextInput
          style={styles.input}
          value={livingEnvironment}
          onChangeText={value => handleInputChange(value, setLivingEnvironment)}
        />
        <Text style={styles.label}>Fitness Goals:</Text>
        <TextInput
          style={styles.input}
          value={fitnessGoals}
          onChangeText={value => handleInputChange(value, setFitnessGoals)}
        />
        <Text style={styles.label}>Hobbies (comma separated):</Text>
        <TextInput
          style={styles.input}
          value={hobbies}
          onChangeText={value => handleInputChange(value, setHobbies)}
        />
        <Text style={styles.label}>Mental Health Status:</Text>
        <TextInput
          style={styles.input}
          value={mentalHealthStatus}
          onChangeText={value =>
            handleInputChange(value, setMentalHealthStatus)
          }
        />
        <Button title="Save" onPress={handleSave} disabled={!hasChanges()} />
        <Button title="Finish" onPress={handleSave} disabled={!isSaved} />
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

export default AdditionalInfoScreen;
