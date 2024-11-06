
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Device from 'expo-device';
import {Platform} from "react-native";

export default (noPermissionCallback) => {
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        let status;
        if (Device.osName === 'iOS') {
            // Request permissions for both camera and media library on iOS
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            status = cameraStatus.status === 'granted' && mediaLibraryStatus.status === 'granted' ? 'granted' : 'denied';
        } else {
            // On Android, request media library permissions only
            const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            status = mediaLibraryStatus.status;
        }

        setHasPermission(status === 'granted');
        if (status !== 'granted' && noPermissionCallback) noPermissionCallback();
    };

    const takeOrPickupPhoto = async (onSubmit, takePhoto = true, imageWidth) => {
        if (hasPermission) {
            let image = takePhoto
              ? await ImagePicker.launchCameraAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: Platform.OS !== 'ios', // disables editing on iOS
                  aspect: [4, 3],
                  quality: 0.8,
                  base64: true,
              })
              : await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.All,
                  allowsEditing: Platform.OS !== 'ios', // disables editing on iOS
                  aspect: [4, 3],
                  quality: 0.8,
                  base64: true,
              });

            if (!image.canceled) {
                if (imageWidth && imageWidth > 0) {
                    image = await ImageManipulator.manipulateAsync(
                      image.assets[0].uri,
                      [{ resize: { width: imageWidth } }],
                      { base64: true }
                    );

                    // -- crop the image 4/3
                    // image = await ImageManipulator.manipulateAsync(
                    //   image.uri,
                    //   [{ crop: { originX: 0, originY: 0, width: image.width, height: image.width * (3 / 4) } }],
                    //   { base64: true }
                    // );
                }
                onSubmit(image);
            }
        }
    };

    return [takeOrPickupPhoto];
};
