import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform
} from 'react-native';
import { COLORS, FONTS, SIZES, images } from '../constants';
import Header from '../components/Header';
import BASE_URL from '../Api/commonApi';

const PackageReport = ({ navigation }) => {
  // const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const packages = [
    {
      id: '1',
      packageName: 'Beach Adventure',
      price: 5000,
      duration: '3 Days',
      staff: '2 Guides',
      totalMembers: 12,
      imageUrl: 'https://via.placeholder.com/300',
    },
    {
      id: '2',
      packageName: 'Mountain Trek',
      price: 7000,
      duration: '5 Days',
      staff: '3 Guides',
      totalMembers: 8,
      imageUrl: 'https://via.placeholder.com/300',
    },
    {
      id: '3',
      packageName: 'Jungle Safari',
      price: 6000,
      duration: '4 Days',
      staff: '2 Rangers',
      totalMembers: 15,
      imageUrl: 'https://via.placeholder.com/300',
    },
  ];

  // useEffect(() => {
  //   fetch(`${BASE_URL}/get-packages`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setPackages(data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching packages:', error);
  //       setLoading(false);
  //     });
  // }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {item.imageUrl && (
          <Image source={images.gym1} style={styles.packageImage} />
        )}
        <View style={styles.membersOverlay}>
          <Text style={styles.membersCount}>{item.totalMembers}</Text>
          <Text style={styles.membersText}>Total Members</Text>
        </View>
      </View>
      <View style={styles.cardData}>
        <Text style={styles.packageName}>{item.packageName}</Text>
        <Text style={styles.text}>Price: {item.price}</Text>
        <Text style={styles.text}>Duration: {item.duration}</Text>
        <Text style={styles.text}>Staff: {item.staff}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ marginTop: Platform.OS === 'ios' ? 20 : 60 }}>
        <Header />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Package Report</Text>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <FlatList
            data={packages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('addPackage')}>
          <Text style={styles.buttonText}>Add New Package</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  container: {
    flex: 1,
    padding: SIZES.base,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.white,
    textAlign: 'center',
    marginVertical: SIZES.base,
  },
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    marginVertical: SIZES.base,
  },
  cardData: {
    padding: SIZES.radius
  },
  packageName: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: 5,
  },
  text: {
    ...FONTS.body3,
    color: COLORS.lightGray,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden', // Ensures the overlay stays within bounds
  },
  packageImage: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.radius,
  },
  membersOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: SIZES.radius,
    borderBottomRightRadius: SIZES.radius,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  membersCount: {
    ...FONTS.h2,
    color: COLORS.primary,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  membersText: {
    ...FONTS.body4,
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.9,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.font,
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  buttonText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
});

export default PackageReport;
