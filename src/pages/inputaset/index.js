import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors, fonts } from '../../utils'
import { MyHeader, MyInput, MyRadio } from '../../components'
import * as Animatable from 'react-native-animatable';
import { Icon } from 'react-native-elements'

export default function InputAset({navigation}) {
  const [form, setForm] = useState({
    kodeAset: '',
    namaAset: '',
    pertanyaan1: null,
    pertanyaan2: null
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);


  // Key untuk AsyncStorage
  const STORAGE_KEY = 'DATA_ASET'

  // Handle perubahan radio button
  const handleRadioChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'pertanyaan1' && { pertanyaan2: null })
    }))
  }

  // Simpan data ke AsyncStorage
  const saveData = async (newData) => {
    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedData = existingData ? JSON.parse(existingData) : [];
      const updatedData = [...parsedData, newData];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      return true;
    } catch (e) {
      console.error('Gagal menyimpan data:', e);
      return false;
    }
  }

  // Handle submit form
  const handleSubmit = async () => {
    if (!form.kodeAset || !form.namaAset || form.pertanyaan1 === null) {
      alert('Harap lengkapi semua field wajib!');
      return;
    }

    if (form.pertanyaan1 === 'Tidak' && form.pertanyaan2 === null) {
      alert('Harap jawab pertanyaan kedua!');
      return;
    }

    const klasifikasi = 
      form.pertanyaan1 === 'Ya' ? 'Aset Layanan Publik' :
      form.pertanyaan2 === 'Ya' ? 'Aset Pemerintahan/Umum' :
      'Aset Internal/Investasi';

    const dataToSave = {
      id: Date.now().toString(),
      kode: form.kodeAset,
      nama: form.namaAset,
      klasifikasi,
      jawaban: {
        pertanyaan1: form.pertanyaan1,
        pertanyaan2: form.pertanyaan2
      },
      tanggal: new Date().toISOString()
    };

    const isSaved = await saveData(dataToSave);
    
    if (isSaved) {
      setShowSuccessModal(true);
      setForm({
        kodeAset: '',
        namaAset: '',
        pertanyaan1: null,
        pertanyaan2: null
      });
      
      // Auto close modal setelah 2 detik
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2500);
    } else {
      alert('Gagal menyimpan data!');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <MyHeader title="Input Aset" onPress={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ padding: 10 }}>
          <MyInput 
            label="Kode Aset" 
            placeholder="Masukan Kode Aset"
            value={form.kodeAset}
            onChangeText={text => setForm({...form, kodeAset: text})}
          />
          
          <MyInput 
            label="Nama Aset" 
            placeholder="Masukan Nama Aset"
            value={form.namaAset}
            onChangeText={text => setForm({...form, namaAset: text})}
          />

          {/* Pertanyaan 1 */}
          <View style={{ marginTop: 15, padding: 10 }}>
            <Text style={{
              fontFamily: fonts.primary[500],
              fontSize: 14,
              marginBottom: 8
            }}>
              Apakah properti dijual/diserahkan dalam rangka pelayanan kepada masyarakat?
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <MyRadio 
                label="Ya" 
                selected={form.pertanyaan1 === 'Ya'}
                onPress={() => handleRadioChange('pertanyaan1', 'Ya')}
                containerStyle={{ marginRight: 20 }}
              />
              
              <View style={{ marginHorizontal: 10 }}>
                <MyRadio 
                  label="Tidak" 
                  selected={form.pertanyaan1 === 'Tidak'}
                  onPress={() => handleRadioChange('pertanyaan1', 'Tidak')}
                />
              </View>
            </View>
          </View>

          {/* Pertanyaan 2 (kondisional) */}
          {form.pertanyaan1 === 'Tidak' && (
            <View style={{ marginTop: 10, padding: 10 }}>
              <Text style={{
                fontFamily: fonts.primary[500],
                fontSize: 14,
                marginBottom: 8
              }}>
                Apakah properti digunakan untuk kegiatan pemerintahan, dimanfaatkan masyarakat umum, produksi barang/jasa, atau tujuan administratif?
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <MyRadio 
                  label="Ya" 
                  selected={form.pertanyaan2 === 'Ya'}
                  onPress={() => handleRadioChange('pertanyaan2', 'Ya')}
                  containerStyle={{ marginRight: 20 }}
                />
                
                <View style={{ marginHorizontal: 10 }}>
                  <MyRadio 
                    label="Tidak" 
                    selected={form.pertanyaan2 === 'Tidak'}
                    onPress={() => handleRadioChange('pertanyaan2', 'Tidak')}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Tombol Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: colors.primary,
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 30,
              marginHorizontal: 10
            }}
          >
            <Text style={{
              color: colors.white,
              fontFamily: fonts.primary[600],
              fontSize: 16
            }}>
              Simpan
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

       {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <Animatable.View 
            animation="bounceIn"
            duration={1000}
            style={styles.modalContent}
          >
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={1500}
            >
              <Icon type='ionicon' name="checkmark-done-circle" size={80} color="#4BB543" />
            </Animatable.View>
            
            <Text style={styles.successText}>Data Berhasil Disimpan!</Text>
            
            <Animatable.Text 
              animation="fadeIn" 
              delay={500}
              style={styles.subText}
            >
              Aset telah tersimpan di perangkat Anda
            </Animatable.Text>
          </Animatable.View>
        </View>
      </Modal>

    </View>
  )
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  successText: {
    fontFamily: fonts.primary[700],
    fontSize: 20,
    color: colors.darkText,
    marginTop: 15,
    marginBottom: 5,
    textAlign:"center"
  },
  subText: {
    fontFamily: fonts.primary[400],
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
  },
});