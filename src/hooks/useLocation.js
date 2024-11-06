
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default (noPermissionCallback) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [location, setLocation] = useState({
        address: undefined,
        city: undefined,
        isoCountryCode: undefined,
    });

    useEffect(() => {
        checkPermissions();
    }, []);

    useEffect(() => {
        if (hasPermission) refreshLocation();
    }, [hasPermission]);

    const checkPermissions = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status !== 'granted' && noPermissionCallback) {
            noPermissionCallback();
        }
    };

    const refreshLocation = async () => {
        if (hasPermission) {
            const location = await Location.getCurrentPositionAsync({});
            const addresses = await Location.reverseGeocodeAsync(location.coords);
            if (addresses && addresses.length > 0) {
                setLocation({
                    address: `${addresses[0].name} ${addresses[0].street}, ${addresses[0].postalCode} ${addresses[0].city} (${addresses[0].country})`,
                    city: addresses[0].city,
                    isoCountryCode: addresses[0].isoCountryCode,
                });
            }
        }
    };

    return [location, refreshLocation];
};
