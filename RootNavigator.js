import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Home } from './comp/Home';
import { SignUp } from './comp/SignUp/SignUp';
import { Login } from './comp/Login/Login';
import { TSM2_0 } from './comp/User/TSM2_0';
import { NewProject } from './comp/newProject/NewProject';
import { RegistrationSuccess } from './comp/SignUp/RegistrationSuccess';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const Stack = createStackNavigator();

// UserNavigator: Beinhaltet alle Bildschirme für angemeldete Benutzer
function UserNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TSM2.0" component={TSM2_0} />
      <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccess} />
      <Stack.Screen name="NewProject" component={NewProject} />
      {/* Fügen Sie hier weitere Bildschirme hinzu, falls nötig */}
    </Stack.Navigator>
  );
}

// RootNavigator: Der Haupt-Navigator
export function RootNavigator({ initialRouteName = "Home" }) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen 
        name="Home" 
        component={Home}
        options={({ navigation }) => ({
          headerRight: () => (
            <View style={styles.buttonsContainer}>
              <Pressable 
                onPress={() => navigation.navigate('Login')}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: pressed ? '#0056b3' : '#007BFF' }
                ]}
              >
                <Text style={styles.buttonText}>Login</Text>
              </Pressable>
              <Pressable 
                onPress={() => navigation.navigate('SignUp')}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: pressed ? '#227a4f' : '#28a745', marginLeft: 10 }
                ]}
              >
                <Text style={styles.buttonText}>SignUp</Text>
              </Pressable>
            </View>
          ),
        })}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="UserArea" component={UserNavigator} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 10
  },
  heading: {
    fontSize: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: 'white',
  }
});
