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
import {
  fetchCategories,
  fetchProductsByCategory,
  fetchMaterialCategories,
  fetchRawMaterialsByCategory,
  fetchUnits,
  // Ensure you have an update thunk, otherwise we'll use createProductionSetup with an ID
  createProductionSetup, 
} from '../../redux/reducers/Production/productionSlice';

const UpdateSetUpProduction = ({navigation, route}) => { // Added route here
  const dispatch = useDispatch();
  const editData = route.params?.editData; // Passed from AllProductSetups card
  
  const {
    loading,
    categories,
    products,
    materialCategories,
    units,
  } = useSelector(state => state.production);

  const [productInfo, setProductInfo] = useState({
    category: '',
    productId: '',
    code: '',
    name: '',
    duration: '',
  });

  const [rawMaterials, setRawMaterials] = useState([]);

  // 1. Initial Data Fetch
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchMaterialCategories());
    dispatch(fetchUnits());
  }, [dispatch]);

  // 2. Patch Data on Load
  useEffect(() => {
    if (editData) {
      // Patch Global Product Info
      setProductInfo({
        category: editData.categoryId?.toString() || '',
        productId: editData.productId?.toString() || '',
        code: editData.productCode || '',
        name: editData.productName || '',
        duration: editData.productionDuration?.toString() || '',
      });

      // Load products for the category so the dropdown can show the correct label
      if (editData.categoryId) {
        dispatch(fetchProductsByCategory(editData.categoryId));
      }

      // Patch Raw Materials
      if (editData.materials && editData.materials.length > 0) {
        const patchedMaterials = editData.materials.map((m) => ({
          id: m.id || Date.now() + Math.random(),
          materialCategory: '', 
          materialId: m.materialId?.toString() || '',
          unitId: m.consumptionUnitId?.toString() || '', 
          expectedOutput: m.outputPerUnit?.toString() || '',
          wastage: m.wastagePercent?.toString() || '',
          // Crucial: Provide initial options so the dropdown isn't empty on load
          materialOptions: [{ label: "Current Material", value: m.materialId?.toString() }], 
        }));
        setRawMaterials(patchedMaterials);
      }
    }
  }, [editData, dispatch]);

  // Data Mappings
  const categoryData = categories.map(cat => ({ label: cat.categoryName, value: cat.id.toString() }));
  const productNameData = products.map(prod => ({ label: prod.productName, value: prod.id.toString(), ...prod }));
  const materialCatData = materialCategories.map(item => ({ label: item.categoryName, value: item.id.toString() }));
  const unitData = units.map(item => ({ label: item.unitName, value: item.id.toString() }));

  const handleCategoryChange = async item => {
    setProductInfo({ ...productInfo, category: item.value, productId: '', code: '', name: '', duration: '' });
    await dispatch(fetchProductsByCategory(item.value));
  };

  const handleProductSelect = item => {
    const cleanDuration = item.productionDuration ? item.productionDuration.toString().replace(/[^0-9]/g, '') : '';
    setProductInfo({
      ...productInfo,
      productId: item.value,
      name: item.label,
      code: item.productCode || '',
      duration: cleanDuration,
    });
  };

  const handleMaterialCategoryChange = async (sectionId, item) => {
    const result = await dispatch(fetchRawMaterialsByCategory(item.value));
    setRawMaterials(prev => prev.map(section => {
      if (section.id === sectionId) {
        const options = result.payload ? [{ label: result.payload.rawMaterialName, value: result.payload.id.toString() }] : [];
        return { ...section, materialCategory: item.value, materialId: '', materialOptions: options };
      }
      return section;
    }));
  };

  const updateSection = (id, field, value) => {
    setRawMaterials(prev => prev.map(section => section.id === id ? { ...section, [field]: value } : section));
  };

  const addSection = () => {
    setRawMaterials([...rawMaterials, { 
      id: Date.now(), materialCategory: '', materialId: '', unitId: '', expectedOutput: '', wastage: '', materialOptions: [] 
    }]);
  };

  const removeSection = (id) => {
    if (rawMaterials.length > 1) {
      setRawMaterials(rawMaterials.filter(s => s.id !== id));
    }
  };

  const handleSubmit = async () => {
    if (!productInfo.category || !productInfo.productId) {
      Alert.alert('Error', 'Product information is incomplete.');
      return;
    }

    const isAnySectionIncomplete = rawMaterials.some(
      m => !m.materialId || !m.unitId || !m.expectedOutput || !m.wastage
    );

    if (isAnySectionIncomplete) {
      Alert.alert('Error', 'Please complete all Raw Material sections.');
      return;
    }

    // Duplicate Check
    const materialIds = rawMaterials.map(m => m.materialId);
    if (new Set(materialIds).size !== materialIds.length) {
      Alert.alert('Error', 'Duplicate materials selected.');
      return;
    }

    const payload = {
      id: editData?.id, // Passing ID for update
      productId: parseInt(productInfo.productId),
      productCode: productInfo.code,
      productName: productInfo.name,
      categoryId: parseInt(productInfo.category),
      productionDuration: parseInt(productInfo.duration) || 0,
      materials: rawMaterials.map(item => ({
        materialId: parseInt(item.materialId),
        consumptionUnitId: parseInt(item.unitId),
        outputPerUnit: parseFloat(item.expectedOutput) || 0,
        wastagePercent: parseFloat(item.wastage) || 0,
      })),
    };

    const result = await dispatch(createProductionSetup(payload));
    if (createProductionSetup.fulfilled.match(result)) {
      Alert.alert('Success', 'Setup Updated Successfully');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Update failed.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ef4444" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Product Setup</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Product Information</Text>
            <Text style={styles.label}>Category *</Text>
            <Dropdown style={styles.dropdown} data={categoryData} labelField="label" valueField="value" value={productInfo.category} onChange={handleCategoryChange} />
            
            <Text style={styles.label}>Product Name *</Text>
            <Dropdown style={styles.dropdown} data={productNameData} labelField="label" valueField="value" value={productInfo.productId} onChange={handleProductSelect} disable={!productInfo.category} />
            
            <Text style={styles.label}>Product Code</Text>
            <TextInput style={[styles.input, styles.disabledInput]} value={productInfo.code} editable={false} />

            <Text style={styles.label}>Duration (mins)</Text>
            <TextInput style={[styles.input, styles.disabledInput]} value={productInfo.duration} editable={false} />
        </View>

        <Text style={[styles.sectionTitle, {marginTop: 20}]}>Raw Materials Mapping</Text>
        
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
            <Dropdown style={styles.dropdown} data={materialCatData} labelField="label" valueField="value" value={section.materialCategory} onChange={item => handleMaterialCategoryChange(section.id, item)} />

            <Text style={styles.label}>Material Name *</Text>
            <Dropdown style={styles.dropdown} data={section.materialOptions} labelField="label" valueField="value" value={section.materialId} onChange={item => updateSection(section.id, 'materialId', item.value)} disable={!section.materialCategory && !editData} />

            <Text style={styles.label}>Unit *</Text>
            <Dropdown style={styles.dropdown} data={unitData} labelField="label" valueField="value" value={section.unitId} onChange={item => updateSection(section.id, 'unitId', item.value)} />

            <Text style={styles.label}>Expected Output *</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={section.expectedOutput} onChangeText={t => updateSection(section.id, 'expectedOutput', t)} />

            <Text style={styles.label}>Wastage (%) *</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={section.wastage} onChangeText={t => updateSection(section.id, 'wastage', t)} />
          </View>
        ))}

        <TouchableOpacity style={styles.addSectionBtn} onPress={addSection}>
          <Icon name="plus-circle" size={20} color="#ef4444" />
          <Text style={styles.addSectionText}>Add Another Raw Material</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.submitButton, loading && {backgroundColor: '#ccc'}]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Update Setup</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    height: 60, backgroundColor: '#ef4444', flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'space-between', paddingHorizontal: 15, elevation: 4 
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerIcon: { width: 24 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2 },
  materialSection: { backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2, marginTop: 15, borderLeftWidth: 4, borderLeftColor: '#ef4444' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  sectionSubtitle: { fontSize: 14, fontWeight: 'bold', color: '#ef4444' },
  label: { fontSize: 12, fontWeight: '600', color: '#666', marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 6, padding: 10, height: 45, backgroundColor: '#fff' },
  disabledInput: { backgroundColor: '#f5f5f5', color: '#999' },
  dropdown: { height: 45, borderColor: '#e0e0e0', borderWidth: 1, borderRadius: 6, paddingHorizontal: 10 },
  addSectionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, padding: 15, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#ef4444', borderStyle: 'dashed' },
  addSectionText: { color: '#ef4444', fontWeight: 'bold', marginLeft: 8 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#eee' },
  submitButton: { backgroundColor: '#ef4444', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default UpdateSetUpProduction;