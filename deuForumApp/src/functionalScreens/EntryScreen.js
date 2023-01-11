import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import IonIcon from "react-native-vector-icons/Ionicons"
import AntIcon from "react-native-vector-icons/AntDesign"
import FontIcon from "react-native-vector-icons/Fontisto"
import { Divider } from "@rneui/themed";
import { user } from '../enterScreens/LoginScreen'
import firestore from '@react-native-firebase/firestore'



const getCommentLikeNumber =(entryId,commentdataid)=>{

  const [commentLikes,setCommentLikesNumber] = useState(0);

  useEffect(()=>{
    firestore().collection("Entries").doc(entryId).collection("Comments")
    .doc(commentdataid).collection("Likes").onSnapshot((documentSnapshot)=>{
      setCommentLikesNumber(documentSnapshot.size);
    })
  },[]);

  return commentLikes;
}



const getComments = (entryId) => {

  const [comments, setComments] = useState([]);

  useEffect(() => {
    let likes = 0;
    const subscriber = firestore().collection("Entries").
      doc(entryId).collection("Comments").onSnapshot((documentSnapshot) => {

        const comments = [];

        documentSnapshot.forEach((dataSnapshot) => {


          firestore().collection("Entries").doc(entryId).collection("Comments").doc(dataSnapshot.id)
            .collection("Likes").get().then((data) => {
              console.log("Lİkessssssss "+data.size)
              likes = data.size;
            })


          comments.push({
            ...dataSnapshot.data(),
            likes:likes,
            key: dataSnapshot.id,
          })
        });
        
        setComments(comments);
      })

    return () => subscriber();
  }, []);

  //console.log(comments);
  return comments;

}


