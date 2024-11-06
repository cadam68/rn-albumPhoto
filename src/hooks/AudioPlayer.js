import { Audio } from "expo-av";
import { LOG } from "./../hooks/useTools";

// https://antenna.io/blog/2019/05/preload-and-replay-sounds-in-expo/
const soundObjects = {};

class AudioPlayer {
  static async initializeAudio() {}

  static load(library) {
    LOG.console(`preload sounds : ${Object.keys(library).join(", ")}`);
    const promisedSoundObjects = [];

    for (const name in library) {
      const sound = library[name];
      soundObjects[name] = new Audio.Sound();
      promisedSoundObjects.push(
        // soundObjects[name].loadAsync(sound, { shouldPlay: true, volume: 0 }) //!\ solve bug first playing
        soundObjects[name].loadAsync(sound)
      );
    }

    return promisedSoundObjects;
  }

  static async playSound(name) {
    try {
      if (soundObjects[name]) {
        soundObjects[name].replayAsync({ volume: 0.5 });
      }
    } catch (error) {
      LOG.warn(error);
    }
  }

  static async stopSound() {
    Object.entries(soundObjects).forEach(([key, soundObject]) => {
      soundObject.stopAsync();
    });
  }
}

export default AudioPlayer;
