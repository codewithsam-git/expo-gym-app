import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
import { useNavigation } from '@react-navigation/native';
import SkeletonMember from '../components/SkeletonMember';
import BASE_URL from '../Api/commonApi';
import { useFocusEffect } from '@react-navigation/native';
import ViewHeader from '../components/ViewHeader';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ViewInventory = () => {
  const navigation = useNavigation();

  const [inventoryItems, setInventoryItems] = useState([]);
  const [skeletonLoader, setSkeletonLoader] = useState(true);

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/view-inventory`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.inventories);
      setInventoryItems(data.inventories);
      setSkeletonLoader(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setSkeletonLoader(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useFocusEffect(
    useCallback(()=>{
      fetchInventory();
    }, [])
  )

  function renderInventoryCard(item) {
    return (
      <View style={styles.card}>
        <Image
          source={images.gym2}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.usedFor}>{item.useFor || 'Inventory'}</Text>
          <Text style={styles.price}>Price: {item.price}/-</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ViewHeader headerTitle="Inventories" navigateTo="addInventory"/>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {inventoryItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Image source={images.noData} style={styles.noDataImage} />
            <Text style={styles.emptyText}>No inventory items available</Text>
          </View>
        ) : (
          <View>
            {skeletonLoader ? (
              <SkeletonMember />
            ) : (
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.grid}>
                  {inventoryItems.map((item, index) => (
                    <View key={item.id} style={styles.cardWrapper}>
                      {renderInventoryCard(item)}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginTop: Platform.OS === 'ios' ? 20 : 40,
    marginBottom: SIZES.base,
  },
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.white,
  },
  headerText: {
    ...FONTS.h2,
    color: COLORS.white,
    textAlign: 'center',
    flex: 1,
  },
  gridContainer: {
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  cardWrapper: {
    width: '90%',
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardImage: {
    width: '100%',
    height: 170,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardDetails: {
    padding: 18,
  },
  itemName: {
    marginVertical: 3,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  usedFor: {
    fontSize: 15,
    marginVertical: 3,
    color: COLORS.lightGray4,
    marginBottom: 6,
  },
  price: {
    fontSize: 17,
    marginVertical: 3,
    fontWeight: '700',
    color: '#388E3C',
    marginBottom: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
    marginTop: screenHeight / 3,
  },
  noDataImage: {
    width: 80,
    height: 80,
    marginBottom: SIZES.base,
  },
  emptyText: {
    color: COLORS.lightGray,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ViewInventory;
