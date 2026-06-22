import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, TextInput, Dimensions, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { AttendanceBasedOnDates, GetRoleByDepartment } from "../../redux/reducers/HRLogin/ReqExpenses";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { Dropdown } from "react-native-element-dropdown";
import { AllEmpAttDates } from "../../redux/reducers/HRLogin/EmployyeWiseAtt";


import RNFS from 'react-native-fs';  // to read the excel data
import XLSX from 'xlsx';// to convert the excel data to json
import * as  RNHTMLtoPDF from 'react-native-html-to-pdf';// it  converts html data to pdf data
//import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { requestLogin } from "../../redux/reducers/HRLogin/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import commonstyles from "../../commonstyles/commonstyles";


const { width, height } = Dimensions.get('window');

const EmployeeAttendance = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);


    const today = new Date();
    const formateDate = (date) => {

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }


    // const [fromdate, setFromdate] = useState(formateDate(today));// to day todays date data by default when page opens
    const [todayDate, setTodayDate] = useState(formateDate(today));

    const [showFromDate, setShowFromDate] = useState(false);
    const [from, setFrom] = useState(formateDate(today));
    //const [from, setFrom] = useState(formateDate(new Date()));// in put filed default show todays date

    const [showToDate, setShowToDate] = useState(false);
    const [todate, setTodate] = useState(formateDate(today));
    //const [todate, setTodate] = useState(formateDate(new Date()));// in put filed default show todays date


    // const [departmentList, setDepartmentList] = useState(''); 
    const [selectedDepartment, setSelectedDepartment] = useState('');// for deapartmeant dropdown

    //const [roleList, setRoleList] = useState([]); // for Roles dropdown
    const [selectedRole, setSelectedRole] = useState(null);

    const [refreshing, setRefreshing] = useState(false);// refresh


    //// default employess Data
    const { AllEmployesAttenceData } = useSelector((state) => state.PostAttendanceBasedOnDates);
    console.log("attendance Data Based On dates----------------------------AllEmployee Attendance --------------------------------------------->", AllEmployesAttenceData);// default employess Data

    const { getEmpdata } = useSelector((state) => state.GetEmp);//employess Data
    console.log("****************************GetEmployess Data All Employess Data in employess Attendance Screen *****************************", getEmpdata);//empless Data

    const { AllEmpAtt } = useSelector((state) => state.EmployeeAttDatesWise);//Based On Dates 
    console.log("All Employess Att Date Wise Data in Our Screen ----------------------->", AllEmpAtt);

    const { GetRolesWiseDepartmentsData } = useSelector((state) => state.RolesByDepartment);
    console.log("All About Roles By Depart Ment Data for Dropdown to show roles------------>", GetRolesWiseDepartmentsData);



    // // for roles By Department 
    // useEffect(() => {

    //     if (GetRolesWiseDepartmentsData && GetRolesWiseDepartmentsData.length > 0) {
    //         setRoleList(
    //             GetRolesWiseDepartmentsData.map(item => ({
    //                 label: String(item.roleName),
    //                 value: item.id,
    //             }))
    //         )
    //     }

    // }, [GetRolesWiseDepartmentsData]);







    // for dynamic dropdown for  departments
    const departmentData = [
        { label: "HR", value: 'HR' },
        { label: "MASTER", value: 'MASTER' },
        { label: "TELECALLER", value: 'TELECALLER' },
        { label: "ACCOUNTS", value: 'ACCOUNTS' },
        { label: "SALES", value: 'SALES' },
    ]




    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data in Employee Attendance Screen------------------------------------------>", data);




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
            const FromDate = formateDate(selected);
            setTodate(FromDate);
        }
    }




    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")

            //setFromdate('');// clear the date value after going back.
            //setTodate(''); // clear the date value after going back.

            //when i go back then clear the input filed
            // setFrom('');
            // setTodate('');
            setFrom(todayDate);
            setTodate(todayDate);

            setShowFromDate(false);
            setShowToDate(false);
            setSelectedEmpName(null);// to emply the selected name in dropdown
            setSelectedDepartment(null);
            setSelectedRole(null)
            handleRefresh();// refrsh data caalled here 


            if (todayDate) {
                const attendanceDate = {
                    // attendanceDate: fromdate,
                    attendanceDate: todayDate,
                };
                dispatch(AttendanceBasedOnDates(attendanceDate))
                console.log("attendance Data-------------->", attendanceDate);
                // dispatch(GetRoleByDepartment()) // for roles by departmenst to show in it

            };
            dispatch(requestLogin())

        }, [todayDate])
    )


    useEffect(() => {
        dispatch(GetRoleByDepartment())
    }, [])





    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("userData");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);
            }
        }
        loadUser();
    }, []);

    console.log("Logined User Data async storege in Hr Login Employee Attendance--------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";




    useEffect(() => {

        // only for Dates 
        if (!from || !todate) return;

        console.log("FROM:", from);
        console.log("TO:", todate);
        console.log("EMPLOYEE ID:", selectedEmpname, typeof selectedEmpname);
        console.log("Selected Role:", selectedRole);
        console.log("Selected Department:", selectedDepartment);


        let payload = {
            //employeeId: selectedEmpname ? Number(selectedEmpname) : null,
            employeeId: selectedEmpname && selectedEmpname !== "ALL" ? Number(selectedEmpname) : null,
            roleId: selectedRole,
            department: selectedDepartment,
            fromDate: from,
            toDate: todate,
        };


        console.log("Payload  dispatching To redux for Date Wise Employee Att------------------------------------>", payload);
        dispatch(AllEmpAttDates(payload));


    }, [from, todate, selectedEmpname, selectedDepartment, selectedRole])

    const [empname, setEmpName] = useState([]);
    const [selectedEmpname, setSelectedEmpName] = useState(null);


    useEffect(() => {
        if (getEmpdata && getEmpdata.length > 0) {
            const employeeList = getEmpdata.map(item => ({
                label: String(item.name),
                value: item.id,
            }));

            setEmpName([
                { label: "All", value: "ALL" },   // ✅ Add this line
                ...employeeList
            ]);
        }
    }, [getEmpdata]);





    const filterData = React.useMemo(() => {
        if (from && todate) {
            if (selectedEmpname && selectedEmpname !== "ALL") {
                return AllEmpAtt.filter(
                    item => Number(item.employeeId) === Number(selectedEmpname)
                );
            }
            return AllEmpAtt;
        }
        return AllEmployesAttenceData;
    }, [from, todate, selectedEmpname, AllEmpAtt, AllEmployesAttenceData]);


    const roleList = React.useMemo(() => {
        if (!GetRolesWiseDepartmentsData) return [];

        return GetRolesWiseDepartmentsData.map(item => ({
            label: String(item.roleName),
            value: item.id,
        }));
    }, [GetRolesWiseDepartmentsData]);






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
                <td>${formatDate(item.attendanceDate)}</td>
                <td>${item.inTime}</td>
                <td>${item.outTime}</td>
                <td>${item.workingHours}</td>
                <td>${item.attendanceStatus}</td>
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
        <th>Date</th>
        <th>In Time</th>
        <th>Out Time</th>
        <th>Working Hours</th>
        <th>Status</th>
        </tr>

        ${rows}

        </table>
        `;

            const options = {
                html,
                fileName: `Attendance_Report_${Date.now()}`,
                directory: "Download",
            };


            const file = await RNHTMLtoPDF.generatePDF(options);

            const destPath = `${RNFS.DownloadDirectoryPath}/Attendance_Report_${Date.now()}.pdf`;

            await RNFS.moveFile(file.filePath, destPath);

            Alert.alert("Success", "PDF downloaded successfully");

        } catch (error) {
            console.log("PDF Error:", error);
            Alert.alert("Error", "Failed to download PDF");
        }
    };






    const downloadExcel = async (records) => {
        try {
            if (!records || records.length === 0) {
                Alert.alert("No Data", "No attendance data available");
                return;
            }

            const formatDate = (date) => {
                const d = new Date(date);
                return d.toLocaleDateString("en-GB");
            };

            const excelData = records.map(item => ({
                "Emp Code": item.empCode,
                "Employee Name": item.name,
                "Role": item.roleName,
                "Department": item.department,
                "Attendance Date": formatDate(item.attendanceDate),
                "In Time": item.inTime,
                "Out Time": item.outTime,
                "Working Hours": item.workingHours,
                "Status": item.attendanceStatus
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Attendance");

            // ✅ Use base64 output
            const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

            const filePath = `${RNFS.DownloadDirectoryPath}/Attendance_Report_${Date.now()}.xlsx`;

            await RNFS.writeFile(filePath, wbout, "base64");

            console.log("Excel saved at:", filePath);
            Alert.alert("Success", "Excel downloaded successfully");

        } catch (error) {
            console.log("Excel Error:", error);
            Alert.alert("Error", "Excel generation failed");
        }
    };


    const showDownloadOptions = (records) => {
        Alert.alert(
            "Download Report",
            "Choose Formate",
            [
                { text: "PDF", onPress: () => downloadPDF(records) },
                { text: "Excel", onPress: () => downloadExcel(records) },
                { text: "Cancel", style: "cancel" }
            ]
        );
    }


    // refresh fun
    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            if (from && todate) {
                let payload = {
                    employeeId: selectedEmpname && selectedEmpname !== "ALL" ? Number(selectedEmpname) : null,
                    roleId: selectedRole,
                    department: selectedDepartment,
                    fromDate: from,
                    toDate: todate,
                };

                await dispatch(AllEmpAttDates(payload)).unwrap();
            } else {
                const attendanceDate = {
                    attendanceDate: todayDate,
                };

                await dispatch(AttendanceBasedOnDates(attendanceDate)).unwrap();
            }

        } catch (error) {
            console.log("Refresh error:", error);
        } finally {
            setRefreshing(false);
        }
    };





    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}
            <SafeAreaView style={styles.header}>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    {/* <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} /> */}
                    <Text style={commonstyles.title}>Employee Attendance</Text>
                </TouchableOpacity>

                {
                    !isAdmin && (
                        <View style={styles.left}>
                            <TouchableOpacity style={styles.My_att} onPress={() => navigation.navigate("MyAttendance")}>
                                <Text style={styles.My_att_text}>My Attendance</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.user} onPress={() => navigation.navigate("AddAttendance")}>
                                <FontAwesome6 name="user-large" color="#000000" size={20} />
                            </TouchableOpacity>
                        </View>
                    )
                }


            </SafeAreaView>

            <View style={styles.searchBar_view}>
                <View style={styles.left}>
                    <TextInput placeholder="Select Date" editable={false} style={styles.name} placeholderTextColor="#888" value={from} />
                    <Text style={styles.in_time}>  to:  </Text>
                    <TextInput value={todate} placeholder="To Date" editable={false} style={styles.name} placeholderTextColor="#888" />
                </View>
                <View style={[styles.left]}>
                    <TouchableOpacity onPress={() => setShowFromDate(true)}>
                        <Ionicons name="calendar-clear-outline" size={15} color="#82889A" style={styles.calender_icon} />
                        {/* <Text>From   </Text>  */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowToDate(true)}>
                        <Ionicons name="calendar-clear-outline" size={15} color="#82889A" style={{ marginLeft: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>



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
                        // data={roleList}
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
                        showsVerticalScrollIndicator={false}
                        data={empname}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Name"

                        value={selectedEmpname}
                        onChange={item => {
                            console.log("Selected Employee Object:", item);
                            console.log("Selected Employee ID:", item.value);
                            // if (item.value === "ALL") {
                            //     setSelectedEmpName(null); // show all employees
                            // } else {
                            //     setSelectedEmpName(item.value);
                            // }
                            setSelectedEmpName(item.value);
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
                        onPress={() => showDownloadOptions(filterData)}
                    >
                        <Feather name="download" size={18} color="#fff" />
                        <Text style={styles.downloadText}>Download</Text>
                    </TouchableOpacity>
                </View>



            </View>



            <View style={styles.Attendence_sheet}>
                <FlatList
                    // data={AllEmployesAttenceData}
                    //data={selectedEmpname && from && todate ? AllEmpAtt : AllEmployesAttenceData}//worked not for Employee ID
                    // data={from && todate ? AllEmpAtt : AllEmployesAttenceData}

                    //data={from && todate ? selectedEmpname? AllEmpAtt.filter(item => item.employeeId === selectedEmpname): AllEmpAtt: AllEmployesAttenceData}
                    data={filterData}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 2 }}

                    //refresh
                    refreshing={refreshing}
                    onRefresh={handleRefresh}

                    ListEmptyComponent={() => (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No Data Found</Text>
                        </View>
                    )}

                    renderItem={({ item, index }) => {


                        // const hasInTime = item.inTime && item.inTime.trim() !== "";
                        // //const calculatedStatus = hasInTime ? "Present" : "Absent";

                        // let calculatedStatus = "Absent";

                        // if (hasInTime) {

                        //     // Clean special unicode spaces
                        //     const cleanTime = item.inTime.replace(/\u202F/g, " ").trim();

                        //     // Split time and meridian
                        //     const [time, modifier] = cleanTime.split(" ");
                        //     let [hours, minutes] = time.split(":").map(Number);

                        //     // Convert to 24-hour format
                        //     if (modifier === "PM" && hours !== 12) {
                        //         hours += 12;
                        //     }
                        //     if (modifier === "AM" && hours === 12) {
                        //         hours = 0;
                        //     }

                        //     // Now check hour
                        //     if (hours >= 12) {
                        //         calculatedStatus = "Half Day";
                        //     } else {
                        //         calculatedStatus = "Present";
                        //     }

                        // }
                        // //{calculatedStatus}


                        return (
                            <View style={styles.card}>
                                <View style={styles.sec_1}>
                                    <Text style={styles.name}>{item.empCode}</Text>
                                    <Text style={styles.Date}>{new Date(item.attendanceDate).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit", })}</Text>
                                </View>
                                <View style={styles.sec_1} >
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={[styles.status, item.attendanceStatus === "Present" ? styles.present : item.attendanceStatus === "Absent" ? styles.Absent : item.attendanceStatus === "Half Day" ? styles.halfday : null]}>{item.attendanceStatus}</Text>
                                </View>

                                <Text style={styles.in_time}>In Time: {item.inTime} </Text>
                                <Text style={styles.in_time} >InLocation: {item.inLocation}</Text>
                                <Text style={styles.in_time}>Out Time: {item.outTime}  </Text>
                                <Text style={styles.in_time}>Working Hours: {item.workingHours}  </Text>

                                <View style={styles.last_sec}>

                                    {/* Text Section */}
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <Text style={styles.in_time} numberOfLines={3} >OutLocation: {item.outLocation} </Text>
                                    </View>

                                    {!isAdmin && (
                                        <TouchableOpacity onPress={() => navigation.navigate("EditAttendance", { EmployeeAttData: item })} style={{ flexShrink: 0 }} >
                                            <Feather name="edit" color="#EF3D3B" size={22} />
                                        </TouchableOpacity>
                                    )}


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
    date: {
        marginTop: responsiveHeight(2),
    },
    calender_icon: {
        paddingRight: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        //paddingTop: 10,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    first: {
        color: colors.formtitlegry,
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    My_att: {
        marginLeft: 24,
    },
    My_att_text: {
        backgroundColor: colors.commoncolor,
        color: colors.white,
        padding: 5,
        fontSize: 12,
        fontWeight: 500,
        borderRadius: 3,
        fontFamily: fonts.sfmedium,
    },
    user: {
        backgroundColor: colors.commomcolorlight,
        borderWidth: 1,
        borderColor: colors.commoncolor,
        padding: 10,
        borderRadius: 30,
        marginLeft: 10,
    },
    for_border: {
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: width * 0.83,
        marginRight: 5,
    },
    Attendence_sheet: {
        flex: 1,
        zIndex: 1,//new
    },
    inputfield: {
        flex: 1,
        color: colors.inputfieldcolor,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
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
    name: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    Date: {
        fontSize: 12,
        fontWeight: 500,
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
    },
    in_time: {
        fontSize: 14,
        fontWeight: 500,
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
    },
    last_sec: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    status: {
        fontSize: 14,
        fontWeight: 500,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 4,
        //marginRight: 5,
    },
    halfday: {
        color: colors.halfdayclr,
        backgroundColor: colors.halfdaybg,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,

    },
    present: {
        color: colors.btntextgreen,
        backgroundColor: colors.btnbggreen,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    Absent: {
        color: colors.commoncolor,
        backgroundColor: colors.commomcolorlight,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
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
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        //paddingLeft: 5,
        fontFamily: fonts.sfmedium,
        paddingHorizontal: 10,
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

















    rowAligned: {
        flexDirection: "row",
        alignItems: "center", // ✅ vertical alignment
        justifyContent: "space-between",
        marginTop: responsiveHeight(2),
    },

    dropdownContainer: {
        flex: 1,              // ✅ take remaining space
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        height: 48,
        justifyContent: "center",
        paddingHorizontal: 5,
        marginRight: 10,      // spacing from button
    },

    downloadBtnNew: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007AFF",
        height: 48,           // ✅ same height as dropdown
        paddingHorizontal: 16,
        borderRadius: 6,
    },
















})
export default EmployeeAttendance;