import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

export default function MyHeader({ 
  onPress, 
  color = colors.white, 
  title, 
  icon = false, 
  iconname = 'search' 
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Icon 
            type='ionicon' 
            name='arrow-back-outline' 
            size={20} 
            color={color} 
          />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Text 
            style={[styles.title, { color }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>

        {icon ? (
          <TouchableOpacity onPress={onPress} style={styles.iconButton}>
            <Icon name={iconname} size={20} color={color} />
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyIcon} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingBottom: 20,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: -1,
  },
  title: {
    ...fonts.headline2,
    textAlign: 'center',
    maxWidth: '80%', // Prevents title from touching screen edges,
    top:10
  },
  iconButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  emptyIcon: {
    width: 40, // Maintains balance when no icon is present
  },
});