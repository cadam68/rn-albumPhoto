import React, { useEffect, useContext, useRef, useCallback } from "react";
import { View, Text, Animated, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { GUI } from "./../hooks/useTools";
import AudioPlayer from "./../hooks/AudioPlayer";
import { Context as PhotoAlbumContext } from "./../context/PhotoAlbumContext";
import { LANGUAGES } from "../config/languages";
import { useFocusEffect } from "@react-navigation/native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const SplashScreen = ({ navigation }) => {
  const x1 = useRef(new Animated.Value(50)).current;
  const x2 = useRef(new Animated.Value(0)).current;
  const { state: photoAlbum } = useContext(PhotoAlbumContext);

  useFocusEffect(
    useCallback(() => {
      const cleanSettings = JSON.parse(JSON.stringify(photoAlbum.settings));
      if (!Object.keys(cleanSettings).length) return;

      Animated.parallel([
        Animated.timing(x1, {
          toValue: 90,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(x2, {
          toValue: 20,
          duration: 5000,
          useNativeDriver: false,
        }),
      ]).start();

      if (!cleanSettings.userId) {
        console.log(`SplashScreen: playing welcome`);
        AudioPlayer.playSound("welcome");
      }

      const timeout = setTimeout(() => {
        navigation.navigate("Main");
      }, 6000);
      return () => {
        AudioPlayer.stopSound();
        clearTimeout(timeout);
      };
    }, [photoAlbum.settings])
  );

  return (
    <View style={[styles.container, styles.border]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          navigation.navigate("Main");
        }}>
        <View style={styles.container}>
          <Animated.View style={[styles.absoluteContainer, { right: -50, marginRight: x2, width: SCREEN_WIDTH + 50 }]}>
            <Image source={require("./../../assets/images/background-1.jpg")} style={{ opacity: 0.6, resizeMode: "cover", width: "100%", height: SCREEN_HEIGHT + 25 }} />
          </Animated.View>

          <Animated.View style={[styles.absoluteContainer, { left: 0, marginLeft: x1 }]}>
            <Image source={require("./../../assets/images/laura.png")} style={{ opacity: 1, resizeMode: "cover", width: "100%", height: SCREEN_HEIGHT + 25 }} />
          </Animated.View>

          <GUI.Spacer style={[styles.border, { alignItems: "center", borderRadius: 3, elevation: 1, backgroundColor: "rgba(255, 255, 255, 0.7)", padding: 20, marginTop: -20, width: "90%" }]}>
            <Text style={{ color: "blue", fontSize: 18 }}>{LANGUAGES.translate("Welcome")}</Text>
          </GUI.Spacer>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  absoluteContainer: {
    position: "absolute",
    top: 0,
    width: SCREEN_WIDTH,
    height: "100%",
  },
  border: {
    borderColor: "#737373",
    borderWidth: 1,
  },
});

export default SplashScreen;
