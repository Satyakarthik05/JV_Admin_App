import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from '@react-native-community/datetimepicker';
import { responsiveHeight } from "react-native-responsive-dimensions";
import { MonthlyReportData } from "../../redux/reducers/HRLogin/EmployyeWiseAtt";
import { Dropdown } from "react-native-element-dropdown";
import { GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";
import { GetRoleByDepartment } from "../../redux/reducers/HRLogin/ReqExpenses";

import RNFS from 'react-native-fs';  // to read the excel data
import XLSX from 'xlsx';// to convert the excel data to json
import * as  RNHTMLtoPDF from 'react-native-html-to-pdf';// it  converts html data to pdf data
//import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';



const MonthlyReport = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);





    useFocusEffect(
        useCallback(() => {
            dispatch(GetRegesteredData())
            dispatch(GetRoleByDepartment())
        }, [])
    )

    const today = new Date();
    const formateDate = (date) => {

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    //const todayFormatted = formateDate(today);


    // First day of current month
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    // Last day of current month
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);





    const [showFromDate, setShowFromDate] = useState(false);
    //const [from, setFrom] = useState(todayFormatted);
    const [from, setFrom] = useState(formateDate(firstDay));

    const [showToDate, setShowToDate] = useState(false);
    //const [todate, setTodate] = useState(todayFormatted);
    const [todate, setTodate] = useState(formateDate(lastDay));

    //const [departmentList, setDepartmentList] = useState([]); 
    const [selectedDepartment, setSelectedDepartment] = useState('');// for deapartmeant dropdown

    const [roleList, setRoleList] = useState([]); // for Roles dropdown
    const [selectedRole, setSelectedRole] = useState(null);


    const [empname, setEmpName] = useState([]);
    const [selectedEmpname, setSelectedEmpName] = useState("ALL");

    const { getEmpdata } = useSelector((state) => state.GetEmp);//employess Data
    console.log("-------------------------GetEmployess Data All Employess Data in Monthly Report-------------------", getEmpdata);//empless Data


    const { GetRolesWiseDepartmentsData } = useSelector((state) => state.RolesByDepartment);
    console.log("All About Roles By Depart Ment Data for Dropdown to show roles------------>", GetRolesWiseDepartmentsData);



    // Dynamic Employee Names 
    // useEffect(() => {
    //     if (getEmpdata && getEmpdata.length > 0) {
    //         const employeeList = getEmpdata.map(item => ({
    //             label: String(item.name),
    //             value: item.id,
    //         }));

    //         setEmpName([
    //             { label: "All", value: "ALL" },   // ✅ Add this line
    //             ...employeeList
    //         ]);
    //     }
    // }, [getEmpdata]);


    useEffect(() => {
        if (getEmpdata && getEmpdata.length > 0) {

            const employeeList = getEmpdata.map(item => ({
                label: String(item.name),
                value: item.id,
            }));

            const list = [
                { label: "All", value: "ALL" },
                ...employeeList
            ];

            setEmpName(list);

            //  Force default selection after data loads
            setSelectedEmpName("ALL");
        }
    }, [getEmpdata]);



    // fordynamic dropdown for  departments
    const departmentData = [
        { label: "HR", value: 'HR' },
        { label: "MASTER", value: 'MASTER' },
        { label: "TELECALLER", value: 'TELECALLER' },
        { label: "ACCOUNTS", value: 'ACCOUNTS' },
        { label: "SALES", value: 'SALES' },
    ]



    // Dynamic Employee Roles By Department
    useEffect(() => {
        if (GetRolesWiseDepartmentsData && GetRolesWiseDepartmentsData.length > 0) {
            setRoleList(
                GetRolesWiseDepartmentsData.map(item => ({
                    label: String(item.roleName),
                    value: item.id,
                }))
            )
        }
    }, [GetRolesWiseDepartmentsData])


    // show from calender
    const Fromdatefun = (event, selected) => {
        setShowFromDate(false);
        if (selected) {
            const FromDate = formateDate(selected);
            setFrom(FromDate);
        }
    }

    // show to calender
    const Todatefun = (event, selected) => {
        setShowToDate(false);
        if (selected) {
            const ToDate = formateDate(selected);
            setTodate(ToDate);
        }
    }


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")


            // setFrom('');
            // setTodate('');
            // setShowFromDate(false);
            // setShowToDate(false);
        })
    )

    useEffect(() => {
        if (!from || !todate) return;

        const payload = {
            fromDate: from,
            toDate: todate,
            roleId: selectedRole,
            department: selectedDepartment,
            //employeeId: selectedEmpname ? Number(selectedEmpname) : null,
            employeeId: !selectedEmpname || selectedEmpname === "ALL" ? null : Number(selectedEmpname),
        }
        console.log("Dispatch From Date And To date for monthly report in form UI page to redux  code--------------->", payload);
        dispatch(MonthlyReportData(payload))
    }, [from, todate, selectedRole, selectedDepartment, selectedEmpname])




    const { loading, MonthReportDateWise } = useSelector((state) => state.MonthlyReportDatesWise);
    console.log("Monthly Report Data in UI Page -------------------->", MonthReportDateWise);

    // refresh data 
    const onRefresh = async () => {
        setRefreshing(true);

        try {
            const payload = {
                fromDate: from,
                toDate: todate,
                roleId: selectedRole,
                department: selectedDepartment,
                employeeId:
                    !selectedEmpname || selectedEmpname === "ALL"
                        ? null
                        : Number(selectedEmpname),
            };

            await dispatch(MonthlyReportData(payload)).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }

        setRefreshing(false);
    };





    const filteredMonthlyReport =
        !selectedEmpname || selectedEmpname === "ALL"
            ? MonthReportDateWise
            : MonthReportDateWise?.filter(
                item => item.employeeId === Number(selectedEmpname)
            );





    const downloadPDF = async (records) => {
        console.log("records data--- pdf ----->", records);


        try {

            if (!records || records.length === 0) {
                Alert.alert("No Data", "No attendance data available");
                return;
            }

            const formatDate = (date) => {
                const d = new Date(date);
                return d.toLocaleDateString("en-GB");
            };

            let rows = "";

            records.forEach(item => {

                rows += `
              <tr>
                  <td>${item.empCode}</td>
                  <td>${item.name}</td>
                  <td>${item.roleName}</td>
                  <td>${item.department}</td>
                  <td>${item.approvedLeaveDays}</td>
                  <td>${item.totalWorkingDays}</td>
                  <td>${item.presentDays}</td>
                  <td>${item.salary}</td>
                  <td>${item.finalSalary}</td>
                  <td>${item.mobileNumber}</td>
              </tr>
              `;

            });

            const html = `
          <h2 style="text-align:center;">Employee Attendance Report</h2>
  
          <table border="1" style="width:100%;border-collapse:collapse;font-size:12px">
  
          <tr>
          <th>Emp Code</th>
          <th>Name</th>
          <th>Role</th>
          <th>Department</th>
          <th>No of Leaves</th>
          <th>Working Days</th>
          <th>Present Days</th>
          <th>Salary</th>
          <th>Final Salary</th>
          <th>Contact Number</th>
          

          </tr>
  
          ${rows}
  
          </table>
          `;

            const options = {
                html,
                fileName: `Monthly_Report_${Date.now()}`,
                directory: "Download",
            };


            const file = await RNHTMLtoPDF.generatePDF(options);

            const destPath = `${RNFS.DownloadDirectoryPath}/Monthly_Report_${Date.now()}.pdf`;

            await RNFS.moveFile(file.filePath, destPath);

            Alert.alert("Success", "PDF downloaded successfully");

        } catch (error) {
            console.log("PDF Error:", error);
            Alert.alert("Error", "Failed to download PDF");
        }
    };





    const downloadExcel = async (records) => {
        console.log("records data--- excel ----->", records);

        try {
            if (!records || records.length === 0) {
                Alert.alert("No Data", "No attendance data available");
                return;
            }

            // Prepare Excel data
            const excelData = records.map(item => ({
                "Emp Code": item.empCode,
                "Employee Name": item.name,
                "Role": item.roleName,
                "Department": item.department,
                "Working Days": item.totalWorkingDays,
                "Present Days": item.presentDays,
                "Salary": item.salary,
                "Final Salary": item.finalSalary,
                "Mobile Number": item.mobileNumber,
                "Leaves": item.approvedLeaveDays
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Report");

            // Generate base64 Excel
            const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

            // File path in Downloads folder
            const path = `${RNFS.DownloadDirectoryPath}/Monthly_Report_${Date.now()}.xlsx`;

            // Write file as base64
            await RNFS.writeFile(path, wbout, "base64");

            console.log("Excel Created Path:", path);
            Alert.alert("Success", "Excel Downloaded Successfully");

            // Optionally share the file
            // await Share.open({
            //     url: 'file://' + path,
            //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            // });

        } catch (error) {
            console.log("Excel Error:", error);
            Alert.alert("Error", "Failed to download Excel");
        }
    };



    const showDownloadOptions = (item) => {
        Alert.alert(
            "Download Report",
            "Choose Formate",
            [
                { text: "PDF", onPress: () => downloadPDF(item) },
                { text: "Excel", onPress: () => downloadExcel(item) },
                { text: "Cancel", style: "cancel" }
            ]
        );
    }



    return (
        <View style={styles.container}>

            <SafeAreaView style={styles.header}>
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Monthly Report </Text>
                </TouchableOpacity>
            </SafeAreaView>


            <View style={styles.searchBar_view}>
                <View style={styles.header}>
                    <TextInput placeholder="From  Date" editable={false} style={styles.name} placeholderTextColor="#888" value={from} />
                    <Text style={styles.in_time}>  to:  </Text>
                    <TextInput value={todate} placeholder="To Date" editable={false} style={styles.name} placeholderTextColor="#888" />
                </View>
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={() => setShowFromDate(true)}>
                        <Ionicons name="calendar-clear-outline" size={15} color="#82889A" style={styles.calender_icon} />
                        {/* <Text>From   </Text>  */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowToDate(true)}>
                        <Ionicons name="calendar-clear-outline" size={15} color="#82889A" style={{ marginLeft: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>



            {/* <View style={styles.date}>
                
                <View style={[styles.for_border_dropdown, { zIndex: 1000 }]}>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.placeholderStyle}
                        itemTextStyle={styles.placeholderStyle}
                        data={departmentData}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Department"
                        value={selectedDepartment}
                        onChange={item => setSelectedDepartment(item.value)}
                        renderRightIcon={() => (
                            <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                        )}
                    />
                </View>
            </View> */}




            <View style={styles.rowDropdownContainer}>

                {/* Department Dropdown */}
                <View style={styles.halfDropdown}>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.placeholderStyle}
                        itemTextStyle={styles.placeholderStyle}
                        data={departmentData}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Department"
                        value={selectedDepartment}
                        onChange={item => setSelectedDepartment(item.value)}
                        renderRightIcon={() => (
                            <Entypo name="chevron-small-down" size={18} color="#82889A" />
                        )}
                    />
                </View>

                {/* Role Dropdown */}
                <View style={styles.halfDropdown}>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.placeholderStyle}
                        itemTextStyle={styles.placeholderStyle}
                        data={roleList}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Role"
                        value={selectedRole}
                        onChange={item => setSelectedRole(item.value)}
                        renderRightIcon={() => (
                            <Entypo name="chevron-small-down" size={18} color="#82889A" />
                        )}
                    />
                </View>

            </View>


            <View style={styles.rowDropdownContainer}>
                <View style={styles.halfDropdown}>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.placeholderStyle}
                        itemTextStyle={styles.placeholderStyle}
                        data={empname}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Name"
                        value={selectedEmpname}
                        showsVerticalScrollIndicator={false}
                        onChange={item => {
                            console.log("Selected Employee Object:", item);
                            console.log("Selected Employee ID:", item.value);
                            if (item.value === "ALL") {
                                setSelectedEmpName("ALL"); // show all employees
                            } else {
                                setSelectedEmpName(item.value);
                            }
                            //setSelectedEmpName(item.value);
                        }}

                        search // ✅ ENABLE SEARCH
                        searchPlaceholder="Search employee..." // ✅ placeholder
                        inputSearchStyle={styles.searchInput} // optional styling

                        renderRightIcon={() => (
                            <Entypo name="chevron-small-down" size={18} color="#82889A" />
                        )}
                    />
                </View>


                <View style={styles.sec_1}>
                    <TouchableOpacity
                        style={styles.downloadBtn}
                        onPress={() => showDownloadOptions(filteredMonthlyReport)}
                    >
                        <Feather name="download" size={18} color="#fff" />
                        <Text style={styles.downloadText}>Download</Text>
                    </TouchableOpacity>
                </View>

            </View>


            <View style={styles.body}>
                <FlatList
                    // data={MonthReportDateWise}
                    // keyExtractor={item => item.id}

                    data={filteredMonthlyReport}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 2 }}

                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.black]}
                            tintColor={colors.commoncolor}
                        />
                    }
                    ListEmptyComponent={() => {
                        if (loading) {
                            return (
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <ActivityIndicator size="large" color="#007AFF" />
                                    <Text style={{ marginTop: 10 }}>Loading Report...</Text>
                                </View>
                            );
                        }

                        return (
                            <View style={styles.noDataContainer}>
                                <Text style={styles.noDataText}>No Data Found</Text>
                            </View>
                        );
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.card}>
                                <View style={styles.sec_1}>
                                    <Text style={styles.name}>Employee Code</Text>
                                    <Text style={styles.name}>Employee Name</Text>
                                </View>
                                <View style={styles.sec_1} >
                                    <Text style={styles.Date}>{item.empCode}</Text>
                                    <Text style={styles.Date}>{item.name}</Text>
                                </View>


                                <View style={styles.sec_1}>
                                    <Text style={styles.name}>Total Working Days</Text>
                                    <Text style={styles.name}>Total Present Days</Text>
                                </View>
                                <View style={styles.sec_1} >
                                    <Text style={styles.Date}>{item.totalWorkingDays}</Text>
                                    <Text style={styles.Date}>{item.presentDays}</Text>
                                </View>


                                <View style={styles.sec_1}>
                                    <Text style={styles.name}>Salary</Text>
                                    <Text style={styles.name}>Final Salary</Text>
                                </View>
                                <View style={styles.sec_1} >
                                    <Text style={styles.Date}>{item.salary}</Text>
                                    <Text style={styles.Date}>{item.finalSalary}</Text>
                                </View>


                                <View style={styles.sec_1}>
                                    <Text style={styles.name}>Contack Number</Text>
                                    <Text style={styles.name}>No Leaves</Text>
                                </View>
                                <View style={styles.sec_1} >
                                    <Text style={styles.Date}>{item.mobileNumber}</Text>
                                    <Text style={styles.Date}>{item.approvedLeaveDays}</Text>
                                </View>






                            </View>
                        )
                    }}
                />
            </View>


            {
                showFromDate &&
                < DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={Fromdatefun}
                    maximumDate={new Date()}
                />
            }


            {
                showToDate &&
                < DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={Todatefun}
                    // minimumDate={new Date()}
                    maximumDate={new Date()}
                />
            }

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: colors.white,
        //gap: responsiveHeight(1),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    body: {
        flex: 1,
        zIndex: 1,//new
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    searchBar_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(1.5),
        borderWidth: 1.5,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
        //paddingVertical: 10,
        //width: width * 0.89,
        marginRight: 5,
    },
    name: {
        fontSize: 15,
        fontWeight: 800,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    calender_icon: {
        paddingRight: 15,
    },
    in_time: {
        fontSize: 14,
        fontWeight: 500,
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
    },
    Date: {
        fontSize: 12,
        fontWeight: 500,
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 10,
        shadowRadius: 6,
        elevation: 4,
        // marginleft:5,
        // marginRight:5,
        marginBottom: 10,
        marginTop: 10,
        flexDirection: 'column',
        gap: 5,
    },
    sec_1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    // for department,roles dropdown
    rowDropdownContainer: {
        flexDirection: "row",
        //justifyContent: "space-between",
        gap: responsiveHeight(3),
        marginTop: responsiveHeight(2),
        zIndex: 999,
    },

    halfDropdown: {
        width: "48%",
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        height: 48,
        justifyContent: "center",
        paddingHorizontal: 5,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        //paddingLeft: 5,
        fontFamily: fonts.sfmedium,
        paddingHorizontal: 10,
    },

    // emp name 
    date: {
        marginTop: responsiveHeight(2),
    },
    calender_icon: {
        paddingRight: 15,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
        height: 48,                // ✅ ADD THIS
        justifyContent: "center",  // ✅ ADD THIS
        paddingHorizontal: 5,      // optional but better
    },
    dropdown: {
        flex: 1,
        height: 48,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    noDataText: {
        fontSize: 16,
        color: "#999",
        fontFamily: fonts.sfmedium,
    },



    downloadBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        marginTop: 8,
    },
    downloadText: {
        color: "#fff",
        marginLeft: 5,
        fontSize: 14,
        fontWeight: "600"
    },


})
export default MonthlyReport