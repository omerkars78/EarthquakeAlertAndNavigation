import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  } from 'react';
import {Alert,PermissionsAndroid} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import RNFetchBlob from 'rn-fetch-blob';
import {stringToBytes} from 'convert-string';
import Db from '../db/db.js';

async function requestBluetoothPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Bluetooth Erişim İzni',
        message: 'Uygulama, Bluetooth özelliğini kullanmak için izin gerektirir.',
        buttonNegative: 'İptal',
        buttonPositive: 'Tamam',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Bluetooth erişim izni verildi.');
    } else {
      console.log('Bluetooth erişim izni reddedildi.');
    }
  } catch (err) {
    console.warn(err);
  }
}

const manager = new BleManager();
const defaultDeviceName = 'POI';
const defaultDeviceRssi = -1;
const dbInstance = new Db();


// Bluetooh İzinleri Kontrol Ederiz
// Bluetooth İzinleri Kontrol Ediyoruz
manager.onStateChange(async (state) => {
  if (state === 'PoweredOn') {
    console.log('Bluetooth açık.');

    // Veritabanındaki check değerini alıyoruz
    const checkValue = await dbInstance.getDefaultCheckValue();

    // Eğer check değeri 0 ise, Bluetooth izni istiyoruz
    if (checkValue === 0) {
      requestBluetoothPermission();
    }
  } else {
    console.log('Bluetooth kapalı.');
    requestBluetoothPermission();
  }
}, true);


export const GlobalSelectContext = createContext();

export const department = [
  {name: 'Lütfen varış Yeri Seçiniz', major: '0', minor: '0'},
  {name: 'Vahap Tecim', major: '1', minor: '40'},
  {name: 'Ybs Sekreterlik', major: '4', minor: '103'},
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
  const [bgColor, setBgColor] = useState('#9370db');
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


  // Yönlendirme İşlemini Yapıyoruz 
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
    }
  }, [minRssiDevice]);
  
 
  // Hedefe ulaştıktan sonra 3 saniye bekleyip uygulamayı yeniden başlatan useEffect
  useEffect(() => {
    if (setText === 'Hedefe Ulaştınız' || bgColor === '#00c957') {
      setTimeout(() => {
        setRestartApp(true);
      }, 3000);
    }
  });

  // Rota yönlendirme aşamsında iken durdurma yapmak istersek kullanılacak fonksiyon
  function stopRouting() {
    clearInterval(intervalIdRef.current);
    manager.stopDeviceScan();
    setSelected(department[0]);
    setText('Hoşgeldiniz Lütfen Hedefinizi Seçiniz');
    setSelectedArrow(arrow[0].name);
    setBgColor('#9370db');
    setRestartApp(false);
    AuthOnPress();
    setIsRoutingRunning(false); // Durum değerini false olarak ayarlayın
    
  }

  // Yeniden Başlatma İşlemlerini Yapan useEffect
  useEffect(() => {
    if (restartApp) {
      clearInterval(intervalIdRef.current);
      manager.stopDeviceScan();
      setSelected(department[0]);
      setText('Hoşgeldiniz Lütfen Hedefinizi Seçiniz');
      setSelectedArrow(arrow[0].name);
      setBgColor('#0000ff');
      setIsDepartmentSelected(false);
      setRestartApp(false);
      AuthOnPress();
      setIsRoutingRunning(false);
      // console.log(restartApp);
      // console.log(isDepartmentSelected);
    }
  }, [restartApp, manager, AuthOnPress]);


  function setBleData(rssi, major, minor) {
    if (
      (minRssiDevice.rssi === 0 ||
        Math.abs(rssi) < Math.abs(minRssiDevice.rssi)) &&
      rssi > -35
    ) {
      setMinRssiDevice({rssi, major, minor});
    } else if (
      Math.abs(rssi) === Math.abs(minRssiDevice.rssi) &&
      rssi > -35
    ) {
      setMinRssiDevice({rssi, major, minor});
    } else if (
      Math.abs(rssi - minRssiDevice.rssi) > 35 &&
      Math.abs(rssi) < Math.abs(minRssiDevice.rssi) &&
      rssi > -35
    ) {
      setMinRssiDevice({rssi, major, minor});
    }
  }
  
 // minRssiDevice güncellendiğinde routing fonksiyonunu çağıran useEffect
  useEffect(() => {
    if (minRssiDevice.rssi !== 0 && isDepartmentSelected) {
      routing();
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
  // Tarama İşlemlerini Yapan Fonksiyon
  const scanForDevices = useCallback(() => {
    const debouncedScan = debounce(() => {
      let deviceFound = false;
  
      manager.stopDeviceScan(); // Taramayı durdurun
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
        if (device.localName === defaultDeviceName) {
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
  
      console.log('scanForDevices is finished');
    }, 500);
  
    debouncedScan();
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
      if (isRoutingRunning) { // isRoutingRunning durumunu kontrol edin
        const datas = await dbInstance.searchMatchedData(
          startMajor,
          startMinor,
          finishMajor,
          finishMinor,
        );
        setMatchedData(datas);
      }
    }
    fetchMatchedData();
  }, [minRssiDevice,isRoutingRunning]);

  // Bizi İlgilendiren Veri kümesini tutan useRef
  useEffect(() => {
    matchedDataRef.current = matchedData;
  }, [matchedData]);

  // Bir yer seçildiğinde o yere gitmemizi sağlayan fonksiyon
  const AuthOnPress = useCallback(() => {
    console.log('AuthOnPress is called');
    if (isDepartmentSelected && !isRoutingRunning) { // Durum değeri false ise koşula girin
      console.log('AuthOnPress is called koşula giriyor');
      intervalIdRef.current = setInterval(() => {
        scanForDevices();
      }, 500);
      setIsRoutingRunning(true);
    }
  }, [isDepartmentSelected, isRoutingRunning]);

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
        requestBluetoothPermission
      }}>
      {props.children}
    </GlobalSelectContext.Provider>
  );
};
export default GlobalProvider;

