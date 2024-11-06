import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as firebase from "firebase";
import AudioPlayer from "./src/hooks/AudioPlayer";
import soundLibrary from "./src/config/soundLibrary";

import firebaseConfig from "./src/config/firebase.config";
import { COLORS, CONST } from "./src/config/default";

import SplashScreenComponent from "./src/screens/SplashScreen";
import PhotoScreen from "./src/screens/PhotoScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import HeaderRight from "./src/components/HeaderRight";

import { Provider as PhotoAlbumProvider, Context as PhotoAlbumContext } from "./src/context/PhotoAlbumContext";
import { Provider as BasicDataProvider } from "./src/context/BasicDataContext";
import { setNavigator } from "./src/hooks/navigationRef";
import { LANGUAGES } from "./src/config/languages";
import { LOG } from "./src/hooks/useTools";

LogBox.ignoreLogs(["Setting a timer"]);

const Stack = createNativeStackNavigator();

function MainFlow() {
  return (
    <Stack.Navigator
      initialRouteName="Photo"
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.backgroundColor },
        headerTintColor: COLORS.backgroundTextColor,
        headerTitleStyle: { textAlign: "center" },
      }}>
      <Stack.Screen
        name="Photo"
        component={PhotoScreen}
        options={{
          title: "Photo Album",
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { state: photoAlbum } = useContext(PhotoAlbumContext);

  useEffect(() => {
    if (!photoAlbum?.settings?.userId) return;
    LOG.activate(photoAlbum.settings.userId === CONST.adminId);
  }, [photoAlbum.settings]);

  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreenComponent} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainFlow} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const loadResourcesAsync = async () => {
  try {
    LOG.console("Loading resources...");

    await AudioPlayer.initializeAudio();
    const soundLoadPromises = AudioPlayer.load(soundLibrary);

    if (!firebase.apps.length) {
      LOG.console("Initializing Firebase", firebaseConfig);
      firebase.initializeApp(firebaseConfig);
    }

    // Await all resource promises
    await Promise.all([...soundLoadPromises, LANGUAGES.restore()]);

    LOG.console("Resources loaded successfully");
  } catch (error) {
    LOG.warn("Error loading resources", error);
  }
};

export default function App() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadResourcesAsync();
      } catch (e) {
        LOG.console(e);
      } finally {
        setIsLoadingComplete(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <PhotoAlbumProvider>
      <BasicDataProvider>
        <NavigationContainer ref={navigator => setNavigator(navigator)}>
          <RootNavigator />
        </NavigationContainer>
      </BasicDataProvider>
    </PhotoAlbumProvider>
  );
}
