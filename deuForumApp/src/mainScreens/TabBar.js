import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './HomeScreen';
import CategoryScreen from './CategoryScreen';

const Tab = createBottomTabNavigator();



export default class TabBar extends Component {
    render() {
        return (
            <Tab.Navigator screenOptions={{
                tabBarLabelPosition: "beside-icon",
                tabBarLabelStyle: {
                    fontWeight: "500",
                    fontSize: 14
                },
                headerShown: false,
                tabBarIconStyle: { display: "none" },
            }
            }>

                <Tab.Screen name="Popüler" component={HomeScreen} initialParams={{ title: "Popüler" }} />
                <Tab.Screen name="Emlak" component={CategoryScreen} initialParams={{ title: "Emlak" }} />
                <Tab.Screen name="İlan" component={CategoryScreen} initialParams={{ title: "İlan" }} />
                <Tab.Screen name="İtiraf" component={CategoryScreen} initialParams={{ title: "İtiraf" }} />

            </Tab.Navigator>
        )
    }
}

const styles = StyleSheet.create({})