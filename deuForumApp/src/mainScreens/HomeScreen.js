import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect,useState } from 'react'
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign"
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome"
import FontistoIcon from "react-native-vector-icons/Fontisto"
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { user } from '../enterScreens/LoginScreen';




const popularEntries =()=>{
  
  const [entries,setEntries]=useState([]);

  useEffect(()=>{
    const subscriber = firestore().collection("Entries").where("Popular","==",true)
    .onSnapshot((querySnapshot)=>{

      const entries = [];
      querySnapshot.forEach(documentSnapshot=>{

        entries.push({
          ...documentSnapshot.data(),
          key:documentSnapshot.id,
        });
      });
      console.log("Bir defa çalış")
      setEntries(entries);
      
    })  

    return ()=>subscriber();
  },[]);
  console.log(entries);
  return entries;
} 


const HomeScreen = ({ route, navigation }) => {

  const { title } = route.params;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* TOP BAR */}
      <View style={styles.topBarStyle}>

        <TouchableOpacity onPress={() => {
          navigation.navigate("profileScreen", {username:user.username});
        }}>
          <Ionicons name="person" size={23} color="white" />
        </TouchableOpacity>



        <Text style={styles.topBarTextStyle}>
          DEU ÖĞRENCİ PLATFORMU
        </Text>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => {
            navigation.navigate("addEntryScreen");
          }}>
            <View style={{ marginRight: 10 }}><AntDesign name="pluscircleo" size={23} color={"white"} /></View>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => {
            navigation.navigate("messageBoxScreen");
          }}>
            <FontAwesomeIcon name='inbox' size={23} color={"white"}></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
      </View>
      {/* Body View */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bodyViewStyle}
        >
          <Text style={styles.pageWelcomeTextStyle}>Hoş Geldin {user.username}!</Text>
          <Text style={styles.pageWelcomeTextStyle}>İşte bugünün popülerleri:</Text>
          
          {
            popularEntries().map(( item,index ) => {

              return (
                <TouchableOpacity key={index} onPress={() => {
                  
                  const dataToPass = {
                    entryId:item["key"],
                    entryTitle:item["title"],
                    entryContent:item["content"],
                    entryCreatorUsername:item["creatorUsername"],
                    entryLikes:item["likes"],
                    entryDate:item["date"]
                  };


                  navigation.navigate("entryScreen",dataToPass);
                }}>
                  <View style={styles.entryStyle}>

                    <View style={styles.entryTopBar}>

                      <View style={{ height: 35, width: 35, borderRadius: 90, justifyContent: "center" }}>
                        <Ionicons name='person' style={{ alignSelf: "center" }} size={20}></Ionicons>
                      </View>

                      <View style={{ paddingLeft: 10 }}>
                        <Text style={{ fontWeight: "bold", color: "black" }}>{item["creatorUsername"]}</Text>
                        <Text>{item["date"]}</Text>
                      </View>
                    </View>

                    <View style={{ paddingHorizontal: 20, height: 25 }}>
                      <Text numberOfLines={1} style={{ color: "black", fontWeight: "bold" }}>{item["title"]}</Text>
                    </View>

                    <View style={{ marginHorizontal: 20, flex:1 }}>
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
                      marginBottom:13
                    }}>
                      <Text>{item["category"]}</Text>

                    </View>


                  </View>
                </TouchableOpacity>
              )
            })
          }


        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  topBarStyle: {
    backgroundColor: "#1FAEFF",

    height: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 5
  },
  addButtonStyle: {
    flexDirection: "row",

  },
  topBarTextStyle: {
    color: "white",
    fontWeight: "bold",
  },
  bodyViewStyle: {
    flex: 1,
    paddingHorizontal: 7,
    paddingTop: 5,

  },
  entryStyle: {
    height: 200,
    backgroundColor: "white",
    elevation: 4,
    marginTop: 10
  },
  pageWelcomeTextStyle: {
    color: "black",
    fontWeight: "600",
    fontSize: 15
  },
  entryTopBar: {
    height: 60,

    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 5
  }
})