import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ โหลดค่าภาษาที่เคยใช้ล่าสุด
const getStoredLanguage = async () => {
  const storedLanguage = await AsyncStorage.getItem('appLanguage');
  return storedLanguage || 'en'; // ถ้าไม่มีค่าให้ใช้ 'en'
};

// ✅ แปลภาษา
const resources = {
  en: {
    translation: {
      "Change Language": "Change Language",
      "Home": "Home",
      "Settings": "Settings"
    }
  },
  th: {
    translation: {
      "Change Language": "เปลี่ยนภาษา",
      "Home": "หน้าแรก",
      "Settings": "การตั้งค่า"
    }
  },
  ar: {
    translation: {
      "Change Language": "تغيير اللغة",
      "Home": "الصفحة الرئيسية",
      "Settings": "الإعدادات"
    }
  }
};

// ✅ ตั้งค่า i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: await getStoredLanguage(), // โหลดภาษาล่าสุดจาก AsyncStorage
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;