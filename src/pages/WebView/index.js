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
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { MyHeader } from '../../components';
import Orientation from 'react-native-orientation-locker';
import { CommonActions } from '@react-navigation/native';
import CookieManager from '@react-native-cookies/cookies'; // tambahkan ini


export default function WebViewScreen({ navigation, route }) {
  const { url, title } = route.params;
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const swipeCount = useRef(0);
  const lastSwipeTime = useRef(0);
  const appState = useRef(AppState.currentState);
  const timeoutRef = useRef(null);

  const allowedExamUrls = [
    'https://docs.google.com/forms/d/e/1FAIpQLSeqyR9h18JFi3IRcINAezcNXHFJoYpEv1TNbkjBsFU9AnYZig/viewform',
    'https://docs.google.com/forms/d/e/1FAIpQLSfNGhFUq14TWIO7Xcaxh8Eub0IagwEQDmKVuQfBD3jn0mHAlg/viewform',
    'https://docs.google.com/forms/d/e/1FAIpQLScLCjgZq_WhnmquT4pqVOkUP7fgtWV9SSVQnL2sSsUv7JV8DA/viewform',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=0&single=true',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=47009594&single=true'
  ];

  const isExamMode = allowedExamUrls.some(examUrl =>
    url.startsWith(examUrl.split('?')[0])
  );

const handleShouldStartLoadWithRequest = (request) => {
  const isAllowed =
    request.url.includes('docs.google.com') ||
    request.url.includes('forms.gle') ||
    request.url.includes('spreadsheets.google.com');

  if (isAllowed) {
    return true;
  }

  if (isExamMode) {
    Alert.alert(
      'Akses Diblokir',
      'Link ini tidak diizinkan di mode ujian',
      [{ text: 'OK' }]
    );
    return false;
  }

  return true;
};



 const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Hanya tangkap gesture geser ke atas cepat (buat keluar)
      return gestureState.dy < -50 && gestureState.vy < -0.5;
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy < -50 && gestureState.vy < -0.5) {
        const now = Date.now();
        if (now - lastSwipeTime.current < 1000) {
          swipeCount.current += 1;
          if (swipeCount.current >= 2) {
            handleExit();
          }
        } else {
          swipeCount.current = 1;
        }
        lastSwipeTime.current = now;
      }
    },
  })
).current;

  useEffect(() => {
    if (!isExamMode) return;

    Orientation.lockToPortrait();
    StatusBar.setHidden(true, 'fade');

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        Alert.alert('PERINGATAN', 'Aplikasi akan ditutup karena terdeteksi keluar dari ujian.');

        timeoutRef.current = setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Splash' }],
            })
          );
        }, 3000);
      }

      appState.current = nextAppState;
    });


    return () => {
      subscription.remove();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      backHandler.remove();
      Orientation.unlockAllOrientations();
      StatusBar.setHidden(false);
    };
  }, [isExamMode]);



  useEffect(() => {
  CookieManager.clearAll(true).then(() => {
    CookieManager.setFromResponse(
      'https://accounts.google.com',
      'SID=YOUR_SAVED_SID_COOKIE_VALUE; Path=/; HttpOnly'
    );
  });
}, []);


