import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Divider } from "@rneui/themed";
import { TextInput } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const RegisterScreen = () => {

  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [passoword, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [check,setCheck]=useState(false);

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={styles.topicViewStyle}>

          <Text style={styles.topicText}>
            Dokuz Eylül
          </Text>
          <Text style={styles.topicText}>
            Üniversitesi
          </Text>

          <Text style={[styles.universityNameText, { paddingTop: 10 }]}>
            Öğrenci Forum platformu
          </Text>
          <Text style={[styles.universityNameText, { paddingTop: 10 }]}>
            Kayıt ol
          </Text>
        </View>

        <Divider color='black' width={1} style={styles.dividerStyle} ></Divider>

        <View style={styles.bodyViewStyle} >

          <Text style={styles.inputNameStyle}>
            Öğrenci E-Posta
          </Text>

          <TextInput placeholder='xxxxx@ogr.deu.edu.tr' style={styles.inputFieldStyle}
            onChangeText={(emailValue) => {

              setEmail(emailValue);
            }} ></TextInput>

          <Text style={[styles.inputNameStyle, { paddingTop: 15 }]}>
            Kullanıcı adı
          </Text>

          <TextInput
            onChangeText={(userName) => {
              setUserName(userName);
            }}
            placeholder='deuStudent123' style={styles.inputFieldStyle}></TextInput>

          <Text style={[styles.inputNameStyle, { paddingTop: 15 }]}>
            Şİfre
          </Text>

          <TextInput secureTextEntry={true}
            onChangeText={(passwordValue) => {
              setPassword(passwordValue);
            }}
            placeholder='Şifreniz' style={styles.inputFieldStyle} ></TextInput>

          <Text style={[styles.inputNameStyle, { paddingTop: 15 }]}>
            Şifre Tekrar
          </Text>

          <TextInput secureTextEntry={true}
            onChangeText={(passwordAgainValue) => {
              setPasswordAgain(passwordAgainValue);
            }}
            placeholder='Şifre tekrar' style={styles.inputFieldStyle}></TextInput>

        </View>

        <View style={styles.checkBoxViewStyle}>
          <BouncyCheckbox size={30} onPress={(isChecked) => { setCheck(isChecked) }} fillColor={"#1FAEFF"} />
          <TouchableOpacity style={{ alignSelf: "center" }}>
            <Text style={{ alignSelf: "center", color: "#1FAEFF", fontWeight: "bold", fontSize: 15 }}>
              Koşulları
            </Text>
          </TouchableOpacity>

          <Text style={{ alignSelf: "center", color: "black", fontWeight: "bold", fontSize: 15 }}>
            {" "}okudum kabul ediyorum.
          </Text>
        </View>


        <TouchableOpacity onPress={async () => {
          
          console.log(email.trim()==="");
          console.log(username.trim()==="");
          console.log(passoword.trim()==="");
          console.log(passwordAgain.trim()==="");
          console.log("is Checked: "+check )

          let isExists = false;

          if ( passwordAgain.trim()!="" && passoword.trim()!="" 
          && email.trim() != "" && username.trim() != "" && (passoword === passwordAgain) && check
          ) 
          {
            

            if( (await firestore().collection("Users").doc(username).get()).exists){
              Alert.alert(
                "Hata",
                "Aynı kullanıcı adında bir kullanıcı bulunuyor tekrar deneyiniz",
                [
                  {
                    text: "OK",
  
                    style: "OK",
                  },
                ],
  
              );
            }
            else{
              await auth().createUserWithEmailAndPassword(email, passoword).then((value) => {
                console.log("auth için Kayıt Yapıldı!!!");


                
                
                firestore().collection("Users").doc(username).set({
                  username: username,
                  password: passoword,
                  email: email
                }).then((valuetwo) => {
                  console.log("Database kaydı yapıldı!");
  
                  Alert.alert(
                    "Başarılı!",
                    "Kaydınız başarıyla yapıldı iyi eğlenceler",
                    [
                      {
                        text: "OK",
  
                        style: "OK",
                      },
                    ],
  
                  );
                })
              }).catch((error)=>{
                
                Alert.alert(
                  "Hata!",
                  "Giriş bilgileriniz hatalı bir daha deneyin",
                  [
                    {
                      text: "OK",
    
                      style: "OK",
                    },
                  ],
    
                );

              })
            }
            console.log("Hatalı giriş")

            
          }
          else{
            
            Alert.alert(
              "Hata!",
              "Giriş bilgileriniz hatalı bir daha deneyin",
              [
                {
                  text: "OK",

                  style: "OK",
                },
              ],

            );
          }


        }}>
          <View style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Kayıt Ol</Text>
          </View>
        </TouchableOpacity>



      </SafeAreaView>
    </ScrollView>

  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  topicViewStyle: {
    paddingTop: 30,
    paddingLeft: 15
  },
  dividerStyle: {
    color: "black",
    paddingTop: 20,
    marginHorizontal: 15

  },
  bodyViewStyle: {
    paddingHorizontal: 15,
    paddingTop: 15
  },
  inputNameStyle: {
    color: "black",

    fontSize: 16
  },
  inputFieldStyle: {
    borderColor: "9FAEC0",
    borderWidth: 0.7,
    marginTop: 10,
    height: 40,
    borderRadius: 3,
    elevation: 1.2
  },
  topicText: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#1FAEFF"
  },
  universityNameText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20
  },
  checkBoxViewStyle: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 15

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
    justifyContent: "center",
    marginHorizontal: 15
  },
  buttonTextStyle: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold"
  }
})