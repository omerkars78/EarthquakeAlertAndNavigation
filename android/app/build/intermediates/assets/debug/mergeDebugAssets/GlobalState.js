import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {Alert} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import RNFetchBlob from 'rn-fetch-blob';
// import DeviceInfo from 'react-native-device-info';
import {stringToBytes} from 'convert-string';
import Db from '../db/db.js';
import {PERMISSIONS, RESULTS, requestMultiple} from 'react-native-permissions';
import {PermissionsAndroid, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

async function requestPermissions() {
  let isGranted = false;
  try {
    if (Platform.OS === 'android') {
      const apiLevel = await DeviceInfo.getApiLevel();

      if (apiLevel <= 31) {
        // Android 11 and below
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Konum ve Bluetooth Erişim İzni',
            message:
              'Uygulama, konum ve Bluetooth özelliklerini kullanmak için izin gerektirir.',
            buttonNegative: 'İptal',
            buttonPositive: 'Tamam',
          },
        );

        if (apiLevel >= 29) {
          // Android 10 and above
          const backgroundGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: 'Arka Plan Konum Erişim İzni',
              message:
                'Uygulama, arka plan konum özelliklerini kullanmak için izin gerektirir.',
              buttonNegative: 'İptal',
              buttonPositive: 'Tamam',
            },
          );

          isGranted = backgroundGranted === PermissionsAndroid.RESULTS.GRANTED;
        }

        isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 12 and above
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        ]);

        isGranted =
          result['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_CONNECT'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_ADVERTISE'] ===
            PermissionsAndroid.RESULTS.GRANTED;
      }
    } else {
      console.log(
        'Bu işletim sistemi Android değil, bu yüzden izinleri istemiyoruz',
      );
    }
  } catch (err) {
    console.warn(err);
  }

  if (isGranted) {
    console.log('Izinler verildi');
  } else {
    console.log('Izinlerde sikinti var');
  }

  return isGranted;
}

const manager = new BleManager();
const defaultDeviceName = 'POI';
const defaultDeviceRssi = -1;
const dbInstance = new Db();

// Bluetooth İzinleri Kontrol Ediyoruz
manager.onStateChange(async state => {
  if (state === 'PoweredOn') {
    console.log('Bluetooth açık.');

    // Veritabanındaki check değerini alıyoruz
    const checkValue = await dbInstance.getDefaultCheckValue();

    // Eğer check değeri 0 ise, Bluetooth izni istiyoruz
    if (checkValue === 0) {
      requestPermissions();
    }
  } else {
    console.log('Bluetooth kapalı.');
    requestPermissions();
  }
}, true);

export const GlobalSelectContext = createContext();

export const department = [
  {name: 'Lütfen varış Yeri Seçiniz', major: '0', minor: '0'},
  {name: 'Vahap Tecim', major: '4', minor: '102'},
  {name: 'Ybs Sekreterlik', major: '4', minor: '103'},
  {name: 'Deneme', major: '1', minor: '40'},
];

export const arrow = [
  {name: 'dot-fill'},
  {name: 'arrow-up'},
  {name: 'arrow-left'},
  {name: 'arrow-right'},
  {name: 'arrow-down'},
  {name: 'x'},
  {name: 'fold-up'},
  {name: 'fold-down'},
];

