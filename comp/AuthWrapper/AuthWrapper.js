import React, { useEffect, useState } from 'react';
import { onAuthStateChangeListener } from '../firbase/auth/auth.listener';
import { RootNavigator } from '../../RootNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';


export function AuthWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChangeListener(user => {
      setIsAuthenticated(!!user);
      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, []);

   if (!initialized || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <RootNavigator initialRouteName={isAuthenticated ? "UserArea" : "Home"} />;

}


const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});