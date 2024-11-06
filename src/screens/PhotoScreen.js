import React, { useState, useContext, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Alert, ImageBackground, ScrollView, Vibration } from "react-native";
import { Image as Image_Element, Button } from "react-native-elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Emoji from "react-native-emoji";
import DropDownPicker from "react-native-dropdown-picker";
import { Context as BasicDataContext } from "./../context/BasicDataContext";
import { Context as PhotoAlbumContext } from "./../context/PhotoAlbumContext";
import usePhoto from "./../hooks/usePhoto";
import useLocation from "./../hooks/useLocation";
import { GUI, MATH } from "./../hooks/useTools";
import { STYLES, IMAGES, CONST } from "../config/default";
import AudioPlayer from "./../hooks/AudioPlayer";
import { LANGUAGES } from "../config/languages";
import placeholderImage from "./../../assets/images/placeholder-image.png";

const PhotoScreen = () => {
  const navigation = useNavigation();
  const { state: photoAlbum, setCurrentPhoto, saveSettings, sendCurrentPhoto } = useContext(PhotoAlbumContext);
  const { state: basicData } = useContext(BasicDataContext);
  const [category, setCategory] = useState(photoAlbum.settings?.category || null);
  const [message, setMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(category);
  const [items, setItems] = useState();

  const [takeOrPickupPhoto] = usePhoto(() => {
    Alert.alert(LANGUAGES.translate("Sorry, we need camera roll permissions to allow you to upload your photo!"));
  });
  const [location, refreshLocation] = useLocation();

  useEffect(() => {
    if (!message) return;

    const timeout = setTimeout(() => {
      setMessage("");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [message]);

  useFocusEffect(
    useCallback(() => {
      if (!photoAlbum.settings?.userId) navigation.navigate("Settings");
    }, [photoAlbum.settings, navigation])
  );

  // --- refresh the list of items when basicData is updated
  useFocusEffect(
    useCallback(() => {
      setItems(basicData.filter(item => item.domain === "category"));
    }, [basicData])
  );

  // --- actualise the location
  // useFocusEffect(
  //   useCallback(() => {
  //     refreshLocation();
  //   }, [])
  // );

  return (
    <View style={STYLES.container}>
      <GUI.ModalActivityIndicator visible={isBusy} />
      <ImageBackground source={IMAGES.PhotoScreen_imageBackground} style={STYLES.image}>
        <GUI.Spacer style={{ borderWidth: 1, borderRadius: 3, elevation: 3, backgroundColor: "rgba(255, 255, 255, 0.5)", height: "90%" }}>
          <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20 }} showsVerticalScrollIndicator={false}>
            <View style={{ elevation: 5, borderWidth: 0, width: 300, height: 200, marginVertical: 10 }}>
              <Image_Element
                style={{ width: "100%", height: "100%", borderWidth: 7, borderColor: "white" }}
                source={photoAlbum.currentPhoto ? { uri: photoAlbum.currentPhoto } : placeholderImage}
                onPress={() => takeOrPickupPhoto(photo => setCurrentPhoto(photo, "take"), true, photoAlbum.settings.imageSize)}
                onLongPress={() => takeOrPickupPhoto(photo => setCurrentPhoto(photo, "pickup"), false, photoAlbum.settings.imageSize)}
              />
            </View>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder={LANGUAGES.translate("Select an item")}
              containerStyle={{ height: 40, width: "100%" }}
              dropDownMaxHeight={120}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              onChangeValue={async selectedValue => {
                setCategory(selectedValue);
                setValue(selectedValue);
                await saveSettings({ category: selectedValue });
              }}
            />
            <GUI.Spacer style={{ height: open ? 120 : 0 }} />
            {message ? <Text style={STYLES.errorMessage}>{message}</Text> : null}
            <Button
              disabled={!photoAlbum.currentPhoto}
              disabledStyle={STYLES.buttonDisabled}
              raised
              containerStyle={STYLES.button}
              buttonStyle={STYLES.button}
              titleStyle={STYLES.textButton}
              title={LANGUAGES.translate("Send Photo")}
              onPress={async () => {
                setMessage("");
                setIsBusy(true);
                const status = await sendCurrentPhoto(photoAlbum, location);
                setIsBusy(false);
                if (!status.succeed) {
                  AudioPlayer.playSound("error");
                  Vibration.vibrate(100);
                  setMessage(status.message);
                } else {
                  setMessage(LANGUAGES.translate("Photo successfully sent!"));
                }
              }}
            />
            <Emoji
              name={photoAlbum.stats.food > Math.ceil(CONST.nbPhotoPerMonth * 1.5) ? "grinning_face_with_star_eyes" : photoAlbum.stats.food > CONST.nbPhotoPerMonth ? "hugging_face" : photoAlbum.stats.food > Math.ceil(CONST.nbPhotoPerMonth / 2) ? "smile" : photoAlbum.stats.food > 0 ? "slightly_smiling_face" : "neutral_face"}
              style={{ fontSize: 50, marginTop: 30 }}
            />
            {
              // --- debug info ---
              photoAlbum.settings?.userId === CONST.adminId && (
                <View style={{ borderWidth: 1, borderColor: "black" }}>
                  <Text>- Address : {location.address}</Text>
                  <Text>- ImageSize : {photoAlbum.settings?.imageSize || "null"}</Text>
                  <Text>- UserId : {photoAlbum.settings?.userId || "null"}</Text>
                  <Text>- category : {photoAlbum.settings?.category || "null"}</Text>
                  <Text>- currentPhoto : {photoAlbum.currentPhoto}</Text>
                  <Text>- originPhoto : {photoAlbum.originPhoto}</Text>
                  <Text>- errorMessage : {photoAlbum.errorMessage}</Text>
                  <Text>- Nb Photo Sent : {photoAlbum.stats.nbPhotoSent}</Text>
                  <Text>- Food : {photoAlbum.stats.food}</Text>
                  <Text>- Last Sent Date : {MATH.date2str(new Date(photoAlbum.stats.lastPhotoSentDate), "dd/MM/yyyy hh:mm:ss")}</Text>
                </View>
              )
            }
          </ScrollView>
        </GUI.Spacer>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({});

export default PhotoScreen;
