import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
import { useNavigation } from '@react-navigation/native';
import SkeletonMember from '../components/SkeletonMember';
import BASE_URL from '../Api/commonApi';
import IMAGES_URL from '../Api/ImagesUrl';
import { useFocusEffect } from '@react-navigation/native';
import ViewHeader from '../components/ViewHeader';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ViewInventory = () => {
  const navigation = useNavigation();

  const [inventoryItems, setInventoryItems] = useState([]);
  const [skeletonLoader, setSkeletonLoader] = useState(true);
  const [menuVisibleFor, setMenuVisibleFor] = useState(null);

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/view-inventory`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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
    useCallback(() => {
      fetchInventory();
    }, [])
  );

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this inventory item?',
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
              const response = await fetch(
                `${BASE_URL}/delete-inventory/${id}`
              );

              if (!response.ok) {
                throw new Error(
                  `Failed to delete item, HTTP error! status: ${response.status}`
                );
              }

              setInventoryItems((prevInventory) =>
                prevInventory.filter((inventory) => inventory.id !== id)
              );
            } catch (err) {
              console.error('Delete error:', err);
              alert('Failed to delete the inventory item. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  function renderInventoryCard(item, index) {
    const isMenuVisible = menuVisibleFor === item.id;

    const toggleMenu = () => {
      setMenuVisibleFor(isMenuVisible ? null : item.id);
    };

    return (
      <TouchableOpacity onPress={() => setMenuVisibleFor(false)}>
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={index * 100}
          style={styles.card}>
          <Image
            source={{ uri: `${IMAGES_URL}/inventory/${item.image}` }}
            style={styles.cardImage}
            resizeMode="cover"
          />

          <View style={styles.cardDetails}>
            <View style={styles.itemInfoContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                <Icon name="more-vert" size={20} color={COLORS.black} />
              </TouchableOpacity>
            </View>
            <Text style={styles.usedFor}>{item.useFor || 'Inventory'}</Text>
            <Text style={styles.price}>Price: {item.price}/-</Text>
          </View>

          {/* Contextual Menu */}
          {isMenuVisible && (
            <Animatable.View
              animation="fadeInDown"
              duration={200}
              style={styles.menuDropdown}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate('editInventory', {
                    inventoryId: item.id,
                  });
                  setMenuVisibleFor(null);
                }}>
                <Animatable.View animation="bounceIn" delay={100}>
                  <Icon name="edit" size={20} color={COLORS.primary} />
                </Animatable.View>
                <Text style={styles.menuItemText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  handleDelete(item.id);
                  setMenuVisibleFor(null);
                }}>
                <Animatable.View animation="bounceIn" delay={200}>
                  <Icon name="delete" size={20} color={COLORS.lightRed} />
                </Animatable.View>
                <Text style={styles.menuItemText}>Delete</Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
        </Animatable.View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animatable.View animation="fadeInDown" duration={800}>
        <ViewHeader headerTitle="Inventories" navigateTo="addInventory" />
      </Animatable.View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {(inventoryItems.length === 0 && !skeletonLoader) ? (
          <View style={styles.emptyState}>
            <Image
              source={images.noData}
              style={styles.noDataImage}
            />
            <Text style={styles.emptyText}>No inventory items available</Text>
          </View>
        ) : (
          <View>
            {skeletonLoader ? (
              <SkeletonMember />
            ) : (
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: Platform.OS === 'ios' ? 120 : 200,
                }}
                scrollEnabled={true}
                onScroll={() =>
                  menuVisibleFor != null && setMenuVisibleFor(null)
                }>
                <View style={styles.grid}>
                  {inventoryItems.map((item, index) => (
                    <View key={item.id} style={styles.cardWrapper}>
                      {renderInventoryCard(item, index)}
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
  gridContainer: {},
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
    padding: 12,
  },
  itemInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  menuButton: {
    padding: SIZES.base,
  },
  menuDropdown: {
    position: 'absolute',
    right: SIZES.base,
    top: SIZES.base,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    textAlign: 'center',
    padding: SIZES.base,
  },
  menuItemText: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: SIZES.base,
  },
});

export default ViewInventory;
