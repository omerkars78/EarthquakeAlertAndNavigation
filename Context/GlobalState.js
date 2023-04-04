import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  Alert,
} from 'react';
import {BleManager} from 'react-native-ble-plx';
import RNFetchBlob from 'rn-fetch-blob';
import {stringToBytes} from 'convert-string';
import Db from '../db/db.js';

const manager = new BleManager();
const defaultDeviceName = 'POI';
const defaultDeviceRssi = -1;
const db = new Db();

export const GlobalSelectContext = createContext();

export const department = [
  {name: 'Please Select', major: 0, minor: 0},
  {name: 'Cardiology', major: '1', minor: '15'},
  {name: 'Dermatology', major: 1, minor: 37},
  {name: 'ENT', major: 1, minor: 38},
  {name: 'Internal Medicine', major: 1, minor: 39},
  {name: 'Endocrinology', major: 1, minor: 49},
  {name: 'General Surgery', major: '1', minor: '67'},
];

export const arrow = [
  {name: 'dot-fill'},
  {name: 'arrow-up'},
  {name: 'arrow-left'},
  {name: 'arrow-right'},
  {name: 'arrow-down'},
  {name: 'x'},
];

export const GlobalProvider = props => {
  const [bgColor, setBgColor] = useState('#0000ff');
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

  // Yönlendirme için kullanılan fonksiyon
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
      }, 1000);
    }
  });

  // Rota yönlendirme aşamsında iken durdurma yapmak istersek kullanılacak fonksiyon
  function stopRouting() {
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

  // En yakın cihazı bulan fonksiyon
  function setBleData(rssi, major, minor) {
    if (
      (minRssiDevice.rssi === 0 ||
        Math.abs(rssi) < Math.abs(minRssiDevice.rssi)) &&
      rssi > -100
    ) {
      setMinRssiDevice({rssi, major, minor});
    } else if (
      Math.abs(rssi) === Math.abs(minRssiDevice.rssi) &&
      rssi > minRssiDevice.rssi &&
      rssi > -100
    ) {
      setMinRssiDevice({rssi, major, minor});
    } else if (
      Math.abs(rssi) < 100 &&
      Math.abs(rssi) > Math.abs(minRssiDevice.rssi) &&
      rssi > -100
    ) {
      setMinRssiDevice({rssi, major, minor});
    }
  }

  // minRssiDevice güncellendiğinde routing fonksiyonunu çağıran useEffect
  useEffect(() => {
    if (minRssiDevice.rssi !== 0 && isDepartmentSelected) {
      routing();
    }
  }, [minRssiDevice, routing]);

  // Tarama İşlemlerini Yapan Fonksiyon
  // Tarama İşlemlerini Yapan Fonksiyon
  const scanForDevices = useCallback(() => {
    let deviceFound = false;

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

    setTimeout(() => {
      if (!deviceFound) {
        Alert.alert(
          'Uyarı',
          'Kapsam alanı dışındasınız, lütfen daha yakın bir konuma gidin.',
          [{text: 'Tamam', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
        setSelectedArrow('x');
        setBgColor('red');
      }
    }, 20000);

    console.log('scanForDevices is finished');
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
      if (minRssiDevice.major !== 0 && minRssiDevice.minor !== 0) {
        const datas = await db.searchMatchedData(
          startMajor,
          startMinor,
          finishMajor,
          finishMinor,
        );
        setMatchedData(datas);
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
    if (isDepartmentSelected) {
      console.log('AuthOnPress is called koşula giriyor');
      intervalIdRef.current = setInterval(() => {
        scanForDevices();
      }, 500);
    }
  }, [isDepartmentSelected]);

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
      }}>
      {props.children}
    </GlobalSelectContext.Provider>
  );
};
export default GlobalProvider;
