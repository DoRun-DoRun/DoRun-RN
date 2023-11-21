import React, {useEffect, useRef} from 'react';
import {Modal, View, Animated, PanResponder} from 'react-native';
import styled from 'styled-components/native';
import {useModal} from './ModalProvider';
import {OverlayContainer} from './OverlayContainer';

const StyledModalContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px;
`;

const StyledModalContent = styled(Animated.View)`
  width: 100%;
  background-color: white;
  border-radius: 16px;
  padding: 16px;
`;

const CustomModal = () => {
  const {isVisible, content, hideModal} = useModal();
  const panY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      panY.setValue(0);
    }
  }, [isVisible, panY]);

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // 오직 아래로 스와이프하는 경우에만 panY를 업데이트
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 0.6) {
          hideModal();
        } else {
          resetBottomSheet();
        }
      },
    }),
  ).current;

  const resetBottomSheet = () => {
    Animated.timing(panY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={isVisible}
      onRequestClose={() => hideModal()}
      style={{zIndex: 10}}>
      <OverlayContainer>
        <StyledModalContainer>
          <StyledModalContent
            style={{
              transform: [{translateY: panY}],
            }}
            {...panResponders.panHandlers}>
            {content}
          </StyledModalContent>
        </StyledModalContainer>
      </OverlayContainer>
    </Modal>
  );
};

export default CustomModal;
