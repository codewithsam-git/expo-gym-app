import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import Header from '../components/Header';
import BASE_URL from '../Api/commonApi';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
const screenWidth = Dimensions.get('window').width;
import { LinearGradient } from 'expo-linear-gradient';
import IMAGES_URL from '../Api/ImagesUrl';
import Ionicon from 'react-native-vector-icons/FontAwesome';

const Notification = ({ navigation }) => {
  const [members, setMembers] = useState([]);

  const formatFetchedDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const sendWhatsAppMessage = (member) => {

    const message =
      `👋 Hello ${member.name} !\n\n` +
      `Your gym membership has expired, but we're excited to welcome you back! 🔄 
      \n` +
      `Take advantage of our exclusive offer to continue your fitness journey. 🏋‍♂
      \n` +
      `👉 *Click below to learn more and renew today:* \n` +
      `https://gym.cronicodigital.com/offers/\n\n` +
      `Stay fit, stay strong! 💪\n\n` +
      `Warm regards,\n` +
      `*One Hour Fitness Club*`;


    const phoneNumber = member.phoneno;
    const whatsappUrl = `whatsapp://send?phone=+91${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    Linking.openURL(whatsappUrl).catch(() => {
      Alert.alert('Make sure WhatsApp is installed on your device');
    });
  };

  function renderMemberExpiryTitleSection() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
          paddingHorizontal: 18,
        }}>
        {/* Left Line */}
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />

        {/* Title Section */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 8,
            paddingHorizontal: 15,
            borderRadius: 10,
          }}>
          <Icon
            name="calendar-outline"
            size={20}
            color="#FFD700" // Gold color for premium look
            style={{ marginRight: 8 }}
          />
          <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>
            Membership Expired / Expiring Soon
          </Text>
        </View>

        {/* Right Line */}
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />
      </View>
    );
  }

  function renderMemberCard(member) {
    return (
      <View style={styles.memberCard}>
        <View style={styles.memberHeader}>
          {/* Avatar and member details on the left */}
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: `${IMAGES_URL}/membersImage/${member.profile_image}` || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgzPKFziefwggi6URHF_ApNhe9okKizqq4lRBjzG9QQ5--_Ch0Iq9IUtPONEw9-SeKlqs&usqp=CAU',
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          <View style={styles.memberDetails}>
            <Text style={styles.memberName}>
              {member.name} {member.surname}
            </Text>
            <Text style={styles.memberPlan}>
              {member.package_name}
            </Text>
            <Text style={styles.memberPlan}>
              {formatFetchedDate(member.start_Date)} - {formatFetchedDate(member.end_date)}
            </Text>
          </View>
          <View style={styles.expiryContainer}>
            <View></View>
            <View>
              <Text style={styles.expiryDate}>
                {
                  formatFetchedDate(member.end_date)
                    > new Date().toLocaleDateString('en-GB')
                    ? formatFetchedDate(member.end_date)
                    : 'Expired'
                }
              </Text>
            </View>
            <TouchableOpacity
              style={styles.shareOnWhatsappButton}
              onPress={() => sendWhatsAppMessage(member)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.shareOnWhatsappText}>Offer</Text>
                <Ionicon
                  name="whatsapp"
                  size={20}
                  color="white"
                  style={{ marginLeft: 5 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/dashboard`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMembers(data.getFilterMembers);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMembers();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
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
          <Header headerTitle="Notifications" />
        </View>
        <ScrollView
          style={{ margin: SIZES.radius }}
          showsVerticalScrollIndicator={false}>
          <View>
            {members.length !== 0 && (
              <View>{renderMemberExpiryTitleSection()}</View>
            )}
            <View>
              {members.length === 0 && (
                <View style={styles.emptyState}>
                  <Image
                    source={images.noNotification}
                    style={styles.noDataImage}
                  />
                  <Text style={styles.emptyText}>
                    Stay tuned! No alerts for now.
                  </Text>
                </View>
              )}
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={true}>
                {members.map((member, index) => (
                  <TouchableOpacity
                    key={member.id}
                    onPress={() =>
                      navigation.navigate('updatePlan', { memberId: member.id })
                    }>
                    <View>{renderMemberCard(member)}</View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  memberCard: {
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  memberPlan: {
    fontSize: 14,
    color: 'gray',
  },
  expiryContainer: {
    position: 'absolute',
    right: 0,
    top: 2,
  },
  expiryDate: {
    fontSize: 12,
    color: COLORS.lightRed, // Expiry date in red
    fontWeight: 'bold',
  },
  shareOnWhatsappButton: {
    marginTop: SIZES.base,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#5DBE3F',
    borderRadius: SIZES.radius,
    alignSelf: 'flex-start',
  },
  shareOnWhatsappText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '500',
    fontSize: 14,
  }
  ,
  emptyState: {
    marginTop: screenWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  noDataImage: {
    width: 100,
    height: 100,
    marginBottom: SIZES.base,
  },
  emptyText: {
    color: COLORS.lightGray,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Notification;
