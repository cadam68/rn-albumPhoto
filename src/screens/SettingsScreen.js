import React, { useState, useContext, useEffect, useRef } from "react";
import { View, StyleSheet, Vibration, ImageBackground, Keyboard, ScrollView } from "react-native";
import { Button, Text, Input } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import { Context as BasicDataContext } from "./../context/BasicDataContext";
import { Context as PhotoAlbumContext } from "./../context/PhotoAlbumContext";
import { GUI, STRING } from "./../hooks/useTools";
import { STYLES, IMAGES, CONST } from "../config/default";
import { LANGUAGES } from "../config/languages";
import Flag from "react-native-flags";
import AudioPlayer from "./../hooks/AudioPlayer";
import BasicData from "./../classes/BasicData";
import DropDownInput from "./../components/DropDownInput";

const SettingsScreen = ({ navigation }) => {
  const { state: photoAlbum, clearErrorMessage, saveSettings, clearContext } = useContext(PhotoAlbumContext);
  const { state: basicData, resetBasicData, updateDomain } = useContext(BasicDataContext);
  const isFirstRun = useRef(true);
  const [userId, setUserId] = useState(photoAlbum.settings?.userId || "");
  const [imageSize, setImageSize] = useState(photoAlbum.settings?.imageSize || null);
  const [goBack, setGoBack] = useState(false);
  const [expendResolution, setExpendResolution] = useState(false);
  const [expendLanguage, setExpendLanguage] = useState(false);
  const [isUserIdValid, setIsUserIdValid] = useState(true);
  const userIdInput = useRef();
  const [message, setMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [country, setCountry] = useState(LANGUAGES.getLanguage());

  const [categories, setCategories] = useState([]);
  const [categoriesUpdated, setCategoriesUpdated] = useState(false);
  const [resolutionOpen, setResolutionOpen] = useState(false);
  const [resolutionValue, setResolutionValue] = useState(imageSize);
  const [resolutionItems, setResolutionItems] = useState(basicData.filter(item => item.domain === "imageSize"));

  const [languageOpen, setLanguageOpen] = useState(false);
  const [languageValue, setLanguageValue] = useState(country);
  const [languageItems] = useState([
    { label: "Español", value: "ES", icon: () => <Flag code="ES" size={32} /> },
    { label: "English", value: "GB", icon: () => <Flag code="GB" size={32} /> },
    {
      label: "Français",
      value: "FR",
      icon: () => <Flag code="FR" size={32} />,
    },
  ]);

  useEffect(() => {
    isFirstRun.current = false;
    setCategories([...basicData.filter(item => item.domain === "category"), BasicData.Build("category", LANGUAGES.translate("New item"), "", "RW")].map(item => (item.mode === "RO" ? item : BasicData.Build(item.domain, `(*) ${item.label}`, item.value, item.mode))));
  }, []);

  useEffect(() => {
    if (isFirstRun.current) return;
    if (!isUserIdValid) {
      userIdInput.current.shake();
      userIdInput.current.focus();
    }
  }, [isUserIdValid]);

  useEffect(() => {
    if (!goBack) return;
    const timeout = setTimeout(() => {
      navigation.goBack();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [goBack]);

  return (
    <View style={STYLES.container}>
      <GUI.ModalActivityIndicator visible={isBusy} />
      <ImageBackground source={IMAGES.SettingsScreen_imageBackground} style={STYLES.image}>
        <GUI.Spacer
          style={{
            borderWidth: 1,
            borderRadius: 3,
            elevation: 3,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            height: "90%",
          }}>
          <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20 }} showsVerticalScrollIndicator={false}>
            <Input
              label={LANGUAGES.translate("Name")}
              value={userId}
              onChangeText={text => setUserId(text.substring(0, 35))}
              ref={userIdInput}
              onSubmitEditing={() => {
                Keyboard.dismiss();
                setResolutionOpen(true);
              }}
              blurOnSubmit={false}
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={{ marginBottom: 0, marginLeft: -20 }}
              leftIcon={{
                type: "AntDesign",
                name: "mail",
                color: "rgba(0, 0, 0, 0.38)",
                size: 25,
              }}
              placeholder={LANGUAGES.translate("Your Name")}
              errorMessage={isUserIdValid ? null : LANGUAGES.translate("Please enter at least %d characters", 5)}
            />

            <DropDownInput ddiDomain="category" ddiItems={categories} setDdiItems={setCategories} setDdiUpdated={setCategoriesUpdated} />

            <Text style={STYLES.label}>{LANGUAGES.translate("Resolution")}</Text>

            <DropDownPicker
              open={resolutionOpen}
              value={resolutionValue}
              items={resolutionItems}
              setOpen={setResolutionOpen}
              setValue={setResolutionValue}
              setItems={setResolutionItems}
              placeholder={LANGUAGES.translate("Select an item")}
              containerStyle={{ height: 40, width: "100%" }}
              dropDownMaxHeight={120}
              onOpen={() => setExpendResolution(true)}
              onClose={() => setExpendResolution(false)}
              onChangeValue={selectedValue => {
                setImageSize(selectedValue);
                setLanguageOpen(true);
              }}
            />
            <GUI.Spacer style={{ height: expendResolution ? 120 : 0 }} />

            <Text style={STYLES.label}>{LANGUAGES.translate("Language")}</Text>
            <DropDownPicker
              open={languageOpen}
              value={languageValue}
              items={languageItems}
              setOpen={setLanguageOpen}
              setValue={setLanguageValue}
              containerStyle={{ height: 40, width: "100%" }}
              labelStyle={{ alignSelf: "center", color: "#000" }}
              dropDownMaxHeight={120}
              placeholder={LANGUAGES.translate("Select an item")}
              onOpen={() => setExpendLanguage(true)}
              onClose={() => setExpendLanguage(false)}
              onChangeValue={async selectedValue => {
                setCountry(selectedValue);
                await LANGUAGES.setLanguage(selectedValue);
                setMessage(LANGUAGES.translate("Language set to %s, please restart the application", selectedValue));
                AudioPlayer.playSound("blip");
              }}
            />
            <GUI.Spacer style={{ height: expendLanguage ? 120 : 0 }} />

            {message ? <Text style={STYLES.errorMessage}>{message}</Text> : null}

            <GUI.Spacer />
            <Button
              raised
              containerStyle={STYLES.button}
              buttonStyle={STYLES.button}
              titleStyle={STYLES.textButton}
              disabledStyle={STYLES.buttonDisabled}
              title={LANGUAGES.translate("Save")}
              disabled={goBack}
              onPress={async () => {
                setIsUserIdValid(true);
                setMessage("");
                setIsBusy(true);
                // save the userId & imageSize settings & reset the category settings if the categories where updated and referenced category deleted
                const status = await saveSettings({
                  userId,
                  imageSize,
                  category: categoriesUpdated && photoAlbum.settings?.category && !categories.some(item => item.value === photoAlbum.settings.category) ? CONST.defaultCategory : null,
                });
                setIsBusy(false);
                if (!status.succeed) {
                  Vibration.vibrate(50);
                  setMessage(LANGUAGES.translate(status.message));
                  setIsUserIdValid(!status.invalidFields.includes("userId"));
                } else {
                  if (categoriesUpdated) {
                    await updateDomain(
                      "category",
                      categories.filter(item => item.value && item.mode === "RW").map(item => BasicData.Build(item.domain, item.value, item.value, item.mode))
                    );
                  }
                  setMessage(LANGUAGES.translate("Configuration Saved"));
                  setGoBack(true);
                }
              }}
            />

            {photoAlbum.settings?.userId === CONST.adminId && (
              <>
                <GUI.Spacer />
                <Button
                  raised
                  containerStyle={STYLES.button}
                  buttonStyle={STYLES.button}
                  titleStyle={STYLES.textButton}
                  title="Reset"
                  onPress={async () => {
                    await clearContext();
                    await LANGUAGES.clearPersistence();
                    await resetBasicData();
                    setMessage(LANGUAGES.translate("Configuration Reset"));
                    setGoBack(true);
                  }}
                />
              </>
            )}
            <GUI.Spacer />
            <Text>{LANGUAGES.translate("Version %s", CONST.version)}</Text>
          </ScrollView>
        </GUI.Spacer>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({});

export default SettingsScreen;
