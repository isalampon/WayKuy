import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Platform,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ นำเข้า AsyncStorage
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const languages = [
  { 
    code: 'th', 
    name: 'ไทย (Thai)', 
    flag: require('../assets/thai.png') // ตรวจสอบว่ามีไฟล์รูปภาพอยู่จริง
  },
  { 
    code: 'en', 
    name: 'English', 
    flag: require('../assets/usa.png')
  },
  { 
    code: 'ar', 
    name: 'العربية (Arabic)', 
    flag: require('../assets/united-arab-emirates.png')
  }
];

const LanguageSettings = ({ navigation }) => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  // ✅ โหลดค่าภาษาที่เคยเลือกไว้จาก AsyncStorage
  useEffect(() => {
    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('appLanguage');
      if (storedLanguage) {
        await i18n.changeLanguage(storedLanguage);
        setSelectedLanguage(storedLanguage);
      }
    };
    loadLanguage();
  }, []);

  const handleLanguageChange = async (languageCode) => {
    try {
      await AsyncStorage.setItem('appLanguage', languageCode); // ✅ บันทึกค่าภาษา
      await i18n.changeLanguage(languageCode); // ✅ เปลี่ยนภาษาใน i18next
      setSelectedLanguage(languageCode); // ✅ อัพเดท UI
      navigation.goBack(); // ✅ กลับไปหน้าเดิม
    } catch (error) {
      console.error('Error changing language', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={33} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Language</Text>
      </View>

      <View style={styles.languageList}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageItem,
              selectedLanguage === language.code && styles.selectedLanguageItem
            ]}
            onPress={() => handleLanguageChange(language.code)}
          >
            <View style={styles.languageContent}>
              <Image 
                source={language.flag} 
                style={styles.flagIcon} 
                resizeMode="contain"
              />
              <Text style={styles.languageName}>{language.name}</Text>
            </View>
            {selectedLanguage === language.code && (
              <Feather name="check" size={24} color="#014737" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#014737',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    height: 134,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  languageList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedLanguageItem: {
    backgroundColor: '#FDCB02', // สีเหลืองแสดงว่าถูกเลือก
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  languageName: {
    fontSize: 16,
    color: '#014737',
    fontWeight: '600',
  },
});

export default LanguageSettings;