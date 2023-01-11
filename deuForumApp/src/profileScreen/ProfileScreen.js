import { StyleSheet, Text, Touchable, TouchableOpacity, View, FlatList, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import IonIcons from "react-native-vector-icons/Ionicons"
import EntypoIcon from "react-native-vector-icons/Entypo"
import AntDesign from "react-native-vector-icons/AntDesign"
import FontistoIcon from "react-native-vector-icons/Fontisto"
import LinearGradient from 'react-native-linear-gradient'
import { user } from '../enterScreens/LoginScreen'
import firestore from '@react-native-firebase/firestore'

const profileEntries = (username) => {

  const [entries, setEntries] = useState([]);

  useEffect(() => {

    const subscriber = firestore().collection("Entries").
      where("creatorUsername", "==", username)
      .onSnapshot((querySnapshot) => {

        const entries = [];
        querySnapshot.forEach(documentSnapshot => {
          entries.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setEntries(entries);

      })

    return () => subscriber();
  }, []);
  console.log(entries);
  return entries;
}




//ÖNEMLİ***** bu sayfa bir kullanıcının usernameini almalı bu sayede başka hesaplar
//onun hesabını inceleyebilir.


const ProfileScreen = ({ navigation, route }) => {
  
  const { username } = route.params;

  const [entryLikeNumber,setEntryLikeNumber]=useState(0);
  const [entryCommentNumber,setEntryCommentNumber] = useState(0);

  return (

    <SafeAreaView>
      <LinearGradient

        colors={['#2193b0', '#6dd5ed']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}

        style={styles.profileTopBar}>

        <TouchableOpacity style={{ position: "absolute", left: 10, top: 10 }} onPress={() => {
          navigation.goBack();
        }}>
          <IonIcons name='arrow-back' size={22} color={"white"}></IonIcons>
        </TouchableOpacity>



        <TouchableOpacity style={{ position: "absolute", right: 10, top: 10 }} onPress={async () => {

          if (username === user.username) {

            Alert.alert(
              "Hata",
              "Kendinizi mesaj kutusuna ekleyemezsiniz",
              [
                {
                  text: "Tamam",
                  style: "OK",
                },
              ],

            );

          }
          else {

            firestore().collection("Users").doc(user.username).collection("MessageBox").
            doc(username).get().then((snapshot)=>{
              if(snapshot.exists){
                Alert.alert(
                  "Hata",
                  "Profil zaten mesaj kutunuza eklenmiş",
                  [
                    {
                      text: "Tamam",
                      style: "OK",
                    },
                  ],
    
                );
              }
              else{
                firestore().collection("Users").doc(user.username).collection("MessageBox")
                .doc(username).set({});

                firestore().collection("Users").doc(username).collection("MessageBox")
                .doc(user.username).set({});

                Alert.alert(
                  "Başarılı",
                  "Kişi mesaj listenize eklendi",
                  [
                    {
                      text: "Tamam",
                      style: "OK",
                    },
                  ],
    
                );
              }
            })

          }
        }}>
          <EntypoIcon name='message' size={22} color={"white"}></EntypoIcon>
        </TouchableOpacity>



        <View style={{
          width: 70, height: 70, borderRadius: 90,
          backgroundColor: "white",
          marginBottom: 10, justifyContent: "center", alignItems: "center"
        }}>
          <IonIcons name='person' size={26}></IonIcons>
        </View>

        <Text style={{ color: "white", fontWeight: "700", fontSize: 20 }}>{username}</Text>
      </LinearGradient>

      <ScrollView>
        <Text style={{ color: "black", fontWeight: "bold", fontSize: 19, marginLeft: 10, marginTop: 10 }}>
          Başlıklar
        </Text>
        {
          profileEntries(username).map( (item, index) => {


            //Burada like comment sorguları yazılabilir 

            var collectiondata = firestore().collection("Entries").doc(item["key"]);

            collectiondata.collection("Likes").onSnapshot((snapshot)=>{

              console.log(snapshot.size+"Likes");

            })

            collectiondata.collection("Comments").onSnapshot((snapshot)=>{
              console.log(snapshot.size+" Comments")
            })


            return (
              <TouchableOpacity key={index} onPress={() => {
                const dataToPass = {
                  entryId: item["key"],
                  entryTitle: item["title"],
                  entryContent: item["content"],
                  entryCreatorUsername: item["creatorUsername"],
                  entryLikes: item["likes"],
                  entryDate: item["date"]
                };
                navigation.navigate("entryScreen", dataToPass);
              }}>


                <View style={styles.entryStyle} key={item.key}>

                  <View style={{ paddingHorizontal: 20, height: 25, marginTop: 10 }}>
                    <Text numberOfLines={1} style={{ color: "black", fontWeight: "bold" }}>{item["title"]}</Text>
                  </View>

                  <View style={{ marginHorizontal: 20, flex: 1 }}>
                    <Text numberOfLines={4} style={{ color: "black" }}>
                      {item["content"]}
                    </Text>
                  </View>

                  <View style={{
                    flexDirection: "row",
                    marginTop: 10,
                    marginHorizontal: 20,
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10
                  }}>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <AntDesign name='like1' color={"#1FAEFF"} size={20}></AntDesign>
                      <Text> {5}</Text>

                      <FontistoIcon name='comment' color={"#1FAEFF"} size={15} style={{ marginLeft: 15 }}></FontistoIcon>
                      <Text> 6 </Text>
                    </View>


                    <Text>{item["category"]}</Text>
                  </View>


                </View>
              </TouchableOpacity>
            )

          })
        }
      </ScrollView>






    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  profileTopBar: {
    height: 140,
    backgroundColor: "#1FAEFF",
    alignItems: "center",
    paddingTop: 20,
    elevation: 3
  },
  entryStyle: {
    height: 150,
    backgroundColor: "white",
    elevation: 4,
    marginTop: 10
  },
})