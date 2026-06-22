import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  ScrollView,
  TextInput,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import {colors, fonts} from '../../config/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import Entypo from 'react-native-vector-icons/Entypo';
import {launchImageLibrary} from 'react-native-image-picker';
import {useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  createProduction,
  addProductToProduction,
  startBatch,
  stopBatch,
  approveProduction,
} from '../../redux/reducers/Production/productionModuleSlice'; // ← adjust path
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchCategories,
  fetchProductsByCategory,
} from '../../redux/reducers/Production/productionSlice'; // Adjust path
const {height, width} = Dimensions.get('window');

const AddProduction = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const editData = route.params?.editData;

  useEffect(() => {
    if (editData?.productionId) {
      dispatch({
        type: 'productionmodule/setProductionId',
        payload: editData.productionId,
      });

      // PATCH FIX: Fetch products for ALL categories in editData
      if (editData.products && editData.products.length > 0) {
        // Get unique category IDs
        const uniqueCategoryIds = [...new Set(editData.products.map(prod => prod.categoryId))];
        
        // Fetch products for each unique category
        uniqueCategoryIds.forEach(categoryId => {
          if (categoryId) {
            dispatch(fetchProductsByCategory(categoryId));
          }
        });
      }
    }
  }, [editData, dispatch]);
  // Redux state
  const {productionId, loading: creatingProduction} = useSelector(
    state => state.productionmodule,
  );
  const {
    categories,
    loading: categoriesLoading,
    products: reduxProducts,
  } = useSelector(state => state.production);

  // --- Local States ---
  // const [date, setDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(
    editData
      ? new Date(editData.productionDate).toLocaleDateString('en-GB')
      : new Date().toLocaleDateString('en-GB'),
  );
  const [incharge, setIncharge] = useState(
    editData?.productionInchargeId?.toString() || '',
  );
  const [isProductSectionVisible, setIsProductSectionVisible] = useState(
    !!editData,
  );

  // const [products, setProducts] = useState(
  //   editData?.products?.length > 0
  //     ? editData.products.map(prod => ({
  //         id: prod.productRowId,
  //         productionProductId: prod.productRowId,
  //         category: prod.categoryId?.toString(),
  //         name: prod.productId?.toString(),
  //         batches: prod.batches.map(b => ({
  //           id: b.batchId,
  //           serverBatchId: b.batchId,
  //           batchNo: b.batchNo,
  //           balletNo: b.batchNo,
  //           // Convert ISO strings from API to HH:mm for the UI
  //           start: b.startTime
  //             ? new Date(b.startTime).toLocaleTimeString([], {
  //                 hour: '2-digit',
  //                 minute: '2-digit',
  //                 hour12: false,
  //               })
  //             : '',
  //           end: b.endTime
  //             ? new Date(b.endTime).toLocaleTimeString([], {
  //                 hour: '2-digit',
  //                 minute: '2-digit',
  //                 hour12: false,
  //               })
  //             : '',
  //           cases: b.cases?.toString() || '',
  //           image: null,
  //           showDelayFields: false, // Or determine based on duration logic
  //         })),
  //       }))
  //     : [{id: Date.now(), category: null, name: null, batches: []}],
  // );

  // --- Helpers ---
  const [products, setProducts] = useState(
  editData?.products?.length > 0
    ? editData.products.map(prod => ({
        // Use the productRowId as the local ID to maintain order
        id: prod.productRowId, 
        productionProductId: prod.productRowId,
        category: prod.categoryId?.toString(),
        name: prod.productId?.toString(),
        productName: prod.productName, // Store the product name for reference
        hasBeenSentToProduction: true, // Mark as sent to production since it's from editData
        batches: prod.batches.map(b => ({
          id: b.batchId,
          serverBatchId: b.batchId,
          batchNo: b.batchNo,
          balletNo: b.batchNo, // Displaying batchNo as Ballet Number
          // Formatting the ISO startTime/endTime for the 00:00 UI
          start: b.startTime
            ? new Date(b.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
            : '',
          end: b.endTime
            ? new Date(b.endTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
            : '',
          cases: b.cases?.toString() || '',
          status: b.status,
          reason: b.reason || '', // Store delay reason from edit data
          image: b.image || null, // Store delay image from edit data (URI for display)
          imageBase64: b.imageBase64 || b.image || null, // Store base64 or fallback to image field
          showDelayFields: false,
        })),
      }))
    : [{id: Date.now(), category: null, name: null, hasBeenSentToProduction: false, batches: []}]
);
  
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle('dark-content');
    }, []),
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const formattedCategories = categories.map(item => ({
    label: item.categoryName,
    value: item.id.toString(), // converting ID to string for dropdown value
  }));

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const onDateChange = (event, selectedDate) => {
    setShowDate(false);
    if (selectedDate) {
      setDate(selectedDate.toLocaleDateString('en-GB'));
    }
  };

  // Convert dd/mm/yyyy → yyyy-mm-dd for API
  const formatDateForAPI = dateStr => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };
  const formattedProducts = reduxProducts.map(item => ({
    label: item.productName,
    value: item.id.toString(),
  }));
  // --- Product Actions ---
  const addNewProductSection = () => {
    setProducts(prev => [
      ...prev,
      {id: Date.now(), category: null, name: null, hasBeenSentToProduction: false, batches: []},
    ]);
  };

  const updateProductInfo = (productId, field, value) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? {...p, [field]: value} : p)),
    );
  };

  // --- Batch Actions ---
  // const addBatch = async productId => {
  //   const currentProduct = products.find(p => p.id === productId);
  //   const nextBalletNo = (currentProduct.batches.length + 1).toString(); // Auto-calc ballet number

  //   if (currentProduct.batches.length === 0) {
  //     const selectedProd = formattedProducts.find(
  //       item => item.value === currentProduct.name,
  //     );
  //     const payload = {
  //       productionId: productionId,
  //       productId: parseInt(currentProduct.name, 10),
  //       productName: selectedProd ? selectedProd.label : '',
  //       categoryId: parseInt(currentProduct.category, 10),
  //     };

  //     try {
  //       const res = await dispatch(addProductToProduction(payload)).unwrap();
  //       // Store the productionProductId returned from the server into the product object
  //       updateProductInfo(
  //         productId,
  //         'productionProductId',
  //         res.productionProductId,
  //       );
  //     } catch (err) {
  //       Alert.alert('Error', err || 'Failed to link product');
  //       return;
  //     }
  //   }

  //   setProducts(prev =>
  //     prev.map(p => {
  //       if (p.id === productId) {
  //         return {
  //           ...p,
  //           batches: [
  //             ...p.batches,
  //             {
  //               id: Date.now(),
  //               batchNo: p.batches.length + 1,
  //               balletNo: nextBalletNo, // <--- Auto-patched here
  //               start: '',
  //               end: '',
  //               cases: '',
  //               image: null,
  //             },
  //           ],
  //         };
  //       }
  //       return p;
  //     }),
  //   );
  // };
  // before going to lunch
  // const addBatch = async productId => {
  //   const currentProduct = products.find(p => p.id === productId);

  //   // --- 1. DUPLICATE PRODUCT CHECK ---
  //   // If this is the FIRST batch, check if this product ID already exists in OTHER sections
  //   if (currentProduct.batches.length === 0) {
  //     const isDuplicate = products.some(
  //       p => p.id !== productId && p.name === currentProduct.name,
  //     );

  //     if (isDuplicate) {
  //       const selectedProd = formattedProducts.find(
  //         item => item.value === currentProduct.name,
  //       );
  //       Alert.alert(
  //         'Duplicate Product',
  //         `${
  //           selectedProd?.label || 'This product'
  //         } is already added in this production. Please select a different product.`,
  //       );
  //       return;
  //     }
  //   }

  //   // --- 2. GLOBAL BALLET NUMBER CALCULATION ---
  //   // Calculate total batches already existing in the entire list
  //   const totalExistingBatches = products.reduce(
  //     (total, p) => total + p.batches.length,
  //     0,
  //   );
  //   const nextBalletNo = (totalExistingBatches + 1).toString();

  //   // --- 3. API CALL (IF FIRST BATCH) ---
  //   if (currentProduct.batches.length === 0) {
  //     const selectedProd = formattedProducts.find(
  //       item => item.value === currentProduct.name,
  //     );
  //     const payload = {
  //       productionId: productionId,
  //       productId: parseInt(currentProduct.name, 10),
  //       productName: selectedProd ? selectedProd.label : '',
  //       categoryId: parseInt(currentProduct.category, 10),
  //     };

  //     try {
  //       const res = await dispatch(addProductToProduction(payload)).unwrap();
  //       updateProductInfo(
  //         productId,
  //         'productionProductId',
  //         res.productionProductId,
  //       );
  //     } catch (err) {
  //       Alert.alert(
  //         'Error',
  //         typeof err === 'string' ? err : 'Failed to link product',
  //       );
  //       return;
  //     }
  //   }

  //   // --- 4. UPDATE STATE ---
  //   setProducts(prev =>
  //     prev.map(p => {
  //       if (p.id === productId) {
  //         return {
  //           ...p,
  //           batches: [
  //             ...p.batches,
  //             {
  //               id: Date.now(),
  //               batchNo: nextBalletNo, // Global increment
  //               balletNo: nextBalletNo, // Displays in input
  //               start: '',
  //               end: '',
  //               cases: '',
  //               image: null,
  //               showDelayFields: false,
  //             },
  //           ],
  //         };
  //       }
  //       return p;
  //     }),
  //   );
  // };
  const addBatch = async productId => {
    const currentProduct = products.find(p => p.id === productId);

    // --- 1. DUPLICATE PRODUCT CHECK ---
    if (currentProduct.batches.length === 0) {
      const isDuplicate = products.some(
        p => p.id !== productId && p.name === currentProduct.name,
      );

      if (isDuplicate) {
        const selectedProd = formattedProducts.find(
          item => item.value === currentProduct.name,
        );
        Alert.alert(
          'Duplicate Product',
          `${selectedProd?.label || 'This product'} is already added.`,
        );
        return;
      }
    }

    // --- 2. GLOBAL BALLET NUMBER CALCULATION ---
    // Instead of currentProduct.batches.length, we sum the length of batches from ALL products
    const totalExistingBatches = products.reduce(
      (total, p) => total + (p.batches ? p.batches.length : 0),
      0,
    );

    // This ensures if Product 1 has 2 batches, the next click (anywhere) results in 3
    const nextGlobalBalletNo = (totalExistingBatches + 1).toString();

    // --- 3. API CALL (IF FIRST BATCH OF THIS SECTION) ---
    if (currentProduct.batches.length === 0) {
      const selectedProd = formattedProducts.find(
        item => item.value === currentProduct.name,
      );
      const payload = {
        productionId: productionId,
        productId: parseInt(currentProduct.name, 10),
        productName: selectedProd ? selectedProd.label : '',
        categoryId: parseInt(currentProduct.category, 10),
      };

      try {
        const res = await dispatch(addProductToProduction(payload)).unwrap();
        updateProductInfo(
          productId,
          'productionProductId',
          res.productionProductId,
        );
        // Mark this product as sent to production
        updateProductInfo(productId, 'hasBeenSentToProduction', true);
      } catch (err) {
        Alert.alert(
          'Error',
          typeof err === 'string' ? err : 'Failed to link product',
        );
        return;
      }
    }

    // --- 4. UPDATE STATE ---
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            batches: [
              ...p.batches,
              {
                id: Date.now(),
                batchNo: nextGlobalBalletNo, // Patched with global count
                balletNo: nextGlobalBalletNo, // Patched with global count
                start: '',
                end: '',
                cases: '',
                image: null,
                imageBase64: null, // Add base64 field for new batches
                showDelayFields: false,
              },
            ],
          };
        }
        return p;
      }),
    );
  };
  const updateBatchField = (productId, batchId, field, value) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const updatedBatches = p.batches.map(b =>
            b.id === batchId ? {...b, [field]: value} : b,
          );
          return {...p, batches: updatedBatches};
        }
        return p;
      }),
    );
  };

  const handleImagePicker = (productId, batchId) => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (!response.didCancel && !response.errorCode) {
        const imageUri = response.assets[0].uri;
        
        // Convert image to base64
        const convertToBase64 = async (uri) => {
          try {
            const response = await fetch(uri);
            const blob = await response.blob();
            
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                // Keep the full data URL with prefix (data:image/jpeg;base64,...)
                resolve(reader.result);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error('Error converting image to base64:', error);
            return null;
          }
        };

        // Convert and store both URI (for display) and base64 (for API)
        convertToBase64(imageUri).then(fullDataUrl => {
          updateBatchField(productId, batchId, 'image', imageUri); // For display
          updateBatchField(productId, batchId, 'imageBase64', fullDataUrl); // Full data URL for API (already has prefix)
        });
      }
    });
  };

  // --- MAIN LOGIC: Add Product Button (hits API only when needed) ---
  const handleAddProduct = async () => {
    // --- VALIDATION ADDED HERE ---
    if (!incharge || incharge.trim() === '') {
      Alert.alert(
        'Required',
        'Production Incharge Name is required to continue.',
      );
      return;
    }

    if (creatingProduction) return;

    const apiDate = formatDateForAPI(date);
    const storedDate = await AsyncStorage.getItem('@production_date');

    if (storedDate === apiDate && productionId !== null) {
      setIsProductSectionVisible(true);
      return;
    }

    const payload = {
      productionDate: apiDate,
      productionInchargeId: incharge, // Sends the name/ID entered
    };

    try {
      await dispatch(createProduction(payload)).unwrap();
      await AsyncStorage.setItem('@production_date', apiDate);
      setIsProductSectionVisible(true);
    } catch (err) {
      const msg =
        typeof err === 'string' ? err : err?.message || 'Failed to create';
      Alert.alert('Error', msg);
    }
  };

  // const handleStartTime = async (productId, batchId, currentBatchNo) => {
  //   const currentProduct = products.find(p => p.id === productId);

  //   // Prepare payload for start-batch
  //   const payload = {
  //     productionProductId: currentProduct.productionProductId, // Saved from addProductToProduction
  //     batchNo: currentBatchNo.toString(),
  //   };

  //   try {
  //     const res = await dispatch(startBatch(payload)).unwrap();

  //     // Update local state with the time and the batchId from server
  //     setProducts(prev =>
  //       prev.map(p => {
  //         if (p.id === productId) {
  //           const updatedBatches = p.batches.map(b =>
  //             b.id === batchId
  //               ? {...b, start: getCurrentTime(), serverBatchId: res.batchId}
  //               : b,
  //           );
  //           return {...p, batches: updatedBatches};
  //         }
  //         return p;
  //       }),
  //     );
  //   } catch (err) {
  //     // FIX: Safely handle the error message
  //     const errorMessage =
  //       typeof err === 'string'
  //         ? err
  //         : err?.message || 'An unknown error occurred';

  //     Alert.alert('Error', errorMessage);
  //     console.log('Full Error Object:', err); // Keep this for debugging
  //   }
  // };

  const isDelayDetected = (startTime, endTime, durationStr) => {
    if (!startTime || !endTime) return false;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    const diff = endTotal - startTotal;
    // Clean duration string like "20 Mins" to number 20
    const allowedLimit = parseInt(durationStr.replace(/[^0-9]/g, ''), 10) || 20;

    return diff > allowedLimit;
  };

  // const handleEndTime = async (productId, batchId) => {
  //   const currentProduct = products.find(p => p.id === productId);
  //   const currentBatch = currentProduct.batches.find(b => b.id === batchId);
  //   const productData = reduxProducts.find(
  //     rp => rp.id.toString() === currentProduct.name,
  //   );

  //   // Validation: Ensure cases are entered before allowing End Time
  //   if (!currentBatch.cases || parseInt(currentBatch.cases, 10) <= 0) {
  //     Alert.alert(
  //       'Required',
  //       'Please enter the Number of Cases before ending the batch.',
  //     );
  //     return;
  //   }

  //   const endTime = getCurrentTime();
  //   updateBatchField(productId, batchId, 'end', endTime);

  //   const hasDelay = isDelayDetected(
  //     currentBatch.start,
  //     endTime,
  //     productData?.productionDuration || '20',
  //   );

  //   if (!hasDelay) {
  //     submitStopBatch(
  //       currentBatch.serverBatchId,
  //       currentBatch.cases,
  //       '',
  //       '',
  //       productId,
  //       batchId,
  //     );
  //   } else {
  //     updateBatchField(productId, batchId, 'showDelayFields', true);
  //   }
  // };

  // const submitStopBatch = async (
  //   serverBatchId,
  //   cases,
  //   reason,
  //   image,
  //   productId,
  //   batchId,
  // ) => {
  //   const payload = {
  //     batchId: serverBatchId,
  //     noOfCases: parseInt(cases || 0, 10),
  //     reason: reason || '',
  //     image: image || '',
  //   };

  //   try {
  //     await dispatch(stopBatch(payload)).unwrap();
  //     Alert.alert('Success', 'Batch Completed');
  //     // Hide delay fields if they were open
  //     updateBatchField(productId, batchId, 'showDelayFields', false);
  //   } catch (err) {
  //     // FIX: Prevent "ReadableNativeMap to string" crash
  //     const errorMessage =
  //       typeof err === 'string' ? err : err?.message || 'Update failed';
  //     Alert.alert('Error', errorMessage);
  //   }
  // };
  const submitStopBatch = async (
  serverBatchId,
  cases,
  reason,
  image,
  productId,
  batchId,
) => {
  // --- NEW VALIDATION FOR DELAY ---
  const currentProduct = products.find(p => p.id === productId);
  const currentBatch = currentProduct.batches.find(b => b.id === batchId);

  // If delay was detected, both reason and image are mandatory
  if (currentBatch.showDelayFields) {
    if (!reason || reason.trim() === '') {
      Alert.alert('Required', 'Please provide a reason for the delay.');
      return;
    }
    if (!currentBatch.imageBase64) {
      Alert.alert('Required', 'Please upload an image for the delay documentation.');
      return;
    }
  }

  const payload = {
    batchId: serverBatchId,
    noOfCases: parseInt(cases || 0, 10),
    reason: reason || '',
    image: currentBatch.imageBase64 || '', // Use base64 image instead of URI
  };

  try {
    await dispatch(stopBatch(payload)).unwrap();
    Alert.alert('Success', 'Batch Completed');
    // Hide delay fields if they were open
    updateBatchField(productId, batchId, 'showDelayFields', false);
    
    // Optional: You might want to update the status locally to 'COMPLETED' 
    // to match your UI logic
    updateBatchField(productId, batchId, 'status', 'COMPLETED');
  } catch (err) {
    const errorMessage =
      typeof err === 'string' ? err : err?.message || 'Update failed';
    Alert.alert('Error', errorMessage);
    console.log('Stop batch error:', err); // Add logging for debugging
  }
};

  // const handleApproveProduction = async () => {
  //   if (!productionId) {
  //     Alert.alert('Error', 'No production session found to approve.');
  //     return;
  //   }

  //   try {
  //     const res = await dispatch(approveProduction(productionId)).unwrap();
  //     Alert.alert('Success', res.message || 'Production Approved by Incharge', [
  //       {text: 'OK', onPress: () => navigation.goBack()},
  //     ]);
  //   } catch (err) {
  //     const errorMessage =
  //       typeof err === 'string' ? err : err?.message || 'Approval failed';
  //     Alert.alert('Error', errorMessage);
  //   }
  // };

  // Delete Product Function
  const deleteProduct = (productId) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product section?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setProducts(prev => prev.filter(p => p.id !== productId));
          }
        }
      ]
    );
  };

  // Delete Batch Function
  const deleteBatch = (productId, batchId) => {
    Alert.alert(
      "Delete Batch",
      "Are you sure you want to delete this batch?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setProducts(prev =>
              prev.map(p => {
                if (p.id === productId) {
                  return {
                    ...p,
                    batches: p.batches.filter(b => b.id !== batchId)
                  };
                }
                return p;
              })
            );
          }
        }
      ]
    );
  };

  // --- Data ---
  
  // 1. Confirmation for START Batch
