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
  NativeModules,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {MyHeader} from '../../components';
import {colors} from '../../utils';
import CookieManager from '@react-native-cookies/cookies';

export default function Kunci({navigation, route}) {
  const {KioskMode} = NativeModules;
  const item = route.params;
  useEffect(() => {
    KioskMode.enterKioskMode();
    console.log('KioskMode Native =>', NativeModules.KioskMode.enterKioskMode);
    CookieManager.clearAll(); // opsional bersihkan cookie dulu
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Peringatan',
          'Kamu tidak bisa kembali saat mengerjakan latihan!',
          [
            {text: 'Lanjut', onPress: () => {}},
            {
              text: 'Tetap Keluar',
              onPress: () => {
                KioskMode.exitKioskMode();
                navigation.goBack();
              },
            },
          ],
        );
        return true; // tetap cegah back
      },
    );

    return () => backHandler.remove();
  }, []);
  const injectedJS = `
    document.querySelectorAll('a[target="_blank"]').forEach(el => {
      el.removeAttribute('target');
    });
    true; // Required for Android
  `;

  const handleUrlRequest = request => {
    const url = request.url;

    // Jika login URL Google atau link tertentu, tetap di WebView
    if (
      url.startsWith('https://accounts.google.com') ||
      url.includes('google.com')
    ) {
      return true; // Biarkan WebView memuat URL tersebut
    }

    // Jika link eksternal lainnya, bisa dicegah atau dibuka di dalam WebView
    if (url.startsWith('http')) {
      return true; // Tetap load di WebView
    }

    return false;
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <MyHeader noback title={item.title} />

      <View
        style={{
          flex: 1,
        }}>
        <WebView
          source={{
            uri: item.url,
          }}
          injectedJavaScript={injectedJS}
          thirdPartyCookiesEnabled={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onShouldStartLoadWithRequest={handleUrlRequest}
          originWhitelist={['*']} // untuk memastikan semua url bisa dimuat
          setSupportMultipleWindows={false} // ini penting agar link _blank tidak buka tab baru
          startInLoadingState
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
