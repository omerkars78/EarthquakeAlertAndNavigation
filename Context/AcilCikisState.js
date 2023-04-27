import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {Alert, PermissionsAndroid} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import RNFetchBlob from 'rn-fetch-blob';
import {stringToBytes} from 'convert-string';
import Db from '../db/db.js';

const manager = new BleManager();
const defaultDeviceName = 'POI';
const defaultDeviceRssi = -1;
const dbInstance = new Db();

export const AcilCikisContext = createContext();

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

export const AcilCikisProvider = props => {
  const [bgColor, setBgColor] = useState('#9370db');
  const [selectedArrow, setSelectedArrow] = useState(arrow[0].name);
  const [minRssiDevice, setMinRssiDevice] = useState({
    rssi: 0,
    major: 0,
    minor: 0,
  });
  const [text, setText] = useState('ACİL ÇIKIŞ');

  let startMajor = String(minRssiDevice.major);
  let startMinor = String(minRssiDevice.minor);
  let finishMajor = String(selected.major);
  let finishMinor = String(selected.minor);

  const [buttonText, setButtonText] = useState('Acil Çıkış Oluştur');
  const [buttonBgColor, setButtonBgColor] = useState('white');
  const [buttonTextColor, setButtonTextColor] = useState('black');
  const [isRoutingRunning, setIsRoutingRunning] = useState(false);

  const matchedDataRef = useRef([]);
  const [matchedData, setMatchedData] = useState([]);
  const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);
  const [restartApp, setRestartApp] = useState(false);
  const intervalIdRef = useRef(null);

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
    setText('Acil Çıkış');
    setSelectedArrow(arrow[0].name);
    setBgColor('#0000ff');
    setRestartApp(false);
    AuthOnPress();
    setIsRoutingRunning(false);
  }

  // Yeniden Başlatma İşlemlerini Yapan useEffect
  useEffect(() => {
    if (restartApp) {
      clearInterval(intervalIdRef.current);
      manager.stopDeviceScan();
      setText('Acil Çıkış');
      setSelectedArrow(arrow[0].name);
      setBgColor('#0000ff');
      setRestartApp(false);
      AuthOnPress();
      setIsRoutingRunning(false);

    }
  }, [restartApp, manager, AuthOnPress]);

  function setBleData(rssi, major, minor) {
    if (
      (minRssiDevice.rssi === 0 ||
        Math.abs(rssi) < Math.abs(minRssiDevice.rssi)) &&
      rssi > -100
    ) {
      setMinRssiDevice({rssi, major, minor});
    } else if (Math.abs(rssi) === Math.abs(minRssiDevice.rssi) && rssi > -100) {
      setMinRssiDevice({rssi, major, minor});
    } else if (
      Math.abs(rssi - minRssiDevice.rssi) > 50 &&
      Math.abs(rssi) < Math.abs(minRssiDevice.rssi) &&
      rssi > -100
    ) {
      setMinRssiDevice({rssi, major, minor});
    }
  }

  // minRssiDevice güncellendiğinde routing fonksiyonunu çağıran useEffect
  useEffect(() => {
    if (minRssiDevice.rssi !== 0 ) {
      routing();
    }
  }, [minRssiDevice, routing]);


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


    console.log('scanForDevices is finished');
  }, [setBleData]);

  // minRssidevice güncellenmiş değerlerini görmemize yarayan useEffect
  useEffect(() => {
    console.log(minRssiDevice);
  }, [minRssiDevice]);
// Eşleşen verileri getiren fonksiyon
useEffect(() => {
    async function fetchMatchedData() {
      
        const datas = await dbInstance.searchMatchedData(
          startMajor,
          startMinor,
          finishMajor,
          finishMinor,
        );
        setMatchedData(datas);
      
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

      console.log('AuthOnPress is called koşula giriyor');
      intervalIdRef.current = setInterval(() => {
        scanForDevices();
      }, 500);
   
  }, []);
  const handleButtonPressAcil = useCallback(() => {

    AuthOnPress();
    dbInstance.getAllRoutes();
    dbInstance.getAllMainRoutes();

}, []);
  return (
    <AcilCikisContext.Provider
      value={{
        bgColor,
        setBgColor,
        selectedArrow,
        setSelectedArrow,
        minRssiDevice,
        setMinRssiDevice,
        text,
        setText,
        buttonText,
        buttonBgColor,
        buttonTextColor,
        stopRouting,
        setButtonBgColor,
        setButtonText,
        setButtonTextColor,
        isRoutingRunning,
        handleButtonPressAcil,
      }}>
      {props.children}
    </AcilCikisContext.Provider>
  );
};

export default AcilCikisProvider;
