import { Text, TextProps, StyleSheet } from 'react-native';
import React from 'react';

export const BaseText: React.FC<TextProps> = ({ style, ...props }) => {
  return (
    <Text {...props} style={[styles.text, style]} />
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Outfit',
  },
});