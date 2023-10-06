import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { auth } from "../firbase/firebase.settings";
import { useNavigation } from '@react-navigation/native';


export function TSM2_0() {
  const user = auth.currentUser;
  const userEmail = user?.email; // Hier verwenden wir den optionalen Chaining-Operator.
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogout = () => {
    auth.signOut()
    .then(() => {
        console.log('Successfully logged out');
        setModalVisible(false);  
        navigation.navigate('Home');  
    })
    .catch(error => {
        console.error('Error logging out:', error);
    });
  }




  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <Text style={styles.welcomeText}>Willkommen,</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>
      <TouchableOpacity style={styles.menuIcon} onPress={() => setModalVisible(true)}>
        <FontAwesomeIcon icon={faBars} size={24} />
      </TouchableOpacity>
    </View>

    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyProjects')} >
      <Text style={styles.buttonText} >My Projects</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} >
      <Text style={styles.buttonText} onPress={() => navigation.navigate('NewProject')}>New Project</Text>
    </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setModalVisible(false)}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} // hitSlop hinzufügen
            >
            <FontAwesomeIcon icon={faTimes} size={24} />
          </TouchableOpacity>

          <Text style={styles.modalOption}>Konto</Text>
          <Text style={styles.modalOption} >DarkMode</Text>
          <Text style={styles.modalOption} onPress={handleLogout}>Logout</Text>
        </View>
      </Modal>

    </View>
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
    position: 'absolute',
    top: 20, 
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
  },
  leftContainer: {
    flexDirection: 'column',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    marginTop: 5,
  },
  menuIcon: {
    position: 'absolute',
    top: 0, 
    right: 30,
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
  modalContainer: {
  position: 'absolute', 
  top: 85, // positionieren Sie das Modal unter dem Burger-Menü
  right: 15, 
  width: 200, // gewünschte Breite des Modals
  backgroundColor: 'rgba(250, 250, 250, 1)',
  borderRadius: 10, // optional, um die Ecken abzurunden
  padding: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
closeButton: {
  position: 'absolute',
  padding: 10,
  top: 5, 
  right: 5,
  zIndex: 1,
},
modalOption: {
  padding: 15,
  borderBottomColor: 'grey',
  borderBottomWidth: 1,
},
});

