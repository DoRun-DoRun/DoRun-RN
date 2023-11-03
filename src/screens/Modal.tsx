import React, {useCallback, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
} from 'react-native';

interface BottomSheetProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  children: React.ReactNode;
  time?: number;
}

function Modals(props: BottomSheetProps) {
  const {modalVisible, setModalVisible, children, time} = props;
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 0.6) {
          closeModal();
        } else {
          resetBottomSheet.start();
        }
      },
    }),
  ).current;

  const closeModal = useCallback(() => {
    closeBottomSheet.start(() => {
      setModalVisible(false);
    });
  }, [closeBottomSheet, setModalVisible]);

  useEffect(() => {
    if (props.modalVisible) {
      resetBottomSheet.start();
      if (time) {
        const closeTimeout = setTimeout(() => {
          closeModal();
        }, time);
        return () => clearTimeout(closeTimeout);
      }
    }
  }, [props.modalVisible, resetBottomSheet, closeModal, time]);

  return (
    <Modal
      visible={modalVisible}
      animationType={'fade'}
      transparent
      statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            ...styles.bottomSheetContainer,
            transform: [{translateY: translateY}],
          }}
          {...panResponders.panHandlers}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  background: {
    flex: 1,
  },
  bottomSheetContainer: {
    margin: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
});

export default Modals;
