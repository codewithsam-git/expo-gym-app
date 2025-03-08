import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Linking,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, SIZES } from '../constants';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation


const MemberBill = ({ memberData }) => {
  const navigation = useNavigation();
  const [isGenerating, setIsGenerating] = useState(false);

  // Default member data if none is passed
  const member = memberData || {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '8857012009',
    planStart: '01/03/2025',
    planEnd: '01/04/2025',
    charges: 299,
    discount: 50,
  };

  // Calculate total amount
  const totalAmount = member.charges - member.discount;

  // Generate a unique invoice number
  const invoiceNumber = `BILL-${Date.now().toString().slice(-6)}`;

  // Current date for the bill
  const currentDate = new Date().toLocaleDateString();

  // HTML content for bill
  const generateHTML = () => {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica', sans-serif;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              margin: 5px 0;
              color: #1a73e8;
            }
            .info-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .info-box {
              width: 45%;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .total-row {
              font-weight: bold;
              background-color: #f8f9fa;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>One Hour Fitness Club</h1>
            <p>123 Fitness Street, Pimpri-Chinchwad</p>
            <p>Email: info@onehourfitnessclub.com | Phone: +91 7788996655</p>
          </div>
          
          <div class="info-section">
            <div class="info-box">
              <h3>Bill To:</h3>
              <p><strong>Name:</strong> ${member.fullName}</p>
              <p><strong>Email:</strong> ${member.email}</p>
              <p><strong>Phone:</strong> ${member.phone}</p>
            </div>
            <div class="info-box">
              <h3>Bill Details:</h3>
              <p><strong>Bill Number:</strong> ${invoiceNumber}</p>
              <p><strong>Date:</strong> ${currentDate}</p>
              <p><strong>Membership Period:</strong> ${member.planStart} to ${member.planEnd}</p>
            </div>
          </div>
          
          <table>
            <tr>
              <th>Description</th>
              <th>Amount (₹)</th>
            </tr>
            <tr>
              <td>Gym Membership Fees</td>
              <td>${member.charges}/-</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>-${member.discount}/-</td>
            </tr>
            <tr class="total-row">
              <td>Total Amount</td>
              <td>${totalAmount}/-</td>
            </tr>
          </table>
          
          <div class="footer">
            <p>Thank you for being a member of Fitness Gym!</p>
            <p>This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </body>
      </html>
    `;
  };

  const generatePDF = async () => {
    try {
      setIsGenerating(true);

      const { uri } = await Print.printToFileAsync({
        html: generateHTML(),
        base64: false,
      });

      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert("Sharing isn't available on your platform");
        }
      } else if (Platform.OS === 'web') {
        window.open(uri, '_blank');
      }

      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleWebPreview = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Member Billing</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content}>
          {/* Invoice Info */}
          <View style={styles.invoiceInfo}>
            <View>
              <Text style={styles.invoiceLabel}>Bill Number</Text>
              <Text style={styles.invoiceValue}>{invoiceNumber}</Text>
            </View>
            <View>
              <Text style={styles.invoiceLabel}>Date</Text>
              <Text style={styles.invoiceValue}>{currentDate}</Text>
            </View>
          </View>

          {/* Member Info */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Member Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{member.fullName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{member.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{member.phone}</Text>
            </View>
          </View>

          {/* Membership Details */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Membership Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Start Date:</Text>
              <Text style={styles.infoValue}>{member.planStart}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>End Date:</Text>
              <Text style={styles.infoValue}>{member.planEnd}</Text>
            </View>
          </View>

          {/* Billing Details */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Billing Details</Text>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Membership Fee</Text>
              <Text style={styles.billingValue}>{member.charges}/-</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Discount</Text>
              <Text style={styles.billingValue}>-{member.discount}/-</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.billingRow}>
              <Text style={[styles.billingLabel, styles.totalLabel]}>
                Total Amount
              </Text>
              <Text style={[styles.billingValue, styles.totalValue]}>
                {totalAmount}/-
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.downloadButton,
              isGenerating && styles.disabledButton,
            ]}
            onPress={generatePDF}
            disabled={isGenerating}>
            <Icon
              name="download-outline"
              size={18}
              color={COLORS.white}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  headerSpacer: {
    width: 24, // To balance the back arrow icon
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  invoiceLabel: {
    ...FONTS.body4,
    color: COLORS.lightGray,
  },
  invoiceValue: {
    ...FONTS.h4,
    color: COLORS.white,
  },
  sectionContainer: {
    marginBottom: SIZES.padding * 1.5,
    padding: SIZES.base,
    backgroundColor: '#202428',
    borderRadius: 10,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.white,
    marginBottom: SIZES.base,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SIZES.base / 2,
  },
  infoLabel: {
    ...FONTS.body4,
    color: COLORS.lightGray,
    width: '35%',
  },
  infoValue: {
    ...FONTS.body4,
    color: COLORS.white,
    flex: 1,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
  },
  billingLabel: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  billingValue: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.base,
  },
  totalLabel: {
    ...FONTS.h4,
  },
  totalValue: {
    ...FONTS.h4,
    color: COLORS.primary,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: '#202428',
  },
  actionButton: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#444',
  },
  downloadButton: {
    backgroundColor: COLORS.primary,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  buttonIcon: {
    marginRight: 5,
  },
});

export default MemberBill;
