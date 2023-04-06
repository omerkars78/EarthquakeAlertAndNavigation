import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

function HomeScreen({navigation}) {
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 30,
          backgroundColor: 'blue'
        },
        button: {
          backgroundColor: '#3498db',
          padding: 10,
          borderRadius: 5,
          margin: 10,
        },
        buttonText: {
          color: 'white',
          textAlign: 'center',
        },
      });
    
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('RotaBul')}>
            <Text style={styles.buttonText}>Rota Bul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AcilÇıkış')}>
            <Text style={styles.buttonText}>Acil Çıkış</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Deprem')}>
            <Text style={styles.buttonText}>Deprem</Text>
          </TouchableOpacity>
        </View>
      );
}

export default HomeScreen;
