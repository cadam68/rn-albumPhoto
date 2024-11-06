import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import BasicData from "./../classes/BasicData";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export const IMAGES = {
  PhotoScreen_imageBackground: require("./../../assets/images/background-3.jpg"),
  SettingsScreen_imageBackground: require("./../../assets/images/background-2.jpg"),
};

export const CONST = {
  adminId: "Admin123",
  nbPhotoPerMonth: 10,
  defaultImageSize: 500,
  defaultCategory: "family",
  basicData: [
    BasicData.Build("imageSize", "Optimised", 500),
    BasicData.Build("imageSize", "Standard resolution", 1024),
    BasicData.Build("imageSize", "High resolution", 2024),
    BasicData.Build("category", "Holidays", "holidays"),
    BasicData.Build("category", "Events", "events"),
    BasicData.Build("category", "Family", "family"),
    BasicData.Build("category", "Others", "others"),
  ],
  appName: "PhotoAlbum",
  debug: false, // <---- iici
  version: "3.0.0",
};

export const COLORS = {
  // backgroundColor: '#f4511e',
  // backgroundTextColor: '#ffffff',
  backgroundColor: "#7C8EA6",
  backgroundTextColor: "#ffffff",
};

export const STYLES = StyleSheet.create({
  image: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    fontSize: 16,
    color: COLORS.backgroundTextColor,
  },
  button: {
    backgroundColor: COLORS.backgroundColor,
    borderRadius: 100,
    height: 50,
    width: 200,
  },
  buttonDisabled: {
    borderWidth: 1,
    borderColor: "#c2c2c2",
    backgroundColor: "#dedede",
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.backgroundColor,
    borderWidth: 1,
  },
  label: {
    alignSelf: "stretch",
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 15,
  },
  dropDownTextInput: {
    width: "100%",
    height: 38,
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    fontSize: 14,
    borderColor: "#e2e2e2",
    backgroundColor: "#fff",
    paddingLeft: 16,
  },
});
