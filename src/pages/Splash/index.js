import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated,
  SafeAreaView,
} from 'react-native';
import { MyDimensi, colors, fonts, windowHeight, windowWidth } from '../../utils';

export default function Splash({ navigation }) {
  // Animasi untuk logo
  const logoScale = new Animated.Value(0.8);
  const logoOpacity = new Animated.Value(0);
  
  // Animasi untuk teks
  const textScale = new Animated.Value(0.8);
  const textOpacity = new Animated.Value(0);
  
  // Animasi untuk loading indicator
  const loadingOpacity = new Animated.Value(0);

  useEffect(() => {
    // Sequence animasi
    Animated.sequence([
      // Animasi logo muncul
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      
      // Animasi teks muncul
      Animated.parallel([
        Animated.spring(textScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      
      // Animasi loading muncul
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        delay: 200,
      })
    ]).start();

    setTimeout(() => {
      navigation.replace("Home");
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo dengan animasi */}
        <Animated.Image
          source={require('../../assets/logo.png')}
          resizeMode="contain"
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            }
          ]}
        />
        
        {/* Teks dengan animasi */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ scale: textScale }],
            }
          ]}
        >
          <Text style={styles.appName}>My Prime</Text>
        </Animated.View>
        
        {/* Loading indicator dengan animasi */}
        <Animated.View style={{ opacity: loadingOpacity }}>
          <ActivityIndicator 
            color={colors.primary} 
            size="small" 
            style={styles.loading} 
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50, // Memberi ruang di bawah
  },
  logo: {
    width: windowWidth / 2, // Ukuran lebih proporsional
    height: windowWidth / 2,
    marginBottom: 30, // Jarak dengan teks
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30, // Jarak dengan loading
  },
  appName: {
    fontFamily: fonts.primary[600],
    fontSize: 24,
    color: colors.primary,
    textAlign: 'center',
    top:0
  },
  loading: {
    marginTop: 20,
  }
});