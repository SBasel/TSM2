import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './RootNavigator';
import { AuthWrapper } from './comp/AuthWrapper/AuthWrapper';


export default function Main() {
  return (
    <NavigationContainer>
      <AuthWrapper>
      <RootNavigator />
      </AuthWrapper>
    </NavigationContainer>
  );
}


