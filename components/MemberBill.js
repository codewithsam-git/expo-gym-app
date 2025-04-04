import React, { useState, useEffect } from 'react';
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
import { COLORS, FONTS, SIZES, images } from '../constants';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../Api/commonApi';
import { ActivityIndicator } from 'react-native';

const MemberBill = ({ route }) => {
  const { num } = route.params;
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneno, setPhoneNo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [address, setAddress] = useState('');
  const [packageName, setPackageName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBillData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/bill-details?num=${num}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setName(data.billData.member.name);
      setSurname(data.billData.member.surname);
      setPhoneNo(data.billData.member.phoneno);
      setEmail(data.billData.member.email);
      setAddress(data.billData.member.address);
      setInvoiceNumber(data.billData.invoice_number);
      setStartDate(data.billData.start_Date);
      setEndDate(data.billData.end_date);
      setPackagePrice(data.billData.packagePrice.toString());
      setDiscount(data.billData.discountFinalPrice.toString());
      setTotalAmount(
        data.billData.packagePrice - data.billData.discountFinalPrice
      );
      setPackageName(data.billData.package_name);
      setIsLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBillData();
  }, []);

  // HTML content for bill
  const generateHTML = () => {
    return `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .invoice-container {
            max-width: 900px;
            margin: 30px auto;
            padding: 30px;
            background-color: #ffffff;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #ddd;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }

        .header div {
            font-weight: bold;
            font-size: 16px;
        }

        .details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            align-items: flex-start;
        }

        .details div {
            width: 48%;
        }

        .details h3 {
            margin-bottom: 8px;
            font-size: 16px;
            font-weight: bold;
        }

        .details p {
            margin: 5px 0;
            font-size: 14px;
        }

        .details img {
            width: 120px;
            height: auto;
            margin-left: 20px;
            object-fit: contain;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .table th,
        .table td {
            border: 1px solid #ddd;
            padding: 12px 15px;
            text-align: left;
            font-size: 14px;
        }

        .table th {
            background: #f8f8f8;
            font-weight: bold;
        }

        .table td {
            background-color: #fafafa;
        }

        .summary {
            margin-top: 20px;
            text-align: right;
        }

        .summary p {
            margin: 5px 0;
            font-size: 16px;
        }

        .notes {
            margin-top: 20px;
            font-size: 14px;
            line-height: 1.6;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>

<body>
    <div class="invoice-container">
        <div class="header">
            <div>Invoice</div>
            <div>Date: <span id="invoiceDate">${new Date().toLocaleDateString('en-GB')}</span></div>
            <div>Payment Status: Completed</div>
        </div>

        <div class="details">
            <div>
                <h3>From:</h3>
                <p><strong>One Hour Fitness Club</strong></p>
                <p>402, Mone Complex, Guruwar Peth</p>
                <p>Satara, 415002</p>
                <p>Email: onehourfitness@gmail.com</p>
                <p>Phone: +9423107707</p>
            </div>
            <div>
                <h3>To:</h3>
                <p><strong>Gaurav Jaiswal</strong></p>
                <p id="clientAddress">${address}</p>
            </div>
            <div>
                <img src="../assets/logo/gym-logo.png" alt="Gym Logo" />
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Plan Name</th>
                    <th>Plan Start Date</th>
                    <th>Plan End Date</th>
                    <th>Package Cost</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td id="planName">${packageName}</td>
                    <td id="startDate">${startDate}</td>
                    <td id="endDate">${endDate}</td>
                    <td id="packagePrice">${packagePrice}</td>
                </tr>
            </tbody>
        </table>

        <div class="summary">
            <p><strong>Price After Discount:</strong> ₹<span id="discount">${discount}</span></p>
            <p><strong>Other Fees:</strong> ₹0</p>
            <p><strong>Amount Payable:</strong> ₹<span id="amountPayable">${discount}</span></p>
        </div>

        <div class="footer">
            <p>Thank you for choosing One Hour Fitness Club! We look forward to serving you again.</p>
        </div>
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

      const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-'); // Replace / with -
      const fileName = `Invoice_${name}_${surname}_${date}.pdf`;
      const newUri = FileSystem.documentDirectory + fileName;

      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });


      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(newUri);
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
          <Text style={styles.headerTitle}>Member Bill</Text>
          <View style={styles.headerSpacer} />
        </View>

        {isLoading ? ( 
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{textAlign: 'center', color: COLORS.lightGray4}}>Generating...</Text>
          </View>
        ) : (

          <ScrollView style={styles.content}>
            <View style={styles.invoiceInfo}>
              <View>
                <Text style={styles.invoiceLabel}>Invoice Number</Text>
                <Text style={styles.invoiceValue}>{invoiceNumber}</Text>
              </View>
              <View>
                <Text style={styles.invoiceLabel}>Date</Text>
                <Text style={styles.invoiceValue}>
                  {new Date().toLocaleDateString('en-GB')}
                </Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Member Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>
                  {name} {surname}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{phoneno}</Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Membership Details</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Start Date:</Text>
                <Text style={styles.infoValue}>{startDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>End Date:</Text>
                <Text style={styles.infoValue}>{endDate}</Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Billing Details</Text>
              <View style={styles.billingRow}>
                <Text style={styles.billingLabel}>Package Price</Text>
                <Text style={styles.billingValue}>{packagePrice}/-</Text>
              </View>
              <View style={styles.billingRow}>
                <Text style={styles.billingLabel}>Price after discount</Text>
                <Text style={styles.billingValue}>{discount}/-</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.billingRow}>
                <Text style={styles.totalLabel}>Amount Payable</Text>
                <Text style={[styles.billingValue, styles.totalValue]}>
                  {discount}/-
                </Text>
              </View>
            </View>
          </ScrollView>

        )}


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
            disabled={isGenerating || isLoading}>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: SIZES.base,
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
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
  },
  infoLabel: {
    ...FONTS.body4,
    color: COLORS.lightGray,
    width: '35%',
  },
  infoValue: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
  },
  billingLabel: {
    ...FONTS.body4,
    color: COLORS.lightGray,
    width: '35%',
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
    color: COLORS.white,
    width: '35%',
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