const handleStartTime = async (productId, batchId, currentBatchNo) => {
  Alert.alert(
    "Start Batch",
    `Are you sure you want to START Batch #${currentBatchNo}?`,
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Yes, Start", 
        onPress: async () => {
          const currentProduct = products.find(p => p.id === productId);
          const payload = {
            productionProductId: currentProduct.productionProductId,
            batchNo: currentBatchNo.toString(),
          };

          try {
            const res = await dispatch(startBatch(payload)).unwrap();
            setProducts(prev =>
              prev.map(p => {
                if (p.id === productId) {
                  const updatedBatches = p.batches.map(b =>
                    b.id === batchId
                      ? { ...b, start: getCurrentTime(), serverBatchId: res.batchId }
                      : b,
                  );
                  return { ...p, batches: updatedBatches };
                }
                return p;
              }),
            );
          } catch (err) {
            const errorMessage = typeof err === 'string' ? err : err?.message || 'An unknown error occurred';
            Alert.alert('Error', errorMessage);
          }
        } 
      }
    ]
  );
};

// 2. Confirmation for END Batch
const handleEndTime = async (productId, batchId) => {
  const currentProduct = products.find(p => p.id === productId);
  const currentBatch = currentProduct.batches.find(b => b.id === batchId);

  // Validation: Case check before even showing the Alert
  if (!currentBatch.cases || parseInt(currentBatch.cases, 10) <= 0) {
    Alert.alert('Required', 'Please enter the Number of Cases before ending the batch.');
    return;
  }

  Alert.alert(
    "End Batch",
    "Are you sure you want to END this batch?",
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Yes, End", 
        onPress: async () => {
          const productData = reduxProducts.find(rp => rp.id.toString() === currentProduct.name);
          const endTime = getCurrentTime();
          updateBatchField(productId, batchId, 'end', endTime);

          // Use expected duration for delay detection (not actual duration)
          const expectedDuration = productData?.productionDuration || '20';
          const hasDelay = isDelayDetected(
            currentBatch.start,
            endTime,
            expectedDuration,
          );

          if (!hasDelay) {
            submitStopBatch(currentBatch.serverBatchId, currentBatch.cases, '', '', productId, batchId);
          } else {
            updateBatchField(productId, batchId, 'showDelayFields', true);
          }
        } 
      }
    ]
  );
};

