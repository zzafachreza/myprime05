import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  PanResponder,
  AppState,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {MyHeader} from '../../components';
import {colors} from '../../utils';

export default function WebViewScreen({navigation, route}) {
  const item = route.params;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <MyHeader title={item.title} />
      <View
        style={{
          flex: 1,
        }}>
        <WebView
          source={{
            uri: item.url,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
