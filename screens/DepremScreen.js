import React , {useState,useEffect} from 'react';
import Db from '../db/db.js'
import {View, Text, TouchableOpacity, Image, StyleSheet, PermissionsAndroid} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';



function DepremScreen() {
  const [image, setImage] = useState(null);
  const db = new Db();
  useEffect(() => {
    const loadLastImage = async () => {
      const lastImageUri = await db.getLastImage();
      if (lastImageUri) {
        setImage(lastImageUri);
      }
    };
    loadLastImage();
  }, []);

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

  return (
    <View style={styles.container}>
      <Text>Deprem Screen</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text>Fotoğraf Yükle</Text>
      </TouchableOpacity>
      {image && (
        <Image
          source={{uri: image}}
          style={{width: 200, height: 200, resizeMode: 'cover', marginTop: 10}}
        />
      )}
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
});

export default DepremScreen;

