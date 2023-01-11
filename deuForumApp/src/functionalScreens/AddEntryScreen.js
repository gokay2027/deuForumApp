import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome"
import DropDownPicker from 'react-native-dropdown-picker';
import { user } from '../enterScreens/LoginScreen'
import firestore from '@react-native-firebase/firestore';

const AddEntryScreen = ({ navigation }) => {

  const [open, setOpen] = useState(false);

  const [value, setValue] = useState(null);

  const [items, setItems] = useState([
    { label: 'Emlak', value: 'Emlak' },
    { label: 'İlan', value: 'İlan' },
    { label: 'İtiraf', value: 'İtiraf' },
  ]);

  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");

  return (
    <SafeAreaView style={{ flex: 1 }}>


      <View style={styles.topBarStyle}>

        <TouchableOpacity style={{ position: "absolute", top: 15, left: 15 }} onPress={() => {
          //Profile screenler kopyala yapıştır yapıldı yani category screen ile home screendeki
          //profile giden fonksiyonlar ayrı çalışıyor global olması lazım
          navigation.goBack();
        }}>
          <Ionicons name='arrow-back' size={23} color="white" />
        </TouchableOpacity>



        <View>
          <Text style={styles.topBarTextStyle}>
            DEU ÖĞRENCİ PLATFORMU
          </Text>
        </View>

      </View>


      <View style={{ marginHorizontal: 15 }}>

        <Text style={styles.inputTextStyle}>Başlık</Text>
        <View style={{
          backgroundColor: "white", borderRadius: 3, elevation: 3,
          borderColor: "black", borderWidth: 0.4
        }}>
          <TextInput

            onChangeText={(topicValue) => {
              setTopic(topicValue);
            }}

            maxLength={50} style={{ height: 40 }}>
          </TextInput>
        </View>

        <Text style={styles.inputTextStyle}>Kategori</Text>

        <DropDownPicker
          style={{
            backgroundColor: "white", borderRadius: 3, elevation: 3,
            borderColor: "black", borderWidth: 0.4
          }}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />

        <Text style={styles.inputTextStyle}>İçerik</Text>

        <View style={{
          backgroundColor: "white", borderRadius: 3, elevation: 3,
          borderColor: "black", borderWidth: 0.4, height: 340
        }}>
          <TextInput
            onChangeText={(contentValue) => {
              setContent(contentValue);
            }}


            textAlignVertical='top' style={{ height: 340 }} maxLength={2000} multiline={true}>

          </TextInput >
        </View>


        <TouchableOpacity onPress={async () => {

          if (value != null && topic.trim() != "" && content.trim()!="") {

            // console.log(value);
            // console.log(topic);
            // console.log(content);
            // console.log(user.username);
            // console.log("Likes"+ " "+0)

            var date = new Date();
            //console.log("Date:"+date.getUTCDate()+" "+date.getUTCMonth()+" "+date.getUTCFullYear());

            await firestore().collection("Entries").add({
              creatorUsername: user.username,
              title: topic,
              content: content,
              category: value,
              date: date.getUTCDate() + "." + (date.getUTCMonth() +1)+ "." + date.getUTCFullYear(),
              likes: 0,
              Popular:false
            })
          }

          else {
            Alert.alert(
              "Hatalı veya eksik bilgi",
              "Hatalı veya eksik bilgi girdiniz lütfen kontrol edip tekrar deneyin",
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
            <Text style={styles.buttonTextStyle}>
              Paylaş
            </Text>
          </View>
        </TouchableOpacity>


      </View>
    </SafeAreaView>
  )
}

export default AddEntryScreen

const styles = StyleSheet.create({
  inputTextStyle: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    paddingBottom: 5,
    paddingTop: 20
  },
  topBarTextStyle: {
    color: "white",
    fontWeight: "bold",

  },
  topBarStyle: {
    backgroundColor: "#1FAEFF",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",

    paddingHorizontal: 15,
    elevation: 5
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

  },
  buttonTextStyle: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold"
  }
})