import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {colors, fonts} from '../../config/theme';
import {
  createProductionSetup,
  fetchCategories,
  fetchProductsByCategory,
  fetchMaterialCategories,
  fetchRawMaterialsByCategory,
  fetchUnits,
  updateProductionSetup,
  clearProducts,
} from '../../redux/reducers/Production/productionSlice';

const SetUpProduction = ({navigation, route}) => {
  const dispatch = useDispatch();
  const editData = route.params?.editData;
  console.log('Edit Data received:', editData);
  const {loading, categories, products, materialCategories, units} =
    useSelector(state => state.production);

  const [productInfo, setProductInfo] = useState({
    category: '',
    productId: '',
    code: '',
    name: '',
    duration: '',
  });

  const [rawMaterials, setRawMaterials] = useState([
    {
      id: Date.now(),
      materialCategory: '',
      materialId: '',
      unitId: '',
      expectedOutput: '',
      wastage: '',
      materialOptions: [],
    },
  ]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchMaterialCategories());
    dispatch(fetchUnits());
    dispatch(fetchRawMaterialsByCategory());
  }, [dispatch]);

  const categoryData = categories.map(cat => ({
    label: cat.categoryName,
    value: cat.id.toString(),
  }));
  // Filter products based on selected category
  const filteredProducts = products.filter(prod => 
    productInfo.category ? prod.categoryId?.toString() === productInfo.category : false
  );
  
  const productNameData = filteredProducts.map(prod => ({
    label: prod.productName,
    value: prod.id.toString(),
    ...prod,
  }));
  const materialCatData = materialCategories.map(item => ({
    label: item.categoryName,
    value: item.id.toString(),
  }));
  // const unitData = units.map(item => ({ label: item.unitName, value: item.id.toString() }));
  const unitData = units.map(item => ({
    label: item.unitName,
    value: item.unitName, // Use the Name as the value instead of ID
  }));

  const handleCategoryChange = async item => {
    // Clear products first to avoid showing products from previous category
    dispatch(clearProducts());
    
    setProductInfo({
      ...productInfo,
      category: item.value,
      productId: '',
      code: '',
      name: '',
      duration: '',
    });
    
    // Fetch products for the new category
    await dispatch(fetchProductsByCategory(item.value));
  };

  const handleProductSelect = item => {
    const cleanDuration = item.productionDuration
      ? item.productionDuration.replace(/[^0-9]/g, '')
      : '';
    setProductInfo({
      ...productInfo,
      productId: item.value,
      name: item.label,
      code: item.productCode || '',
      duration: cleanDuration,
    });
  };

  const updateSection = (id, field, value) => {
    setRawMaterials(prev =>
      prev.map(section =>
        section.id === id ? {...section, [field]: value} : section,
      ),
    );
  };

  const addSection = () => {
    setRawMaterials([
      ...rawMaterials,
      {
        id: Date.now(),
        materialCategory: '',
        materialId: '',
        unitId: '',
        expectedOutput: '',
        wastage: '',
        materialOptions: [],
      },
    ]);
  };

  const removeSection = id => {
    if (rawMaterials.length > 1) {
      setRawMaterials(rawMaterials.filter(s => s.id !== id));
    }
  };

  const handleMaterialCategoryChange = async (sectionId, item) => {
    console.log('Material Category Changed:', {sectionId, categoryId: item.value});
    const result = await dispatch(fetchRawMaterialsByCategory(item.value));
    setRawMaterials(prev =>
      prev.map(section => {
        if (section.id === sectionId) {
          // Handle both array and single object responses
          let options = [];
          if (result.payload) {
            const data = Array.isArray(result.payload)
              ? result.payload
              : [result.payload];
            options = data.map(material => ({
              label: material.rawMaterialName || material.name,
              value: material.id.toString(),
            }));
          }
          const updatedSection = {
            ...section,
            materialCategory: item.value, // Storing Category ID
            materialId: '',
            materialOptions: options,
          };
          console.log('Updated Section with options:', updatedSection);
          return updatedSection;
        }
        return section;
      }),
    );
  };

  // 2. Updated Handle Submit: Construct payload with categoryId inside materials
  const handleSubmit = async () => {
    if (!productInfo.category || !productInfo.productId) {
      Alert.alert(
        'Validation Error',
        'Please select Product Category and Product Name.',
      );
      return;
    }

    const isAnySectionIncomplete = rawMaterials.some(
      m =>
        !m.materialCategory ||
        !m.materialId ||
        !m.unitId ||
        !m.expectedOutput,
    );

    if (isAnySectionIncomplete) {
      Alert.alert(
        'Validation Error',
        'Please fill all fields in every Raw Material section.',
      );
      return;
    }

    const materialIds = rawMaterials.map(m => m.materialId);
    const hasDuplicates = materialIds.some(
      (id, index) => materialIds.indexOf(id) !== index,
    );
    if (hasDuplicates) {
      Alert.alert(
        'Duplicate Material',
        'You have selected the same Material Name in multiple sections.',
      );
      return;
    }

    // CONSTRUCTING THE PAYLOAD
    const payload = {
      productId: parseInt(productInfo.productId),
      productCode: productInfo.code,
      productName: productInfo.name,
      categoryId: parseInt(productInfo.category),
      productionDuration: parseInt(productInfo.duration) || 0,
      materials: rawMaterials.map(item => ({
        materialId: parseInt(item.materialId),
        categoryId: parseInt(item.materialCategory), // ADDED: categoryId of the material
        consumptionUnit: item.unitId,
        outputPerUnit: parseFloat(item.expectedOutput) || 0,
      })),
    };
    
    console.log('Final Payload:', JSON.stringify(payload, null, 2));
    console.log('Raw Materials State:', rawMaterials);
    
    if (editData) {
      // If editing, send the ID separately to the thunk
      const id = editData.id;
      result = await dispatch(updateProductionSetup({id, payload}));
    } else {
      result = await dispatch(createProductionSetup(payload));
    }

    // 3. Handle Response
    if (
      createProductionSetup.fulfilled.match(result) ||
      updateProductionSetup.fulfilled.match(result)
    ) {
      Alert.alert(
        'Success',
        editData ? 'Updated Successfully' : 'Saved Successfully',
      );
      navigation.goBack();
    } else {
      Alert.alert('Error', result.payload?.message || 'Action failed.');
    }
  };
  //   console.log('Final Payload with Material Category:', JSON.stringify(payload, null, 2));

  //   const result = await dispatch(createProductionSetup(payload));
  //   if (createProductionSetup.fulfilled.match(result)) {
  //     Alert.alert('Success', 'Product Setup Saved Successfully');
  //     navigation.goBack();
  //   } else {
  //     Alert.alert('Error', 'Failed to save setup.');
  //   }
  // };

  useEffect(() => {
    if (editData) {
      // 1. Patch Product Info
      setProductInfo({
        category: editData.categoryId?.toString() || '',
        productId: editData.productId?.toString() || '',
        code: editData.productCode || '',
        name: editData.productName || '',
        duration: editData.productionDuration?.toString() || '',
      });

      if (editData.categoryId) {
        dispatch(fetchProductsByCategory(editData.categoryId));
      }

      // 2. Patch Materials with Async Options
      const patchMaterials = async () => {
        if (editData.materials && editData.materials.length > 0) {
          const updatedMaterials = await Promise.all(
            editData.materials.map(async mat => {
              let options = [];

              // Trigger the API call for this specific category
              if (mat.categoryId) {
                const result = await dispatch(
                  fetchRawMaterialsByCategory(mat.categoryId),
                );

                // Map the result payload to the dropdown format
                if (result.payload) {
                  const data = Array.isArray(result.payload)
                    ? result.payload
                    : [result.payload];
                  options = data.map(item => ({
                    label: item.rawMaterialName || item.name,
                    value: item.id.toString(),
                  }));
                }
              }

              return {
                id: mat.id || Date.now() + Math.random(),
                materialCategory: mat.categoryId?.toString() || '',
                materialId: mat.materialId?.toString() || '',
                unitId: mat.consumptionUnit || '',
                expectedOutput: mat.outputPerUnit?.toString() || '',
                wastage: mat.wastagePercent?.toString() || '',
                materialOptions: options,
              };
            }),
          );
          console.log('Updated Materials:', updatedMaterials);
          setRawMaterials(updatedMaterials);
        }
      };

      patchMaterials().catch(err => console.error('Error patching materials:', err));
    }
  }, [editData, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ef4444" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.headerIcon}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editData ? 'Edit Setup' : 'Product Setup'}
        </Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* PRODUCT INFO CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product Information</Text>
          <Text style={styles.label}>Category *</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.placeholderStyle}
            itemTextStyle={styles.placeholderStyle}
            data={categoryData}
            labelField="label"
            valueField="value"
            placeholder="--Select Category--"
            value={productInfo.category}
            onChange={handleCategoryChange}
          />

          <Text style={styles.label}>Product Name *</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.placeholderStyle}
            itemTextStyle={styles.placeholderStyle}
            data={productNameData}
            labelField="label"
            valueField="value"
            placeholder="--Select Product--"
            value={productInfo.productId}
            onChange={handleProductSelect}
            disable={!productInfo.category}
          />

          <Text style={styles.label}>Product Code</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={productInfo.code}
            editable={false}
            placeholder="Auto-filled"
          />

          <Text style={styles.label}>Duration (mins)</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={productInfo.duration}
            editable={false}
            placeholder="Auto-filled"
          />
        </View>

        <Text style={[styles.sectionTitle, {marginTop: 20}]}>
          Raw Materials Mapping
        </Text>

        {rawMaterials.map((section, index) => (
          <View key={section.id} style={styles.materialSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionSubtitle}>Material #{index + 1}</Text>
              {rawMaterials.length > 1 && (
                <TouchableOpacity onPress={() => removeSection(section.id)}>
                  <Icon name="close-circle" size={22} color="red" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.label}>Material Category *</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.placeholderStyle}
              itemTextStyle={styles.placeholderStyle}
              data={materialCatData}
              labelField="label"
              valueField="value"
              placeholder="--Select Category--"
              value={section.materialCategory}
              onChange={item => handleMaterialCategoryChange(section.id, item)}
            />

            <Text style={styles.label}>Material Name *</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.placeholderStyle}
              itemTextStyle={styles.placeholderStyle}
              data={section.materialOptions}
              labelField="label"
              valueField="value"
              placeholder="--Select Material--"
              value={section.materialId}
              onChange={item =>
                updateSection(section.id, 'materialId', item.value)
              }
              disable={!section.materialCategory}
            />

            <Text style={styles.label}>Unit *</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.placeholderStyle}
              itemTextStyle={styles.placeholderStyle}
              data={unitData}
              labelField="label"
              valueField="value"
              placeholder="--Select Unit--"
              value={section.unitId} // This will now store "KG", "PCS", etc.
              onChange={item => updateSection(section.id, 'unitId', item.value)}
            />
            <Text style={styles.label}>Quantity *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#000"
              value={section.expectedOutput}
              onChangeText={t => updateSection(section.id, 'expectedOutput', t)}
            />

            {/* <Text style={styles.label}>Wastage (%) *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0%"
              value={section.wastage}
              onChangeText={t => updateSection(section.id, 'wastage', t)}
            /> */}
          </View>
        ))}

        <TouchableOpacity style={styles.addSectionBtn} onPress={addSection}>
          <Icon name="plus-circle" size={20} color="#ef4444" />
          <Text style={styles.addSectionText}>Add Another Raw Material</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && {backgroundColor: '#ccc'}]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Save Setup</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8f9fa'},
  header: {
    height: 60,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    elevation: 4,
  },
  headerTitle: {fontSize: 18, fontWeight: '700', color: '#fff'},
  headerIcon: {width: 24},
  scrollContent: {padding: 16, paddingBottom: 100},
  card: {backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2},
  materialSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  sectionSubtitle: {fontSize: 14, fontWeight: 'bold', color: '#ef4444'},
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 10,
    height: 45,
    backgroundColor: '#fff',
    color:"#000"
  },
  disabledInput: {backgroundColor: '#f5f5f5', color: '#999'},
  dropdown: {
    height: 45,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  addSectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ef4444',
    borderStyle: 'dashed',
  },
  addSectionText: {color: '#ef4444', fontWeight: 'bold', marginLeft: 8},
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  placeholderStyle: {
    fontSize: 16,
    color: colors.inputfieldcolor,
    fontWeight: 500,
    paddingLeft: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.inputfieldcolor,
    fontWeight: 500,
    paddingLeft: 10,
  },

  placeholderStyle: {
    fontSize: 16,
    color: colors.inputfieldcolor,
    fontWeight: 500,
    paddingLeft: 10,
  },
});

export default SetUpProduction;
