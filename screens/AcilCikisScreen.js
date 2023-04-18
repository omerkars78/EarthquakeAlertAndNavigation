import React,{useContext} from 'react';
import {View,StyleSheet} from 'react-native';
import Header from '../components/Header';
import Circle from '../components/Circle';
import SelectMenu from '../components/SelectMenu';
import Button from '../components/Button';
import GlobalProvider , {GlobalSelectContext} from '../Context/GlobalState';
function AcilCikisScreen() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}
function AppContent() {
  const {bgColor} = useContext(GlobalSelectContext);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 30,
      backgroundColor: bgColor
    },
    girisWrapper: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'transparent',
    },
    circle: {
      height: 250,
      backgroundColor: 'white',
      borderRadius: 250,
    },
    icon: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconRight: {
      flex: 1,
      justifyContent: 'center',
      transform: [{rotate: '90deg'}],
      alignItems: 'center',
    },
    iconLeft: {
      flex: 1,
      justifyContent: 'center',
      transform: [{rotate: '-90deg'}],
      transition: 'all 0.5s ease',
      alignItems: 'center',
    },
    iconBottom: {
      flex: 1,
      justifyContent: 'center',
      transform: [{rotate: '-180deg'}],
      transition: 'all 0.5s ease',
      alignItems: 'center',
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.girisWrapper}>
        <Header />
        <Circle />
        <SelectMenu />
        <Button />
      </View>
    </View>
  );
}
export default AcilCikisScreen;