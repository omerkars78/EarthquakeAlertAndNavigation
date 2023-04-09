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
import DateTimePickerModal from 'react-native-modal-datetime-picker';

function DepremScreen() {
  const [image, setImage] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const [dateTimeRangesWithImages, setDateTimeRangesWithImages] = useState([]);

  const db = new Db();

  // Son seçilen resmi yükleme
  useEffect(() => {
    const loadLastImage = async () => {
      const lastImageUri = await db.getLastImage();
      if (lastImageUri) {
        setImage(lastImageUri);
      }
    };
    loadLastImage();
  }, []);

  // Fotoğraf seçme işlemi
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
            const db = new Db();
            db.addImage(imageUri);
          }
        });
      } else {
        console.log('Depolama izni reddedildi.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Tarih seçiciyi göster
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Tarih seçiciyi gizle
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Tarih seçildiğinde çalışacak fonksiyon
  const handleDateConfirm = date => {
    console.log('A date has been picked: ', date);
    setDateTime(date);
    hideDatePicker();
  };

  // Saat seçiciyi göster
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  // Saat seçiciyi gizle
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  // Saat seçildiğinde çalışacak fonksiyon
  const handleTimeConfirm = time => {
    if (dateTime) {
      const newDateTime = new Date(dateTime);
      newDateTime.setHours(time.getHours());
      newDateTime.setMinutes(time.getMinutes());
      setDateTime(newDateTime);
    }
    hideTimePicker();
  };

  // Tarih, saat ve resim seçildiğinde veritabanına kaydetme işlemi
  const addDateTimeRangeWithImage = async () => {
    if (image && dateTime) {
      const endTime = new Date(dateTime);
      endTime.setMinutes(dateTime.getMinutes() + 30); // 30 dakika sonrasını varsayılan olarak bitiş zamanı olarak ayarladık
      await db.addTimeRangeWithImage(dateTime, endTime, image);
      const newItem = {
        startTime: dateTime,
        endTime: endTime,
        imageURI: image,
      };

      setDateTimeRangesWithImages([...dateTimeRangesWithImages, newItem]);
      setImage(null);
    } else {
      alert('Lütfen tarih, saat ve fotoğraf seçiniz.');
    }
  };

  // İlişkili fotoğraf ve zaman aralığını silme işlemi
  const deleteItem = async item => {
    await db.deleteTimeRangeWithImage(item.startTime, item.imageURI);
    setDateTimeRangesWithImages(
      dateTimeRangesWithImages.filter(
        dateTimeRange => dateTimeRange.startTime !== item.startTime,
      ),
    );
  };

  // Liste öğelerini göstermek için kullanılacak fonksiyon
  const renderItem = ({item}) => {
    return (
      <View style={styles.listItem}>
        <View>
          <Text>
            {new Date(item.startTime).toLocaleString()} -{' '}
            {new Date(item.endTime).toLocaleString()}
          </Text>
          <Image
            source={{uri: item.imageURI}}
            style={{
              width: 100,
              height: 100,
              resizeMode: 'cover',
              marginTop: 10,
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteItem(item)}>
          <Text>Sil</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Deprem Screen</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text>Fotoğraf Yükle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={showDatePicker}>
        <Text>Tarih Seç</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={showTimePicker}>
        <Text>Saat Seç</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={addDateTimeRangeWithImage}>
        <Text>Zaman Aralığı ve Fotoğraf Ekle</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
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
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
});

export default DepremScreen;