export const GlobalProvider = props => {
  const [bgColor, setBgColor] = useState('#ff7800');
  // const [bgColor, setBgColor] = useState('#0000ff');
  const [selected, setSelected] = useState(department[0]);
  const [selectedArrow, setSelectedArrow] = useState(arrow[0].name);
  const [minRssiDevice, setMinRssiDevice] = useState({
    rssi: 0,
    major: 0,
    minor: 0,
  });
  const [text, setText] = useState('Hoşgeldiniz Lütfen Hedefinizi Seçiniz');

  let startMajor = String(minRssiDevice.major);
  let startMinor = String(minRssiDevice.minor);
  let finishMajor = String(selected.major);
  let finishMinor = String(selected.minor);
  let params = [startMajor, startMinor, finishMajor, finishMinor];

  const [buttonText, setButtonText] = useState('Rota Oluştur');
  const [buttonBgColor, setButtonBgColor] = useState('white');
  const [buttonTextColor, setButtonTextColor] = useState('black');

  const matchedDataRef = useRef([]);
  const [matchedData, setMatchedData] = useState([]);
  const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);
  const [restartApp, setRestartApp] = useState(false);
  const intervalIdRef = useRef(null);
  const [isRoutingRunning, setIsRoutingRunning] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const routing = useCallback(() => {
    setIsRoutingRunning(true);
    for (const element of matchedDataRef.current) {
      if (
        element.curMajor.toString() === minRssiDevice.major.toString() &&
        element.curMinor.toString() === minRssiDevice.minor.toString()
      ) {
        console.log('yönlendirme başladı');
        setText(element.nextText);
        setSelectedArrow(element.nextDirection);
        setBgColor('blue');
      }
      if (
        element.finishMajor.toString() === minRssiDevice.major.toString() &&
        element.finishMinor.toString() === minRssiDevice.minor.toString()
      ) {
        console.log('yönlendirme başarılı');
        setText('Hedefe Ulaştınız');
        setSelectedArrow('dot-fill');
        setBgColor('#00c957');
        break;
      }
    }
  }, [minRssiDevice]);

  // Hedefe ulaştıktan sonra 3 saniye bekleyip uygulamayı yeniden başlatan useEffect
  useEffect(() => {
    if (setText === 'Hedefe Ulaştınız' || bgColor === '#00c957') {
      setTimeout(() => {
        setRestartApp(true);
      }, 1500);
    }
  });

  // Rota yönlendirme aşamsında iken durdurma yapmak istersek kullanılacak fonksiyon
  function stopRouting() {
    clearInterval(intervalIdRef.current);
    manager.stopDeviceScan();
    setSelected(department[0]);
    setText('Hoşgeldiniz Lütfen Hedefinizi Seçiniz');
    setSelectedArrow(arrow[0].name);
    setBgColor('ff7800');
    setIsDepartmentSelected(false);
    setRestartApp(false);
    stopScanning();
    setIsRoutingRunning(false);
  }

  // Yeniden Başlatma İşlemlerini Yapan useEffect
  useEffect(() => {
    if (restartApp) {
      clearInterval(intervalIdRef.current);
      manager.stopDeviceScan();
      setSelected(department[0]);
      setText('Hoşgeldiniz Lütfen Hedefinizi Seçiniz');
      setSelectedArrow(arrow[0].name);
      setBgColor('ff7800');
      setIsDepartmentSelected(false);
      setRestartApp(false);
      stopScanning();
      setIsRoutingRunning(false);
    }
  }, [restartApp, manager, AuthOnPress]);

  function setBleData(rssi, major, minor) {
    if (
      (minRssiDevice.rssi === 0 ||
        Math.abs(rssi) < Math.abs(minRssiDevice.rssi)) &&
      rssi > -15
    ) {
      setMinRssiDevice({rssi, major, minor});
    } else if (Math.abs(rssi) === Math.abs(minRssiDevice.rssi) && rssi > -15) {
      setMinRssiDevice({rssi, major, minor});
    } else if (
      Math.abs(rssi - minRssiDevice.rssi) > 50 &&
      Math.abs(rssi) < Math.abs(minRssiDevice.rssi) &&
      rssi > -15
    ) {
      setMinRssiDevice({rssi, major, minor});
    }
  }

  // minRssiDevice güncellendiğinde routing fonksiyonunu çağıran useEffect
  useEffect(() => {
    if (minRssiDevice.rssi !== 0 && isDepartmentSelected) {
      console.log('Before routing:', matchedDataRef.current);
      routing();
      console.log('After routing:', matchedDataRef.current);
    }
  }, [minRssiDevice, routing, isDepartmentSelected]);

  // Tarama işlerini bir saniyede bir yapacağımız fonksiyon
  function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }

  // // Tarama İşlemlerini Yapan Fonksiyon
  // const scanForDevices = useCallback(async () => {
  //   const isPermissionGranted = await requestPermissions();

  //   if (isPermissionGranted) {
  //     console.log('Permissions are granted. Starting scanning...');

  //     let deviceFound = false;

  //     manager.startDeviceScan(null, null, (error, device) => {
  //       if (error) {
  //         console.log(error);
  //         // Hata mesajınız
  //         return;
  //       }
  //       else if (device.localName === defaultDeviceName) {
  //         deviceFound = true;

  //         const base64 = RNFetchBlob.base64;
  //         const advertisingData = stringToBytes(
  //           base64.decode(device.manufacturerData),
  //         );
  //         const rssi = device.rssi;
  //         const major = advertisingData[21];
  //         const minor = advertisingData[23];

  //         setBleData(rssi, major, minor);
  //         console.log(major, minor, rssi);
  //         // console.log(matchedDataRef.current);
  //       }
  //     });

  //     console.log('scanForDevices çalıştı');
  //   } else {
  //     console.log('İzin sorunu var çalışmıyor.');
  //   }
  // }, [setBleData]);

  const scanForDevices = useCallback(() => {
    let deviceFound = false;

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        // Hata mesajınız
        return;
      } else if (device.localName === defaultDeviceName) {
        deviceFound = true;

        const base64 = RNFetchBlob.base64;
        const advertisingData = stringToBytes(
          base64.decode(device.manufacturerData),
        );
        const rssi = device.rssi;
        const major = advertisingData[21];
        const minor = advertisingData[23];

        setBleData(rssi, major, minor);

        console.log(matchedDataRef.current);
      }
    });
  }, [setBleData]);

  // minRssidevice güncellenmiş değerlerini görmemize yarayan useEffect
  useEffect(() => {
    console.log(minRssiDevice);
  }, [minRssiDevice]);

  // Seçili bir yerin olup olmadığını kontrol eden fonksiyon
  const checkSelected = useCallback(() => {
    if (!selected || selected.name === department[0].name) {
      setIsDepartmentSelected(false);
      alert('Please Select Department');
    } else {
      setIsDepartmentSelected(true);
    }
  }, [selected, department]);

  // Seçili bir yerin olup olmadığını kontrol eden useEffect chechkSelected ı kontrol eder
  useEffect(() => {
    checkSelected();
  }, [checkSelected]);

  // Eşleşen verileri getiren fonksiyon
  useEffect(() => {
    async function fetchMatchedData() {
      const datas = await dbInstance.searchMatchedData(
        startMajor,
        startMinor,
        finishMajor,
        finishMinor,
      );
      if (datas.length > 0) {
        // Eğer gelen veri dolu bir array ise
        setMatchedData(datas); // state'i güncelle
      }
    }
    fetchMatchedData();
  }, [minRssiDevice]);

  // Bizi İlgilendiren Veri kümesini tutan useRef
  useEffect(() => {
    matchedDataRef.current = matchedData;
  }, [matchedData]);

  // Bir yer seçildiğinde o yere gitmemizi sağlayan fonksiyon
  const AuthOnPress = useCallback(() => {
    console.log('AuthOnPress is called');
    if (isDepartmentSelected && !isScanning) {
      console.log('AuthOnPress is called and enters the condition');
      setIsScanning(true);
      intervalIdRef.current = setInterval(() => {
        scanForDevices();

      }, 3000);
    }
  }, [isDepartmentSelected, isScanning]);

  const stopScanning = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      setIsScanning(false);
    }
  }, []);

  // Button.js te butonumuza bağlı olan fonksiyon
  const handleButtonPress = useCallback(() => {
    if (!isDepartmentSelected) {
      alert('Please select a department.');
    } else {
      AuthOnPress();
    }
  }, [isDepartmentSelected, AuthOnPress]);

  return (
    <GlobalSelectContext.Provider
      value={{
        selected: selected,
        department: department,
        bgColor: bgColor,
        selectedArrow: selectedArrow,
        arrow: arrow,
        text: text,
        matchedData: matchedData,
        buttonBgColor: buttonBgColor,
        buttonTextColor: buttonTextColor,
        buttonText: buttonText,
        isRoutingRunning: isRoutingRunning,
        dbInstance: dbInstance,
        setIsRoutingRunning,
        setSelected,
        AuthOnPress,
        scanForDevices,
        setSelectedArrow,
        setBgColor,
        setText,
        handleButtonPress,
        stopRouting,
        setButtonBgColor,
        setButtonText,
        setButtonTextColor,
        requestPermissions,
      }}>
      {props.children}
    </GlobalSelectContext.Provider>
  );
};
export default GlobalProvider;
