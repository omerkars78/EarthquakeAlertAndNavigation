import React, {useState, useEffect} from 'react';
import Db from '../db/db.js';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
// import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

function DepremScreen() {
  const [image, setImage] = useState(null);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [dateTimeRangesWithImages, setDateTimeRangesWithImages] = useState([]);

  const db = new Db();

  // useEffect(() => {
  //   const loadAllDateTimeRangesWithImages = async () => {
  //     const allDateTimeRangesWithImages = await db.getAllTimeRangesWithImages();
  //     setDateTimeRangesWithImages(allDateTimeRangesWithImages);
  //   };
  //   loadAllDateTimeRangesWithImages();
  // }, []);

  // const pickImage = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       {
  //         title: 'Deprem Uygulaması Depolama İzni',
  //         message: 'Deprem Uygulaması depolama alanına erişim izni gerektirir.',
  //         buttonPositive: 'Tamam',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       const options = {
  //         title: 'Fotoğraf Seç',
  //         storageOptions: {
  //           skipBackup: true,
  //           path: 'images',
  //         },
  //       };
  //       launchImageLibrary(options, response => {
  //         console.log('Response = ', response);
  //         if (!response.didCancel && !response.error) {
  //           const imageUri = response.assets[0].uri;
  //           setImage(imageUri);
  //         }
  //       });
  //     } else {
  //       console.log('Depolama izni reddedildi.');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  // const showStartTimePicker = () => {
  //   setStartTimePickerVisibility(true);
  // };

  // const hideStartTimePicker = () => {
  //   setStartTimePickerVisibility(false);
  // };

  // const handleStartTimeConfirm = time => {
  //   const newStartTime = new Date();
  //   newStartTime.setHours(time.getHours());
  //   newStartTime.setMinutes(time.getMinutes());
  //   setStartTime(newStartTime);
  //   hideStartTimePicker();
  // };

  // const showEndTimePicker = () => {
  //   setEndTimePickerVisibility(true);
  // };

  // const hideEndTimePicker = () => {
  //   setEndTimePickerVisibility(false);
  // };

  // const handleEndTimeConfirm = time => {
  //   const newEndTime = new Date();
  //   newEndTime.setHours(time.getHours());
  //   newEndTime.setMinutes(time.getMinutes());
  //   setEndTime(newEndTime);
  //   hideEndTimePicker();
  // };

  // const addDateTimeRangeWithImage = async () => {
  //   if (image && startTime && endTime) {
  //     await db.addTimeRangeWithImage(startTime.toISOString(), endTime.toISOString(), image);
  //     const newItem = {
  //       startTime: startTime.toISOString(),
  //       endTime: endTime.toISOString(),
  //       imageURI: image,
  //     };
  
  //     setDateTimeRangesWithImages([...dateTimeRangesWithImages, newItem]);
  //     setImage(null);
  //     setStartTime(null);
  //     setEndTime(null);
  //   } else {
  //     alert('Lütfen başlangıç saati, bitiş saati ve fotoğraf seçiniz.');
  //   }
  // };

  // const deleteItem = async item => {
  //   await db.deleteTimeRangeWithImage(item.startTime, item.endTime,item.imageURI);
  //   setDateTimeRangesWithImages(
  //     dateTimeRangesWithImages.filter(
  //       dateTimeRange => dateTimeRange.startTime !== item.startTime,
  //     ),
  //   );
  // };
  // const renderItem = ({item}) => {
  //   const startTime = new Date(item.startTime);
  //   const endTime = new Date(item.endTime);
  useEffect(() => {
    const loadAllDateTimeRangesWithImages = async () => {
      const allDateTimeRangesWithImages = await db.getAllTimeRangesWithImages();
      setDateTimeRangesWithImages(allDateTimeRangesWithImages);
    };
    loadAllDateTimeRangesWithImages();
  }, []);
  
  const adjustTimezone = (time) => {
    const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const timezoneOffsetInHours = timezoneOffsetInMinutes / 60;
    const adjustedTime = new Date(time);
    adjustedTime.setHours(adjustedTime.getHours() - timezoneOffsetInHours);
    return adjustedTime;
  };
  
  const pickImage = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Deprem Uygulaması Depolama İzni',
          message: 'Deprem Uygulaması depolama alanına erişim izni gerektirir.',
          buttonPositive: 'Tamam',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const options = {
          title: 'Fotoğraf Seç',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        launchImageLibrary(options, response => {
          console.log('Response = ', response);
          if (!response.didCancel && !response.error) {
            const imageUri = response.assets[0].uri;
            setImage(imageUri);
          }
        });
      } else {
        console.log('Depolama izni reddedildi.');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };
  
  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };
  
  const handleStartTimeConfirm = (time) => {
    const adjustedTime = adjustTimezone(time);
    setStartTime(adjustedTime);
    hideStartTimePicker();
  };
  
  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };
  
  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };
  
  const handleEndTimeConfirm = (time) => {
    const adjustedTime = adjustTimezone(time);
    setEndTime(adjustedTime);
    hideEndTimePicker();
  };
  
  const addDateTimeRangeWithImage = async () => {
    if (image && startTime && endTime) {
      await db.addTimeRangeWithImage(startTime.toISOString(), endTime.toISOString(), image);
      const newItem = {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        imageURI: image,
      };
  
      setDateTimeRangesWithImages([...dateTimeRangesWithImages, newItem]);
      setImage(null);
      setStartTime(null);
      setEndTime(null);
    } else {
      alert('Lütfen başlangıç saati, bitiş saati ve fotoğraf seçiniz.');
    }
  };
  
  const deleteItem = async (item) => {
    await db.deleteTimeRangeWithImage(item.startTime, item.endTime, item.imageURI);
    setDateTimeRangesWithImages(
      dateTimeRangesWithImages.filter(
        dateTimeRange => dateTimeRange.startTime !== item.startTime,
      ),
    );
  };
  
  const renderItem = ({item}) => {
    const startTime = new Date(item.startTime);
    const endTime = new Date(item.endTime);
  
    return (
      <View style={styles.item_container}>
        <Text style={styles.item_text}>
          Başlangıç: {startTime.toLocaleTimeString()} - Bitiş:{' '}
          {endTime.toLocaleTimeString()}
        </Text>
        <View style={styles.item_details_container}>
          <Image
            source={{uri: `file://${item.imageURI}`}}
            style={styles.item_image}
          />
          <TouchableOpacity
            style={styles.delete_button}
            onPress={() => deleteItem(item)}>
            <Text style={styles.delete_text}>Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Hayat Üçgeni Ekle</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Fotoğraf Yükle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={showStartTimePicker}>
        <Text style={styles.buttonText}>Başlangıç Saati Seç</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={showEndTimePicker}>
        <Text style={styles.buttonText}>Bitiş Saati Seç</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={addDateTimeRangeWithImage}>
        <Text style={styles.buttonText}>Hayat Üçgeni Ekle</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={hideStartTimePicker}
      />
      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
      />
      {!image && <Text>Fotoğraf seçilmedi.</Text>}
      {image && (
        <Image
          source={{uri: image}}
          style={{width: 200, height: 200, resizeMode: 'cover', marginTop: 10}}
        />
      )}
      <FlatList
        data={dateTimeRangesWithImages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFA07A',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  item_container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  item_details_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 10,
  },
  item_text: {
    alignSelf:'flex-start',
    marginBottom: 10,
  },
  item_image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 10,
  },
  delete_button: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  delete_text: {
    color: 'white',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DepremScreen;
