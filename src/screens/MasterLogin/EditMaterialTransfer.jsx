import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, StatusBar, ScrollView, TextInput, Alert, ActivityIndicator } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { colors, fonts } from "../../config/theme";
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { GetRawCategories, GetUnitsData } from "../../redux/reducers/MasterLogin/AddCategory";
import { EditGivenAllData, GetAllRawMaterialData, GetCopackers } from "../../redux/reducers/MasterLogin/AddProduct";
import { requestLogin } from "../../redux/reducers/HRLogin/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import commonstyles from "../../commonstyles/commonstyles";


const Editmaterialtransfer = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const route = useRoute();
    const { EditGivenData } = route.params;
    console.log("Edit Given Data coming from params-------->", EditGivenData);

    const [userData, setUserData] = useState(null);

    useFocusEffect(
        useCallback(() => {
            dispatch(GetAllRawMaterialData())
            dispatch(GetRawCategories())
            dispatch(GetUnitsData())
            dispatch(requestLogin())
            dispatch(GetCopackers())
        }, [])
    )

    const { data } = useSelector((state) => state.Login);
    console.log("Data logined User Data ---------->", data);


    // edit tansfer dropdown 
    const [transferToName, setTransferToName] = useState('');


    const [phno, setPhno] = useState('');
    const [category, setCategory] = useState(null);
    const [name, setName] = useState(null);

    const SupplierData = [
        { label: "Ganesh", value: 1, phno: "9037476467" },
        { label: "Naresh", value: 2, phno: "7034032388" }
    ];

    const [showDate, setShowDate] = useState(false);  // show calender
    const getTodayDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const [date, setDate] = useState(getTodayDate());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [materailCount, setMaterialCount] = useState(1);
    const [material, setMaterial] = useState([
        {
            id: Date.now(),
            materialno: 1,
            category: null,
            name: null,
            materialId: null,
            unit: '',
            quantity: '',
            wastage: '',
            conversion: '',
            usable: '',
            expoutput: '',
            recqty: '',
        }
    ])



    const AddMaterial = () => {
        setMaterial(prev => [
            ...prev,
            {
                id: Date.now(),
                materialno: materailCount + 1,
                category: null,
                name: null,
                materialId: null,
                unit: '',
                quantity: '',
                wastage: '',
                conversion: '',
                usable: '',
                expoutput: '',
                recqty: '',
            }
        ]);
        setMaterialCount(prev => prev + 1);
    };

    // const removeMaterial = (id) => {
    //     setMaterial(prev => prev.filter(item => item.id !== id));
    // }
    const removeMaterial = (id) => {
        if (material.length === 1) {
            Alert.alert("Error", "At least one material is required");
            return;
        }
        setMaterial(prev => prev.filter(item => item.id !== id));
    };

    const { GetRawMaterialData } = useSelector((state) => state.GetRawMaterialsData);
    console.log("Get Raw Material data in Add Material Transfer Screen  Screen -->", GetRawMaterialData);

    const { GetRawCategory } = useSelector((state) => state.GetAllRawCategy);
    console.log("GetRaw Categories data ------------------>", GetRawCategory);

    const { UnitsData } = useSelector((state) => state.GetUnitsRawMaster);
    console.log("Get Units  data in Add Raw Material Transfer page===============>", UnitsData);

    const { copackersData } = useSelector((state) => state.GetCopackerData);
    console.log("Get copackers data  in Edit material taransfer screen==============>", copackersData);


    const CopackerDropdownData =
        copackersData?.map(item => ({
            label: item.copackerName,   //  in UI
            value: item.copackerName,   //  name
            phno: item.contact          // for auto fill
        })) || [];


    const CategoryData =
        GetRawCategory?.map(item => ({
            label: item.categoryName,
            //value: item.categoryName,
            value: item.id,
            id: item.id
        })) || [];

    const MaterialNameData =
        GetRawMaterialData?.map(item => ({
            label: item.rawMaterialName,//rawMaterialCode
            value: item?.id,//rawMaterialCode
            id: item.id,
        })) || [];

    const UnitsDropdownData =
        UnitsData?.map(item => ({
            label: item.unitName,
            // value: item.unitName,
            value: item.id,
            id: item.id
        })) || [];



    const handleDateChange = (event, selectedDate) => {
        setShowDate(false);
        if (selectedDate) {
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            setDate(`${year}-${month}-${day}`);
        }
    };


    // storeing logined user id here 
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("userData");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUserData(parsedUser);
                }
            }
            catch (error) {
                console.log("Error loading user:", error);
            }
        };
        loadUser();
    }, []);






    useEffect(() => {
        if (EditGivenData) {

            setTransferToName(EditGivenData?.vendorName || '');
            setPhno(EditGivenData?.contactNumber || '');

            //  Set Date from API
            if (EditGivenData?.transferDate) {
                const apiDate = new Date(EditGivenData.transferDate);
                const day = String(apiDate.getDate()).padStart(2, '0');
                const month = String(apiDate.getMonth() + 1).padStart(2, '0');
                const year = apiDate.getFullYear();

                setDate(`${year}-${month}-${day}`);
            }

            //  2. Set Materials
            if (EditGivenData?.items) {
                const formattedMaterials = EditGivenData.items.map((item, index) => ({
                    id: Date.now() + index,
                    materialno: index + 1,

                    category: item.categoryId || CategoryData.find(c => c.label === item.category)?.value || null,

                    materialId: item.materialId || MaterialNameData.find(m => m.label === item.rawMaterialName)?.value || null,

                    unit: item.unit || UnitsDropdownData.find(u => u.label === item.unitOfMeasure)?.value || null,

                    quantity: item.qty?.toString(),
                    wastage: item.wastagePercent?.toString(),
                    conversion: item.conversionRatio?.toString(),
                    usable: item.usableQty?.toString(),
                    expoutput: item.expectedOutput?.toString(),
                }));

                setMaterial(formattedMaterials);
                setMaterialCount(formattedMaterials.length);
            }
        }
    }, [EditGivenData]);





    const [validerror, setValidError] = useState({});
    const handleValidation = () => {
        let newerror = {};

        if (!transferToName) {
            newerror.transferToName = "Please Select Transfer To";
        }


        //  Phone Number (exact 10 digits)
        if (!phno || !phno.trim()) {
            newerror.phno = "Please Enter Contact Number";
        } else if (!/^\d{10}$/.test(phno)) {
            newerror.phno = "Enter valid 10 digit number";
        }

        // Material Validation
        material.forEach((item, index) => {

            if (!item.category) {
                newerror[`category_${index}`] = "Select Material Category";
            }

            if (!item.materialId) {
                newerror[`name_${index}`] = "Select Material Name";
            }

            if (!item.unit || !item.unit.toString().trim()) {
                newerror[`unit_${index}`] = "Enter Unit Measurement";
            }

            //  Quantity (number > 0)
            if (!item.quantity || !item.quantity.toString().trim()) {
                newerror[`quantity_${index}`] = "Enter Quantity";
            } else if (!/^\d+(\.\d+)?$/.test(item.quantity)) {
                newerror[`quantity_${index}`] = "Enter valid number";
            } else if (Number(item.quantity) <= 0) {
                newerror[`quantity_${index}`] = "Must be greater than 0";
            }


            //  Wastage % (0–100)
            if (!item.wastage || !item.wastage.toString().trim()) {
                newerror[`wastage_${index}`] = "Enter Wastage %";
            } else if (!/^\d+(\.\d+)?$/.test(item.wastage)) {
                newerror[`wastage_${index}`] = "Enter valid percentage";
            } else if (Number(item.wastage) < 0 || Number(item.wastage) > 100) {
                newerror[`wastage_${index}`] = "Must be between 0–100";
            }


            //  Conversion Ratio
            if (!item.conversion || !item.conversion.toString().trim()) {
                newerror[`conversion_${index}`] = "Enter Conversion Ratio";
            } else if (!/^\d+(\.\d+)?$/.test(item.conversion)) {
                newerror[`conversion_${index}`] = "Enter valid number";
            } else if (Number(item.conversion) <= 0) {
                newerror[`conversion_${index}`] = "Must be greater than 0";
            }

            // Usable Material
            if (!item.usable || Number(item.usable) <= 0) {
                newerror[`usable_${index}`] = "Usable material must be greater than 0";
            }

            //  Expected Output
            if (!item.expoutput || !item.expoutput.toString().trim()) {
                newerror[`expoutput_${index}`] = "Enter Expected Output";
            } else if (!/^\d+(\.\d+)?$/.test(item.expoutput)) {
                newerror[`expoutput_${index}`] = "Enter valid number";
            } else if (Number(item.expoutput) <= 0) {
                newerror[`expoutput_${index}`] = "Must be greater than 0";
            }

        });

        setValidError(newerror);
        return Object.keys(newerror).length === 0;
    };


    const handleSubmit = async () => {

        if (isSubmitting) return; //  prevent multiple clicks

        const isvalid = handleValidation();
        if (!isvalid) return;

        setIsSubmitting(true);

        const payload = {

            //dropdown for transfer to 
            vendorName: transferToName,
            // vendorName: transferTo,
            contactNumber: phno,
            transferDate: date,
            createdBy: userData?.id,
            items: material.map(item => ({
                categoryId: item.category,   //  ID
                unitId: item.unit,           //  ID
                materialId: item.materialId,
                qty: Number(item.quantity),
                wastagePercent: Number(item.wastage),
                conversionRatio: Number(item.conversion),
            }))
        };



        try {
            const id = EditGivenData?.transferId;
            const response = await dispatch(EditGivenAllData({ id, payload })).unwrap();
            console.log("Payload Data--------->", payload, id);
            Alert.alert(
                "Success", response?.message || "Added Raw Material Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => { navigation.goBack() }
                    }
                ]
            )
        }
        catch (error) {
            Alert.alert("Error", error || "Something went Wrong");
        }
        finally {
            setIsSubmitting(false); // reset
        }

    }


    return (
        <View style={styles.container}>

            <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
            <SafeAreaView >
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Edit  Material Transfer</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>

                <Text style={styles.title}>Receiver Details</Text>
                <View style={styles.card}>


                    <View style={styles.head}>
                        <Text style={styles.first}>Date</Text>
                        <View style={styles.for_border}>
                            <TextInput style={styles.inputfield} editable={false} value={date} placeholder="Date" placeholderTextColor="#888" />
                            <TouchableOpacity onPress={() => setShowDate(true)} >
                                <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                            </TouchableOpacity>
                        </View>
                        {/* onPress={() => setShowDate(true)} */}
                    </View>

                    <View style={styles.head}>
                        <Text style={styles.first}>Transfer To</Text>
                        <View style={[styles.for_border_dropdown, validerror?.transferToName && styles.errorBorder]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                data={CopackerDropdownData}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Transfer To"
                                value={transferToName}
                                onChange={(item) => {
                                    setTransferToName(item.value);
                                    setPhno(item.phno);
                                }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}
                            />
                        </View>

                        {
                            validerror.transferToName ? (
                                <Text style={styles.error_text}>{validerror.transferToName}</Text>
                            ) : null
                        }
                    </View>

                    <View style={styles.head}>
                        <Text style={styles.first}>Contact Details</Text>
                        <View style={[styles.for_border, validerror.phno ? styles.errorBorder : null]}>
                            <TextInput placeholder="contact details" style={styles.inputfield} placeholderTextColor="#888" value={phno} onChangeText={setPhno} maxLength={10} keyboardType="numeric" />
                        </View>
                        {
                            validerror.phno ? (
                                <Text style={styles.error_text}>{validerror.phno}</Text>
                            ) : null
                        }
                    </View>



                </View>





                <View style={styles.head}>
                    <Text style={styles.title}>Materials Transforming</Text>


                    {
                        material.map((item, index) => (
                            <View style={styles.card} key={item.id}>
                                <View style={styles.left_side}>
                                    <Text style={styles.title}>item {item.materialno}</Text>
                                    <TouchableOpacity onPress={() => removeMaterial(item.id)}>
                                        <Feather name="trash-2" size={16} color="#FF0000" style={styles.bg} />
                                    </TouchableOpacity>
                                </View>


                                <View style={styles.head}>
                                    <Text style={styles.first}>Material Category</Text>
                                    <View style={[styles.for_border_dropdown, validerror[`category_${index}`] && styles.errorBorder]}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            labelField="label"
                                            valueField="value"
                                            data={CategoryData}
                                            value={item.category}
                                            onChange={val => { setMaterial(prev => prev.map(matl => matl.id === item.id ? { ...matl, category: val.value } : matl)) }}
                                            placeholder="Select Category"
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                    {validerror[`category_${index}`] && (
                                        <Text style={styles.error_text}>{validerror[`category_${index}`]}</Text>
                                    )}
                                </View>


                                <View style={styles.head}>
                                    <Text style={styles.first}>Material Name</Text>
                                    <View style={[styles.for_border_dropdown, validerror[`name_${index}`] && styles.errorBorder]}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            labelField="label"
                                            valueField="value"
                                            data={MaterialNameData}
                                            //value={item.name}
                                            value={item.materialId}
                                            // onChange={val => { setMaterial(prev => prev.map(matl => matl.id === item.id ? { ...matl, name: val.value } : matl)) }}
                                            onChange={val => {
                                                setMaterial(prev =>
                                                    prev.map(matl =>
                                                        matl.id === item.id
                                                            ? {
                                                                ...matl,
                                                                materialId: val.value, // ✅ store ID
                                                                // name: val.label        // (optional for UI)
                                                            }
                                                            : matl
                                                    )
                                                )
                                            }}

                                            placeholder="Select Name"
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                    {validerror[`name_${index}`] && (
                                        <Text style={styles.error_text}>{validerror[`name_${index}`]}</Text>
                                    )}
                                </View>

                                <View style={styles.head_new}>
                                    <View style={styles.left}>
                                        <Text style={styles.first}>Unit of measure</Text>
                                        <View style={[styles.for_newborder, validerror[`unit_${index}`] && styles.errorBorder]}>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.placeholderStyle}
                                                itemTextStyle={styles.placeholderStyle}
                                                data={UnitsDropdownData}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select Unit"
                                                value={item.unit}
                                                onChange={val => {
                                                    setMaterial(prev =>
                                                        prev.map(matl =>
                                                            matl.id === item.id
                                                                ? { ...matl, unit: val.value, }
                                                                : matl
                                                        )
                                                    )
                                                }}
                                                // unitLabel: val.label
                                                renderRightIcon={() => (
                                                    <Entypo
                                                        name="chevron-small-down"
                                                        size={18}
                                                        color="#82889A"
                                                        style={styles.calender_icon}
                                                    />
                                                )}
                                            />
                                        </View>

                                        {validerror[`unit_${index}`] && (
                                            <Text style={styles.error_text}>{validerror[`unit_${index}`]}</Text>
                                        )}
                                    </View>

                                    <View style={styles.right}>
                                        <Text style={styles.first}>Quantity</Text>
                                        <View style={[styles.for_newborder, validerror[`quantity_${index}`] && styles.errorBorder]}>
                                            <TextInput placeholder="Quantity" style={styles.newinputfield} value={item.quantity} placeholderTextColor="#888" keyboardType="numeric"

                                                onChangeText={text => {
                                                    setMaterial(prev =>
                                                        prev.map(matl => {
                                                            if (matl.id === item.id) {

                                                                const quantity = Number(text || 0);
                                                                const wastage = Number(matl.wastage || 0);
                                                                const conversion = Number(matl.conversion || 100);

                                                                const baseUsable = quantity - (quantity * wastage / 100);
                                                                const finalUsable = baseUsable * (conversion / 100);

                                                                return {
                                                                    ...matl,
                                                                    quantity: text,
                                                                    usable: quantity ? finalUsable.toFixed(2) : ''
                                                                };
                                                            }
                                                            return matl;
                                                        })
                                                    );
                                                }}


                                            />
                                        </View>
                                        {
                                            validerror[`quantity_${index}`] && (
                                                <Text style={styles.error_text}>{validerror[`quantity_${index}`]}</Text>
                                            )
                                        }
                                    </View>
                                </View>


                                <View style={styles.head_new}>

                                    <View style={styles.left}>
                                        <Text style={styles.first}>Wastage %</Text>
                                        <View style={[styles.for_newborder, validerror[`wastage_${index}`] && styles.errorBorder]}>
                                            <TextInput
                                                placeholder="Wastage %"
                                                style={styles.newinputfield}
                                                keyboardType="numeric"
                                                value={item.wastage}

                                                onChangeText={text => {
                                                    setMaterial(prev =>
                                                        prev.map(matl => {
                                                            if (matl.id === item.id) {

                                                                const quantity = Number(matl.quantity || 0);
                                                                const wastage = Number(text || 0);
                                                                const conversion = Number(matl.conversion || 100);

                                                                const baseUsable = quantity - (quantity * wastage / 100);
                                                                const finalUsable = baseUsable * (conversion / 100);

                                                                return {
                                                                    ...matl,
                                                                    wastage: text,
                                                                    usable: quantity ? finalUsable.toFixed(2) : ''
                                                                };
                                                            }
                                                            return matl;
                                                        })
                                                    );
                                                }}


                                            />
                                        </View>
                                        {
                                            validerror[`wastage_${index}`] && (
                                                <Text style={styles.error_text}>{validerror[`wastage_${index}`]}</Text>
                                            )
                                        }

                                    </View>

                                    <View style={styles.right}>
                                        <Text style={styles.first}>Conversion Ratio</Text>
                                        <View style={[styles.for_newborder, validerror[`conversion_${index}`] && styles.errorBorder]}>
                                            <TextInput
                                                placeholder="Conversion Ratio"
                                                style={styles.newinputfield}
                                                value={item.conversion}
                                                keyboardType="numeric"
                                                onChangeText={text => {
                                                    setMaterial(prev =>
                                                        prev.map(matl => {
                                                            if (matl.id === item.id) {

                                                                const quantity = Number(matl.quantity || 0);
                                                                const wastage = Number(matl.wastage || 0);
                                                                const conversion = Number(text || 100);

                                                                const baseUsable = quantity - (quantity * wastage / 100);
                                                                const finalUsable = baseUsable * (conversion / 100);

                                                                return {
                                                                    ...matl,
                                                                    conversion: text,
                                                                    usable: quantity ? finalUsable.toFixed(2) : ''
                                                                };
                                                            }
                                                            return matl;
                                                        })
                                                    );
                                                }}

                                            />
                                        </View>
                                        {
                                            validerror[`conversion_${index}`] && (
                                                <Text style={styles.error_text}>{validerror[`conversion_${index}`]}</Text>
                                            )
                                        }
                                    </View>

                                </View>



                                <View style={styles.head_new}>

                                    <View style={styles.left}>
                                        <Text style={styles.first}>Usable Material</Text>
                                        <View style={[styles.for_newborder, validerror[`usable_${index}`] && styles.errorBorder]}>
                                            <TextInput
                                                placeholder="Usable Material"
                                                style={styles.newinputfield}
                                                value={item.usable}
                                                editable={false}



                                            />
                                        </View>
                                        {
                                            validerror[`usable_${index}`] && (
                                                <Text style={styles.error_text}>{validerror[`usable_${index}`]}</Text>
                                            )
                                        }
                                    </View>


                                    <View style={styles.right}>
                                        <Text style={styles.first}>Expected Output</Text>
                                        <View style={[styles.for_newborder, validerror[`expoutput_${index}`] && styles.errorBorder]}>
                                            <TextInput
                                                placeholder="Expected Output"
                                                style={styles.newinputfield}
                                                value={item.expoutput}
                                                keyboardType="numeric"
                                                onChangeText={text => {
                                                    setMaterial(prev =>
                                                        prev.map(matl =>
                                                            matl.id === item.id ? { ...matl, expoutput: text } : matl
                                                        )
                                                    )
                                                }}
                                            />
                                        </View>
                                        {
                                            validerror[`expoutput_${index}`] && (
                                                <Text style={styles.error_text}>{validerror[`expoutput_${index}`]}</Text>
                                            )
                                        }
                                    </View>

                                </View>


                            </View>
                        ))
                    }


                </View>



                <TouchableOpacity style={styles.botted} onPress={AddMaterial}>
                    <Entypo name="plus" size={20} color="#4A5565" />
                    <Text style={styles.bottedText}>Add Another Raw Material</Text>
                </TouchableOpacity>


                {/* <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.btn_text}>Add Transform</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={[styles.button, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting} >
                    {isSubmitting ? (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.btn_text, { marginLeft: 10 }]}>
                                Updating...
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.btn_text}>Update Transform</Text>
                    )}
                </TouchableOpacity>


            </ScrollView>
            {
                showDate &&
                <DateTimePicker
                    //value={new Date()}
                    value={new Date(date)}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    //onChange={TodayDate}
                    onChange={handleDateChange}
                />
            }
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    calender_icon: {
        paddingRight: 15,
    },
    main: {
        marginTop: 13,
    },
    head_new: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 13,
    },
    botted: {
        flexDirection: 'row',
        // alignSelf:'center',
        textAlign: 'center',
        marginTop: 20,

        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.commoncolor,

        paddingVertical: 8,
        borderRadius: 6,
        paddingLeft: 90,
    },
    bottedText: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.formtitlegry,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    left_side: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.inputfieldborder,
        paddingBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    bg: {
        backgroundColor: colors.lightredcolor,
        padding: 8,
        borderRadius: 8,
    },
    head: {
        marginTop: 13,
    },
    first: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.formtitlegry,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    for_border: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    for_newborder: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
    },
    newinputfield: {
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        paddingHorizontal: 5,
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
    },
    dropdown: {
        flex: 1,
        height: 48,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        // paddingLeft: 5,
        paddingHorizontal: 10,
        fontFamily: fonts.sfmedium,
    },
    calender_icon: {
        paddingRight: 10,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 12,
        shadowRadius: 6,
        elevation: 4,

        marginRight: 1,
        marginLeft: 1,
        marginTop: 13,
    },
    button: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 20,
    },
    btn_text: {
        fontSize: 16,
        fontWeight: 700,
        color: colors.white,
        textAlign: 'center',
        paddingTop: 16,
        paddingBottom: 16,

    },
    left: {
        flex: 1,
        marginRight: 8,
    },
    right: {
        flex: 1
    },

    error_text: {
        color: colors.error,
        fontSize: 13,
        marginTop: 4,
        fontFamily: fonts.sfmedium,
    },
    errorBorder: {
        borderColor: colors.error,
    },



})
export default Editmaterialtransfer