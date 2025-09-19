// src/components/Loader.js

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Loader = () => {
  const { colors } = useTheme();
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [bounceAnim]);

  const dot1Scale = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  const dot2Scale = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.2],
    extrapolate: 'clamp'
  });
  const dot3Scale = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });


  const dotStyle = (delay) => ({
    backgroundColor: colors.loaderDotColor,
    transform: [{
      translateY: bounceAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -8, 0],
      })
    }],
    opacity: bounceAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.5, 1, 0.5],
    })
  });

  return (
    <View style={styles.loaderContainer}>
      <Animated.View style={[styles.loaderDot, dotStyle(0)]} />
      <Animated.View style={[styles.loaderDot, dotStyle(100)]} />
      <Animated.View style={[styles.loaderDot, dotStyle(200)]} />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginVertical: 10,
  },
  loaderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
});

export default Loader;