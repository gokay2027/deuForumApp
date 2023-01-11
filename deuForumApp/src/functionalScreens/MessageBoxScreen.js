import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { Component, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import IonIcons from "react-native-vector-icons/Ionicons"
import EntypoIcon from "react-native-vector-icons/Entypo"
import AntDesign from "react-native-vector-icons/AntDesign"
import FontistoIcon from "react-native-vector-icons/Fontisto"
import firestore from '@react-native-firebase/firestore'
import { user } from '../enterScreens/LoginScreen'

const messageBoxUsers = () => {

  const [userList, setUserList] = useState([]);

  const sub = firestore().collection("Users").doc(user.username)
    .collection("MessageBox").get().then((documentReference) => {

      let userList = []

      documentReference.forEach((dataReference) => {
        userList.push(dataReference.id);
      }
      )
    setUserList(userList);
    })
    return userList;
}

const MessageBoxScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.topBarStyle}>

        <TouchableOpacity style={{ position: "absolute", top: 15, left: 15 }} onPress={() => {
          //Profile screenler kopyala yapıştır yapıldı yani category screen ile home screendeki
          //profile giden fonksiyonlar ayrı çalışıyor global olması lazım
          navigation.goBack();
        }}>
          <IonIcons name='arrow-back' size={23} color="white" />
        </TouchableOpacity>

        <Text style={styles.topBarTextStyle}>
          DEU ÖĞRENCİ PLATFORMU
        </Text>



      </View>

      <View>
        {
          messageBoxUsers().map(( item, index ) => {

            return (
              
              <TouchableOpacity key={index}

                onPress={() => {
                  navigation.navigate("messageScreen",{messageUser:item});
                }}

                style={{ marginTop: 10, marginHorizontal: 10, }}>
                <View style={{
                  height: 50,
                  borderRadius: 5,
                  alignItems: "center",
                  paddingHorizontal: 10,
                  elevation: 1,
                  backgroundColor: "white",
                  flexDirection: "row"
                }}>
                  <View style={{
                    width: 30, height: 30, borderRadius: 90,
                    backgroundColor: "white",
                    justifyContent: "center", alignItems: "center"
                  }}>
                    <IonIcons name='person' size={22}></IonIcons>


                  </View>

                  <Text style={{ color: "black", fontWeight: "600", marginLeft: 20 }}>{item}</Text>


                </View>
              </TouchableOpacity>

            )

          })
        }
      </View>



    </SafeAreaView>
  )
}

export default MessageBoxScreen

const styles = StyleSheet.create({
  topBarStyle: {
    backgroundColor: "#1FAEFF",

    height: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 15,
    elevation: 5
  },
  topBarTextStyle: {
    color: "white",
    fontWeight: "bold",
  },
})