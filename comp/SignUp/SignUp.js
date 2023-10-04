import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { createNewUserWithEmailAndPassword } from '../firbase/auth/auth.emailAndPassword';
import { SignInWithGooglePopup } from '../firbase/auth/auth.googlePopup';

export function SignUp({ navigation }) {
  const [formValue, setFormValue] = React.useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [err, setErr] = React.useState('');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailSignUp = async () => {
    switch (true) {
      case !formValue.email:
        setErr("The Email field must not be empty.");
        return;
      case !emailRegex.test(formValue.email):
        setErr("The email must be a valid email format.");
        return;
      case !formValue.password:
        setErr("The Password field must not be empty.");
        return;
      case !formValue.confirmPassword:
        setErr("The Confirm Password field must not be empty.");
        return;
      case formValue.password.length < 8:
        setErr("The password must be at least 8 characters.");
        return;
      case formValue.password !== formValue.confirmPassword:
        setErr("The passwords do not match.");
        return;
    }

    try {
      await createNewUserWithEmailAndPassword(formValue.email, formValue.password);
      navigation.navigate('RegistrationSuccess');
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setErr("This email already exists");
          break;
        case "auth/invalid-email":
          setErr("The email is invalid");
          break;
        case "auth/operation-not-allowed":
          setErr("An error has occurred here. Please contact support. [Operation not allowed]");
          break;
        case "auth/weak-password":
          setErr("The password is too weak");
          break;
        default:
          setErr(error.code);
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up for TSM2.0</Text>
      {err ? <Text style={{color: 'red'}}>{err}</Text> : null}
      <TextInput
        placeholder="Email"
        value={formValue.email}
        onChangeText={(text) => setFormValue(prev => ({ ...prev, email: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={formValue.password}
        onChangeText={(text) => setFormValue(prev => ({ ...prev, password: text }))}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        value={formValue.confirmPassword}
        onChangeText={(text) => setFormValue(prev => ({ ...prev, confirmPassword: text }))}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleEmailSignUp}>
        <Text style={styles.buttonText}>Sign Up with Email</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={SignInWithGooglePopup}>
        <Text style={styles.buttonText}>Sign Up with Google</Text>
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





