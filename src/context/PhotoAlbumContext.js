import createDataContext from "./createDataContext";
import Settings from "./../classes/Settings";
import Stats from "./../classes/Stats";
import { STORAGE } from "./../hooks/useTools";
import * as firebase from "firebase";
import * as MediaLibrary from "expo-media-library";
import { MATH, STRING, LOG } from "./../hooks/useTools";
import { CONST } from "./../config/default";
import firebaseConfig from "./../config/firebase.config";
import { sprintf } from "sprintf-js";

const photoAlbumReducer = (state, action) => {
  switch (action.type) {
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "save_settings":
      return { ...state, settings: action.payload };
    case "save_stats":
      return { ...state, stats: action.payload };
    case "set_current_photo":
      // payload = {photo, originPhoto}
      return { ...state, currentPhoto: action.payload.photo, originPhoto: action.payload.originPhoto };
    case "clear_context":
      return { errorMessage: "", settings: new Settings({ imageSize: CONST.defaultImageSize, category: CONST.defaultCategory }), stats: new Stats(), currentPhoto: null, originPhoto: null, photos: [] };
    case "send_current_photo":
      // payload = {storageUrl, stats}
      return { ...state, stats: action.payload.stats, currentPhoto: null, originPhoto: null, photos: [...state.photos, action.payload.storageUrl] };
    default:
      return state;
  }
};

// ------

const validateUserId = userId => {
  const validUserId = new RegExp("^[ .a-zA-Z-0-9]+$");
  return userId.length >= 5 && validUserId.test(userId);
};

// ------

const init = dispatch => async () => {
  loadSettings(dispatch)();
  loadStats(dispatch)();
};

const loadSettings = dispatch => async () => {
  try {
    LOG.console("- load Settings -");
    let settings = await STORAGE.getItem("settings");
    if (!settings) {
      settings = new Settings({ imageSize: CONST.defaultImageSize, category: CONST.defaultCategory });
      await STORAGE.setItem("settings", settings);
    } else settings = new Settings(settings);
    LOG.console(`- loading ${settings.toString()}`);
    dispatch({ type: "save_settings", payload: settings });
  } catch (err) {
    LOG.console(err);
  }
};

const loadStats = dispatch => async () => {
  try {
    LOG.console("- load Stats -");
    let stats = await STORAGE.getItem("stats");
    if (!stats) {
      stats = new Stats();
      await STORAGE.setItem("stats", stats);
    } else stats = new Stats(stats);
    if (stats.lastPhotoSentDate) {
      // actualise the food since the last sent
      let food = 0;
      try {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        let diffDays = Math.abs((new Date().setHours(0, 0, 0) - stats.lastPhotoSentDate) / oneDay);
        food = stats.food - Math.floor((diffDays * CONST.nbPhotoPerMonth) / 30);
      } catch (error) {}
      stats = new Stats({ ...stats, food: food > 0 ? food : 0 });
    }
    LOG.console(`- loading ${stats.toString()}`);
    dispatch({ type: "save_stats", payload: stats });
  } catch (err) {
    LOG.console(err);
  }
};

const saveSettings = dispatch => async settings => {
  let status = { succeed: true, message: "", invalidFields: [] };
  let { userId, imageSize, category } = settings;
  let settingsKeys = Object.keys(settings);
  try {
    LOG.console(`saveSettings(userId=[${userId}], imageSize=[${imageSize}], category=[${category}]`);
    if (settingsKeys.indexOf("userId") != -1) {
      userId = userId ? userId.trim() : "";
      if (!validateUserId(userId)) status.invalidFields.push("userId");
    }
    if (status.invalidFields.length > 0) return { ...status, succeed: false };

    let settings = await STORAGE.getItem("settings");
    settings = settings ? new Settings(settings) : new Settings();
    if (userId) settings.userId = userId;
    if (imageSize) settings.imageSize = imageSize;
    if (category) settings.category = category;
    // LOG.console('save', settings)
    await STORAGE.setItem("settings", settings);
    dispatch({ type: "save_settings", payload: settings });
    status = { ...status, message: "Saved" };
  } catch (err) {
    // we need to reflect an error message somewhere
    LOG.console(err);
    let errMsg = "Something went wrong...";
    status = { ...status, succeed: false, message: errMsg };
  }
  return status;
};

