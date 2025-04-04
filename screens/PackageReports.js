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
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, SIZES, images } from '../constants';
import ViewHeader from '../components/ViewHeader';
import BASE_URL from '../Api/commonApi';
import * as Animatable from 'react-native-animatable';
const screenWidth = Dimensions.get('window').width;

const PackageReport = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await fetch(`${BASE_URL}/report-cards`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReports(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error report cards:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp" // Animate each card sliding up
      duration={800}
      delay={index * 100} // Stagger animation for each card
      style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={images.gym1} style={styles.packageImage} />
        <View style={styles.membersOverlay}>
          <Text style={styles.membersCount}>{item.memberCount}</Text>
          <Text style={styles.membersText}>Total Members</Text>
        </View>
      </View>
      <View style={styles.cardData}>
        <Text style={styles.packageName}>Package: {item.package_name}</Text>
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animatable.View animation="fadeInDown" duration={800}>
        <ViewHeader headerTitle="Package Report" navigateTo="addPackage" />
      </Animatable.View>
      {reports.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No reports available at the moment
          </Text>
        </View>
      ) : (
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <FlatList
              data={reports}
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
      )}
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
  emptyState: {
    marginTop: screenWidth / 2,
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
    padding: SIZES.radius,
  },
  packageName: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: 5,
    textAlign: 'left', // Centers the package name
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
