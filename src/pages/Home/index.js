import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  Linking
} from 'react-native';
import { colors, fonts, windowWidth } from '../../utils';

export default function Home({ navigation }) {
  // Data menu items dengan URL/link eksternal
  const menuItems = [
      { id: 1, image: require('../../assets/menu19.png'), url: 'https://agcuprimegenerationkarangasem.my.canva.site/aplikasi-cari-id',
            title: 'CARI ID SISWA'
     },

      { id: 2, image: require('../../assets/menu11.png'), url: 'https://absenpg.my.canva.site/presensimyprime',
            title: 'PRESENSI SISWA'
     },
    { id: 3, image: require('../../assets/menu12.png'), url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=0&single=true',
            title: 'FLASH EXERCISE'
     },
    { id: 4, image: require('../../assets/menu13.png'), url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=47009594&single=true' ,
            title: 'FLASH TEST'
    },

    { id: 5, image: require('../../assets/menu1.png'), url: 'https://docs.google.com/forms/d/e/1FAIpQLScpelFVvOQ_ZmEwt2Kwy84zoIsRQY40auzohxSFPQNudsfpPA/closedform',
      title: 'PESAN TOS'
     },
   
    { id: 6, image: require('../../assets/menu2.png'), url: ' https://absenpg.my.canva.site/formizinpg',
      title: 'PENGAJUAN IZIN SISWA'
     },
    { id:7, image: require('../../assets/menu3.png'), url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=141651735&single=true',
            title: 'TOS EXPRESS'
     },
    { id: 8, image: require('../../assets/menu4.png'), url: 'https://docs.google.com/forms/d/e/1FAIpQLSfSjr9Gla525_mrNhDSH4B9qtMAKSvzPEi7Nseh0qqhx-UxJw/viewform',
            title: 'KONSULTASI USS'
     },
    { id: 9, image: require('../../assets/menu5.png'), url: 'https://sites.google.com/view/primegetmembers/dashboard?authuser=0',
            title: 'PRIME GET MEMBERS'
     },
    { id: 10, image: require('../../assets/menu6.png'), url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=1300124076&single=true',
            title: 'PRIME LEARNING AGREEMENT'
     },
    { id: 11, image: require('../../assets/menu7.png'), url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRCQ1u1tL1abpKz0GA85o6b2OwumULIw0UxXz-cVqLWum356bc243n77yprBCHpJTvASRhGv8BUJDFl/pubhtml?gid=1670176431&single=true',
            title: 'STUDENT OF THE WEEK SD'
     },
    { id: 12, image: require('../../assets/menu8.png'), url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQYJbG7BHYBj-YVQoYupPui1eCo95aYLLg6qRt8UkDtbxLNJtZ7A6pTbATf3jm9b117DLwydp0Qpgbq/pubhtml?gid=319664218&single=true',
            title: 'STUDENT OF THE WEEK SMA'
     },
    { id: 13, image: require('../../assets/menu9.png'), url: 'https://docs.google.com/forms/d/e/1FAIpQLSfyi_e1ZQp7DJylhPi7MvjDkAf9QT5lG80ViLgjHk4VoRW5LQ/viewform',
            title: 'PENGAJUAN KOMPLAIN SISWA'
     },
    { id: 14, image: require('../../assets/menu10.png'), url: 'https://absenpg.my.canva.site/staplinkok',
            title: 'DOWNLOAD SERTIFIKAT'
     },
   
    { id: 15, image: require('../../assets/menu14.png'), url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=981714491&single=true' ,
            title: 'AGCU TEST'
    },
    { id: 16, image: require('../../assets/menu15.png'), url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=71098455&single=true' ,
            title: 'SEPUTAR PRIME GENERATION'
    },
    { id: 17, image: require('../../assets/menu16.png'), url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=1153877532&single=true',
            title: 'TRY OUT FLASH'
     },
    { id: 18, image: require('../../assets/menu17.png'), url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUSMOGCOWc28deNGjej_FaBrZ9wg29KlGigIpsACN_Nivj6ARJmaGMQssVkC4lk70SVNdI5OK0siQk/pubhtml?gid=6968534&single=true',
            title: 'STUDENT OF THE WEEK SMP'
     },
    { id: 19, image: require('../../assets/menu18.png'), url: 'https://eduprime.io/login/',
            title: 'E-LEARNING EDUPRIME'
     },
      { id: 20, image: require('../../assets/menu20.png'), url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=656570455&single=true',
            title: 'ONLINE CLASS'
     },
      { id: 21, image: require('../../assets/menu21.png'), url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1A7-Kwt91K28NzdQjLlxidaE-vaxP5dHR5mWz9SNAyZTV0bkOOb9UQ8BFMN4iGB49E3HC1cKDfZse/pubhtml?gid=1436620329&single=true',
            title: 'BOOKWORM'
     },
  
  ];

   // Fungsi untuk navigasi ke WebView dengan URL yang dipilih
const handlePress = (item) => {
  navigation.navigate('WebViewScreen', { 
    url: item.url,
    title: item.title 
  });
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
          {menuItems.map((item) => (
            <TouchableNativeFeedback 
              key={item.id}
             onPress={() => handlePress(item)}
            >
              <View style={{ padding: 10 }}>
                <Image 
                  style={{
                    width: 300,
                    height: 70,
                    alignSelf: 'center',
                    resizeMode: 'contain'
                  }} 
                  source={item.image}
                />
              </View>
            </TouchableNativeFeedback>
          ))}
        </View>
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
    flexGrow: 1,
    paddingBottom: 20,
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
});