  // // veri tekrarı olmaması için useMemo kullanıyoruz
  // const setBleData = useMemo(
  //   () => (rssi, major, minor) => {
  //     if (
  //       minRssiDevice.rssi === 0 ||
  //       Math.abs(rssi) < Math.abs(minRssiDevice.rssi)
  //     ) {
  //       setMinRssiDevice({rssi, major, minor});
        
  //     }
  //   },
  //   [minRssiDevice.rssi],
  // );

  // // Match olan verileri tutmak için oluşturduğumuz state
  // const [matchedData, setMatchedData] = useState([]);
  // useEffect(() => {
  //   async function fetchMatchedData() {
  //     if (minRssiDevice.major !== 0 && minRssiDevice.minor !== 0) {
  //       const datas = await db.searchMatchedData(
  //         startMajor,
  //         startMinor,
  //         finishMajor,
  //         finishMinor,
  //       );
  //       setMatchedData(datas);
  //     }
  //   }
  
  //   fetchMatchedData();
  // }, [minRssiDevice]);


  // // Uygulamanın algoritmik bir şekilde renderlanıp çalışması için useEffect kullanıyoruz
  // useEffect(() => {
  //   AuthOnPress();
  //   return () => {
  //     manager.stopDeviceScan();
  //     console.log('kapandı');
  //   };
  // }, [minRssiDevice]);

  // // Çevredekileri tarayıp en yakın beacon'ı bulan fonksiyonumuz
  // function scanForDevices() {
  //   try {
  //     manager.startDeviceScan(null, null, (error, device) => {
  //       if (error) {
  //         console.log(error);
  //       }

  //       if (device.localName === defaultDeviceName) {
  //         if (device.rssi <= defaultDeviceRssi) {
  //           const base64 = RNFetchBlob.base64;
  //           const advertisingData = stringToBytes(
  //             base64.decode(device.manufacturerData),
  //           );

  //           const rssi = device.rssi;
  //           const name = device.localName;
  //           const major = advertisingData[21];
  //           const minor = advertisingData[23];

  //           setBleData(rssi, major, minor);
  //            console.log(matchedData);
            
  //           if (matchedData.length > 0) {
  //             routing();
  //           }
  //           console.log(minRssiDevice);
  //         } else {
  //           console.log('There is a beacon nearby...');
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // // Select Menüsünden birini seçtikten sonra çalışacak fonksiyonumuz
  // const AuthOnPress = () => {
  //   console.log(params);
  //   if (!selected || selected.name === department[0].name) {
  //     alert('Please Select Department');
  //   } else {
  //     scanForDevices();
  //   }
  // };

  // const matchedData = [
  //   {
  //     beforeDirection: 'arrowdown',
  //     beforeDistance: 10,
  //     beforeMajor: '1',
  //     beforeMinor: '40',
  //     curMajor: '1',
  //     curMinor: '15',
  //     finishMajor: '1',
  //     finishMinor: '67',
  //     id: 1,
  //     mainRouteId: 1,
  //     nextDirection: 'arrowup',
  //     nextDistance: 50,
  //     nextMajor: '1',
  //     nextMinor: '67',
  //     nextText: '50 Metre Düz İlerleyiniz',
  //     startMajor: '1',
  //     startMinor: '15',
  //   },
  //   {
  //     beforeDirection: 'arrowdown',
  //     beforeDistance: 10,
  //     beforeMajor: '1',
  //     beforeMinor: '15',
  //     curMajor: '1',
  //     curMinor: '67',
  //     finishMajor: '1',
  //     finishMinor: '67',
  //     id: 2,
  //     mainRouteId: 1,
  //     nextDirection: 'arrowdown',
  //     nextDistance: 50,
  //     nextMajor: '1',
  //     nextMinor: '67',
  //     nextText: '1000 Metre Düz İlerleyiniz',
  //     startMajor: '1',
  //     startMinor: '15',
  //   },
  // ];
  

  //   // Use useRef to prevent unnecessary re-renders of the matchedData state
  //   const matchedDataRef = useRef([]);
  //   const [matchedData, setMatchedData] = useState([]);
  //   // Yönlendirme İçin Çalışacak Olan Algoritma
  
  //   const routing = useCallback(() => {
  //     if (minRssiDevice.major !== 0 && minRssiDevice.minor !== 0 && matchedDataRef.current.length > 0) {
  //       for (let i = 0; i < matchedDataRef.current.length; i++) {
  //         const element = matchedDataRef.current[i];
          
  //         if (
  //           element.curMajor === minRssiDevice.major &&
  //           element.curMinor === minRssiDevice.minor
  //         ) {
  //           console.log('element', element.curMajor, element.curMinor);
  //           setText(element.nextText);
  //           setSelectedArrow(element.nextDirection);
  //           setBgColor('blue');
  //           console.log('yönlendirmeye başladı');
    
  //           if (
  //             element.finishMajor === minRssiDevice.major &&
  //             element.finishMinor === minRssiDevice.minor
  //           ) {
  //             setText('Hedefe Ulaştınız');
  //             setSelectedArrow('dot-fill');
  //             setBgColor('green');
  //             console.log('Yönlendirme başarılı', bgColor);
  //             break;
  //           } else {
  //             setSelectedArrow('x');
  //             setBgColor('red');
  //             setText('Lütfen Kapsam Alanı içerisine giriniz');
  //             console.log('yönlendirme başarısız');
  //           }
  //         }
  //       }
  //     }
  //   }, [scanForDevices]);
    
  
  //   // Use useCallback to prevent unnecessary re-renders of the setBleData function
  //   const setBleData = useCallback(
  //     (rssi, major, minor) => {
  //       if (
  //         minRssiDevice.rssi === 0 ||
  //         Math.abs(rssi) < Math.abs(minRssiDevice.rssi)
  //       ) {
  //         setMinRssiDevice({rssi, major, minor});
  //       }
  //     },
  //     [minRssiDevice],
  //   );
  
  
  
  //   // Use useEffect to update the matchedDataRef when the matchedData state changes
  //   useEffect(() => {
  //     matchedDataRef.current = matchedData;
  //   }, [matchedData]);
  
  //   // Use useCallback to prevent unnecessary re-renders of the scanForDevices function
  //   const scanForDevices = useCallback(() => {
  //     try {
  //       manager.startDeviceScan(null, null, (error, device) => {
  //         if (error) {
  //           console.log(error);
  //           return;
  //         }
  
  //         if (device.localName === defaultDeviceName) {
  //           if (device.rssi <= defaultDeviceRssi) {
  //             const base64 = RNFetchBlob.base64;
  //             const advertisingData = stringToBytes(
  //               base64.decode(device.manufacturerData),
  //             );
  
  //             const rssi = device.rssi;
  //             const name = device.localName;
  //             const major = advertisingData[21];
  //             const minor = advertisingData[23];
  
  //             setBleData(rssi, major, minor);
  //             console.log(matchedDataRef.current);
  //             console.log(minRssiDevice);
  //             routing();
              
  //           } else {
  //             console.log('There is a beacon nearby...');
  //           }
  //         }
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }, [setBleData,routing]);
  
  
  //   useEffect(() => {
  //     routing();
  //   }, [matchedDataRef.current]);
  //   // Use useCallback to prevent unnecessary re-renders of the AuthOnPress function
  //   const AuthOnPress = useCallback(() => {
  //     console.log(params);
  //     if (!selected || selected.name === department[0].name) {
  //       alert('Please Select Department');
  //     } else {
        
  //       scanForDevices();
  //     }
  //   }, );
  
  //   // Use useEffect to start and stop the device scan
  //   useEffect(() => {
  //     AuthOnPress();
  
  //     return () => {
  //       manager.stopDeviceScan();
  //       console.log('kapandı');
  //     };
  //   }, [AuthOnPress]);
  
  //   // Use useEffect to fetch the matched data
  //   useEffect(() => {
  //     async function fetchMatchedData() {
  //       if (minRssiDevice.major !== 0 && minRssiDevice.minor !== 0) {
  //         const datas = await db.searchMatchedData(
  //           startMajor,
  //           startMinor,
  //           finishMajor,
  //           finishMinor,
  //         );
  //         setMatchedData(datas);
  //       }
  //     }
  
  //     fetchMatchedData();
  //   }, [minRssiDevice]);

  const matchedDataRef = useRef([]);
  const [matchedData, setMatchedData] = useState([]);


  const routing = useCallback(() => {
    if (
      minRssiDevice.major !== 0 &&
      minRssiDevice.minor !== 0 &&
      matchedDataRef.current.length > 0
    ) {
      for (let i = 0; i < matchedDataRef.current.length; i++) {
        const element = matchedDataRef.current[i];

        if (
          element.curMajor === minRssiDevice.major &&
          element.curMinor === minRssiDevice.minor
        ) {
          console.log('element', element.curMajor, element.curMinor);
          setText(element.nextText);
          setSelectedArrow(element.nextDirection);
          setBgColor('blue');
          console.log('yönlendirmeye başladı');

          if (
            element.finishMajor === minRssiDevice.major &&
            element.finishMinor === minRssiDevice.minor
          ) {
            setText('Hedefe Ulaştınız');
            setSelectedArrow('dot-fill');
            setBgColor('green');
            console.log('Yönlendirme başarılı', bgColor);
            break;
          } else {
            setSelectedArrow('x');
            setBgColor('red');
            setText('Lütfen Kapsam Alanı içerisine giriniz');
            console.log('yönlendirme başarısız');
          }
        }
      }
    }
  }, [matchedData]);

  const setBleData = useCallback(
    (rssi, major, minor) => {
      if (
        minRssiDevice.rssi === 0 ||
        Math.abs(rssi) < Math.abs(minRssiDevice.rssi)
      ) {
        setMinRssiDevice({rssi, major, minor});
      }
    },
    [minRssiDevice],
  );

  const scanForDevices = useCallback(() => {
    try {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log(error);
          return;
        }

        if (device.localName === defaultDeviceName) {
          if (device.rssi <= defaultDeviceRssi) {
            const base64 = RNFetchBlob.base64;
            const advertisingData = stringToBytes(
              base64.decode(device.manufacturerData),
            );

            const rssi = device.rssi;
            const name = device.localName;
            const major = advertisingData[21];
            const minor = advertisingData[23];

            setBleData(rssi, major, minor);
            console.log(matchedDataRef.current);
            console.log(minRssiDevice);
            routing();
          } else {
            console.log('There is a beacon nearby...');
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [setBleData, routing]);

  const AuthOnPress = useCallback(() => {
    console.log(params);
    if (!selected || selected.name === department[0].name) {
      alert('Please Select Department');
    } else {
      scanForDevices();
    }
  }, [selected, scanForDevices]);

  useEffect(() => {
    matchedDataRef.current = matchedData;
  }, [matchedData]);

  useEffect(() => {
    AuthOnPress();

    return () => {
      manager.stopDeviceScan();
      console.log('kapandı');
    };
  }, [AuthOnPress]);

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

  useEffect(() => {
    routing();
  }, [matchedData]);

    // const matchedDataRef = useRef([]);
  // const [matchedData, setMatchedData] = useState([]);
  // // Yönlendirme İçin Çalışacak Olan Algoritma

  // const routing = useCallback(() => {
  //   if (
  //     minRssiDevice.major !== 0 &&
  //     minRssiDevice.minor !== 0 &&
  //     matchedDataRef.current.length > 0
  //   ) {
  //     for (let i = 0; i < matchedDataRef.current.length; i++) {
  //       const element = matchedDataRef.current[i];

  //       if (
  //         element.curMajor === minRssiDevice.major &&
  //         element.curMinor === minRssiDevice.minor
  //       ) {
  //         console.log('element', element.curMajor, element.curMinor);
  //         setText(element.nextText);
  //         setSelectedArrow(element.nextDirection);
  //         setBgColor('blue');
  //         console.log('yönlendirmeye başladı');

  //         if (
  //           element.finishMajor === minRssiDevice.major &&
  //           element.finishMinor === minRssiDevice.minor
  //         ) {
  //           setText('Hedefe Ulaştınız');
  //           setSelectedArrow('dot-fill');
  //           setBgColor('green');
  //           console.log('Yönlendirme başarılı', bgColor);
  //           break;
  //         } else {
  //           setSelectedArrow('x');
  //           setBgColor('red');
  //           setText('Lütfen Kapsam Alanı içerisine giriniz');
  //           console.log('yönlendirme başarısız');
  //         }
  //       }
  //     }
  //   }
  // }, [scanForDevices]);

  // // Use useCallback to prevent unnecessary re-renders of the setBleData function
  // const setBleData = useCallback(
  //   (rssi, major, minor) => {
  //     if (
  //       minRssiDevice.rssi === 0 ||
  //       Math.abs(rssi) < Math.abs(minRssiDevice.rssi)
  //     ) {
  //       setMinRssiDevice({rssi, major, minor});
  //     }
  //   },
  //   [minRssiDevice],
  // );

  // // Use useEffect to update the matchedDataRef when the matchedData state changes
  // useEffect(() => {
  //   matchedDataRef.current = matchedData;
  // }, [matchedData]);

  // // Use useCallback to prevent unnecessary re-renders of the scanForDevices function
  // const scanForDevices = useCallback(() => {
  //   try {
  //     manager.startDeviceScan(null, null, (error, device) => {
  //       if (error) {
  //         console.log(error);
  //         return;
  //       }

  //       if (device.localName === defaultDeviceName) {
  //         if (device.rssi <= defaultDeviceRssi) {
  //           const base64 = RNFetchBlob.base64;
  //           const advertisingData = stringToBytes(
  //             base64.decode(device.manufacturerData),
  //           );

  //           const rssi = device.rssi;
  //           const name = device.localName;
  //           const major = advertisingData[21];
  //           const minor = advertisingData[23];

  //           setBleData(rssi, major, minor);
  //           console.log(matchedDataRef.current);
  //           console.log(minRssiDevice);
  //           routing();
  //         } else {
  //           console.log('There is a beacon nearby...');
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [setBleData, routing]);

  // useEffect(() => {
  //   routing();
  // }, [matchedDataRef.current]);
  // // Use useCallback to prevent unnecessary re-renders of the AuthOnPress function
  // const AuthOnPress = useCallback(() => {
  //   console.log(params);
  //   if (!selected || selected.name === department[0].name) {
  //     alert('Please Select Department');
  //   } else {
  //     scanForDevices();
  //   }
  // });

  // // Use useEffect to start and stop the device scan
  // useEffect(() => {
  //   AuthOnPress();

  //   return () => {
  //     manager.stopDeviceScan();
  //     console.log('kapandı');
  //   };
  // }, [AuthOnPress]);

  // // Use useEffect to fetch the matched data
  // useEffect(() => {
  //   async function fetchMatchedData() {
  //     if (minRssiDevice.major !== 0 && minRssiDevice.minor !== 0) {
  //       const datas = await db.searchMatchedData(
  //         startMajor,
  //         startMinor,
  //         finishMajor,
  //         finishMinor,
  //       );
  //       setMatchedData(datas);
  //     }
  //   }

  //   fetchMatchedData();
  // }, [minRssiDevice]);

  const routing = useCallback(() => {
    if (
      minRssiDevice.major !== 0 &&
      minRssiDevice.minor !== 0 &&
      matchedDataRef.current.length > 0
    ) {
      for (let i = 0; i < matchedDataRef.current.length; i++) {
        const element = matchedDataRef.current[i];

        if (
          element.curMajor === minRssiDevice.major &&
          element.curMinor === minRssiDevice.minor
        ) {
          console.log('element', element.curMajor, element.curMinor);
          setText(element.nextText);
          setSelectedArrow(element.nextDirection);
          setBgColor('blue');
          console.log('yönlendirmeye başladı');

          if (
            element.finishMajor === minRssiDevice.major &&
            element.finishMinor === minRssiDevice.minor
          ) {
            setText('Hedefe Ulaştınız');
            setSelectedArrow('dot-fill');
            setBgColor('green');
            console.log('Yönlendirme başarılı', bgColor);
            break;
          } else {
            setSelectedArrow('x');
            setBgColor('red');
            setText('Lütfen Kapsam Alanı içerisine giriniz');
            console.log('yönlendirme başarısız');
          }
        }
      }
    }
  }, [matchedData]);

  import {createContext, useState, useEffect, useCallback, useRef} from 'react';
import {BleManager} from 'react-native-ble-plx';
import RNFetchBlob from 'rn-fetch-blob';
import {stringToBytes} from 'convert-string';
import Db from '../db/db.js';

// Default variables
const manager = new BleManager();
const defaultDeviceName = 'POI';
const defaultDeviceRssi = -1;
const db = new Db();

export const GlobalSelectContext = createContext();

// Select Menu Departments
export const department = [
  {name: 'Please Select', major: 0, minor: 0},
  {name: 'Cardiology', major: '1', minor: '15'},
  {name: 'Dermatology', major: 1, minor: 37},
  {name: 'ENT', major: 1, minor: 38},
  {name: 'Internal Medicine', major: 1, minor: 39},
  {name: 'Endocrinology', major: 1, minor: 49},
  {name: 'General Surgery', major: '1', minor: '67'},
];

// Circle arrows
export const arrow = [
  {name: 'dot-fill'},
  {name: 'arrow-up'},
  {name: 'arrow-left'},
  {name: 'arrow-right'},
  {name: 'arrow-down'},
  {name: 'x'},
];

// Global Provider
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

  // Variables for comparing with database values
  let startMajor = String(minRssiDevice.major);
  let startMinor = String(minRssiDevice.minor);
  let finishMajor = String(selected.major);
  let finishMinor = String(selected.minor);

  // Parameters for fetching data from the database
  let params = [startMajor, startMinor, finishMajor, finishMinor];

  // Using useRef to prevent unnecessary usage of matchedData
  const matchedDataRef = useRef([]);
  const [matchedData, setMatchedData] = useState([]);

  // Routing function
  const routing = async () => {
    if (minRssiDevice.major !== 0 && minRssiDevice.minor !== 0) {
      const currentMatchedData = matchedDataRef.current.find(
        element =>
          element.curMajor === minRssiDevice.major &&
          element.curMinor === minRssiDevice.minor,
      );

      if (currentMatchedData) {
        console.log(
          'element',
          currentMatchedData.curMajor,
          currentMatchedData.curMinor,
        );
        setText(currentMatchedData.nextText);
        setSelectedArrow(currentMatchedData.nextDirection);
        setBgColor('blue');
        console.log('yönlendirmeye başladı');

        if (
          currentMatchedData.finishMajor === minRssiDevice.major &&
          currentMatchedData.finishMinor === minRssiDevice.minor
        ) {
          setText('Hedefe Ulaştınız');
          setSelectedArrow('dot-fill');
          setBgColor('green');
          console.log('Yönlendirme başarılı', bgColor);
        } else {
          setSelectedArrow('x');
          setBgColor('red');
          setText('Lütfen Kapsam Alanı içerisine giriniz');
          console.log('yönlendirme başarısız');
        }
      }
    }
  };

  // useEffect to perform routing operations when minRssiDevice changes
  useEffect(() => {
    async function fetchDataAndUpdate() {
      if (
        minRssiDevice.major !== 0 &&
        minRssiDevice.minor !== 0 &&
        matchedData.length > 0
      ) {
        await routing();
      }
    }
    fetchDataAndUpdate();
  }, [minRssiDevice]);

  // Function to always get the smallest rssi value
  const setBleData = useCallback(
    (rssi, major, minor) => {
      if (
        minRssiDevice.rssi === 0 ||
        Math.abs(rssi) < Math.abs(minRssiDevice.rssi)
      ) {
        setMinRssiDevice({rssi, major, minor});
      }
    },
    [minRssiDevice],
  );

  // Function to scan for devices and update minRssiDevice values
  const scanForDevices = useCallback(() => {
    try {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log(error);
          return;
        }
        if (device.localName === defaultDeviceName) {
          if (device.rssi <= defaultDeviceRssi) {
            const base64 = RNFetchBlob.base64;
            const advertisingData = stringToBytes(
              base64.decode(device.manufacturerData),
            );
            const rssi = device.rssi;
            const name = device.localName;
            const major = advertisingData[21];
            const minor = advertisingData[23];
            setBleData(rssi, major, minor);
            console.log(matchedDataRef.current);
            console.log(minRssiDevice);
          } else {
            console.log('There is a beacon nearby...');
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [setBleData]);

  // Function to be called when the button is pressed
  const AuthOnPress = useCallback(() => {
    console.log(params);
    if (!selected || selected.name === department[0].name) {
      alert('Please Select Department');
    } else {
      scanForDevices();
    }
  }, [selected]);

  useEffect(() => {
    matchedDataRef.current = matchedData;
  }, [matchedData]);

  // useEffect for basic functions
  useEffect(() => {
    AuthOnPress();
    return () => {
      manager.stopDeviceScan();
      console.log('kapandı');
    };
  }, [AuthOnPress]);

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

  return (
    <GlobalSelectContext.Provider
      value={{
        selected: selected,
        department: department,
        bgColor: bgColor,
        selectedArrow: selectedArrow,
        arrow: arrow,
        text: text,
        setSelected,
        AuthOnPress,
        scanForDevices,
        setSelectedArrow,
        setBgColor,
        setText,
      }}>
      {props.children}
    </GlobalSelectContext.Provider>
  );
};

export default GlobalProvider;


// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useCallback,
//   useRef
// } from 'react';
// import {BleManager} from 'react-native-ble-plx';
// import RNFetchBlob from 'rn-fetch-blob';
// import {stringToBytes} from 'convert-string';
// import Db from '../db/db.js';

// //default değişkenlerimiz
// const manager = new BleManager();
// const defaultDeviceName = 'POI';
// const defaultDeviceRssi = -1;
// const db = new Db();

// export const GlobalSelectContext = createContext();

// // Select Menu Departments
// export const department = [
//   {name: 'Please Select', major: 0, minor: 0},
//   {name: 'Cardiology', major: '1', minor: '15'},
//   {name: 'Dermatology', major: 1, minor: 37},
//   {name: 'ENT', major: 1, minor: 38},
//   {name: 'Internal Medicine', major: 1, minor: 39},
//   {name: 'Endocrinology', major: 1, minor: 49},
//   {name: 'General Surgery', major: '1', minor: '67'},
// ];

// // circle için arrows
// export const arrow = [
//   {name: 'dot-fill'},
//   {name: 'arrow-up'},
//   {name: 'arrow-left'},
//   {name: 'arrow-right'},
//   {name: 'arrow-down'},
//   {name: 'x'},
// ];
// // Global Provider içerisinde kullanacaklarımızı tanımlıyoruz
// export const GlobalProvider = props => {
//   const [bgColor, setBgColor] = useState('#0000ff');
//   const [selected, setSelected] = useState(department[0]);
//   const [selectedArrow, setSelectedArrow] = useState(arrow[0].name);
//   const [minRssiDevice, setMinRssiDevice] = useState({
//     rssi: 0,
//     major: 0,
//     minor: 0,
//   });
//   const [text, setText] = useState('Hoşgeldiniz Lütfen Hedefinizi Seçiniz');
//   // Veri Tabanındaki değerler ile karşılaştırabilmek için oluşturuğumuz değişkenler
//   let startMajor = String(minRssiDevice.major);
//   let startMinor = String(minRssiDevice.minor);
//   let finishMajor = String(selected.major);
//   let finishMinor = String(selected.minor);
//   // Veritabanından veri almak için kullanılacak parametreler
//   let params = [startMajor, startMinor, finishMajor, finishMinor];
//   // // Tekrar tekrar render olmaması için useRef kullanıyoruz
//   const matchedDataRef = useRef([]);
//   const [matchedData, setMatchedData] = useState([]);

//     // Yönlendirme için routing() fonksiyonu
//     const routing = useCallback(() => {
//       for (let i = 0; i < matchedDataRef.current.length; i++) {
//         const element = matchedDataRef.current[i];

//         if (
//           element.curMajor.toString() === minRssiDevice.major.toString() &&
//           element.curMinor.toString() === minRssiDevice.minor.toString()
//         ) {
//           console.log("çalışıyor");
//           console.log("element", element.curMajor, element.curMinor);
//           setText(element.nextText);
//           setSelectedArrow(element.nextDirection);
//           setBgColor("blue");
//           console.log("yönlendirmeye başladı");

//           if (
//             element.finishMajor.toString() === minRssiDevice.major.toString() &&
//             element.finishMinor.toString() === minRssiDevice.minor.toString()
//           ) {
//             setText("Hedefe Ulaştınız");
//             setSelectedArrow("dot-fill");
//             setBgColor("#00c957");
//             console.log("Yönlendirme başarılı", bgColor);
//             manager.stopDeviceScan();
//             break;
//           }
//         // } else {
//         //   setSelectedArrow("x");
//         //   setBgColor("red");
//         //   setText("Lütfen Kapsam Alanı içerisine giriniz");
//         //   console.log("yönlendirme başarısız");
//         //   manager.stopDeviceScan();
//         }
//       }
//     }, [minRssiDevice, matchedDataRef.current]);

//     // En yakındaki cihazı bulmak için kullanılan fonksiyon
//     const setBleData = useCallback(
//       (rssi, major, minor) => {
//         if (
//           minRssiDevice.rssi === 0 ||
//           Math.abs(rssi) < Math.abs(minRssiDevice.rssi) ||
//           (Math.abs(rssi) === Math.abs(minRssiDevice.rssi) && rssi > minRssiDevice.rssi) ||
//           (Math.abs(rssi) > Math.abs(minRssiDevice.rssi) && Math.abs(rssi) < 15)
//         ) {
//           setMinRssiDevice({rssi, major, minor});
//           routing();
//         }
//       },
//       [minRssiDevice],
//     );

//     // Tarama yapıp yakındaki cihazları tespit ettiğimiz fonksiyon yukarıdaki setBleData Çalıştıkça Çalışır
//     const scanForDevices = useCallback(() => {
//       try {

//         manager.startDeviceScan(null, null, (error, device) => {
//           if (error) {
//             console.log(error);
//             return;
//           }
//           if (device.localName === defaultDeviceName) {
//             if (device.rssi <= defaultDeviceRssi) {
//               const base64 = RNFetchBlob.base64;
//               const advertisingData = stringToBytes(
//                 base64.decode(device.manufacturerData),
//               );
//               const rssi = device.rssi;
//               const name = device.localName;
//               const major = advertisingData[21];
//               const minor = advertisingData[23];
//               setBleData(rssi, major, minor);
//               console.log(matchedDataRef.current);
//               console.log(minRssiDevice);
//             } else {
//               console.log('There is a beacon nearby...');
//             }
//           }
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     }, [setBleData]);
//     // Departman seçimi yaptırır eğer seçiliyse scan işlemini başlatır
//     const AuthOnPress = useCallback(() => {
//       console.log(params);
//       if (!selected || selected.name === department[0].name) {
//         alert('Please Select Department');

//       } else{
//         scanForDevices();
//         routing();
//       }
//     });
//     // matchedData değiştiğinde matchedDataRef değişkenine atar
//     useEffect(() => {
//       matchedDataRef.current = matchedData;
//     }, [matchedData]);
//     // Ana çalışacak algoritmik fonksiyonlar
//     useEffect(() => {
//       AuthOnPress();
//       return () => {
//         manager.stopDeviceScan();
//         console.log('kapandı');
//       };
//     }, [AuthOnPress]);

//     // Veritabanından uygun eşleşmeleri çekmek için kullanılan fonksiyon
//     useEffect(() => {
//       async function fetchMatchedData() {
//         if (minRssiDevice.major !== 0 && minRssiDevice.minor !== 0) {
//           const datas = await db.searchMatchedData(
//             startMajor,
//             startMinor,
//             finishMajor,
//             finishMinor,
//           );
//           setMatchedData(datas);
//         }
//       }
//       fetchMatchedData();
//     }, [minRssiDevice]);

//   return (
//     <GlobalSelectContext.Provider
//       value={{
//         selected: selected,
//         department: department,
//         bgColor: bgColor,
//         selectedArrow: selectedArrow,
//         arrow: arrow,
//         text: text,
//         setSelected,
//         AuthOnPress,
//         scanForDevices,
//         setSelectedArrow,
//         setBgColor,
//         setText,
//       }}>
//       {props.children}
//     </GlobalSelectContext.Provider>
//   );
// };
// export default GlobalProvider;

// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
// } from 'react';
// import {BleManager} from 'react-native-ble-plx';
// import RNFetchBlob from 'rn-fetch-blob';
// import {stringToBytes} from 'convert-string';
// import Db from '../db/db.js';

// //default değişkenlerimiz
// const manager = new BleManager();
// const defaultDeviceName = 'POI';
// const defaultDeviceRssi = -1;
// const db = new Db();

// export const GlobalSelectContext = createContext();

// // Select Menu Departments
// export const department = [
//   {name: 'Please Select', major: 0, minor: 0},
//   {name: 'Cardiology', major: '1', minor: '15'},
//   {name: 'Dermatology', major: 1, minor: 37},
//   {name: 'ENT', major: 1, minor: 38},
//   {name: 'Internal Medicine', major: 1, minor: 39},
//   {name: 'Endocrinology', major: 1, minor: 49},
//   {name: 'General Surgery', major: '1', minor: '67'},
// ];

// // circle için arrows
// export const arrow = [
//   {name: 'dot-fill'},
//   {name: 'arrow-up'},
//   {name: 'arrow-left'},
//   {name: 'arrow-right'},
//   {name: 'arrow-down'},
//   {name: 'x'},
// ];
// // Global Provider içerisinde kullanacaklarımızı tanımlıyoruz
// export const GlobalProvider = props => {
//   const [bgColor, setBgColor] = useState('#0000ff');
//   const [selected, setSelected] = useState(department[0]);
//   const [selectedArrow, setSelectedArrow] = useState(arrow[0].name);
//   const [minRssiDevice, setMinRssiDevice] = useState({
//     rssi: 0,
//     major: 0,
//     minor: 0,
//   });
//   const [text, setText] = useState('Hoşgeldiniz Lütfen Hedefinizi Seçiniz');
//   // Veri Tabanındaki değerler ile karşılaştırabilmek için oluşturuğumuz değişkenler
//   let startMajor = String(minRssiDevice.major);
//   let startMinor = String(minRssiDevice.minor);
//   let finishMajor = String(selected.major);
//   let finishMinor = String(selected.minor);
//   // Veritabanından veri almak için kullanılacak parametreler
//   let params = [startMajor, startMinor, finishMajor, finishMinor];
//   // // Tekrar tekrar render olmaması için useRef kullanıyoruz
//   const matchedDataRef = useRef([]);
//   const [matchedData, setMatchedData] = useState([]);
//   const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);

//   const routing = useCallback(() => {
//     for (const element of matchedDataRef.current) {
//       if (
//         element.curMajor.toString() === minRssiDevice.major.toString() &&
//         element.curMinor.toString() === minRssiDevice.minor.toString()
//       ) {
//         console.log("yönlendirme başladı");
//         setText(element.nextText);
//         setSelectedArrow(element.nextDirection);
//         setBgColor("blue");

//         if (
//           element.finishMajor.toString() === minRssiDevice.major.toString() &&
//           element.finishMinor.toString() === minRssiDevice.minor.toString()
//         ) {
//           console.log("yönlendirme başarılı");
//           setText("Hedefe Ulaştınız");
//           setSelectedArrow("dot-fill");
//           setBgColor("#00c957");
//           setIsDepartmentSelected(false);
//           break;
//         }
//       }
//     }
//   }, [minRssiDevice]);

//   function setBleData(rssi, major, minor) {
//     const absRssi = Math.abs(rssi);

//     setMinRssiDevice((prevState) => {
//       const absMinRssi = Math.abs(prevState.rssi);

//       if (
//         prevState.rssi === 0 ||
//         (absRssi <= 15 && (absRssi < absMinRssi || (absRssi === absMinRssi && rssi > prevState.rssi)))
//       ) {
//         console.log("setBleData is called", rssi, major, minor);
//         return { rssi, major, minor };
//       } else {
//         console.log("setBleData is not called due to condition failure");
//         return prevState;
//       }
//     });
//   }

//   useEffect(() => {
//     if (minRssiDevice.rssi !== 0) {
//       routing();
//     }
//   }, [minRssiDevice, routing]);

//   const scanForDevices = () => {
//     manager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         console.log(error);
//         return;
//       }
//       if (device.localName === defaultDeviceName) {
//         const base64 = RNFetchBlob.base64;
//         const advertisingData = stringToBytes(
//           base64.decode(device.manufacturerData),
//         );
//         const rssi = device.rssi;
//         const major = advertisingData[21];
//         const minor = advertisingData[23];

//         console.log("Before setBleData is called", rssi, major, minor);
//         setBleData(rssi, major, minor);
//         console.log(matchedDataRef.current);
//         console.log(minRssiDevice);
//       }
//     });
//     console.log("scanForDevices is finished");
//   };

//   const checkSelected = useCallback(() => {
//     if (!selected || selected.name === department[0].name) {
//       setIsDepartmentSelected(false);
//       alert("Please Select Department");
//     } else {
//       setIsDepartmentSelected(true);
//     }
//   }, [selected, department]);

//   useEffect(() => {
//     async function fetchMatchedData() {
//       if (minRssiDevice.major !== 0 && minRssiDevice.minor !== 0) {
//         const datas = await db.searchMatchedData(
//           startMajor,
//           startMinor,
//           finishMajor,
//           finishMinor,
//         );
//         setMatchedData(datas);
//       }
//     }
//     fetchMatchedData();
//   }, [minRssiDevice]);

//   useEffect(() => {
//     checkSelected();
//   }, [checkSelected]);

//   useEffect(() => {
//     matchedDataRef.current = matchedData;
//   }, [matchedData]);

//   const AuthOnPress = useCallback(() => {
//     console.log("AuthOnPress is called");
//     if (isDepartmentSelected) {
//       console.log("AuthOnPress is called koşula giriyor");

//       const intervalId = setInterval(() => {
//         scanForDevices();
//       }, 500); // yarım saniyede bir tekrar çağırır.

//       // Taramayı durdurmak için bu kod
//       // clearInterval(intervalId);
//     }
//   }, [isDepartmentSelected]);

//       const handleButtonPress = useCallback(() => {
//       if (!isDepartmentSelected) {
//       alert("Please select a department.");
//       } else {
//       AuthOnPress();
//       }
//       }, [isDepartmentSelected, AuthOnPress]);

//   return (
//     <GlobalSelectContext.Provider
//       value={{
//         selected: selected,
//         department: department,
//         bgColor: bgColor,
//         selectedArrow: selectedArrow,
//         arrow: arrow,
//         text: text,
//         matchedData: matchedData,
//         setSelected,
//         AuthOnPress,
//         scanForDevices,
//         setSelectedArrow,
//         setBgColor,
//         setText,
//         handleButtonPress,
//       }}>
//       {props.children}
//     </GlobalSelectContext.Provider>
//   );
// };
// export default GlobalProvider;

