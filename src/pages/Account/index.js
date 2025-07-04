import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Modal
} from 'react-native';
import { fonts, colors } from '../../utils';
import { getData, storeData } from '../../utils/localStorage';
import { MyHeader, MyInput } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { Icon } from 'react-native-elements';

export default function Profile({ navigation }) {
    const [profile, setProfile] = useState({
        kodeUnit: '',
        namaUnit: ''
    });
    const [savedProfiles, setSavedProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            // Load data from storage
            getData('profiles').then(res => {
                if (res) {
                    setSavedProfiles(res);
                }
                setLoading(false);
            });
        }
    }, [isFocused]);

    const handleSave = () => {
        if (!profile.kodeUnit || !profile.namaUnit) {
            alert('Harap lengkapi kode dan nama unit!');
            return;
        }

        const newProfile = {
            id: Date.now().toString(),
            ...profile,
            date: new Date().toISOString()
        };

        const updatedProfiles = [...savedProfiles, newProfile];

        // Save data to local storage
        storeData('profiles', updatedProfiles)
            .then(() => {
                setSavedProfiles(updatedProfiles);
                setShowSuccessModal(true);
                setProfile({ kodeUnit: '', namaUnit: '' }); // Clear input fields
                
                // Auto close modal after 2 seconds
                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 2500);
            });
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <MyHeader title="Profile" onPress={() => navigation.goBack()} />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Input Profil Unit</Text>
                    
                    <MyInput 
                        label="Kode Unit"
                        placeholder="Masukkan Kode Unit"
                        value={profile.kodeUnit}
                        onChangeText={text => setProfile({...profile, kodeUnit: text})}
                    />
                    
                    <MyInput 
                        label="Nama Unit"
                        placeholder="Masukkan Nama Unit"
                        value={profile.namaUnit}
                        onChangeText={text => setProfile({...profile, namaUnit: text})}
                    />
                    
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.saveButtonText}>Simpan</Text>
                    </TouchableOpacity>

                    {/* Saved Data Cards */}
                    {savedProfiles.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Daftar Profil Unit</Text>
                            {savedProfiles.map((item, index) => (
                                <View key={item.id} style={[
                                    styles.dataCard,
                                    index === 0 && { marginTop: 10 }
                                ]}>
                                    <View style={styles.dataRow}>
                                        <Text style={styles.dataLabel}>Kode Unit:</Text>
                                        <Text style={styles.dataValue}>{item.kodeUnit}</Text>
                                    </View>
                                    
                                    <View style={styles.dataRow}>
                                        <Text style={styles.dataLabel}>Nama Unit:</Text>
                                        <Text style={styles.dataValue}>{item.namaUnit}</Text>
                                    </View>

                                    <Text style={styles.dateText}>
                                        {new Date(item.date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
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
                            Profil unit telah tersimpan
                        </Animatable.Text>
                    </Animatable.View>
                </View>
            </Modal>
        </SafeAreaView>
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
    formContainer: {
        padding: 15,
    },
    sectionContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontFamily: fonts.primary[600],
        fontSize: 16,
        color: colors.primary,
        marginBottom: 15,
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: colors.primary,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
        marginHorizontal: 10,
        
    },
    saveButtonText: {
        color: colors.white,
        fontFamily: fonts.primary[600],
        fontSize: 16,
    },
    dataCard: {
        backgroundColor: colors.lightBackground,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: colors.border,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dataLabel: {
        fontFamily: fonts.primary[600],
        color: colors.darkText,
        fontSize: 14,
    },
    dataValue: {
        fontFamily: fonts.primary[400],
        color: colors.darkText,
        fontSize: 14,
    },
    dateText: {
        fontFamily: fonts.primary[400],
        fontSize: 12,
        color: colors.secondaryText,
        marginTop: 8,
        textAlign: 'right',
    },
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
        textAlign: "center"
    },
    subText: {
        fontFamily: fonts.primary[400],
        fontSize: 14,
        color: colors.secondaryText,
        textAlign: 'center',
    },
});