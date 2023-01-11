/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { NavigationContainer, StackActions } from '@react-navigation/native';
import React from 'react';


import { createNativeStackNavigator } from './node_modules/@react-navigation/native-stack';

import LoginScreen from "./src/enterScreens/LoginScreen"
import RegisterScreen from "./src/enterScreens/RegisterScreen"

import AddEntryScreen from "./src/functionalScreens/AddEntryScreen"
import EntryScreen from "./src/functionalScreens/EntryScreen"
import MessageBoxScreen from "./src/functionalScreens/MessageBoxScreen"
import MessageScreen from "./src/functionalScreens/MessageScreen"

import ProfileScreen from "./src/profileScreen/ProfileScreen"

import HomeScreen from "./src/mainScreens/TabBar"
import TabBar from './src/mainScreens/TabBar';


import { NetInfoStateType, useNetInfo } from '@react-native-community/netinfo';


//No connection screen imports
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MComIcons from "react-native-vector-icons/MaterialCommunityIcons"



const Stack = createNativeStackNavigator();

const App = () => {

  const netInfo = useNetInfo();
  if (netInfo.isConnected) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>

          {/* Enter Screens */}
          <Stack.Screen name="loginScreen" component={LoginScreen} />
          <Stack.Screen name="registerScreen" component={RegisterScreen} />

          {/* Functional Screens */}
          <Stack.Screen name="addEntryScreen" component={AddEntryScreen} />
          <Stack.Screen name="entryScreen" component={EntryScreen} />
          <Stack.Screen name="messageBoxScreen" component={MessageBoxScreen} />
          <Stack.Screen name="messageScreen" component={MessageScreen} />

          {/* Profile Screens */}
          <Stack.Screen name="profileScreen" component={ProfileScreen} />

          {/* Main Screen */}
          {/* Home screenin Bir bottom navigation barı olmalı bu sayede categorilere bakılabilir */}
          <Stack.Screen name="tabBarScreen" component={TabBar} />

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
        <View style={{ alignItems: "center" }}>
          <MComIcons color={"#1FAEFF"} size={90} name='connection'></MComIcons>
          <View style={{ padding: 20 }}>
            <Text style={{ color: "#1FAEFF", fontWeight: "bold", fontSize: 25, textAlign: "center" }}>İnternet bağlantısı bulunamadı.</Text>
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: "black", fontWeight: "", fontSize: 15, textAlign: "center" }}>Wifi bağlantısını ya da mobil veriyi açmayı deneyin ve uygulamayı tekrardan başlatın.</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
    


  }

};
export default App;
