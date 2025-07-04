import { View, Text, ScrollView, TouchableOpacity, Alert, Share } from 'react-native'
import React, { useState } from 'react'
import { colors, fonts, windowWidth } from '../../utils'
import { MyHeader, MyInput, MyButton, MyGap } from '../../components'
import Clipboard from '@react-native-clipboard/clipboard';

export default function ZTEConfig({navigation}) {
  const [form, setForm] = useState({
    port: '',
    onuNumber: '',
    sn: '',
    description: '',
    username: '',
    password: '',
    ssid: '',
    vlan1: '',
    vlan2: ''
  });

  const [showResult, setShowResult] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');

  const handleInputChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    });
  };

  const generateScript = () => {
    if (!form.port || !form.onuNumber || !form.sn || !form.vlan1) {
      Alert.alert('Error', 'Harap isi semua field yang wajib!');
      return;
    }

    const script = `
interface gpon-olt_${form.port}
onu ${form.onuNumber} type ZTE-F670L sn ${form.sn}
!
interface gpon-onu_${form.port}:${form.onuNumber}
  name ${form.description || 'Customer'}
  description 1$$${form.description || 'Customer'}$$
  tcont 1 profile 1G
  tcont 2 profile 1G
  gemport 1 tcont 1
  gemport 2 tcont 2
  service-port 1 vport 1 user-vlan ${form.vlan1} vlan ${form.vlan1}
  service-port 2 vport 2 user-vlan ${form.vlan2 || form.vlan1} vlan ${form.vlan2 || form.vlan1}
!
pon-onu-mng gpon-onu_${form.port}:${form.onuNumber}
  service 1 gemport 1 vlan ${form.vlan1}
  ${form.vlan2 ? `service 2 gemport 2 vlan ${form.vlan2}` : ''}
  ${form.username ? `wan-ip 1 mode pppoe username ${form.username} password ${form.password} vlan-profile VLAN${form.vlan1}-PPPOE host 1` : ''}
  security-mgmt 212 state enable mode forward protocol web
  interface wifi wifi_0/2 state unlock
  ${form.ssid ? `ssid auth wep wifi_0/2 open-system
  ssid ctrl wifi_0/2 name ${form.ssid}
  vlan port wifi_0/2 mode tag vlan ${form.vlan2 || form.vlan1}` : ''}
  vlan port eth_0/1 mode tag vlan ${form.vlan2 || form.vlan1}
  vlan port eth_0/2 mode tag vlan ${form.vlan2 || form.vlan1}
  vlan port eth_0/3 mode tag vlan ${form.vlan2 || form.vlan1}
  vlan port eth_0/4 mode tag vlan ${form.vlan2 || form.vlan1}
!
exit
write
    `.trim();

    setGeneratedScript(script);
    setShowResult(true);
  };

  const copyToClipboard = () => {
    Clipboard.setString(generatedScript);
    Alert.alert('Berhasil', 'Script telah disalin ke clipboard!');
  };

  const shareScript = async () => {
    try {
      await Share.share({
        message: generatedScript,
        title: 'Konfigurasi ZTE ONT'
      });
    } catch (error) {
      Alert.alert('Error', 'Gagal membagikan script');
    }
  };

  const resetForm = () => {
    setForm({
      port: '',
      onuNumber: '',
      sn: '',
      description: '',
      username: '',
      password: '',
      ssid: '',
      vlan1: '',
      vlan2: ''
    });
    setShowResult(false);
  };

  return (
    <View style={styles.container}>
      <MyHeader title="ZTE Config" onPress={() => navigation.goBack()}/>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          {!showResult ? (
            <>
              <MyInput 
                label="Port" 
                value={form.port}
                onChangeText={(text) => handleInputChange('port', text)}
                placeholder="Contoh: 1/1/3"
              />
              <MyInput 
                label="Nomor ONU" 
                value={form.onuNumber}
                onChangeText={(text) => handleInputChange('onuNumber', text)}
                keyboardType="numeric"
              />
              <MyInput 
                label="SN (Serial Number)" 
                value={form.sn}
                onChangeText={(text) => handleInputChange('sn', text)}
              />
              <MyInput 
                label="Nama Description" 
                value={form.description}
                onChangeText={(text) => handleInputChange('description', text)}
              />
              <MyInput 
                label="Username PPPoE" 
                value={form.username}
                onChangeText={(text) => handleInputChange('username', text)}
              />
              <MyInput 
                label="Password PPPoE" 
                value={form.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry
              />
              <MyInput 
                label="SSID" 
                value={form.ssid}
                onChangeText={(text) => handleInputChange('ssid', text)}
              />
              <MyInput 
                label="VLAN 1 (Internet)" 
                value={form.vlan1}
                onChangeText={(text) => handleInputChange('vlan1', text)}
                keyboardType="numeric"
              />
              <MyInput 
                label="VLAN 2 (VoIP/TV)" 
                value={form.vlan2}
                onChangeText={(text) => handleInputChange('vlan2', text)}
                keyboardType="numeric"
              />

              <MyGap height={20} />
              <View style={styles.buttonContainer}>
                <MyButton 
                  title="Generate Script" 
                  onPress={generateScript}
                  style={styles.fullWidthButton}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.resultTitle}>Hasil Konfigurasi:</Text>
              
              <View style={styles.scriptContainer}>
                <Text selectable style={styles.scriptText}>
                  {generatedScript}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <View style={styles.halfWidthButton}>
                  <MyButton 
                    title="Copy" 
                    onPress={copyToClipboard}
                    type="secondary"
                  />
                </View>
                <View style={styles.halfWidthButton}>
                  <MyButton 
                    title="Share" 
                    onPress={shareScript}
                    type="secondary"
                  />
                </View>
              </View>

              <MyGap height={10} />
              <View style={styles.buttonContainer}>
                <MyButton 
                  title="Buat Konfigurasi Baru" 
                  onPress={resetForm}
                  style={styles.fullWidthButton}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  contentContainer: {
    padding: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  fullWidthButton: {
    width: '100%',
  },
  resultTitle: {
    fontFamily: fonts.primary[600],
    fontSize: 16,
    color: colors.dark,
    marginBottom: 15,
  },
  scriptContainer: {
    backgroundColor: colors.greyLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  scriptText: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    color: colors.dark,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfWidthButton: {
    width: '48%',
  },
};