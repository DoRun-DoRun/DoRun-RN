import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useModal} from './ModalProvider';
import CustomModal from './CustomModal';
import {SafeAreaView} from 'react-native-safe-area-context';

const ExampleUsage = () => {
  const {showModal} = useModal();

  const openModal = () => {
    const modalContent = (
      <View>
        <Text>모달 작성</Text>
        <TouchableOpacity onPress={() => console.log('Button Pressed')}>
          <Text>버튼 클릭</Text>
        </TouchableOpacity>
      </View>
    );

    showModal(modalContent);
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={openModal}>
        <Text>모달 보여주기</Text>
      </TouchableOpacity>
      <CustomModal />
    </SafeAreaView>
  );
};

export default ExampleUsage;
