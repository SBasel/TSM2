import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from "../firbase/firebase.settings";
import { signInThisUserWithEmailAndPassword } from '../firbase/auth/auth.emailAndPassword';
import { SignInWithGooglePopup } from '../firbase/auth/auth.googlePopup';
import { useNavigation } from '@react-navigation/native';


export function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');
  const navigation = useNavigation();


  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const handleEmailLogin = async () => {
    if (!email) {
        setErr("The Email field must not be empty.");
        return;
    }
    if (!emailRegex.test(email)) {
        setErr("The email must be a valid email format.");
        return;
    }
    if (!password) {
        setErr("The Password field must not be empty.");
        return;
    }
    try {
        await signInThisUserWithEmailAndPassword(email, password);
        navigation.navigate('UserArea', { screen: 'TSM2.0' });
    } catch (error) {
        console.error("Error logging in with email and password:", error);
    }
};


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login to TSM2.0</Text>
      {err ? <Text style={{color: 'red'}}>{err}</Text> : null}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
        <Text style={styles.buttonText}>Login with Email</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => SignInWithGooglePopup(navigation)}>
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20, // space between heading and inputs
  },
  input: {
    borderWidth: 1,
    width: 250, // increased width
    fontSize: 18, // increased font size
    padding: 10, // added padding for bigger touch area
    marginBottom: 15, // increased space between inputs
  },
  button: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
