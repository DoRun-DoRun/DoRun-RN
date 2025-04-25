import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  View,
} from 'react-native';
import {useModal} from './ModalProvider';
import {OverlayContainer} from './OverlayContainer';

const CustomModal = () => {
  const {isVisible, content, hideModal, showOverlay} = useModal();
  const panY = useRef(new Animated.Value(0)).current;
  const height = Dimensions.get('window').height;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(panY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(panY, {
        toValue: height * 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, panY, height]);

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (event, gestureState) => {
        // 오직 아래로 스와이프하는 경우에만 panY를 업데이트
        if (gestureState.dy > 20) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 50) {
          closeModalWithAnimation();
        } else {
          resetBottomSheet();
        }
      },
    }),
  ).current;

  const closeModalWithAnimation = () => {
    Animated.timing(panY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => hideModal());
  };

  const resetBottomSheet = () => {
    Animated.timing(panY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal transparent={true} visible={isVisible} style={{zIndex: 10}}>
      <OverlayContainer hideBackground={!showOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}>
          <ModalContainer showOverlay={showOverlay}>
            <ModalContent
              showOverlay={showOverlay}
              style={{
                transform: [{translateY: panY}],
              }}
              {...panResponders.panHandlers}>
              {content}
            </ModalContent>
          </ModalContainer>
        </KeyboardAvoidingView>
      </OverlayContainer>
    </Modal>
  );
};

export default CustomModal;

/* -------------------------------------------------------------------------- */
/* 🌱  styled-components → StyleSheet + 함수형 컴포넌트 ---------------------- */
/* -------------------------------------------------------------------------- */
import {StyleSheet, ViewProps} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

/* ---------- 1. Modal 최상단 래퍼 ---------------------------------------- */
export const ModalContainer: React.FC<{showOverlay: boolean} & ViewProps> = ({
  showOverlay,
  style,
  children,
  ...rest
}) => (
  <View
    style={[
      styles.modalContainer,
      {
        marginBottom: showOverlay ? 0 : 48,
        padding: showOverlay ? 0 : 8,
      },
      style,
    ]}
    {...rest}>
    {children}
  </View>
);

/* ---------- 2. Modal 내용 컨테이너 -------------------------------------- */
export const ModalContent: React.FC<
  {showOverlay: boolean} & Animated.AnimatedProps<ViewProps>
> = ({showOverlay, style, children, ...rest}) => (
  <Animated.View
    style={[
      styles.modalContent,
      showOverlay
        ? {borderTopLeftRadius: 16, borderTopRightRadius: 16}
        : {borderRadius: 16},
      style,
    ]}
    {...rest}>
    {children}
  </Animated.View>
);

/* ---------- 3. 제목 + 밑줄 --------------------------------------------- */
export const ModalHeadText: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {theme} = useTheme();
  return (
    <View style={styles.headerText}>
      {children}
      <View style={[styles.longDivider, {borderColor: theme.gray5}]} />
    </View>
  );
};

/* ---------- 4. 상단 회색 바 -------------------------------------------- */
export const ModalHeadBorder: React.FC = () => {
  const {theme} = useTheme();
  return (
    <View style={styles.headerBorder}>
      <View style={[styles.shortDivider, {borderColor: theme.gray6}]} />
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/* 🎨 StyleSheet ------------------------------------------------------------ */
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 24,
    paddingBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 2, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {elevation: 3},
    }),
  },
  headerText: {paddingTop: 16, gap: 16},
  longDivider: {borderBottomWidth: 2, marginHorizontal: -24},
  headerBorder: {paddingVertical: 12, gap: 12, alignItems: 'center'},
  shortDivider: {padding: 6, width: 35, borderBottomWidth: 4},
});
