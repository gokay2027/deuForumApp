import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput } from 'react-native'
import IonIcons from "react-native-vector-icons/Ionicons"
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import firestore from '@react-native-firebase/firestore'
import { user } from '../enterScreens/LoginScreen'


const getMessages = (username) => {

  const [messages, setMessages] = useState([]);

  useEffect(() => {

    const sub = firestore().collection("Users").doc(user.username)
      .collection("MessageBox").doc(username).collection("Messages").orderBy("date","asc").
      onSnapshot((documentReference) => {

        const messages = [];


        documentReference.forEach((data) => {
          messages.push({ ...data.data(), key: data.id, });
        }
        )
        setMessages(messages);
      }
      )
    return () => sub();
  }, [])

  for (let i = 0; i < messages.length; i++) {
    console.log(messages[i])
  }
  return messages;

}



const MessageScreen = ({ navigation, route }) => {
  
  const [message,setMessage] = useState("");

  const { messageUser } = route.params;

  console.log(messageUser);

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
          {messageUser}
        </Text>
      </View>


      {/* Message area view Scrollable olmalı */}
      <View style={{ flex: 1 }}>


        <FlatList
          data={getMessages(messageUser)}
          renderItem={({ item }) => {
            return (
              <View style={item["senderUsername"] == user.username ? styles.senderStyle : styles.receiverStyle}>
                <Text
                  style={item["senderUsername"] == user.username ? styles.alignSender : styles.alignReceiver}
                > {item["message"]}
                </Text>
              </View>
            )
          }}>

        </FlatList>
      </View>

      {/* Message Textbox */}
      <View style={{
        height: 50, backgroundColor: "white",
        borderTopColor: "black", borderTopWidth: 0.3,
        flexDirection: "row",
        justifyContent: "space-between", paddingHorizontal: 10
      }}>

        <TextInput
        
        onChangeText={(messageValue)=>{
          setMessage(messageValue);
        }}
        
        multiline={true} style={{ flex: 1 }} placeholder='Mesaj'></TextInput>

        <TouchableOpacity

          onPress={ async () => {
            console.log(message)
            console.log("gönder")

            let isMessageSent=true

            await firestore().collection("Users").doc(user.username)
            .collection("MessageBox").doc(messageUser).collection("Messages")
            .add({
              senderUsername:user.username,
              receiverUsername:messageUser,
              message:message,
              date:new Date()
            }).catch((error)=>{
              isMessageSent=false;
            });


            if(isMessageSent===true){
              await firestore().collection("Users").doc(messageUser)
              .collection("MessageBox").doc(user.username).collection("Messages")
              .add({
                senderUsername:user.username,
                receiverUsername:messageUser,
                message:message,
                date:new Date()
              })
            }
            else{
              console.log("Mesaj yollanamadı bir sorun var");
            }

            
          }}

          style={{ alignSelf: "center" }}>
          <View style={{
            justifyContent: "center",
            width: 80,
            alignItems: "center",
            height: 30,
            backgroundColor: "#1FAEFF",
            borderRadius: 90,
            elevation: 2
          }}
          >

            <Text style={{ color: "white" }}>Gönder</Text>

          </View>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  )
}

export default MessageScreen

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

  senderStyle: {
    marginLeft: 80,
    backgroundColor: "#0F547A",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    elevation: 1,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 3
  },

  receiverStyle: {
    marginRight: 80,
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 1,
    borderRadius: 10,
    backgroundColor: "#1FAEFF",
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 3
  },

  alignReceiver: {
    textAlign: "left",
    color: "white"
  },

  alignSender: {
    textAlign: "right", color: "white"
  }
})