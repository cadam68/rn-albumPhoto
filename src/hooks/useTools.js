import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { CONST } from "../config/default";

export const GUI = {
  Separator: function () {
    return <View style={styles.separator} />;
  },
  Spacer: function (props) {
    return <View style={[styles.spacer, props.style]}>{props.children}</View>;
  },
  ModalActivityIndicator: function ({ visible }) {
    return (
      <Modal visible={visible} animationType="none" transparent>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="white" animating={visible} />
        </View>
      </Modal>
    );
  },
  TextInput: function ({ value, onChangeText, name, ...props }) {
    return (
      <TextInput
        value={value}
        onChangeText={value => onChangeText(name, value)} //... Bind the name here
        {...props}
      />
    );
  },
  TextInputFocus: function ({ ...props }) {
    const [isFocused, setIsFocused] = useState(false);
    const { style } = props;
    const { fontSize } = style;

    return (
      <View style={isFocused ? props.styleFocus : props.style}>
        <TextInput {...props} style={{ marginHorizontal: 10, fontSize }} onBlur={() => setIsFocused(false)} onFocus={() => setIsFocused(true)} />
      </View>
    );
  },
  Button: function ({ ...props }) {
    const { onPress } = props;
    let { title, style } = props;
    const { fontSize, color } = style;
    // delete style.fontSize;                           // delete a property of an object
    style = (({ fontSize, color, ...o }) => o)(style); // remove property fontSize

    return (
      <TouchableOpacity activeOpacity={1} onPress={onPress}>
        <View style={[{ justifyContent: "center", alignItems: "center" }, style]}>
          <Text style={{ fontSize, color: "gray", position: "absolute", paddingTop: 2, paddingLeft: 2 }}>{title}</Text>
          <Text style={{ fontSize, color }}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  },
  TitleH1: function ({ text, styleView }) {
    return (
      <View style={styleView}>
        <Text style={[STYLES.h1, { color: "#cccccc", position: "absolute", top: 1, left: 1 }]}>{text}</Text>
        <Text style={STYLES.h1}>{text}</Text>
      </View>
    );
  },
  Stars: function ({ nb, count }) {
    return (
      <View style={{ flexDirection: "row" }}>
        {Array(nb)
          .fill(null)
          .map((value, i) => {
            return <FontAwesome key={i} name="star" size={14} color="red" />;
          })}
        {Array(count - nb)
          .fill(null)
          .map((value, i) => {
            return <Feather key={i} name="star" size={14} color="red" />;
          })}
      </View>
    );
  },
  Icon: function ({ onPress: onPressHandler, family, name, enable }) {
    switch (family) {
      case "Feather":
        if (!enable)
          return (
            <View>
              <Feather name={name} size={24} style={{ color: "gray" }} />
            </View>
          );
        else
          return (
            <View>
              <TouchableOpacity onPress={onPressHandler}>
                <Feather name={name} size={24} color="gray" style={{ position: "absolute", top: 2, left: 2 }} />
                <Feather name={name} size={24} style={{ color: "white" }} />
              </TouchableOpacity>
            </View>
          );
      case "FontAwesome5":
        if (!enable)
          return (
            <View>
              <FontAwesome5 name={name} size={24} style={{ color: "gray" }} />
            </View>
          );
        else
          return (
            <View>
              <TouchableOpacity onPress={onPressHandler}>
                <FontAwesome5 name={name} size={24} color="gray" style={{ position: "absolute", top: 2, left: 2 }} />
                <FontAwesome5 name={name} size={24} style={{ color: "white" }} />
              </TouchableOpacity>
            </View>
          );
      case "SimpleLineIcons":
        if (!enable)
          return (
            <View>
              <SimpleLineIcons name={name} size={24} style={{ color: "gray" }} />
            </View>
          );
        else
          return (
            <View>
              <TouchableOpacity onPress={onPressHandler}>
                <SimpleLineIcons name={name} size={24} color="gray" style={{ position: "absolute", top: 2, left: 2 }} />
                <SimpleLineIcons name={name} size={24} style={{ color: "white" }} />
              </TouchableOpacity>
            </View>
          );
      default:
        return null;
    }
  },
};

export const STRING = {
  noSpaces: function (str) {
    return str.replace(/\s+/g, "");
  },
  clean: function (str) {
    return str.replace(/[^\w]/gi, "");
  },
  alphanumeric_UsAscii: function (str) {
    return str.replace(/[^0-9a-zA-Z ]/gi, "");
  },
  alphanumeric: function (str) {
    const punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
    const spaceRE = /\s+/g;
    return str.replace(punctRE, "").replace(spaceRE, " ");
  },
  toTitleCase: function (phrase) {
    return phrase
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },
};

export const MATH = {
  distance: function (lat1, lon1, lat2, lon2) {
    const p = 0.017453292519943295; // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

    return Math.abs(12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
  },
  randomRgb: function () {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red},${green},${blue})`;
    // return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
  },
  random: function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  toFixedNumber: function (num, digits, base) {
    const pow = Math.pow(base || 10, digits);
    return Math.round(num * pow) / pow;
  },
  toFixed: function (val, dec) {
    return (Math.round(val * Math.pow(10, dec)) / Math.pow(10, dec)).toFixed(dec);
  },
  date2str: function (x, y) {
    try {
      const z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds(),
      };

      // Replace format tokens with values from `z`
      y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        const key = v.slice(-1);
        const value = z[key];
        return ((v.length > 1 ? "0" : "") + value).slice(-2);
      });

      // Replace year format tokens
      return y.replace(/(y+)/g, function (v) {
        return x.getFullYear().toString().slice(-v.length);
      });
    } catch (error) {
      console.error("Error in date2str:", error);
    }
    return "";
  },
};

export const STYLES = StyleSheet.create({
  buttonText: {
    fontSize: 14,
    color: "#fff",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  button: {
    backgroundColor: "#7777FF",
    borderRadius: 1,
    paddingVertical: 10,
  },
  input: {
    margin: 15,
    borderColor: "black",
    borderWidth: 1,
  },
  h1: {
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
  },
  h2: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

let LogDebugOn = CONST.debug;
export const LOG = {
  console: (...props) => {
    if (LogDebugOn) console.log(`[${CONST.appName}] ` + props);
  },
  warn: (...props) => {
    if (LogDebugOn) console.warn(`[${CONST.appName}] ` + props);
  },
  error: (...props) => {
    console.error(`[${CONST.appName}] ` + props);
  },
  activate: state => {
    LogDebugOn = !!state;
    console.log(`[${CONST.appName}] log is ${LogDebugOn ? "on" : "off"}`);
  },
};

export const STORAGE = {
  async setItem(key, value) {
    try {
      return await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // console.error('AsyncStorage#setItem error: ' + error.message);
    }
  },

  async getItem(key) {
    return await AsyncStorage.getItem(key).then(result => {
      if (result) {
        try {
          result = JSON.parse(result);
        } catch (e) {
          // console.error('AsyncStorage#getItem error deserializing JSON for key: ' + key, e.message);
        }
      }
      return result;
    });
  },

  async removeItem(key) {
    return await AsyncStorage.removeItem(key);
  },

  async getAllKeys() {
    return await AsyncStorage.getAllKeys();
  },

  async removeAllItems() {
    const allKeys = await AsyncStorage.getAllKeys();
    // console.log('Storage remove allKeys', allKeys);
    // await Promise.all(allKeys.map(async key => await AsyncStorage.removeItem(key)));
    for await (let key of allKeys) await AsyncStorage.removeItem(key);
  },
};

const styles = StyleSheet.create({
  separator: {
    marginVertical: 5,
    marginHorizontal: 15,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  spacer: {
    margin: 10,
    alignSelf: "stretch",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.3)",
    marginBottom: 0,
    marginTop: 57,
  },
});