const saveStats = dispatch => async stats => {
  LOG.console("save stats", stats);
  try {
    await STORAGE.setItem("stats", stats);
    dispatch({ type: "save_stats", payload: stats });
  } catch (err) {
    // we need to reflect an error message somewhere
    LOG.console(err);
  }
};

const clearContext = dispatch => async () => {
  try {
    // let allKeys = await STORAGE.getAllKeys();
    // LOG.console(allKeys);
    await STORAGE.removeItem("settings");
    await STORAGE.removeItem("stats");
    dispatch({ type: "clear_context" });
  } catch (err) {
    LOG.console(err);
  }
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: "clear_error_message" });
};

const setCurrentPhoto = dispatch => async (image, originPhoto) => {
  LOG.console(`setCurrentPhoto(${image.uri}, ${originPhoto})`);
  LOG.console(`image{ width=${image.width}, height=${image.height}, size=${image.base64.length} }`);
  dispatch({ type: "set_current_photo", payload: { photo: image.uri, originPhoto } });
};

const uploadImageAsync = async (uri, imageName) => {
  // return null;    // IICI // DISEABLE DURING TAT

  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    // const storageRef = firebase.storage().ref().child(`images/${imageName}`);
    const storageRef = firebase.storage().ref().child(`${imageName}`);
    const uploadTask = storageRef.put(blob, { contentType: "image/jpeg" });

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        LOG.console(`Upload is ${progress}% done`);
      },
      error => {
        LOG.error("Upload failed:", error);
        reject(error);
      },
      () => {
        // Upload completed successfully, get the download URL
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then(downloadURL => {
            resolve(downloadURL);
          })
          .catch(error => {
            LOG.error("Failed to retrieve download URL:", error);
            reject(error);
          });
      }
    );
  });
};

/*
const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = firebase.storage().ref().child("public/images/" + imageName);
    return ref.put(blob, { contentType: 'image/jpeg' });
}
*/

const sendCurrentPhoto = dispatch => async (state, location) => {
  let status = { succeed: true, message: "" };
  try {
    // let imageName = `${STRING.clean(state.settings.category)}/${STRING.clean(state.settings.userId)}_${MATH.date2str(new Date(), 'yyyyMMddhhmmss')}.jpg`;

    let param = {
      userId: STRING.clean(STRING.toTitleCase(state.settings.userId)),
      category: STRING.noSpaces(STRING.toTitleCase(state.settings.category)),
      isoCountryCode: location.isoCountryCode ? location.isoCountryCode : "NA",
      city: state.originPhoto == "take" ? (location.city ? STRING.clean(STRING.toTitleCase(location.city)) : "NA") : "NA",
      date: MATH.date2str(new Date(), "yyyyMMdd_hhmmss"),
    };
    let imageRepository = sprintf(firebaseConfig.imageRepository, param);
    let imageName = sprintf(firebaseConfig.imageName, param);

    // save image to photo gallery
    if (state.originPhoto == "take") {
      LOG.console("save photo to photoAlbum");
      await MediaLibrary.saveToLibraryAsync(state.currentPhoto);
    }

    let storageUrl = await uploadImageAsync(state.currentPhoto, `${imageRepository}/${imageName}`);
    LOG.console(storageUrl);

    let stats = new Stats({ nbPhotoSent: state.stats.nbPhotoSent + 1, food: state.stats.food > 2 * CONST.nbPhotoPerMonth ? state.stats.food : state.stats.food + 1, lastPhotoSentDate: new Date().setHours(0, 0, 0) });
    await STORAGE.setItem("stats", stats);

    dispatch({ type: "send_current_photo", payload: { storageUrl, stats } });
  } catch (err) {
    LOG.console(err);
    let errMsg = err.code ? err.code : "Something went wrong...";
    status = { ...status, succeed: false, message: errMsg };
  }
  return status;
};

export const { Provider, Context } = createDataContext(photoAlbumReducer, { clearErrorMessage, saveSettings, saveStats, setCurrentPhoto, clearContext, sendCurrentPhoto }, { errorMessage: "", settings: new Settings(), stats: new Stats(), currentPhoto: null, originPhoto: null, photos: [] }, init);
