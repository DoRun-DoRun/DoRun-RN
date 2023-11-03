import React, {useState} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import Modals from './screens/Modal';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const pressButton = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Button title={'모달 열기'} onPress={pressButton} />
      <Modals modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <View style={styles.testcontainer}>
          <Text style={styles.testtext}>View를 만들어서 모달을 제작</Text>
          <Text style={styles.testtext}>1</Text>
          <Text style={styles.testtext}>2</Text>
          <Text style={styles.testtext}>1</Text>
          <Text style={styles.testtext}>2</Text>
          <Text style={styles.testtext}>1</Text>
          <Text style={styles.testtext}>2</Text>
          <Text style={styles.testtext}>1</Text>
          <Text style={styles.testtext}>2</Text>
        </View>
      </Modals>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testcontainer: {
    gap: 5,
  },
  testtext: {
    color: 'black',
    fontSize: 25,
  },
});

export default App;
