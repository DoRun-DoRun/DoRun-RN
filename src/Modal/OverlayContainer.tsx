/* OverlayContainer.tsx ---------------------------------------------------- */
import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import {useModal} from './ModalProvider';

/* ------------------------------------------------------------------ */
/* 1) OverlayBackground (Pressable)                                   */
const OverlayBackground: React.FC<PressableProps> = ({
  style,
  children,
  ...rest
}) => {
  // If style is a function, wrap it to include overlayBg
  const combinedStyle =
    typeof style === 'function'
      ? (state: any) => [styles.overlayBg, style(state)]
      : [styles.overlayBg, style];

  return (
    <Pressable style={combinedStyle} {...rest}>
      {children}
    </Pressable>
  );
};

/* 2) 살짝 어두운 반투명 레이어                                        */
const FillOverlayOpacity: React.FC<ViewProps> = ({style, ...rest}) => (
  <View style={[styles.fillOpacity, style]} {...rest} />
);

/* 3) OverlayContainer (기존 API 유지)                                */
interface OverlayContainerProps {
  hideBackground?: boolean;
  children: React.ReactNode;
}

export const OverlayContainer: React.FC<OverlayContainerProps> = ({
  children,
  hideBackground,
}) => {
  const {hideModal} = useModal();

  return (
    <OverlayBackground onPress={hideModal}>
      {!hideBackground && <FillOverlayOpacity />}
      {children}
    </OverlayBackground>
  );
};

/* ------------------------------------------------------------------ */
/* StyleSheet                                                         */
const styles = StyleSheet.create({
  overlayBg: {
    width: '100%',
    height: '100%',
  },
  fillOpacity: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    opacity: 0.2,
  },
});
