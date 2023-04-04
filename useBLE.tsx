import {PermissionsAndroid, Platform} from 'react-native';

type PermissionCallback = (result: boolean) => void;

interface BluetoothLowEnergyApi {
  requestPermissions(callback: PermissionCallback): Promise<void>;
}

export default function useBLE(): BluetoothLowEnergyApi {
  const requestPermissions = async (callback: PermissionCallback) => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      const grantedStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Bluetooth needs access to your location to work properly',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      callback(true);
    }
  };

  return {
    requestPermissions,
  };
}
