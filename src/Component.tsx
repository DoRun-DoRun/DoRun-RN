/* ui/index.tsx ------------------------------------------------------------- */
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import ViewShot, {captureRef} from 'react-native-view-shot';
import {adjustBrightness} from './Hook/hook';
import {Palette} from './theme/palette';
import {useTheme} from './theme/ThemeProvider';

/* ---------- Typography --------------------------------------------------- */
export interface FontProps {
  size: number;
  weight?: 'Bold' | 'Medium' | 'Regular';
  color?: keyof Palette | string;
  lineHeight?: number;
  textAlign?: 'auto' | 'center' | 'left' | 'right';
}

export const NotoSansKR: React.FC<FontProps & Text['props']> = ({
  size,
  weight = 'Bold',
  color,
  lineHeight,
  textAlign = 'auto',
  style,
  children,
  ...rest
}) => {
  const {theme} = useTheme();
  const resolved =
    color && (theme as any)[color] ? (theme as any)[color] : theme.black;

  return (
    <Text
      style={[
        {
          fontSize: size,
          lineHeight: lineHeight ?? size * 1.25,
          fontFamily: `NotoSansKR-${weight}`,
          color: resolved,
          textAlign,
        },
        style,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};

export const InputNotoSansKR: React.FC<
  FontProps & TextInput['props'] & {border?: boolean}
> = ({size, weight = 'Bold', color, border, style, ...rest}) => {
  const {theme} = useTheme();
  const resolved =
    color && (theme as any)[color] ? (theme as any)[color] : theme.black;

  return (
    <TextInput
      placeholderTextColor={theme.gray4}
      style={[
        {
          fontSize: size,
          fontFamily: `NotoSansKR-${weight}`,
          color: resolved,
          padding: border ? 8 : 0,
          borderBottomWidth: border ? StyleSheet.hairlineWidth : 0,
          lineHeight: Platform.select({ios: 0, android: size * 1.7}),
          ...(Platform.OS === 'android' && {includeFontPadding: false}),
        },
        style,
      ]}
      {...rest}
    />
  );
};

export const TossFace: React.FC<
  FontProps & TextInput['props'] & {border?: boolean}
> = ({size, weight = 'Bold', color, border, style, ...rest}) => {
  const {theme} = useTheme();

  return (
    <TextInput
      placeholderTextColor={theme.gray4}
      style={[
        {
          fontSize: size,
          fontFamily: `TossFaceFontMac`,
          color: '#000',
          padding: border ? 8 : 0,
          borderBottomWidth: border ? StyleSheet.hairlineWidth : 0,
          lineHeight: Platform.select({ios: 0, android: size * 1.7}),
          ...(Platform.OS === 'android' && {includeFontPadding: false}),
        },
        style,
      ]}
      {...rest}
    />
  );
};

/* ---------- Layout Containers ------------------------------------------- */
export const HomeContainer: React.FC<
  {color?: keyof Palette | string} & View['props']
> = ({color, style, children, ...rest}) => {
  const {theme} = useTheme();
  const bg =
    color && (theme as any)[color] ? (theme as any)[color] : theme.white;
  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: bg}, style]} {...rest}>
      {children}
    </SafeAreaView>
  );
};

export const InnerContainer: React.FC<
  {gap?: number; separate?: boolean} & View['props']
> = ({gap, separate, style, children, ...rest}) => (
  <View
    style={[
      {
        flex: 1,
        padding: 16,
        gap,
        justifyContent: separate ? 'space-between' : 'flex-start',
      },
      style,
    ]}
    {...rest}>
    {children}
  </View>
);

export const RowContainer: React.FC<
  {gap?: number; separate?: boolean} & View['props']
> = ({gap, separate, style, children, ...rest}) => (
  <View
    style={[
      {
        flexDirection: 'row',
        alignItems: 'center',
        gap,
        justifyContent: separate ? 'space-between' : 'flex-start',
      },
      style,
    ]}
    {...rest}>
    {children}
  </View>
);

/* ---------- Scroll Helpers ---------------------------------------------- */
export const RowScrollContainer: React.FC<{
  gap?: number;
  children: React.ReactNode;
}> = ({gap, children}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{marginHorizontal: -16}}>
    <View style={{flexDirection: 'row', paddingHorizontal: 16, gap}}>
      {children}
    </View>
  </ScrollView>
);

export const ScrollContainer = React.forwardRef<ScrollView, ScrollViewProps>(
  ({style, children, ...rest}, ref) => (
    <ScrollView
      ref={ref}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={[styles.container, style]}
      {...rest}>
      {children}
    </ScrollView>
  ),
);

/* ---------- Button ------------------------------------------------------- */
export interface ButtonProps {
  children: React.ReactNode;
  type?: 'primary' | 'secondary' | 'gray' | 'black';
  onPress?: () => void;
  disabled?: boolean;
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  children,
  type = 'primary',
  onPress,
  disabled,
}) => {
  const {theme} = useTheme();

  /* 색상 매핑 */
  let fg: keyof Palette | string = 'white';
  let bg = theme.primary1;

  if (type === 'secondary') {
    fg = 'gray4';
    bg = theme.white;
  } else if (type === 'gray') {
    fg = 'gray4';
    bg = theme.gray7;
  } else if (type === 'black') {
    fg = 'black';
    bg = theme.white;
  }
  if (disabled) {
    fg = 'white';
    bg = theme.gray4;
  }

  return (
    <Pressable
      android_ripple={
        Platform.OS === 'android'
          ? {color: adjustBrightness(bg, 0.9)}
          : undefined
      }
      disabled={disabled}
      onPress={onPress}
      style={{borderRadius: 10}}>
      <LinearGradient
        colors={
          type === 'primary' && !disabled
            ? ['#1727C3', '#6377F1', '#9EB7F6']
            : [bg, bg]
        }
        start={{x: 1.27, y: 4.29}}
        end={{x: -0.19, y: -2.08}}
        style={{padding: 8, alignItems: 'center', borderRadius: 10}}>
        <NotoSansKR size={16} lineHeight={23} color={fg}>
          {children}
        </NotoSansKR>
      </LinearGradient>
    </Pressable>
  );
};

/* ---------- Modal: 사진 확대 --------------------------------------------- */
export const ModalViewPhoto: React.FC<{
  visible: boolean;
  onClose: () => void;
  uri: string;
}> = ({visible, onClose, uri}) => {
  const {width, height} = useWindowDimensions();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.modalBackdrop}>
        <Image source={{uri}} resizeMode="contain" style={{width, height}} />
      </TouchableOpacity>
    </Modal>
  );
};

/* ---------- 로딩 --------------------------------------------------------- */
export const LoadingIndicator = () => (
  <View style={styles.loadingCenter}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

/* ---------- ViewShot & 공유 --------------------------------------------- */
export const ContentSave: React.FC<{
  fileName: string;
  children: React.ReactElement<{onShare: () => void}>;
}> = ({fileName, children}) => {
  const ref = React.useRef<ViewShot>(null);

  const onShare = async () => {
    try {
      const uri = await captureRef(ref, {format: 'jpg', quality: 0.9});
      await Share.open({
        title: 'Share via',
        message: 'Check out this image!',
        url: Platform.OS === 'ios' ? `file://${uri}` : uri,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ViewShot
      ref={ref}
      options={{fileName, format: 'jpg', quality: 0.9}}
      style={{padding: 24}}>
      {React.cloneElement(children, {onShare})}
    </ViewShot>
  );
};

/* ---------- Styles & Utils ---------------------------------------------- */
const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCenter: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: {flex: 1},
});