const handleExit = () => {
  Alert.alert(
    'Konfirmasi Keluar',
    'Anda yakin ingin keluar dari mode ujian?',
    [
      {
        text: 'Batal',
        style: 'cancel',
        onPress: () => {
          swipeCount.current = 0;
        },
      },
      {
        text: 'Keluar',
        onPress: () => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }], // <- Ganti sesuai nama screen awal kamu
            })
          );
        },
        style: 'destructive',
      },
    ],
    { cancelable: false }
  );
};


  const onLoadEnd = () => {
    setLoading(false);
  };

  const handleNavigationStateChange = (navState) => {
  // Contoh: kalau mau deteksi jika halaman error
  if (navState.url.includes('accounts.google.com')) {
    console.log('Login Google sedang berjalan...');
  }

  // Tambahan logika lainnya kalau perlu
  // console.log(navState.url);
};


  return (
    <View
      style={[styles.container, isExamMode && styles.examContainer]}
      {...(isExamMode ? panResponder.panHandlers : {})}
    >
      {!isExamMode && <MyHeader title={title} />}

      {isExamMode && (
        <View style={styles.examWarning}>
          <Text style={styles.warningText}>MODE UJIAN - DILARANG KELUAR</Text>
        </View>
      )}

     <WebView
  ref={webViewRef}
  source={{ uri: url }}
  style={styles.webview}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  startInLoadingState={true}
  scalesPageToFit={false} // ini cegah zoom pinch
  androidHardwareAccelerationDisabled={false}
  onLoadEnd={onLoadEnd}
  scrollEnabled={true}
    thirdPartyCookiesEnabled={true}
  sharedCookiesEnabled={true}
   nestedScrollEnabled={true}
  onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
onNavigationStateChange={handleNavigationStateChange}
  mixedContentMode="compatibility"
  allowsInlineMediaPlayback={true}
  mediaPlaybackRequiresUserAction={false}
  allowsFullscreenVideo={true}
  allowsBackForwardNavigationGestures={false}
  incognito={false} // Penting untuk maintain login session
  cacheEnabled={true}
  cacheMode="LOAD_DEFAULT"
  userAgent="Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36"
  injectedJavaScript={ 

     isExamMode
    ? ` (function() {
        function fixLinks() {
          const anchors = document.querySelectorAll('a');
          for (let i = 0; i < anchors.length; i++) {
            const a = anchors[i];
            a.removeAttribute('target');
            a.setAttribute('target', '_self');
            a.onclick = function(e) {
              e.preventDefault();
              window.location.href = this.href;
            };
          }
        }

        document.addEventListener('DOMContentLoaded', fixLinks);
        setTimeout(fixLinks, 1000); // Retry after 1s
        setInterval(fixLinks, 3000); // Re-apply every 3s if dynamic content

        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', function(event) {
          window.history.pushState(null, null, window.location.href);
        });

        document.addEventListener('contextmenu', function(e) { 
          e.preventDefault(); 
          return false; 
        });

        document.addEventListener('selectstart', function(e) { 
          e.preventDefault(); 
          return false; 
        });

        document.addEventListener('keydown', function(e) {
          if (e.ctrlKey || e.metaKey || e.altKey || e.key === 'F12') {
            e.preventDefault(); 
            return false;
          }
        });

        document.addEventListener('gesturestart', function(e) {
          e.preventDefault(); 
          return false;
        });

        if (window.top !== window.self) {
          window.top.location = window.self.location;
        }

        return true;
      })();
    `
    : `
      (function() {
        function fixLinks() {
          const anchors = document.querySelectorAll('a');
          for (let i = 0; i < anchors.length; i++) {
            const a = anchors[i];
            a.removeAttribute('target');
            a.setAttribute('target', '_self');
            a.onclick = function(e) {
              e.preventDefault();
              window.location.href = this.href;
            };
          }
        }

        document.addEventListener('DOMContentLoaded', fixLinks);
        setTimeout(fixLinks, 1000);
        setInterval(fixLinks, 3000);

        return true;
      })();
    `
  }
/>


      {loading && isExamMode && (
        <View style={styles.blockerOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Memuat Mode Ujian...</Text>
        </View>
      )}

      {isExamMode && (
        <TouchableOpacity
          style={styles.exitButton}
          onPress={handleExit}
          activeOpacity={0.7}
        >
          <Text style={styles.exitText}>KELUAR</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  examContainer: {
    borderWidth: 3,
    borderColor: 'red',
    overflow: 'hidden',
  },
  examWarning: {
    backgroundColor: '#d32f2f',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  webview: {
    flex: 1,
  },
  exitButton: {
    backgroundColor: '#d32f2f',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  blockerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 60,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});
