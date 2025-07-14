import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  Linking,
  Modal,
  TouchableOpacity,

} from 'react-native';
import {colors, fonts, windowWidth} from '../../utils';

export default function Home({navigation}) {
   const [modalVisible, setModalVisible] = useState(false);
  // Data menu items dengan URL/link eksternal
  const menuItems = [
    {
      id: 1,
      image: require('../../assets/menu19.png'),
      url: 'https://agcuprimegenerationkarangasem.my.canva.site/aplikasi-cari-id',
      title: 'CARI ID SISWA',
      kunci: 0,
    },

    {
      id: 2,
      image: require('../../assets/menu11.png'),
      url: 'https://absenpg.my.canva.site/presensimyprime',
      title: 'PRESENSI SISWA',
      kunci: 0,
    },
    {
      id: 3,
      image: require('../../assets/menu12.png'),
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=0&single=true',
      title: 'FLASH EXERCISE',
      kunci: 1,
    },
    {
      id: 4,
      image: require('../../assets/menu13.png'),
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=47009594&single=true',
      title: 'FLASH TEST',
      kunci: 1,
    },

    {
      id: 5,
      image: require('../../assets/menu1.png'),
      url: 'https://docs.google.com/forms/d/e/1FAIpQLScpelFVvOQ_ZmEwt2Kwy84zoIsRQY40auzohxSFPQNudsfpPA/closedform',
      title: 'PESAN TOS',
      kunci: 0,
    },

    {
      id: 6,
      image: require('../../assets/menu2.png'),
      url: ' https://absenpg.my.canva.site/formizinpg',
      title: 'PENGAJUAN IZIN SISWA',
      kunci: 0,
    },
    {
      id: 7,
      image: require('../../assets/menu3.png'),
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=141651735&single=true',
      title: 'TOS EXPRESS',
    },
    {
      id: 8,
      image: require('../../assets/menu4.png'),
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSfSjr9Gla525_mrNhDSH4B9qtMAKSvzPEi7Nseh0qqhx-UxJw/viewform',
      title: 'KONSULTASI USS',
      kunci: 0,
    },
    {
      id: 9,
      image: require('../../assets/menu5.png'),
      url: 'https://sites.google.com/view/primegetmembers/dashboard?authuser=0',
      title: 'PRIME GET MEMBERS',
      kunci: 0,
    },
    {
      id: 10,
      image: require('../../assets/menu6.png'),
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=1300124076&single=true',
      title: 'PRIME LEARNING AGREEMENT',
      kunci: 0,
    },
    {
      id: 11,
      image: require('../../assets/menu7.png'),
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRCQ1u1tL1abpKz0GA85o6b2OwumULIw0UxXz-cVqLWum356bc243n77yprBCHpJTvASRhGv8BUJDFl/pubhtml?gid=1670176431&single=true',
      title: 'STUDENT OF THE WEEK SD',
      kunci: 0,
    },
    {
      id: 12,
      image: require('../../assets/menu8.png'),
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQYJbG7BHYBj-YVQoYupPui1eCo95aYLLg6qRt8UkDtbxLNJtZ7A6pTbATf3jm9b117DLwydp0Qpgbq/pubhtml?gid=319664218&single=true',
      title: 'STUDENT OF THE WEEK SMA',
      kunci: 0,
    },
    {
      id: 13,
      image: require('../../assets/menu9.png'),
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSfyi_e1ZQp7DJylhPi7MvjDkAf9QT5lG80ViLgjHk4VoRW5LQ/viewform',
      title: 'PENGAJUAN KOMPLAIN SISWA',
      kunci: 0,
    },
    {
      id: 14,
      image: require('../../assets/menu10.png'),
      url: 'https://absenpg.my.canva.site/staplinkok',
      title: 'DOWNLOAD SERTIFIKAT',
      kunci: 0,
    },

    {
      id: 15,
      image: require('../../assets/menu14.png'),
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=981714491&single=true',
      title: 'AGCU TEST',
      kunci: 1,
    },
    {
      id: 16,
      image: require('../../assets/menu15.png'),
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=71098455&single=true',
      title: 'SEPUTAR PRIME GENERATION',
      kunci: 0,
    },
    {
      id: 17,
      image: require('../../assets/menu16.png'),
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=1153877532&single=true',
      title: 'TRY OUT FLASH',
      kunci: 1,
    },
    {
      id: 18,
      image: require('../../assets/menu17.png'),
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUSMOGCOWc28deNGjej_FaBrZ9wg29KlGigIpsACN_Nivj6ARJmaGMQssVkC4lk70SVNdI5OK0siQk/pubhtml?gid=6968534&single=true',
      title: 'STUDENT OF THE WEEK SMP',
      kunci: 0,
    },
    {
      id: 19,
      image: require('../../assets/menu18.png'),
      url: 'https://eduprime.io/login/',
      title: 'E-LEARNING EDUPRIME',
      kunci: 1,
    },
    {
      id: 20,
      image: require('../../assets/menu20.png'),
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=656570455&single=true',
      title: 'ONLINE CLASS',
      kunci: 0,
    },
    {
      id: 21,
      image: require('../../assets/menu21.png'),
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=1436620329&single=true',
      title: 'BOOKWORM',
      kunci: 1,
    },
  ];

  // Fungsi untuk navigasi ke WebView dengan URL yang dipilih
  const handlePress = item => {
    console.log(item);
    if (item.kunci > 0) {
      navigation.navigate('Kunci', {
        url: item.url,
        title: item.title,
      });
    } else {
      navigation.navigate('WebViewScreen', {
        url: item.url,
        title: item.title,
      });
    }
  };

    const openWhatsApp = (phoneNumber) => {
    const url = `whatsapp://send?phone=${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Jika WhatsApp tidak terinstall, buka browser
          const webUrl = `https://wa.me/${phoneNumber}`;
          return Linking.openURL(webUrl);
        }
      })
      .catch((err) => console.error('Error opening WhatsApp:', err));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Selamat Datang</Text>
            <Text style={styles.appName}>My Prime</Text>
          </View>
          <Image
            style={styles.logo}
            source={require('../../assets/logo.png')}
          />
        </View>

        <View style={styles.menuContainer}>
          {/* Menu dengan perulangan */}
          {menuItems.map(item => (
            <TouchableNativeFeedback
              key={item.id}
              onPress={() => handlePress(item)}>
              <View style={{padding: 10}}>
                <Image
                  style={{
                    width: 300,
                    height: 70,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                  }}
                  source={item.image}
                />
              </View>
            </TouchableNativeFeedback>
          ))}
        </View>
      </ScrollView>

      <View style={styles.floatingContactButton}>
            <TouchableNativeFeedback onPress={() => setModalVisible(true)}>
              <View style={styles.contactButton}>

              <Image style={{
                width:20,
                height:20,
              }} source={require('../../assets/wa-icon.png')}/>
              <Text style={{
                fontFamily:fonts.primary[700],
                marginHorizontal:10,
                fontSize:12

              }}>Hubungi Kami</Text>
              </View>
            </TouchableNativeFeedback>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Kontak WhatsApp</Text>
            
            {/* Pilihan WhatsApp 1 */}
            <TouchableOpacity 
              style={styles.waOption}
              onPress={() => {
                openWhatsApp('6282341733030'); // Ganti dengan nomor pertama
                setModalVisible(false);
              }}>
              <Image
                style={styles.waOptionIcon}
                source={require('../../assets/wa-icon.png')}
              />
              <Text style={styles.waOptionText}>Admin  Diponegoro</Text>
            </TouchableOpacity>
            
            {/* Pilihan WhatsApp 2 */}
            <TouchableOpacity 
              style={styles.waOption}
              onPress={() => {
                openWhatsApp('6281339416161'); // Ganti dengan nomor kedua
                setModalVisible(false);
              }}>
              <Image
                style={styles.waOptionIcon}
                source={require('../../assets/wa-icon.png')}
              />
              <Text style={styles.waOptionText}>Admin Gedung Untung Surapati</Text>
            </TouchableOpacity>
            
            {/* Tombol Tutup */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },

   contactButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 30,
  },
  welcomeText: {
    fontFamily: fonts.primary[500],
    color: colors.white,
    fontSize: 16,
  },
  appName: {
    fontFamily: fonts.primary[700],
    color: colors.white,
    fontSize: 20,
    marginTop: 5,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  menuContainer: {
    paddingHorizontal: 20,
  },


  contactButtonContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 20,
    right: 10,
  },
  contactButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    elevation: 3,
    borderColor:'#9f9a9aff'
  },
  waIcon: {
    width: 30,
    height: 30,
  },
  contactText: {
    fontFamily: fonts.primary[500],
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: fonts.primary[600],
    fontSize: 18,
    marginBottom: 20,
    color: colors.primary,
  },
  waOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  waOptionIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  waOptionText: {
    fontFamily: fonts.primary[500],
    fontSize: 12,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontFamily: fonts.primary[600],
    fontSize: 16,
  },

   floatingContactButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderColor:'#dededede'
  },
});
