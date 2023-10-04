import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const getWindowDimensions = () => {
  const { width } = Dimensions.get('window');
  if (width <= 320) {  
    return {
      width: 300,
      height: 300,
      marginTop: 10,
    };
  } else if (width <= 768) {  
    return {
      width: 400,
      height: 400,
      marginTop: 15,
    };
  } else {  
    return {
      width: 700,
      height: 700,
      marginTop: 20,
    };
  }
}


export function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Time Managment System 2.0</Text>
        
      </View>
      <View>
        <Image source={require('../assets/HeroTMS.png')} style={styles.image} />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'top',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 10,
  },
  heading: {
    fontSize: 24,
  },
  image: {
    ...getWindowDimensions(),
  },
});
