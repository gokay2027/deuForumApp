import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Divider } from "@rneui/themed";
import { Button } from '@rneui/base';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
import User from '../dataClasses/user';
import { NetInfoStateType, useNetInfo } from '@react-native-community/netinfo';

export let user = null;

export default LoginScreen = ({ navigation }) => {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <ScrollView>
        <View style={
          styles.circleView
        }>

          <Text>LOGO</Text>
        </View>

        <View style={styles.topicViewStyle}>
          <Text style={styles.topicText}>
            Dokuz Eylül
          </Text>
          <Text style={styles.topicText}>
            Üniversitesi
          </Text>

          <Text style={styles.universityNameText} >
            Öğrenci Forum Platformu
          </Text>
        </View>

        <Divider color='black' width={1} style={styles.dividerStyle} ></Divider>


        <View style={styles.bodyViewStyle} >

          <Text style={styles.inputNameStyle}>
            Kullanıcı Adı:
          </Text>

          <TextInput
            onChangeText={(usernameValue) => {
              setUsername(usernameValue);
            }}
            placeholder='Kullanıcı Adınız' style={styles.inputFieldStyle} ></TextInput>

          <Text style={[styles.inputNameStyle, { paddingTop: 20 }]}>
            Şifre
          </Text>

          <TextInput
            secureTextEntry={true}
            onChangeText={(passwordValue) => {
              setPassword(passwordValue);
            }}

            placeholder='Şifreniz' style={styles.inputFieldStyle}></TextInput>

        </View>


        <View style={styles.bottomBoxStyle}>
          <TouchableOpacity style={{ paddingTop: 20 }}>
            <Text>
              Şifreni mi unuttun?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={async () => {

            await firestore().collection("Users").doc(username).get().then((documentData) => {

              if (documentData.data()["password"] === password) {


                user = new User(documentData.data()["username"], documentData.data()["email"]);
                
                auth().signInWithEmailAndPassword(documentData.data()["email"], password).then(()=>{
                  console.log("Hoş geldiniz!!!");

                  


                });

                console.log(user.username);
                console.log(user.email);
                navigation.navigate("tabBarScreen");
              }
              else {

                Alert.alert("Hatalı Giriş",
                  "Kullanıcı adınız ya da şifreniz hatalı lütfen tekrar deneyin",
                  [
                    {
                      text: "Tamam"
                    }
                  ]
                )

              }

            }).catch((error) => {
              if (error.name === "TypeError") {
                console.log(error.name)
                Alert.alert("Hatalı Giriş",
                  "Kullanıcı adınız ya da şifreniz hatalı lütfen tekrar deneyin",
                  [
                    {
                      text: "Tamam"
                    }
                  ]
                )
              }
            })


          }}>
            <View style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>Giriş Yap</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            navigation.navigate("registerScreen");
          }}>
            <View style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>Kaydol</Text>
            </View>
          </TouchableOpacity>



        </View>
      </ScrollView>





    </SafeAreaView>

  )
}




const styles = StyleSheet.create(
  {
    circleView: {
      width: 116,
      height: 116,
      backgroundColor: "white",
      top: 30,
      right: 30,
      position: "absolute",
      alignSelf: "flex-end",
      borderRadius: 90,
      elevation: 10,
      alignItems: "center",
      justifyContent: "center"
    },
    topicText: {
      fontWeight: "bold",
      fontSize: 30,
      color: "#1FAEFF"
    },
    universityNameText: {
      color: "black",
      fontWeight: "bold",
      fontSize: 25
    },
    topicViewStyle: {
      paddingTop: 90,
      paddingLeft: 15
    },
    dividerStyle: {
      color: "black",
      paddingTop: 40,
      marginHorizontal: 15

    },
    bodyViewStyle: {
      paddingHorizontal: 15,
      paddingTop: 30
    },
    inputNameStyle: {
      color: "black",
      fontSize: 18
    },
    inputFieldStyle: {
      borderColor: "black",
      borderWidth: 0.7,
      marginTop: 10,
      height: 40,
      borderRadius: 3
    },
    bottomBoxStyle: {
      paddingHorizontal: 15
    },
    buttonStyle: {
      backgroundColor: "#1FAEFF",
      height: 40,
      marginTop: 20,
      borderRadius: 5,
      elevation: 10,
      shadowColor: "black",
      shadowOpacity: 10,
      alignItems: "center",
      justifyContent: "center"
    },
    buttonTextStyle: {
      color: "white",
      fontSize: 15,
      fontWeight: "bold"
    }
  }
)