import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {colors, fonts} from '../../utils';
import {MyHeader} from '../../components';

export default function ONTPage({navigation}) {
  const ontMenus = [
    {
      id: 1,
      name: 'ZTE',
      color: '#C62828',
      screen: 'ZTEConfig',
    },
    {
      id: 2,
      name: 'FH ACS',
      color: '#1565C0',
      screen: 'FhAcsConfig',
    },
    {
      id: 3,
      name: 'FH POLOS',
      color: '#00838F',
      screen: 'FhPolosConfig',
    },
    {
      id: 4,
      name: 'ZTE DUALBAND',
      color: '#D84315',
      screen: 'ZteDualbandConfig',
    },
    {
      id: 5,
      name: 'UNIVERSAL-ONT',
      color: '#2E7D32',
      screen: 'UniversalOntConfig',
    },
  ];

  return (
    <View style={styles.container}>
      <MyHeader title="ONT TYPE" onPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {ontMenus.map(menu => (
          <TouchableOpacity
            key={menu.id}
            style={[styles.menuItem, {backgroundColor: menu.color}]}
            onPress={() => navigation.navigate(menu.screen)}>
            <Text style={styles.menuText}>{menu.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    padding: 15,
  },
  menuItem: {
    borderRadius: 10,
    padding: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  menuText: {
    fontFamily: fonts.primary[700],
    fontSize: 18,
    color: colors.white,
  },
});