const EntryScreen = ({ route, navigation }) => {

  const [commentContent, setCommentContent] = useState("");
  const [commentNumber, setCommentNumber] = useState(0);
  const [likeNumber, setLikeNumber] = useState(0);
  const [commentLikeNumber, setCommentLikeNumber] = useState(0);

  const dataToPass
    = route.params;

  console.log("İçerik:: " + dataToPass["entryId"])


  //Like sayısı
  useEffect(() => {
    firestore().collection("Entries").doc(dataToPass["entryId"]).collection("Likes").onSnapshot((snapShot) => {

      setLikeNumber(snapShot.size);
    })

  }, []);



  //Comment sayısı
  useEffect(() => {

    firestore().collection("Entries").doc(dataToPass["entryId"]).collection("Comments").onSnapshot((snapShot) => {

      setCommentNumber(snapShot.size);
    })

  }, [])





  return (

    <SafeAreaView style={{ flex: 1 }}>

      {/* Top Bar */}
      <View style={styles.topBarStyle}>
        <TouchableOpacity style={{ position: "absolute", left: 15 }} onPress={() => {
          navigation.goBack();
        }}>
          <IonIcon name='arrow-back' size={22} color={"white"}></IonIcon>
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", color: "white", fontSize: 17 }}> Forum</Text>
      </View>

      {/* Owner Entry */}
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <View style={styles.ownerEntry}>


          <TouchableOpacity onPress={() => {

            navigation.navigate("profileScreen", { username: dataToPass["entryCreatorUsername"] });

          }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>

              <View style={{ marginLeft: 10, backgroundColor: "white", borderRadius: 90, height: 35, width: 35, justifyContent: "center", alignItems: "center" }}>
                <IonIcon name='person' size={25}></IonIcon>
              </View>

              <View style={{ paddingLeft: 10 }}>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{dataToPass["entryCreatorUsername"]}</Text>
                <Text>
                  {dataToPass["entryDate"]}
                </Text>
              </View>
            </View>
          </TouchableOpacity>


          {/* Owner entry content */}
          <View style={styles.entryTextStyle}>

            <Text style={{ fontSize: 16, color: "black" }}>
              {dataToPass["entryContent"]}
            </Text>

            <View style={{ flexDirection: "row", paddingTop: 10 }}>


              <TouchableOpacity onPress={async () => {

                if (!(await firestore().collection("Entries").doc(dataToPass["entryId"]).collection("Likes").doc(user.username).get()).exists) {
                  firestore().collection("Entries").doc(dataToPass["entryId"]).collection("Likes")
                    .doc(user.username).set({
                      username: user.username
                    })
                }


              }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }} >
                  <AntIcon name='like1' color={"#1FAEFF"}></AntIcon>
                  <Text> {likeNumber} Beğenme</Text>
                </View>
              </TouchableOpacity>


              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontIcon name='comment' color={"#1FAEFF"}></FontIcon>
                <Text> {commentNumber} Yorum</Text>
              </View>

            </View>
          </View>
          <Divider color='black' width={1} style={styles.dividerStyle} ></Divider>
        </View>

        {/* Entry Comments View */}
        <View style={{ marginHorizontal: 15, marginTop: 6 }}>
          <Text style={{ fontWeight: "bold", color: "black", fontSize: 25 }}>Yorumlar</Text>
        </View>


        {/* {

          ÇALIŞIYOR
          console.log(getComments(dataToPass["entryId"]))
          
        } */}

        {
          getComments(dataToPass["entryId"]).map((item, index) => {



            let commentLikes = 0;

            //burada sorun yok


            console.log(item["likes"]);

            return (
              <View key={index} style={styles.commentEntry}>

                <View style={{ flexDirection: "row", alignItems: "center" }}>


                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => {
                    navigation.navigate("profileScreen", { username: item["commentUsername"] });
                  }}>
                    <View style={{ marginLeft: 10, backgroundColor: "white", borderRadius: 90, height: 35, width: 35, justifyContent: "center", alignItems: "center" }}>
                      <IonIcon name='person' size={25}></IonIcon>
                    </View>

                    <View style={{ paddingLeft: 10 }}>
                      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item["commentUsername"]}</Text>
                      <Text>
                        {item["commentDate"]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Owner entry content */}
                <View style={styles.entryTextStyle}>

                  <Text style={{ fontSize: 16, color: "black" }}>
                    {item["comment"]}
                  </Text>

                  <View style={{ flexDirection: "row", paddingTop: 10 }}>


                    <TouchableOpacity onPress={async () => {
                      console.log("Beğen")




                      if (!(await firestore().collection("Entries").doc(dataToPass["entryId"]).collection("Comments").doc(item["key"])
                        .collection("Likes").doc(user.username).get()).exists) {

                        firestore().collection("Entries").doc(dataToPass["entryId"]).collection("Comments")
                          .doc(item["key"]).collection("Likes").doc(user.username).set({
                            username: user.username
                          }).then(()=>{
                            console.log("Beğenildi");
                          })

                      }
                      else {
                        console.log("Olmadı")
                      }


                    }}>
                      <View style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }} >
                        <AntIcon name='like1' color={"#1FAEFF"}></AntIcon>
                        <Text> {item["likes"]} Beğenme</Text>
                      </View>
                    </TouchableOpacity>

                  </View>
                </View>

              </View>
            )
          })
        }
      </ScrollView>

      <View style={{
        height: 50, backgroundColor: "white",
        borderTopColor: "black", borderTopWidth: 0.3,
        flexDirection: "row",
        justifyContent: "space-between", paddingHorizontal: 10
      }}>

        <TextInput onChangeText={(commentValue) => {

          setCommentContent(commentValue);

        }} multiline={true} style={{ flex: 1 }} placeholder='Yorum yap'></TextInput>

        <TouchableOpacity onPress={async () => {

          console.log(user.username);
          const date = new Date();

          console.log(date.getUTCDate() + "." + (date.getMonth() + 1) + "." + date.getUTCFullYear());
          const todayString = date.getUTCDate() + "." + (date.getMonth() + 1) + "." + date.getUTCFullYear();

          if (commentContent.trim() != "") {

            await firestore().collection("Entries").doc(dataToPass["entryId"])
              .collection("Comments")
              .add({
                commentUsername: user.username,
                comment: commentContent,
                commentDate: todayString,
                commentLikes: 0
              })


          }
          else {
            Alert.alert(
              "Yorum alanı boş",
              "Boş yorum giremezsiniz",
              [
                {
                  text: "OK",

                  style: "OK",
                },
              ],

            );
          }

        }} style={{ alignSelf: "center" }}>
          <View style={{
            justifyContent: "center",
            width: 80,
            alignItems: "center",
            height: 30,
            backgroundColor: "#1FAEFF",
            borderRadius: 90,
            elevation: 2
          }}>
            <Text style={{ color: "white" }}>Gönder</Text>
          </View>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  )
}

export default EntryScreen

const styles = StyleSheet.create({
  topBarStyle: {
    backgroundColor: "#1FAEFF",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    elevation: 5
  },
  ownerEntry: {
    //Geçici yükseklik silinecek
    //
    marginTop: 10,
    marginHorizontal: 10
  },
  entryTextStyle: {
    marginHorizontal: 40,
    marginTop: 10,
  },
  dividerStyle: {
    color: "black",
    paddingTop: 20,
  },
  commentEntry: {
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 10
  }
})