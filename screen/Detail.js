import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import ReviewForm from "./ReviewForm";
import { firebaseApp } from "../screen/FirebaseConfig"; 

const db = getFirestore(firebaseApp);

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const place = route.params?.place || {};
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📌 ดึงข้อมูลรีวิวจาก Firebase Firestore
  useEffect(() => {
    if (!place.id) return;
    
    const reviewsRef = collection(db, "Reviews");
    const q = query(reviewsRef, where("placeId", "==", place.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviewsData(reviews);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [place.id]);

  const handleReviewButtonPress = () => {
    setIsReviewFormVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="chevron-left" size={32} color="white" />
      </TouchableOpacity>

      {/* 📷 Image */}
      <Image source={{ uri: place.image }} style={styles.mainImage} />

      <View style={styles.detailContainer}>
        <Text style={styles.title}>{place.name}</Text>

        {/* ⭐ Rating */}
        <View style={styles.metaContainer}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="gold" />
            <Text style={styles.ratingText}>{place.rating}</Text>
            <Text style={styles.reviewCountText}>({reviewsData.length} Reviews)</Text>
          </View>
        </View>

        <Text style={styles.distance}>{place.distance} km</Text>
        <Text style={styles.category}>({place.category})</Text>

        {/* 📍 Details */}
        <View style={styles.detailsSection}>
          <View style={styles.infoContainer}>
            <Feather name="map-pin" size={16} color="#014737" />
            <Text style={styles.infoText}>{place.location}</Text>
          </View>
        </View>

        {/* 📝 Reviews Section */}
        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsSectionTitle}>Reviews</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#014737" />
          ) : reviewsData.length > 0 ? (
            reviewsData.slice(0, 2).map((review, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Feather name="user" size={16} color="#014737" />
                  <Text style={styles.reviewUser}>{review.username}</Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <View style={styles.starContainer}>
                  {[...Array(review.rating)].map((_, i) => (
                    <FontAwesome key={i} name="star" size={14} color="gold" />
                  ))}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noReviewText}>No reviews yet. Be the first to review!</Text>
          )}
          <TouchableOpacity>
            <Text style={styles.showAllReviews}>Show all reviews</Text>
          </TouchableOpacity>
        </View>

        {/* 📝 Write Review Button */}
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={handleReviewButtonPress}
        >
          <Text style={styles.reviewButtonText}>Write your review</Text>
        </TouchableOpacity>

        <ReviewForm
          visible={isReviewFormVisible}
          onClose={() => setIsReviewFormVisible(false)}
          placeId={place.id}
        />
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 50,
    zIndex: 2,
  },
  mainImage: {
    width: "100%",
    height: 250,
  },
  detailContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: -30, // Overlap effect
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#014737",
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  reviewCountText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  favoriteButton: {
    padding: 5,
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  distanceContainer: {
    marginBottom: 15,
  },
  distance: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    width: "100%",
  },
  detailsSection: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#014737",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  directionsContainer: {
    marginTop: 10,
  },
  directionsButton: {
    backgroundColor: "#014737",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  directionsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  reviewsSection: {
    marginBottom: 15,
  },
  reviewsSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#014737",
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  reviewUser: {
    marginLeft: 10,
    fontWeight: "bold",
    color: "#014737",
  },
  reviewComment: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: "row",
  },
  showAllReviews:{
    backgroundColor: "#014737",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  // showAllReviewsText: {
  //   color: "white",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  reviewButton: {
    backgroundColor: "#014737",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  reviewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default Detail;
