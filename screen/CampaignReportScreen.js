import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const db = getFirestore();

const reportOptions = [
  '1 month ago',
  '2 month ago',
  '3 month ago',
  '4 month ago',
  '5 month ago',
  '6 month ago',
];

export default function CampaignReportScreen({ navigation }) {
  const [selectedReport, setSelectedReport] = useState('1 month ago');
  const [showModal, setShowModal] = useState(false);
  const [reportData, setReportData] = useState({
    impressions: 0,
    clicks: 0,
    calls: 0,
  });
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'CampaignReports'), where('month', '==', '2024-03')); // เปลี่ยนตาม selectedReport
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setReportData({
            impressions: data.impressions || 0,
            clicks: data.clicks || 0,
            calls: data.calls || 0,
          });
        }

        const campaignSnap = await getDoc(doc(db, 'CampaignSubscriptions', 'your-campaign-id'));
        if (campaignSnap.exists()) {
          setSummary(campaignSnap.data());
        }
      } catch (error) {
        console.error('Error loading report:', error);
      }
    };

    fetchData();
  }, [selectedReport]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Halal Way</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tab */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabButtonDisabled}  onPress={() => navigation.navigate('CampaignScreen')}>
          <Text style={styles.tabTextDisabled}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Report</Text>
        </TouchableOpacity>
      </View>

      {/* Performance Report */}
      <View style={styles.card}>
        <View style={styles.reportHeader}>
          <Text style={styles.cardTitle}>Performance Report</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Text style={styles.dropdownText}>{selectedReport} ⌄</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricText}>Impressions 👀</Text>
          <Text style={styles.metricValue}>{reportData.impressions}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricText}>Clicks 👆</Text>
          <Text style={styles.metricValue}>{reportData.clicks}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricText}>Conversions 📞</Text>
          <Text style={styles.metricValue}>{reportData.calls}</Text>
        </View>
      </View>

      {/* Campaign Summary */}
      {summary && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Campaign Summary</Text>
          <Text style={styles.summaryText}>
            Campaign Duration ⏳ - <Text style={styles.bold}>{summary.createdAt} - {summary.endDate}</Text>
          </Text>
          <Text style={styles.summaryText}>
            Campaign Type 📄 - <Text style={styles.bold}>{summary.campaignName}</Text>
          </Text>
          <Text style={styles.summaryText}>
            Campaign Cost 💰 - <Text style={styles.bold}>{summary.price.toLocaleString()} THB</Text>
          </Text>
        </View>
      )}

      {/* Renew Campaign */}
      <TouchableOpacity style={styles.renewButton}>
        <Text style={styles.renewText}>Renew the campaign</Text>
      </TouchableOpacity>

      {/* Modal Report Time */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Report Time</Text>
            {reportOptions.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedReport(opt);
                  setShowModal(false);
                }}
              >
                <Text style={[styles.modalText, selectedReport === opt && { fontWeight: 'bold' }]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalDone} onPress={() => setShowModal(false)}>
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#014737',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
  },
  tabButtonDisabled: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  tabButton: {
    flex: 1,
    backgroundColor: '#014737',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: { color: 'white', fontWeight: 'bold' },
  tabTextDisabled: { color: '#999' },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#014737',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownText: {
    color: '#014737',
    fontSize: 14,
  },
  metricBox: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  metricText: { fontSize: 14, color: '#333' },
  metricValue: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  summaryText: { marginBottom: 8, color: '#333' },
  bold: { fontWeight: 'bold' },
  renewButton: {
    backgroundColor: '#014737',
    margin: 20,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  renewText: { color: 'white', fontWeight: 'bold' },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '80%',
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#014737',
    marginBottom: 10,
  },
  modalOption: {
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
  },
  modalDone: {
    marginTop: 10,
    backgroundColor: '#014737',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  modalDoneText: {
    color: 'white',
    fontWeight: 'bold',
  },
});