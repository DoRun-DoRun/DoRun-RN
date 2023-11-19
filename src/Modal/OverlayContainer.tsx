import React, {Component} from 'react';
import {Animated, ViewStyle, StyleProp, BackHandler} from 'react-native';
import styled from 'styled-components/native';

const OverlayBackground = styled(Animated.View)<{
  width?: number;
  height?: number;
}>`
  justify-content: center;
  align-items: center;
  position: absolute;
  width: ${({width}) => (width ? `${width}px` : '100%')};
  height: ${({height}) => (height ? `${height}px` : '100%')};
`;

interface OverlayContainerProps {
  width?: number;
  height?: number;
  hideBackground?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onBackButtonPress?: () => void;
  animationEnabled?: boolean;
  opacity?: number;
}

interface FillOverlayOpacityProps {
  opacity: number;
}

const FillOverlayOpacity = styled.View<FillOverlayOpacityProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  opacity: ${({opacity}) => opacity};
`;

class OverlayContainer extends Component<OverlayContainerProps> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const {onBackButtonPress} = this.props;
    if (onBackButtonPress) {
      onBackButtonPress();
      return true; // 이벤트 처리 완료
    }
    return false; // 이벤트 처리 중지
  };

  render() {
    const {
      width,
      height,
      hideBackground,
      children,
      style,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      animationEnabled = false,
      opacity = 0.3,
    } = this.props;

    return (
      <OverlayBackground width={width} height={height} style={style}>
        {hideBackground ? null : <FillOverlayOpacity opacity={opacity} />}
        {children}
      </OverlayBackground>
    );
  }
}

export default OverlayContainer;
