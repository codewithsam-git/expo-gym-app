import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants';
import BASE_URL from '../Api/commonApi';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const History = ({ route }) => {
  const { memberId } = route.params;
  const [billHistory, setBillHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchBillHistory = async () => {
    try {
      console.log(`${BASE_URL}/members-history?id=${memberId}`);
      const response = await fetch(
        `${BASE_URL}/members-history?id=${memberId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBillHistory(data.getMemberHistory);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillHistory();
  }, []);

  function renderBillItem(bill, index) {
    const statusColor =
      bill.memberStatus === 'Active' ? '#5DBE3F' : COLORS.lightRed;

    return (
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        delay={index * 150}
        style={styles.billItem}>
        {/* Profile and Timeline */}
        <View style={styles.profileContainer}>
          <Animatable.View
            animation="bounceIn"
            duration={1000}
            style={styles.profileWrapper}>
            <Image
              source={{
                uri:
                  bill.avatarUrl ||
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzPKFziefwggi6URHF_ApNhe9okKizqq4lRBjzG9QQ5--_Ch0Iq9IUtPONEw9-SeKlqs&usqp=CAU',
              }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
          </Animatable.View>
        </View>

        {/* Bill Details */}
        <View style={styles.billDetails}>
          <View style={styles.billRow}>
            <Text style={styles.packageName}>{bill.package_name || 'N/A'}</Text>
            <Text style={styles.price}>₹{bill.packagePrice || 'N/A'}</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>
              {new Date(bill.start_Date).toLocaleDateString()}
            </Text>
            <Text style={styles.dateSeparator}> - </Text>
            <Text style={styles.dateText}>
              {new Date(bill.end_date).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewBillButton}
            onPress={() => {
              navigation.navigate('memberBill', { num: bill.invoice_number });
            }}>
            <Text style={styles.viewBillText}>View Bill</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Header */}
      <View>
      <Animatable.View
        animation="fadeInDown"
        duration={800}
        style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill History</Text>
        <View style={styles.headerSpacer} />
      </Animatable.View>
      </View>

      <View style={styles.contentContainer}>
        {/* Single Continuous Timeline (Non-Scrolling) */}

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : billHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No bill history available</Text>
          </View>
        ) : (
          <>
            <View style={styles.timelineLine} />
            <ScrollView
              contentContainerStyle={{
                paddingBottom: Platform.OS === 'ios' ? 60 : 160,
              }}
              scrollEnabled={true}>
              {billHistory.map((bill, index) => (
                <View key={bill.id || index}>
                  {renderBillItem(bill, index)}
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.font,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  backButton: {
    padding: SIZES.base,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SIZES.font,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: SIZES.font + 24,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.lightGray4,
    zIndex: 0,
  },
  billItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.base * 2.5,
  },
  profileContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  profileWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  billDetails: {
    flex: 1,
    padding: SIZES.font,
    borderRadius: SIZES.base,
    marginLeft: SIZES.base,
    backgroundColor: COLORS.secondary,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  packageName: {
    ...FONTS.h3, // Slightly smaller than memberNameText
    color: COLORS.white,
    fontWeight: '600',
    flex: 1,
    marginRight: SIZES.base,
  },
  price: {
    ...FONTS.h3,
    color: '#5DBE3F',
    fontWeight: '700',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: SIZES.base,
  },
  dateText: {
    ...FONTS.body4,
    color: COLORS.lightGray,
    fontWeight: '500',
  },
  dateSeparator: {
    ...FONTS.body4,
    color: COLORS.lightGray,
    marginHorizontal: SIZES.base,
  },
  viewBillButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base / 2,
    paddingHorizontal: SIZES.base,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-start',
  },
  viewBillText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '600',
  },
  loadingText: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    textAlign: 'center',
    marginTop: SIZES.padding,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
});

export default History;
