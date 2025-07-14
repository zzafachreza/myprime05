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
import {MyButton, MyHeader} from '../../components';
import {colors} from '../../utils';
import CookieManager from '@react-native-cookies/cookies';
import SoundPlayer from 'react-native-sound-player';

export default function Kunci({navigation, route}) {
  const {KioskMode} = NativeModules;
  const item = route.params
  const cekKiosmode = async () => {
    const isActive = await KioskMode.isKioskModeActive();

    if (!isActive) {
      navigation.goBack()
      alert("Mode full belum diaktifkan, silahkan klik 'mengerti'")
    }
  }
  useEffect(() => {
  
    setTimeout(() => {
      cekKiosmode();
    }, 2000);
    

  // 🔐 Masuk mode kiosk
  KioskMode.enterKioskMode()
    .then((success) => {
      console.log('cek',success)
      if (!success) {
        // ❌ Tidak setuju / tidak bisa Kiosk → back
        navigation.goBack();
        return;
      }

      // ✅ Kalau berhasil, jalanin lanjutan
      CookieManager.clearAll();

      // 🔒 Cegah tombol back
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          SoundPlayer.playSoundFile('salah', 'mp3');
          Alert.alert(
            'Peringatan',
            'Kamu tidak bisa kembali saat mengerjakan tes, yuk selesaikan dulu tesnya!',
            [
              {
                text: 'Lanjut',
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: 'Tetap Keluar',
                onPress: () => {
                  KioskMode.exitKioskMode();
                  navigation.goBack();
                },
              },
            ],
          );
          return true;
        },
      );

      // 🔁 Cleanup saat unmount
      return () => {
        backHandler.remove();
        KioskMode.exitKioskMode();
      };
    })
    .catch((err) => {
      console.error('Gagal masuk kiosk mode:', err);
      navigation.goBack();
    });
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
      {/* <MyButton onPress={async ()=>{
        try {
      const isActive = await KioskMode.isKioskModeActive();
      console.log('Apakah Kiosk Mode aktif? =>', isActive);
    } catch (e) {
      console.log('Gagal cek kiosk mode:', e);
    }
      }} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
