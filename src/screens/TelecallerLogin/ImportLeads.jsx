import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity, Text, FlatList, ScrollView, TextInput, Alert } from "react-native";
import { colors, fonts } from "../../config/theme";
import Feather from 'react-native-vector-icons/Feather';
import * as DocumentPicker from '@react-native-documents/picker';
import RNFS from 'react-native-fs';  // to read the excel data
import XLSX from 'xlsx';// to convert the excel data to json
import { ImportLeadsFun } from "../../redux/reducers/TelecallerLogin/AddCallers";
import { useDispatch, useSelector } from "react-redux";
import { GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";
import { responsiveHeight } from "react-native-responsive-dimensions";
import commonstyles from "../../commonstyles/commonstyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const ImportLead = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const inserts=useSafeAreaInsets();
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");
            dispatch(GetRegesteredData())
        }, [])
    )

    const [filename, setFilename] = useState("");  // to store excel file name to display in inputfield

    const [excelData, setExcelData] = useState([]);  //Stores Excel rows data and  converted into JSON and store in excelData
    const [fileError, setFileError] = useState("");//error stores
    const [loading, setLoading] = useState(false);// for mutiple submits





    // file picker and  to read the excel data when user tap to upload the excel file
    const chooseFile = async () => {
        try {
            const [result] = await DocumentPicker.pick({
                mode: 'open',
                type: [DocumentPicker.types.xlsx, DocumentPicker.types.xls,],   // document type should be xlsx or xls
            });
            setFilename(result.name); // here  selected file name will store
            setFileError(""); // ✅ clear error when file selected
            console.log("result", result); // name uri size type

            //1. read file 
            const path = result.uri.replace("file://", "");  // convert file uri to json uri link
            const fileData = await RNFS.readFile(path, 'base64');// base64 require for xlsx

            //2. convert excel->json data
            const workbook = XLSX.read(fileData, { type: 'base64' });// convert excel data to json data
            const sheetName = workbook.SheetNames[0];// here we are taking 1st sheet data in excel like we have many sheets in excel as we know in that 1st list in array[0,1,2,,3] so 0 will take.
            console.log("sheet Name", sheetName);

            const sheet = workbook.Sheets[sheetName]; // that sheet name   that 1st sheet name
            const jsonData = XLSX.utils.sheet_to_json(sheet);  //in that sheet the json data  // in that 1st sheet data convered in to json

            //3. save excel row
            setExcelData(jsonData); //Stores Excel data in state
            console.log("jsonData", jsonData);


        }
        catch (error) {
            if (!DocumentPicker.isCancel(error)) {
                console.log("Excel Error", error);
            }


        }
    }

    const { getEmpdata } = useSelector((state) => state.GetEmp);
    console.log("Get Employees List Data---->All Employee Data", getEmpdata);

    const telecallerList = getEmpdata?.filter(emp => emp.roleName === "TELECALLER")?.map(emp =>
    ({
        label: emp.name,
        value: emp.id
    })) || [];

    console.log("Telecaller list data---------->", telecallerList);


    // const handleSubmit = async () => {
    //     console.log("***came to handle submit function***");

    //     //if (loading) return; //  prevent multiple clicks
    //     let isValid = true;

    //     if (!filename) {
    //         setFileError("Please upload an Excel file");
    //         isValid = false;
    //     } else if (!excelData || excelData.length === 0) {
    //         setFileError("Excel file is empty or invalid");
    //         isValid = false;
    //     } else {
    //         setFileError(""); // clear error
    //     }

    //     if (!isValid) return;
    //     //setLoading(true); // ✅ start loading




    //     const payload = excelData.map((row) => {
    //         console.log("Excel First Row:", excelData[0]);
    //         console.log("Excel Keys:", Object.keys(excelData[0]));

    //         const telecallerName = row["Assigned Telecaller ID "] || row["Assigned Telecaller"] || "";

    //         const cleanedName = String(telecallerName).trim().toLowerCase();

    //         const telecaller = telecallerList.find(
    //             item => item.label.trim().toLowerCase() === cleanedName
    //         );


    //         const excelDate =
    //             row["Lead Created Date"] ||
    //             row["Lead Created Date "] ||
    //             row["LeadCreatedDate"];

    //         let formattedDate = "";

    //         if (excelDate) {
    //             if (typeof excelDate === "number") {
    //                 const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
    //                 formattedDate = jsDate.toISOString().split("T")[0];
    //             } else {
    //                 formattedDate = new Date(excelDate).toISOString().split("T")[0];
    //             }
    //         }

    //         console.log("Excel Telecaller:", telecallerName);
    //         console.log("Matched Telecaller:", telecaller);

    //         return {
    //             leadSource: row["Lead Source "] || row["Lead Source"] || "",
    //             customerName: row["Customer Name"] || "",
    //             mobileNumber: String(row["Mobile Number"] || ""),
    //             alternateNumber: String(row["Alternative Mobile Number"] || ""),
    //             emailId: row["Email ID"] || "",
    //             address: row["Addess"] || row["Address"] || "",
    //             areaLocation: row["Area / Location "] || row["Area / Location"] || "",
    //             telecallerId: telecaller ? telecaller.value : 0,
    //             leadCreatedDate: formattedDate,
    //             leadStatus: row["Lead Status "] || "New"
    //         };
    //     });


    //     console.log("Payload data that dispatching  to redux code  import Lead  to redux code -------------------->", payload);

    //     try {

    //         let lastResponse = null;

    //         for (let i = 0; i < payload.length; i++) {
    //             const singleLead = payload[i];

    //             console.log("single Lead------>", singleLead);

    //             const response = await dispatch(ImportLeadsFun(singleLead)).unwrap();

    //             lastResponse = response;
    //         }

    //         console.log("Final API Response:", lastResponse);

    //         Alert.alert(
    //             "Success",
    //             String(
    //                 lastResponse?.data?.message?.text ||
    //                 lastResponse?.data?.message ||
    //                 lastResponse?.message ||
    //                 "Added Lead Successfully"
    //             ),
    //             [{ text: "OK", onPress: () => navigation.goBack() }]
    //         );

    //     }
    //     catch (error) {
    //         console.log("Import Error:", error);
    //         Alert.alert("Error", String(error || "Something went wrong"));
    //     }


    // }

    //***********************************************************************taking more time to submit ************************************* */


    const handleSubmit = async () => {
        console.log("***came to handle submit function***");

        if (loading) return;

        let isValid = true;

        if (!filename) {
            setFileError("Please upload an Excel file");
            isValid = false;
        } else if (!excelData || excelData.length === 0) {
            setFileError("Excel file is empty or invalid");
            isValid = false;
        } else {
            setFileError("");
        }

        if (!isValid) return;

        setLoading(true);

        try {
            const payload = excelData.map((row) => {
                const telecallerName =
                    row["Assigned Telecaller ID "] ||
                    row["Assigned Telecaller"] || "";

                const cleanedName = String(telecallerName).trim().toLowerCase();

                const telecaller = telecallerList.find(
                    item => item.label.trim().toLowerCase() === cleanedName
                );

                const excelDate =
                    row["Lead Created Date"] ||
                    row["Lead Created Date "] ||
                    row["LeadCreatedDate"];

                let formattedDate = "";

                if (excelDate) {
                    if (typeof excelDate === "number") {
                        const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
                        formattedDate = jsDate.toISOString().split("T")[0];
                    } else {
                        formattedDate = new Date(excelDate).toISOString().split("T")[0];
                    }
                }

                return {
                    leadSource: row["Lead Source "] || row["Lead Source"] || "",
                    customerName: row["Customer Name"] || "",
                    mobileNumber: String(row["Mobile Number"] || ""),
                    alternateNumber: String(row["Alternative Mobile Number"] || ""),
                    emailId: row["Email ID"] || "",
                    address: row["Addess"] || row["Address"] || "",
                    areaLocation:
                        row["Area / Location "] || row["Area / Location"] || "",
                    telecallerId: telecaller ? telecaller.value : 0,
                    leadCreatedDate: formattedDate,
                    leadStatus: row["Lead Status "] || "New"
                };
            });

            let lastResponse = null;

            for (let i = 0; i < payload.length; i++) {
                const response = await dispatch(
                    ImportLeadsFun(payload[i])
                ).unwrap();

                lastResponse = response;
            }

            Alert.alert("Success", "Leads Imported Successfully", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (error) {
            console.log("Import Error:", error);
            Alert.alert("Error", String(error || "Something went wrong"));
        } finally {
            setLoading(false); // ✅ ALWAYS RESET
        }
    };






    return (

        <View style={styles.container}>



            {/* <SafeAreaView style={commonstyles.header}>
                <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} onPress={() => navigation.goBack()} />
                <Text style={commonstyles.title}> Import Leads</Text>
            </SafeAreaView> */}

            <SafeAreaView>
                <TouchableOpacity style={[commonstyles.header,{paddingTop:inserts.top+10}]} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Import Leads</Text>
                </TouchableOpacity>
            </SafeAreaView>
             

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.rowContainer}>

                    {/* Inputfiled  style={styles.InputContainer}*/}
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity style={[styles.fileInput, fileError && { borderColor: "red", borderWidth: 1.5 }]} onPress={chooseFile} activeOpacity={0.8} >
                            <TextInput
                                placeholder="Choose File"
                                value={filename}
                                editable={false}
                                style={styles.fileTextInput}
                                placeholderTextColor={colors.foundationgray}
                            />
                            <Feather name="upload" size={20} color={colors.commoncolor} />
                        </TouchableOpacity>
                        {/* {fileError ? (
                        <Text style={styles.errorText}>{fileError}</Text>
                    ) : null} */}
                    </View>


                    {/* BUTTON */}
                    <TouchableOpacity
                        style={[
                            styles.btn,
                            { opacity: loading ? 0.6 : 1 }
                        ]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.btn_text}>
                            {loading ? "Submitting..." : "Submit Lead"}
                        </Text>
                    </TouchableOpacity>

                </View>
                {/* ERROR BELOW */}
                {fileError ? (
                    <Text style={styles.errorText}>{fileError}</Text>
                ) : null}

                {
                    excelData.length > 0 && (
                        <View>
                            {
                                excelData.map((row, index) => (
                                    <View key={index} style={styles.card}>
                                        {Object.keys(row).map((key, i) => (
                                            <View key={i} style={styles.data}>
                                                <Text style={styles.left_text}>{key} :</Text>
                                                <Text style={styles.right_text}>
                                                    {key.includes("Lead Created Date") && typeof row[key] === "number"
                                                        ? new Date((row[key] - 25569) * 86400 * 1000).toLocaleDateString("en-GB")
                                                        : row[key]}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                ))
                            }
                        </View>
                    )
                }








                {/* <TouchableOpacity
                    style={[
                        styles.btn,
                        { opacity: loading ? 0.6 : 1 }
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.btn_text}>
                        {loading ? "Submitting..." : "Submit Lead"}
                    </Text>
                </TouchableOpacity> */}



            </ScrollView>
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
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        //marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 12,
        shadowRadius: 6,
        elevation: 4,
        marginTop: 13,
        marginLeft: 2,
        marginRight: 1,
    },
    data: {
        flexDirection: 'row',
        //alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    left_text: {
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.foundationgray,
        flex: 1,
    },
    right_text: {
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.black,
        flex: 1,
    },
    btn: {
        backgroundColor: colors.commoncolor,
        marginLeft: 10,
        height: 50,
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderRadius: 8,
    },
    btn_text: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: fonts.sfbold,
        color: colors.white,
        fontWeight: 700,
    },



    InputContainer: {
        marginTop: 12,
    },

    fileInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.foundationgray,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 50,
    },

    fileTextInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: fonts.sfmedium,
        color: colors.black,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 5,
        fontFamily: fonts.sfmedium,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },






})
export default ImportLead;