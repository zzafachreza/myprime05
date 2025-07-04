import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { colors, fonts } from '../../utils'
import { MyHeader, MyInput, MyButton, MyGap } from '../../components'
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';

export default function ZteDualbandConfig({navigation}) {
  const [form, setForm] = useState({
    port: '',
    onuNumber: '',
    sn: '',
    description: '',
    username: '',
    password: '',
    ssid: '',
    vlan1: '',
    vlan2: '',
    wifiAuth: 'wep'
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
  if (!form.port || !form.onuNumber || !form.sn || !form.vlan1 || !form.vlan2 || !form.ssid || !form.username || !form.password) {
    Alert.alert('Error', 'Harap isi semua field yang wajib!');
    return;
  }

  const wifiAuthScript =
    form.wifiAuth === 'wep'
      ? `  ssid auth wep wifi_0/2 open-system\n  ssid auth wep wifi_0/6 open-system`
      : `  ssid auth ${form.wifiAuth} wifi_0/2\n  ssid auth ${form.wifiAuth} wifi_0/6`;

  const script = `conf t
interface gpon-olt_${form.port}
onu ${form.onuNumber} type ZTE-F670L sn ${form.sn}
!
interface gpon-onu_${form.port}:${form.onuNumber}
  name ${form.description}
  description 1$$${form.description}$$
  tcont 1 profile 1G
  tcont 2 profile 1G
  gemport 1 tcont 1
  gemport 2 tcont 2
  service-port 1 vport 1 user-vlan ${form.vlan1} vlan ${form.vlan1}
  service-port 2 vport 2 user-vlan ${form.vlan2} vlan ${form.vlan2}
!
pon-onu-mng gpon-onu_${form.port}:${form.onuNumber}
  service 1 gemport 1 vlan ${form.vlan1}
  service 2 gemport 2 vlan ${form.vlan2}
  wan-ip 1 mode pppoe username ${form.username} password ${form.password} vlan-profile VLAN${form.vlan1}-PPPOE host 1
  security-mgmt 212 state enable mode forward protocol web
  interface wifi wifi_0/2 state unlock
  interface wifi wifi_0/6 state unlock
${wifiAuthScript}
  ssid ctrl wifi_0/2 name ${form.ssid}
  ssid ctrl wifi_0/6 name ${form.ssid}
  vlan port wifi_0/2 mode tag vlan ${form.vlan2}
  vlan port wifi_0/6 mode tag vlan ${form.vlan2}
  vlan port eth_0/1 mode tag vlan ${form.vlan2}
  vlan port eth_0/2 mode tag vlan ${form.vlan2}
  vlan port eth_0/3 mode tag vlan ${form.vlan2}
  vlan port eth_0/4 mode tag vlan ${form.vlan2}
!
exit`.trim();

  setGeneratedScript(script);
  setShowResult(true);
};

  const copyToClipboard = () => {
    Clipboard.setString(generatedScript);
    Alert.alert('Berhasil', 'Script telah disalin ke clipboard!');
  };

  const shareScript = async () => {
    try {
      await Share.open({
        message: generatedScript,
        title: 'Konfigurasi ZTE DUALBAND ONT'
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
      vlan2: '',
      wifiAuth: 'wep'
    });
    setShowResult(false);
  };

  return (
    <View style={styles.container}>
      <MyHeader title="ZTE DUALBAND Config" onPress={() => navigation.goBack()}/>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          {!showResult ? (
            <>
              <MyInput 
                label="Port" 
                value={form.port}
                onChangeText={(text) => handleInputChange('port', text)}
                placeholder="Contoh: 1/2/15"
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
                placeholder="Contoh: ZTEGD825B52D"
              />
              <MyInput 
                label="Nama Description" 
                value={form.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder="Contoh: Zakia_BT"
              />
              <MyInput 
                label="Username PPPoE" 
                value={form.username}
                onChangeText={(text) => handleInputChange('username', text)}
                placeholder="Contoh: ZAKIA_B.TEMBOK"
              />
              <MyInput 
                label="Password PPPoE" 
                value={form.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry
                placeholder="Contoh: ZAKIA_B.TEMBOK"
              />
              <MyInput 
                label="SSID (Nama WiFi)" 
                value={form.ssid}
                onChangeText={(text) => handleInputChange('ssid', text)}
                placeholder="Contoh: Kania_Net"
              />
              <MyInput 
                label="VLAN 1 (Internet)" 
                value={form.vlan1}
                onChangeText={(text) => handleInputChange('vlan1', text)}
                keyboardType="numeric"
                placeholder="Contoh: 234"
              />
              <MyInput 
                label="VLAN 2 (VoIP/TV)" 
                value={form.vlan2}
                onChangeText={(text) => handleInputChange('vlan2', text)}
                keyboardType="numeric"
                placeholder="Contoh: 20"
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
              <Text style={styles.resultTitle}>Hasil Konfigurasi ZTE DUALBAND:</Text>
              
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