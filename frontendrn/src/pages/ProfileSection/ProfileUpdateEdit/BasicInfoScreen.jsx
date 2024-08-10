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

const BasicInfoScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {userInfo} = useSelector(state => state.user);
  const {user} = useSelector(state => state.auth);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
      setFirstName(userInfo.firstName || '');
      setLastName(userInfo.lastName || '');
      setDateOfBirth(userInfo.dateOfBirth || '');
      setGender(userInfo.gender || '');
      setImageUrl(userInfo.imageUrl || '');
      setIsSaved(true);
      setHasChanges(false);
    }
  }, [userInfo]);

  const handleSave = () => {
    const updatedData = {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      imageUrl,
    };

    if (userInfo && userInfo._id) {
      dispatch(updateUserInfo({userId: userInfo._id, userData: updatedData}));
      setIsSaved(true);
      setHasChanges(false);
    }
  };

  const handleNext = () => {
    navigation.navigate('HealthInfo');
  };

  const handleInputChange = (value, setter) => {
    setter(value);
    setIsSaved(false);
    setHasChanges(true);
  };

  return (
    <ScrollView Style={styles.container}>
      <View style={styles.innerContainer}>
      <Text style={styles.label}>First Name:</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={value => handleInputChange(value, setFirstName)}
      />
      <Text style={styles.label}>Last Name:</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={value => handleInputChange(value, setLastName)}
      />
      <Text style={styles.label}>Date of Birth:</Text>
      <TextInput
        style={styles.input}
        value={dateOfBirth}
        onChangeText={value => handleInputChange(value, setDateOfBirth)}
        placeholder="YYYY-MM-DD"
      />
      <Text style={styles.label}>Gender:</Text>
      <TextInput
        style={styles.input}
        value={gender}
        onChangeText={value => handleInputChange(value, setGender)}
      />
      <Text style={styles.label}>Profile Image URL:</Text>
      <TextInput
        style={styles.input}
        value={imageUrl}
        onChangeText={value => handleInputChange(value, setImageUrl)}
      />
      <Button title="Save" onPress={handleSave} disabled={!hasChanges} />
      <Button title="Next" onPress={handleNext} disabled={!isSaved} />
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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

export default BasicInfoScreen;
