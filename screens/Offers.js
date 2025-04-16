import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  SafeAreaView,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import { COLORS, FONTS, SIZES, images } from '../constants';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import BASE_URL from '../Api/commonApi';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import IMAGES_URL from '../Api/ImagesUrl';

const Offers = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const OfferImage = React.memo(({ uri, style }) => {
    return (
      <Image
        source={{ uri }}
        style={style}
        resizeMode="cover"
      />
    );
  });

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/offers`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOffers(data.offers);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSubmit = async () => {
    if (!imageUrl) {
      Alert.alert('Please select a offer image.');
      return;
    }

    const formData = new FormData();
    if (imageUrl) {
      const uriParts = imageUrl.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const file = {
        uri: imageUrl,
        type: `image/${fileType}`,
        name: `offer_image.${fileType}`,
      };
      formData.append('image', file);
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/offers`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert(
          'Success',
          'Offer created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                fetchOffers();
                setImageUrl(null);
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to add offer, please try again',
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this offer?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete cancelled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await fetch(`${BASE_URL}/delete-offer?id=${id}`);

              if (!response.ok) {
                throw new Error(
                  `Failed to delete item, HTTP error! status: ${response.status}`
                );
              }

              setOffers((prevOffer) =>
                prevOffer.filter((offer) => offer.id !== id)
              );
              fetchOffers();
            } catch (err) {
              console.error('Delete error:', err);
              alert('Failed to delete the offer. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    } else {
      console.log('Image picker was canceled');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[
          COLORS.black,
          COLORS.black,
          COLORS.black,
          COLORS.black,
          COLORS.gray,
          COLORS.black,
          COLORS.black,
          COLORS.black,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
        }}>
        <View>
          <Header headerTitle="Offers" />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animatable.View
            animation="fadeInLeft"
            duration={800}
            delay={200}
            style={styles.headerContainer}>
            <Text style={styles.title}>Create a New Offer</Text>
            <Text style={styles.subtitle}>
              Engage your audience with a stunning offer
            </Text>
          </Animatable.View>

          <Animatable.View
            animation="fadeInRight"
            duration={800}
            delay={200}
            style={styles.formContainer}>
            {/*
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Offer Description :</Text>
            <TextInput
              placeholder="Describe your offer..."
              placeholderTextColor={COLORS.lightGray}
              value={offerDescription}
              onChangeText={setOfferDescription}
              style={styles.descriptionTextInput}
              multiline={true}
              numberOfLines={4}
            />
          </View> 
          */}

            {/* Image Picker */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Offer Image :</Text>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.imageTextInput}>
                {imageUrl ? (
                  <Text style={styles.imagePickerText}>Change Image</Text>
                ) : (
                  <Text
                    style={[
                      styles.imagePickerText,
                      { color: COLORS.lightGray },
                    ]}>
                    Upload Image
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Image Preview */}
            {imageUrl && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              </View>
            )}

            {loading ? (
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>Saving...</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Save Offer</Text>
              </TouchableOpacity>
            )}
          </Animatable.View>

          <View style={styles.offersContainer}>
            <Animatable.View animation="fadeInRight" duration={800} delay={200}>
              <View style={styles.titleContainer}>
                <View style={styles.line} />
                <Text style={styles.availableOffersTitle}>
                  Available Offers
                </Text>
                <View style={styles.line} />
              </View>
            </Animatable.View>
            {offers.length === 0 && (
              <Animatable.View
                animation="fadeInLeft"
                duration={800}
                delay={200}
                style={styles.emptyState}>
                <Text style={styles.emptyText}>No offers created yet</Text>
              </Animatable.View>
            )}
            <FlatList
              data={offers}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.offersListContainer}
              renderItem={({ item, index }) => (
                <Animatable.View
                  animation="fadeInRight"
                  duration={800}
                  delay={index * 200}
                  style={styles.offerCard}
                  key={item.id}>
                  <OfferImage
                    uri={`${IMAGES_URL}/offers/${item.image}`}
                    style={styles.offerImage}
                  />
                  <View style={styles.offerContent}>
                    <TouchableOpacity
                      style={styles.offerButton}
                      onPress={() => handleDelete(item.id)}>
                      <Text style={styles.offerButtonText}>Delete Offer</Text>
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              )}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  scrollContainer: {
    paddingBottom: SIZES.padding * 2,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    ...FONTS.body4,
    color: COLORS.lightGray,
    marginTop: SIZES.base,
  },
  formContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding * 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  inputWrapper: {
    marginBottom: SIZES.padding * 1.5,
  },
  label: {
    ...FONTS.body3,
    color: COLORS.white,
    marginBottom: SIZES.base,
    fontWeight: '600',
  },
  descriptionTextInput: {
    backgroundColor: COLORS.gray1,
    borderRadius: SIZES.radius,
    padding: SIZES.font,
    color: COLORS.white,
    ...FONTS.body3,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    height: 100,
  },
  imageTextInput: {
    marginTop: SIZES.base,
    backgroundColor: COLORS.gray1,
    borderRadius: SIZES.radius,
    padding: SIZES.font,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  imagePickerText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginVertical: SIZES.padding,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    marginTop: SIZES.base,
    borderRadius: SIZES.radius,
  },

  submitButtonText: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  emptyState: {
    marginTop: SIZES.base,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  emptyText: {
    color: COLORS.lightGray,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  offersListContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  offerCard: {
    width: 280,
    marginRight: SIZES.padding * 1.5,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    backgroundColor: COLORS.secondary,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  offerImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
  },
  offerContent: {
    padding: SIZES.font,
  },
  offerDescription: {
    ...FONTS.body3,
    color: COLORS.white,
    marginBottom: SIZES.padding,
    lineHeight: 22,
  },
  offerButton: {
    backgroundColor: COLORS.lightRed,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-center',
  },
  offerButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  offersContainer: {
    marginTop: SIZES.padding2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.white,
    marginHorizontal: 30,
  },
  availableOffersTitle: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
});

export default Offers;
