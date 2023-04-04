import {Picker} from '@react-native-picker/picker';
import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import {GlobalSelectContext} from '../Context/GlobalState';

function SelectMenu() {
  const {selected, setSelected, department, text, setText} =
    useContext(GlobalSelectContext);

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        onValueChange={itemValue => setText(itemValue)}>
        {text}
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selected.name}
          onValueChange={itemValue =>
            setSelected(department.find(clinic => clinic.name === itemValue))
          }
          style={styles.picker}>
          {department.map(clinic => (
            <Picker.Item
              label={clinic.name}
              value={clinic.name}
              key={clinic.name}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = {
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    padding: 8,
  },
  pickerContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

export default SelectMenu;
