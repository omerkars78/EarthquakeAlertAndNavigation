import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import RNFetchBlob from 'rn-fetch-blob';
import { stringToBytes } from 'convert-string';
const manager = new BleManager();
export const AcilCikisContext = createContext();
const mainRoutes = [
  { startMajor: 0, startMinor: 1, finishMajor: 1, finishMinor: 40 }
];
const routes = [
  { mainRouteId: 1, curMajor: 0, curMinor: 1, nextMajor: 0, nextMinor: 2, nextDirection: 'arrow-up', nextText: '5 metre düz ilerleyin' },
  { mainRouteId: 1, curMajor: 1, curMinor: 40, nextMajor: 1, nextMinor: 10, nextDirection: 'arrow-left', nextText: 'Sağa dönün sonra sola dönün' },
  { mainRouteId: 1, curMajor: 1, curMinor: 10, nextMajor: 1, nextMinor: 40, nextDirection: 'arrow-left', nextText: 'İki metre ilerleyin' },
  { mainRouteId: 1, curMajor: 0, curMinor: 2, nextMajor: 0, nextMinor: 0, nextDirection: 'dot-fill', nextText: 'hedefe vardınız' }
];
export const AcilCikisProvider = props => {
  const [buttonText, setButtonText] = useState('Rota Oluştur');
  const [buttonBgColor, setButtonBgColor] = useState('white');
  const [buttonTextColor, setButtonTextColor] = useState('black');
  const [bgColor, setBgColor] = useState('#9370db');
  // const [bgColor, setBgColor] = useState('#00ff00');
  // const [selectedArrow, setSelectedArrow] = useState('dot-fill');
  const [selectedArrow, setSelectedArrow] = useState('dot-fill');
  const [minRssiDevice, setMinRssiDevice] = useState({
    rssi: 0,
    major: 0,
    minor: 0,
  });
  // const [text, setText] = useState('ACİL ÇIKIŞ');
  const [text, setText] = useState('ACİL ÇIKIŞ');
  const routing = useCallback(() => {
    for (const element of routes) {
      if (
        element.curMajor === minRssiDevice.major &&
        element.curMinor === minRssiDevice.minor
      ) {
        setText(element.nextText);
        setSelectedArrow(element.nextDirection);
        setBgColor('blue');
        if (
          element.nextMajor === minRssiDevice.major &&
          element.nextMinor === minRssiDevice.minor
        ) {
          setText('Hedefe Ulaştınız');
          setSelectedArrow('dot-fill');
          setBgColor('#00c957');
          break;
        }
      }
    }
  }, [minRssiDevice]);
  useEffect(() => {
    if (minRssiDevice.rssi !== 0 ) {
      routing();
    }
  }, [minRssiDevice, routing]);
  const setBleData = useCallback((rssi, major, minor) => {
    if (
      (minRssiDevice.rssi === 0 || Math.abs(rssi) < Math.abs(minRssiDevice.rssi)) &&
      rssi > -50
    ) {
      setMinRssiDevice({rssi, major, minor});
    } else if (
      Math.abs(rssi - minRssiDevice.rssi) > 50 &&
      Math.abs(rssi) < Math.abs(minRssiDevice.rssi) &&
      rssi > -50
      ) {
        setMinRssiDevice({rssi, major, minor});
      }
    }, [minRssiDevice]);
  
    const scanForDevices = useCallback(() => {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log(error);
          Alert.alert(
            'Error',
            'Lütfen bluetoothunuzu açıp kapatınız ve uygulamayı yeniden başlatınız',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          return;
        }
  
        const base64 = RNFetchBlob.base64;
        const advertisingData = stringToBytes(base64.decode(device.manufacturerData));
        const rssi = device.rssi;
        const major = advertisingData[21];
        const minor = advertisingData[23];
  
        setBleData(rssi, major, minor);
        console.log(minRssiDevice);
      });
    }, [setBleData]);
  
    useEffect(() => {
      console.log(minRssiDevice);
    }, [minRssiDevice]);
  
    const handleButtonPressAcil = useCallback(() => {
      console.log("basıldı");
      scanForDevices();
    }, [scanForDevices]);
  
    return (
      <AcilCikisContext.Provider
        value={{
          bgColor,
          selectedArrow,
          minRssiDevice,
          text,
          setText,
          buttonBgColor,
          setBgColor,
          setButtonBgColor,
          setButtonTextColor,
          setButtonText,
          buttonTextColor,
          buttonText,
          handleButtonPressAcil
        }}>
        {props.children}
      </AcilCikisContext.Provider>
    );
  };
  
  export default AcilCikisProvider;