import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, MyDimensi } from '../../utils';

export default function MyRadio({ 
  label, 
  selected, 
  onPress,
  disabled = false 
}) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
      style={styles.touchable}
    >
      <View style={styles.container}>
        <View style={[
          styles.radioButton,
          selected && styles.radioButtonSelected,
          disabled && styles.disabled
        ]}>
          {selected && <View style={styles.radioButtonInner} />}
        </View>
        <Text style={[
          styles.radioLabel,
          selected && styles.labelSelected,
          disabled && styles.labelDisabled
        ]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginVertical: 10,
    marginHorizontal:0,
    
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  radioButtonSelected: {
    borderColor: colors.primaryDark,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    marginLeft: 12,
    fontSize: MyDimensi / 4,
    fontFamily: fonts.secondary[600],
    color: colors.darkText,
  },
  labelSelected: {
    color: colors.primaryDark,
    fontFamily: fonts.secondary[700],
  },
  disabled: {
    borderColor: colors.disabled,
    backgroundColor: colors.lightGray,
  },
  labelDisabled: {
    color: colors.disabled,
  },
});