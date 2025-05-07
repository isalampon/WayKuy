import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const db = getFirestore();

const CategoryServices = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'Services'), where('category', '==', category));
        const querySnapshot = await getDocs(q);
        const servicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#014737" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="chevron-left" size={32} color="#014737" />
      </TouchableOpacity>

      <Text style={styles.header}>{category} Services</Text>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.navigate('Detail', { service: item })}>
            <Image source={{ uri: item.image }} style={styles.serviceImage} />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{item.name}</Text>
              <Text style={styles.serviceLocation}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', left: 20, top: 50, zIndex: 2 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#014737', textAlign: 'center', marginBottom: 20 },
  serviceCard: { flexDirection: 'row', backgroundColor: '#f5f5f5', borderRadius: 10, marginBottom: 15, overflow: 'hidden' },
  serviceImage: { width: 100, height: 100 },
  serviceInfo: { flex: 1, padding: 10 },
  serviceTitle: { fontSize: 16, fontWeight: 'bold', color: '#014737' },
  serviceLocation: { fontSize: 14, color: '#666' },
});

export default CategoryServices;