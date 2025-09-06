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
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {MyHeader} from '../../components';
import {colors, fonts} from '../../utils';
import CookieManager from '@react-native-cookies/cookies';
import SoundPlayer from 'react-native-sound-player';

const {width, height} = Dimensions.get('window');

export default function Kunci({navigation, route}) {
  const {KioskMode} = NativeModules;
  const item = route.params;

  // State untuk modal kode akses
  const [modalVisible, setModalVisible] = useState(false);
  const [kodeAkses, setKodeAkses] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // 🔐 Masuk mode kiosk
    KioskMode.enterKioskMode();

    // 🧪 Debug (opsional)
    console.log(
      'KioskMode enter =>',
      typeof NativeModules.KioskMode.enterKioskMode,
    );
    // 🧹 Bersihkan cookie jika diperlukan
    CookieManager.clearAll();

    // 🔒 Cegah tombol back
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        SoundPlayer.playSoundFile('salah', 'mp3'); // 🔊 Putar suara dulu

        Alert.alert(
          'Peringatan',
          'Kamu tidak bisa kembali saat mengerjakan latihan!',
          [
            {
              text: 'Lanjut',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'Tetap Keluar',
              onPress: () => {
                openFormKodeAkses();
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
      KioskMode.exitKioskMode(); // Jaga-jaga jika tidak keluar dari alert
    };
  }, []);

  const EXITMODE = () => {
    KioskMode.exitKioskMode(); // 🔓 Keluarkan dari kiosk
    navigation.goBack(); // ⬅️ Kembali
  };

  const openFormKodeAkses = () => {
    setModalVisible(true);
    setKodeAkses('');
    setErrorMessage('');
  };

  const closeModal = () => {
    setModalVisible(false);
    setKodeAkses('');
    setErrorMessage('');
    setLoading(false);
  };

  const verifikasiKodeAkses = async () => {
    if (!kodeAkses.trim()) {
      setErrorMessage('Silakan masukan kode akses!');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://admin.myprime.my.id/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Token': 'myprime2025api1511tokenAZRF', // Ganti dari Authorization ke X-API-Token
        },
        body: JSON.stringify({
          kode: kodeAkses.trim(),
        }),
      });

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      setLoading(false);

      if (data == 200) {
        // Kode akses valid
        Alert.alert(
          'Berhasil!',
          'Kode akses valid. Keluar dari mode latihan...',
          [
            {
              text: 'OK',
              onPress: () => {
                closeModal();
                setTimeout(() => {
                  EXITMODE(); // Keluar dari kiosk mode dan kembali
                }, 300);
              },
            },
          ],
        );
      } else {
        // Kode akses tidak valid
        setErrorMessage(data.message || 'Kode akses tidak valid!');
        SoundPlayer.playSoundFile('salah', 'mp3');
        // Clear input untuk coba lagi
        setKodeAkses('');
      }
    } catch (error) {
      console.error('Error verifikasi kode akses:', error);
      setLoading(false);
      setErrorMessage('Terjadi kesalahan koneksi. Silakan coba lagi.');
      SoundPlayer.playSoundFile('salah', 'mp3');
    }
  };

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

      {/* Modal Kode Akses */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Masukan Kode Akses</Text>
            <Text style={styles.modalSubtitle}>
              Masukan kode akses untuk keluar dari mode latihan
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Kode Akses"
              placeholderTextColor="#999"
              value={kodeAkses}
              onChangeText={setKodeAkses}
              secureTextEntry={true}
              autoFocus={true}
              maxLength={20}
              onSubmitEditing={verifikasiKodeAkses}
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={closeModal}
                disabled={loading}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.verifyButton]}
                onPress={verifikasiKodeAkses}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.verifyButtonText}>Verifikasi</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: width * 0.85,
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.secondary[600],
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: fonts.secondary[600],
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    fontFamily: fonts.secondary[600],
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: '#ffeaea',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  verifyButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButtonText: {
    color: 'white',
    fontFamily: fonts.secondary[600],
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
