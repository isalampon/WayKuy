import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { firebase, getFirestore, collection, addDoc, serverTimestamp, runTransaction, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '../screen/FirebaseConfig'; // ตรวจสอบให้แน่ใจว่า Firebase ถูกตั้งค่า

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);
const ReviewForm = ({ visible, onClose, placeId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages([...images, ...result.assets.map(asset => asset.uri)]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImages = async () => {
    const uploadedUrls = [];
    
    for (const uri of images) {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `Reviews/${placeId}/${filename}`);
  
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      uploadedUrls.push(url);
    }
  
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!review.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrls = await uploadImages();
      
      const reviewData = {
        placeId,
        rating,
        comment: review,
        images: imageUrls,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userId: firebase.auth().currentUser?.uid || 'anonymous',
        username: firebase.auth().currentUser?.displayName || 'Anonymous User'
      };

      await firebase.firestore()
        .collection('Reviews')
        .add(reviewData);

      // Update place's average rating
      const placeRef = firebase.firestore().collection('places').doc(placeId);
      await firebase.firestore().runTransaction(async (transaction) => {
        const placeDoc = await transaction.get(placeRef);
        const placeData = placeDoc.data();
        
        const newRatingCount = (placeData.ratingCount || 0) + 1;
        const newRatingTotal = (placeData.ratingTotal || 0) + rating;
        const newAverageRating = newRatingTotal / newRatingCount;
        
        transaction.update(placeRef, {
          rating: newAverageRating,
          ratingCount: newRatingCount,
          ratingTotal: newRatingTotal
        });
      });

      Alert.alert('Success', 'Your review has been submitted');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#014737" />
          </TouchableOpacity>

          <Text style={styles.title}>Write your review</Text>

          <Text style={styles.subtitle}>Rate this place</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
              >
                <Feather
                  name={star <= rating ? "star" : "star"}
                  size={32}
                  color={star <= rating ? "#FFD700" : "#D3D3D3"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.subtitle}>Write a review</Text>
          <TextInput
            style={styles.reviewInput}
            multiline
            placeholder="Tell us what you think..."
            value={review}
            onChangeText={setReview}
          />

          <Text style={styles.subtitle}>Add photos</Text>
          <TouchableOpacity 
            style={styles.imagePickerButton}
            onPress={handleImagePicker}
          >
            <Feather name="image" size={24} color="#014737" />
            <Text style={styles.imagePickerText}>
              (File .png .jpg .jpeg)
            </Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              {images.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.imagePreview}
                />
              ))}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.saveButtonText}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#014737',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#014737',
    marginTop: 15,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    height: 120,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#014737',
    borderRadius: 10,
    justifyContent: 'center',
  },
  imagePickerText: {
    color: '#666',
    fontSize: 14,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#014737',
  },
  cancelButtonText: {
    color: '#014737',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ReviewForm;