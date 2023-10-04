import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export function RegistrationSuccess({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Registrierung erfolgreich!</Text>
      <Button
        title="Zum Login"
        onPress={() => navigation.navigate('Login')}
      />
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
    marginBottom: 20,
  },
});
