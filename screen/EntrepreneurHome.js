import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from './AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';


const { width } = Dimensions.get('window');
const db = getFirestore();

const EntrepreneurHome = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  // 🔄 โหลดบริการจาก Firestore
  const fetchServices = async () => {
    if (!user) return;

    try {
      const q = query(collection(db, 'Services'), where('EntrepreneurId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const serviceList = [];

      querySnapshot.forEach((doc) => {
        serviceList.push({ id: doc.id, ...doc.data() });
      });

      setServices(serviceList);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // 🎯 โหลดทุกครั้งที่เข้าหน้านี้
  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [])
  );


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.openDrawer()}
          >
            <Feather name="menu" size={28} color="white" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: 'center', position: 'absolute', left: 0, right: 0 }}>
            <Image
              source={require('../png/logo-removebg.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate('Search')}
          >
            <Feather name="search" size={20} color="#667085" />
            <Text style={styles.searchPlaceholder}>Search...</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.userInfoContainer}>
        <View>
          <Text style={styles.userName}>
            Hello, {user ? user.displayName || "User" : "User"}
          </Text>
          <Text style={styles.userEmail}>
            {user ? user.email : "Not logged in"}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Feather name="bell" size={24} color="#014737" />
        </TouchableOpacity>
      </View>


      {/* Add Service Button */}
      <TouchableOpacity
        style={styles.addServiceButton}
        onPress={() => navigation.navigate('AddServices')}
      >
        <View style={styles.addServiceButtonContent}>
          <Feather name="plus-circle" size={28} color="#014737" />
          <Text style={styles.addServiceText}>Add New Service</Text>
        </View>
      </TouchableOpacity>

      {/* Services List */}
      <ScrollView contentContainerStyle={styles.serviceContainer}>
        <Text style={styles.sectionTitle}>Your Service</Text>

        {services.length === 0 ? (
          <Text style={styles.noServiceText}>Service not found.</Text>
        ) : (
          services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => {
                setSelectedService(service);
                setModalVisible(true);
              }}
            >
              <Image
                source={{ uri: Array.isArray(service.image) ? service.image[0] : service.image }}
                style={{ width: 60, height: 60, borderRadius: 8 }}
              />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.name}</Text>
                <Text style={styles.serviceLocation}>📍 {service.location}</Text>
                {service.operatingHours && service.operatingHours.length > 0 && (
                  <Text style={styles.serviceHours}>
                    🕒 {service.operatingHours[0].day} {service.operatingHours[0].openTime}–{service.operatingHours[0].closeTime}
                  </Text>
                )}
              </View>
            </TouchableOpacity>


          ))

        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: 'white',
            width: '90%',
            borderRadius: 12,
            padding: 20,
            maxHeight: '80%',
          }}>
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => setModalVisible(false)}>
              <Feather name="x" size={24} color="#014737" />
            </TouchableOpacity>
            {selectedService && (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  {(Array.isArray(selectedService.image) ? selectedService.image : [selectedService.image]).map((uri, index) => (
                    <Image
                      key={index}
                      source={{ uri }}
                      style={{ width: 160, height: 120, borderRadius: 12, marginRight: 10 }}
                    />
                  ))}
                </ScrollView>
                
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#014737', marginBottom: 6 }}>{selectedService.name}</Text>
                <Text style={{ fontSize: 14, color: '#555' }}>📍 {selectedService.location}</Text>

                <Text style={{ fontSize: 16, fontWeight: '600', color: '#014737', marginTop: 14 }}>🕒 Operating Hours</Text>
                {selectedService.operatingHours?.length > 0 ? (
                  selectedService.operatingHours.map((item, index) => (
                    <Text key={index} style={{ fontSize: 13, color: '#666' }}>
                      • {item.day}: {item.openTime}–{item.closeTime}
                    </Text>
                  ))
                ) : (
                  <Text style={{ fontSize: 13, color: '#888' }}>No hours set.</Text>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    backgroundColor: '#014737',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    //overflow: 'hidden',
    //paddingBottom: 80,
    height: 180,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  logo: {
    width: 150,
    height: 120,
    marginTop: 80,
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    width: 24,
    height: 16,
    justifyContent: 'space-between',
  },
  notificationButton: {
    padding: 10,
  },
  greetingContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#014737',
  },
  userEmail: {
    fontSize: 14,
    color: '#667085',
    marginTop: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 80,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 16,
    color: '#667085',
    flex: 1,
  },
  addServiceButton: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  addServiceButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F4F2', // Light version of primary color
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: '#014737',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addServiceText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#014737',
    fontWeight: '600',
  },
  serviceContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  noServiceContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#014737',
    marginBottom: 15,
  },
  noServiceText: {
    fontSize: 18,
    color: '#014737',
    fontWeight: '600',
  },
  noServiceSubtext: {
    fontSize: 14,
    color: '#667085',
    marginTop: 10,
    textAlign: 'center',
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  serviceInfo: { flex: 1 },
  serviceTitle: { fontSize: 16, fontWeight: 'bold', color: '#014737' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#014737',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#014737',
  },
  serviceLocation: {
    fontSize: 13,
    color: '#666',
  },
  serviceHours: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: 'white', marginTop: 4 },
});

export default EntrepreneurHome;