// 3. Confirmation for APPROVE Production
const handleApproveProduction = async () => {
  if (!productionId) {
    Alert.alert('Error', 'No production session found to approve.');
    return;
  }

  Alert.alert(
    "Approve Production",
    "Are you sure you want to approve this production? This action cannot be undone.",
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Yes, Approve", 
        style: "default",
        onPress: async () => {
          try {
            const res = await dispatch(approveProduction(productionId)).unwrap();
            Alert.alert('Success', res.message || 'Production Approved by Incharge', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          } catch (err) {
            const errorMessage = typeof err === 'string' ? err : err?.message || 'Approval failed';
            Alert.alert('Error', errorMessage);
          }
        } 
      }
    ]
  );
};
  
  const CategoryData = [
    {label: 'Category 1', value: 'cat1'},
    {label: 'Category 2', value: 'cat2'},
  ];
  const NameData = [
    {label: 'Product A', value: 'prodA'},
    {label: 'Product B', value: 'prodB'},
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TouchableOpacity
          style={styles.header}
          onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
          <Text style={styles.title}>Add Production</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}>
        {/* Section: Production Information */}
        <Text style={[styles.title, {marginTop: 20}]}>
          Production Information
        </Text>
        <View style={styles.card}>
          <View style={styles.head}>
            <Text style={styles.first}>Date</Text>
            <View style={styles.for_border}>
              <TextInput
                style={styles.inputfield}
                editable={false}
                value={date}
              />
              <TouchableOpacity onPress={() => setShowDate(true)}>
                <Ionicons
                  name="calendar-clear-outline"
                  size={18}
                  color="#82889A"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.head}>
            <Text style={styles.first}>Production Incharge</Text>
            <View style={styles.for_border}>
              <TextInput
                placeholder="Enter Incharge Name"
                style={styles.inputfield}
                value={incharge}
                onChangeText={setIncharge}
                placeholderTextColor="#888"
                keyboardType="default" // ✅ allow text instead of numeric
              />
            </View>
          </View>
        </View>

        {/* Initial Add Product Trigger → now calls API logic */}
        {!isProductSectionVisible && (
          <TouchableOpacity
            style={[styles.button, {marginTop: 20}]}
            onPress={handleAddProduct}
            disabled={creatingProduction}>
            <Text style={styles.btn_text}>
              {creatingProduction ? 'Creating...' : 'Add Product'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Dynamic Product Sections */}
        {isProductSectionVisible &&
          products.map((product, pIndex) => (
            <View key={product.id}>
              <View style={styles.productHeaderContainer}>
                <Text
                  style={[
                    styles.title,
                    {marginTop: 25, color: colors.commoncolor},
                  ]}>
                  Product
                  {/* Product #{pIndex + 1} */}
                </Text>
                
                {/* Delete Product Button - Show only if product has never been sent to production */}
                {!product.hasBeenSentToProduction && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteProduct(product.id)}>
                    <Feather name="trash-2" size={18} color="#ff4444" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.card}>
                <Text style={styles.first}>Product Category</Text>
                <View style={styles.for_border_dropdown}>
                  <Dropdown
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.dropdownText}
                    itemTextStyle={styles.dropdownText}
                    style={styles.dropdown}
                    data={formattedCategories}
                    labelField="label"
                    valueField="value"
                    placeholder={
                      categoriesLoading ? 'Loading...' : 'Select Category'
                    }
                    value={product.category}
                    onChange={item => {
                      // 1. Update local state for this specific product row
                      updateProductInfo(product.id, 'category', item.value);

                      // 2. Clear the previous product name if category changes
                      updateProductInfo(product.id, 'name', null);

                      // 3. Dispatch the API call with the selected Category ID
                      dispatch(fetchProductsByCategory(item.value));
                    }}
                  />
                </View>

                <View style={styles.head}>
                  <Text style={styles.first}>Product Name</Text>
                  <View style={styles.for_border_dropdown}>
                    <Dropdown
                      style={styles.dropdown}
                      selectedTextStyle={styles.placeholderStyle}
                      placeholderStyle={styles.placeholderStyle}
                      itemTextStyle={styles.dropdownText}
                      data={formattedProducts} // Use the data from API
                      labelField="label"
                      valueField="value"
                      placeholder="Select Name"
                      value={product.name}
                      onChange={item =>
                        updateProductInfo(product.id, 'name', item.value)
                      }
                      renderSelectedItem={() => {
                        // If we have a stored productName from editData, display it
                        if (product.productName && !formattedProducts.find(p => p.value === product.name)) {
                          return (
                            <Text style={styles.dropdownText}>
                              {product.productName}
                            </Text>
                          );
                        }
                        // Otherwise show the selected item from dropdown
                        const selected = formattedProducts.find(p => p.value === product.name);
                        return (
                          <Text style={styles.dropdownText}>
                            {selected?.label || 'Select Name'}
                          </Text>
                        );
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* Dynamic Batches */}
              {product.batches.map((batch, bIndex) => {
                // Find the duration for this specific product from our fetched products list
                const productData = reduxProducts.find(
                  rp => rp.id.toString() === product.name,
                );
                
                // Calculate actual duration if batch has both start and end times
                const calculateActualDuration = (startTime, endTime) => {
                  if (!startTime || !endTime) return null;
                  
                  const [startH, startM] = startTime.split(':').map(Number);
                  const [endH, endM] = endTime.split(':').map(Number);
                  
                  const startTotal = startH * 60 + startM;
                  const endTotal = endH * 60 + endM;
                  
                  const diffMinutes = endTotal - startTotal;
                  return diffMinutes > 0 ? diffMinutes : 0;
                };

                // Check if there was a delay for completed batches
                const checkIfDelayOccurred = (startTime, endTime, expectedDuration) => {
                  if (!startTime || !endTime || !expectedDuration) return false;
                  
                  const actualDuration = calculateActualDuration(startTime, endTime);
                  const expectedMinutes = parseInt(expectedDuration.replace(/[^0-9]/g, ''), 10) || 20;
                  
                  return actualDuration > expectedMinutes;
                };
                
                // If batch has end time (completed), calculate actual duration from start/end times
                // Otherwise show expected duration from product setup
                let displayDuration;
                if (batch.end && batch.start) {
                  // Batch is completed, calculate actual duration
                  const actualDuration = calculateActualDuration(batch.start, batch.end);
                  displayDuration = actualDuration !== null ? `${actualDuration} Mins` : 'N/A';
                } else {
                  // Batch not completed, show expected duration
                  displayDuration = productData?.productionDuration || 'N/A';
                }

                // Check if delay occurred for completed batch
                const hadDelay = batch.end && batch.start && 
                  checkIfDelayOccurred(batch.start, batch.end, productData?.productionDuration);

                return (
                  <View key={batch.id} style={styles.card}>
                    <View style={styles.batchHeaderCard}>
                      <View style={styles.batchLeft}>
                        <View style={styles.batchNumber}>
                          <Text style={styles.batchNumberText}>
                            {batch.balletNo}
                          </Text>
                        </View>
                        <Text style={styles.batchHeaderText}>
                          Batch Section
                        </Text>
                      </View>
                      
                      {/* Delete Batch Button - Show only if batch hasn't been started */}
                      {batch.start === '' && (
                        <TouchableOpacity
                          style={styles.deleteBatchButton}
                          onPress={() => deleteBatch(product.id, batch.id)}>
                          <Feather name="trash-2" size={16} color="#ff4444" />
                        </TouchableOpacity>
                      )}
                    </View>
                    {/* NEW FIELD: Production Duration (TextInput) */}
                    

                    <Text style={styles.first}>Ballet Number</Text>
                    <View style={styles.for_border}>
                      <TextInput
                        placeholder="Enter Ballet Number"
                        style={styles.inputfield}
                        value={batch.balletNo}
                        onChangeText={v =>
                          updateBatchField(product.id, batch.id, 'balletNo', v)
                        }
                      />
                    </View>


                    {/* No of Cases Field */}
                    {batch.start !== '' && !batch.showDelayFields && (
                      <View style={styles.head}>
                        <Text style={styles.first}>No of Cases</Text>
                        <View style={styles.for_border}>
                          <TextInput
                            keyboardType="numeric"
                            placeholder="Enter Number of Cases"
                            style={styles.inputfield}
                            value={batch.cases}
                            onChangeText={v =>
                              updateBatchField(product.id, batch.id, 'cases', v)
                            }
                          />
                        </View>
                      </View>
                    )}


<View style={{marginBottom: 15,marginTop:15}}>
                      <Text style={styles.first}>
                        {batch.end && batch.start ? 'Duration' : 'Expected Production Duration'}
                      </Text>
                      <View
                        style={[
                          styles.for_border,
                          {backgroundColor: '#F9F9F9'},
                        ]}>
                        <TextInput
                          style={[
                            styles.inputfield,
                            {color: colors.commoncolor, fontWeight: '700'},
                          ]}
                          value={displayDuration}
                          editable={false} // Keeping it read-only as it's a target from DB
                        />
                      </View>
                    </View>
                    <View style={styles.head_new}>
                      <View style={styles.left}>
                        <Text style={styles.first}>Start Time</Text>
                        <TouchableOpacity
                          disabled={batch.start !== ''}
                          onPress={() =>
                            handleStartTime(
                              product.id,
                              batch.id,
                              batch.balletNo,
                            )
                          }>
                          <View
                            style={[
                              styles.for_newborder,
                              batch.start !== '' && {
                                backgroundColor: '#F5F5F5',
                              },
                            ]}>
                            <TextInput
                              style={styles.newinputfield}
                              value={batch.start}
                              editable={false}
                              placeholder="00:00"
                              placeholderTextColor="#000"
                            />
                          </View>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.right}>
                        <Text
                          style={[
                            styles.first,
                            {opacity: batch.start ? 1 : 0.4},
                          ]}>
                          End Time
                        </Text>
                        <TouchableOpacity
                          disabled={!batch.start || batch.end !== ''}
                          onPress={() => handleEndTime(product.id, batch.id)}>
                          <View
                            style={[
                              styles.for_newborder,
                              {
                                backgroundColor: batch.start
                                  ? 'transparent'
                                  : '#F5F5F5',
                              },
                            ]}>
                            <TextInput
                              style={styles.newinputfield}
                              value={batch.end}
                              editable={false}
                              placeholder="00:00"
                              placeholderTextColor="#000"
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Conditional Delay Section */}
                    {batch.showDelayFields && (
                      <View
                        style={{
                          marginTop: 15,
                          borderTopWidth: 1,
                          borderColor: '#eee',
                          paddingTop: 10,
                        }}>
                        <Text style={[styles.first, {color: 'red'}]}>
                          ⚠️ Delay Detected! Please provide info:
                        </Text>

                        <View style={styles.head}>
                          <Text style={styles.first}>No of Cases</Text>
                          <View style={styles.for_border}>
                            <TextInput
                              keyboardType="numeric"
                              placeholder="Confirm Cases"
                              style={styles.inputfield}
                              value={batch.cases}
                              onChangeText={v =>
                                updateBatchField(
                                  product.id,
                                  batch.id,
                                  'cases',
                                  v,
                                )
                              }
                            />
                          </View>
                        </View>

                        <View style={styles.head}>
                          <Text style={styles.first}>Reason for Delay <Text style={{color: 'red'}}>*</Text></Text>
                          <View style={styles.for_border}>
                            <TextInput
                              style={styles.inputfield}
                              placeholder="Enter reason (e.g. Machine delay)"
                              value={batch.reason}
                              onChangeText={v =>
                                updateBatchField(
                                  product.id,
                                  batch.id,
                                  'reason',
                                  v,
                                )
                              }
                            />
                          </View>
                        </View>

                        <View style={styles.head}>
                          <Text style={styles.first}>Upload Image <Text style={{color: 'red'}}>*</Text></Text>
                          <TouchableOpacity
                            style={styles.inputfiled_upimg}
                            onPress={() =>
                              handleImagePicker(product.id, batch.id)
                            }>
                            {batch.image ? (
                              <Image
                                source={{uri: batch.image}}
                                style={styles.uploadImage}
                              />
                            ) : (
                              <Feather
                                name="upload"
                                size={30}
                                color="#8991A6"
                              />
                            )}
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                          style={styles.button}
                          onPress={() =>
                            submitStopBatch(
                              batch.serverBatchId,
                              batch.cases,
                              batch.reason,
                              batch.image,
                              product.id,
                              batch.id,
                            )
                          }>
                          <Text style={styles.btn_text}>
                            Submit & End Batch
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Display Delay Information for Completed Batches */}
                    {batch.end && hadDelay && batch.reason && (
                      <View
                        style={{
                          marginTop: 15,
                          borderTopWidth: 1,
                          borderColor: '#ffeb3b',
                          paddingTop: 10,
                          backgroundColor: '#fff9c4',
                          borderRadius: 8,
                          padding: 10,
                        }}>
                        <Text style={[styles.first, {color: '#f57f17', fontWeight: 'bold'}]}>
                          ⚠️ Delay Information
                        </Text>

                        <View style={styles.head}>
                          <Text style={styles.first}>Reason for Delay:</Text>
                          <View style={[styles.for_border, {backgroundColor: '#fff'}]}>
                            <TextInput
                              style={styles.inputfield}
                              value={batch.reason}
                              editable={false}
                              multiline={true}
                            />
                          </View>
                        </View>

                        {batch.image && (
                          <View style={styles.head}>
                            <Text style={styles.first}>Delay Documentation:</Text>
                            <View style={styles.inputfiled_upimg}>
                              <Image
                                source={{uri: batch.image}}
                                style={styles.uploadImage}
                              />
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}

              {/* Add Ballet Button */}
              {/* Add Ballet Button */}
              {product.category &&
                product.name &&
                editData?.status !== 'APPROVED' && // <--- Add this condition
                (product.batches.length === 0 ||
                  product.batches[product.batches.length - 1].end !== '') && (
                  <TouchableOpacity
                    style={styles.botted}
                    onPress={() => addBatch(product.id)}>
                    <Entypo name="plus" size={20} color={colors.commoncolor} />
                    <Text
                      style={[styles.bottedText, {color: colors.commoncolor}]}>
                      Add Batch
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          ))}

        {/* Global Action Buttons */}
        {isProductSectionVisible && (
  <View style={{marginTop: 10}}>
    {products.length > 0 &&
      editData?.status !== 'APPROVED' && ( // <--- Add this condition
        (() => {
          const lastProduct = products[products.length - 1];
          const hasCategoryAndName = lastProduct.category && lastProduct.name;
          const hasCompletedLastBatch =
            lastProduct.batches.length > 0 &&
            lastProduct.batches[lastProduct.batches.length - 1].end !== '';

          return hasCategoryAndName && hasCompletedLastBatch ? (
            <TouchableOpacity
              style={[styles.botted, {borderColor: '#000'}]}
              onPress={addNewProductSection}>
              <Ionicons
                name="add-circle-outline"
                size={20}
                color="#000"
              />
              <Text style={[styles.bottedText, {color: '#000'}]}>
                Add Another Product
              </Text>
            </TouchableOpacity>
          ) : null;
        })()
      )}

    {/* Approve button logic you already have */}
    {/* {productionId && editData?.status !== 'APPROVED' && (
      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: '#28a745', marginTop: 10},
        ]}
        onPress={handleApproveProduction}>
        <Text style={styles.btn_text}>Approve Production</Text>
      </TouchableOpacity>
    )} */}

    {/* Approved Message */}
    {editData?.status === 'APPROVED' && (
      <View style={{ marginTop: 20, padding: 15, backgroundColor: '#d4edda', borderRadius: 8 }}>
        <Text style={{ color: '#155724', fontWeight: 'bold', textAlign: 'center' }}>
          ✅ This Production is already APPROVED
        </Text>
      </View>
    )}
  </View>
)}
      </ScrollView>

      {showDate && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white, paddingHorizontal: 15},
  header: {flexDirection: 'row', alignItems: 'center', paddingTop: 10},
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginLeft: 8,
    fontFamily: fonts.sfbold,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    elevation: 4,
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  head: {marginTop: 15},
  first: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.formtitlegry,
    marginBottom: 5,
    fontFamily: fonts.sfmedium,
  },
  for_border: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  inputfield: {
    flex: 1,
    color: colors.inputfieldcolor,
    fontSize: 16,
    height: 45,
  },
  for_border_dropdown: {
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 6,
  },
  dropdown: {height: 45, paddingHorizontal: 10},
  placeholderStyle: {fontSize: 16, color: '#888'},
  head_new: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  left: {flex: 0.48},
  right: {flex: 0.48},
  for_newborder: {
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 6,
    height: 45,
    justifyContent: 'center',
  },
  newinputfield: {color: colors.black, fontSize: 16, textAlign: 'center'},
  inputfiled_upimg: {
    height: 120,
    borderWidth: 1,
    borderColor: colors.inputfieldborder,
    borderRadius: 6,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  uploadImage: {width: '100%', height: '100%', borderRadius: 6},
  batchHeaderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  batchLeft: {flexDirection: 'row', alignItems: 'center'},
  batchNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.commoncolor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  batchNumberText: {color: '#fff', fontSize: 14, fontWeight: '700'},
  batchHeaderText: {fontSize: 16, fontWeight: '600', color: '#444'},
  botted: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.commoncolor,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bottedText: {fontSize: 16, fontWeight: '600', marginLeft: 8},
  button: {
    backgroundColor: colors.commoncolor,
    borderRadius: 8,
    marginTop: 20,
    paddingVertical: 15,
  },
  btn_text: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },

  placeholderStyle: {
    fontSize: 16,
    color: '#888', // Grey color for placeholder
  },
  dropdownText: {
    fontSize: 16,
    color: colors.black, // Force text to be Black
    fontFamily: fonts.sfregular,
  },
  productHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  deleteBatchButton: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
});

export default AddProduction;
