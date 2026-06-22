import { StyleSheet } from "react-native";
import {
    responsiveWidth,
    responsiveHeight,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { colors, fonts } from "../config/theme";
//   const { width } = Dimensions.get('window');
const commonstyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    backgroundcolor: {
        backgroundColor: "#C6A06A"
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: responsiveWidth(4),
        borderTopColor: '#333',
        alignItems: 'center',
    },
    button: {
        padding: 13,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,

        backgroundColor: '#fff',
        width: "100%"
    },
    buttontext: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 800,
        fontFamily: 'SFPRODISPLAYSEMIBOLDITALIC',
    },
    text1: {
        fontSize: 16,
        fontFamily: fonts.sfmedium,
        color: colors.foundationgray,

    },
    text2: {
        fontSize: 12,
        color: colors.foundationgray,
        fontFamily: fonts.sfregular,
        fontWeight:'400',
    },
    text3: {
        fontSize: 16,
        fontFamily: fonts.sfmedium,
        color: colors.goodsblack,
    },
    text4: {
        fontSize: 16,
        fontFamily: fonts.sfmedium,
        color: colors.simpleblack
    },
    text5: {
        fontSize: 12,
        fontFamily: fonts.sfmedium,
        color: colors.foundationgray,
    },
    text6: {
        fontSize: 12,
        fontFamily: fonts.sfmedium,
        color: colors.simpleblack,
    },

    text7: {
        fontSize: 14,
        fontFamily: fonts.sfbold,
        color: colors.simpleblack,
        fontWeight:'700',
    },
    text8: {
        fontSize: 16,
        fontFamily: fonts.sfregular,
        color: colors.inputfieldcolor
    },
    text9: {
        fontSize: 14,
        fontWeight: 700,
        fontFamily: fonts.bold,
        color: "#000"
    },
    text10: {
        fontSize: 12,
        fontWeight: 400,
        fontFamily: fonts.sfregular,
        color: "#000"
    },
    text11: {
        fontSize: 14,
        fontWeight: 700,
        fontFamily: fonts.bolditalic,
        color: "#757575"
    },
    text12: {
        fontSize: 24,
        fontWeight: 700,
        fontFamily: fonts.bolditalic,
        color: "#757575"
    },
    text13: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: fonts.regular,
        color: "#757575"
    },
    text14: {
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.medium,
        color: "#262757"
    },

    marginBottom16: { marginBottom: 16 },
    marginBottom24: { marginBottom: 24 },
    marginBottom32: { marginBottom: 32 },

    marginBottom12: {
        marginBottom: 12
    },
    marginTop24: { marginTop: 24 },
    marginTop10: { marginTop: 10 },
    hr: {
        height: 0.5,
        borderBottomWidth: 0.5,
        backgroundColor: "#9E9E9E",

    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    column: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    smallbutton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderColor: 'red',
        width: 112,
        borderWidth: 1
    },
    smallgreenbuttontext: {
        color: '#000',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500'
    },
    smallgraybutton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderRadius: 16,
        backgroundColor: '#b8b8b8',
        width: 112,

    },
    smallgreenbutton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderRadius: 16,
        // backgroundColor: '#00B562',
        width: 112,
        borderColor: "#262757",
        borderWidth: 0.5

    },
    card: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.white,
        flexDirection: 'column',
        gap: 8,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,

        // Shadow for Android
        elevation: 4,
    },
    smallcard: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.white,
        flexDirection: 'column',
        //alignItems: 'flex-start',
        alignItems: 'center', 
        gap: 8,
        borderColor: '#CFD4E0', borderWidth: 1
    },
    header1: {
        color: colors.simpleblack,
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
    },
    header2: {
        color: colors.commoncolor,
        fontSize: 16,
        //   fontWeight: '700',
        fontFamily: 'Poppins-Bold'
    },
     header3: {
        color: colors.simpleblack,
        fontSize: 18,
        fontFamily: 'Poppins-Bold'
    },
    header4:{
      color:colors.simpleblack,
      fontFamily:fonts.sfbold,
      fontSize:16,
    },
    redbutton: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        height: 38,    // for gap + alignment
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        // flex: 1,
    },
    redbuttonText: {
        color: colors.white,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: fonts.sfbold,
        fontWeight:'700'
    },
    eyeBox: {
        backgroundColor: '#E4FFEE',
        borderRadius: 8,
        borderWidth: 0.6,
        borderColor: '#72D697',
        width: 36,
        aspectRatio: 1,
        padding: 10,
        flexDirection: 'row',   // needed for gap
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    waterText: {
        color: colors.foundationgray,
        fontSize: 14,
        fontFamily: fonts.sfmedium,
        lineHeight: 14,
    },
    amountText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        color: colors.simpleblack,
        lineHeight: 14,
    },
    row1: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    assignText: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: colors.black,
    },
    smallcard1: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.white,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
        borderColor: '#CFD4E0', borderWidth: 1
    },
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    profileContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 16
    },
    cardgap: {
        marginVertical: 12,
        marginHorizontal: 12,
    },
    column1: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    incrementbtn: {
        height: responsiveHeight(3.5),
        width: responsiveWidth(20),
        backgroundColor: colors.lightGray,
        padding: 4,
        borderRadius: 8,
    },
    bothbtn: {
        backgroundColor: colors.white,
        paddingHorizontal: 8,
        borderRadius: 4,
        alignItems: 'center'
    },
    greenbtn: {
        alignSelf: 'flex-start',
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    cameracard: {
        borderWidth: 1,
        borderColor: colors.lightbordercolor,
        padding: 20,
        borderRadius: 8,
    },
    paymentbutton: {

    },
    inputcard: {
        flex:1,
        paddingRight:12,
        paddingLeft:12,
        borderRadius: 12,
        // paddingTop:10,
        backgroundColor: colors.white,
        // alignItems: 'center',
        justifyContent:'center',
        gap: 8,
        borderColor: colors.inputfieldborder,
        borderWidth: 1,
        color:colors.black,
    },
    incrementContainer:{
        borderWidth:1,
        borderColor:colors.commoncolor,
        backgroundColor:colors.simpleredborder,
        padding:5,
        borderRadius:8,
    },
    redbutton1:{
        backgroundColor:colors.commoncolor,
        padding:10,
        borderRadius:8,
        width:responsiveWidth(50),
        marginHorizontal:12,
        marginBottom:10,
    },
    name:{
        fontsize:14,
        fontWeight:'400',
        fontFamily:fonts.sfmedium,
        color:colors.inputfieldcolor,
        paddingBottom:3,
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
    },
    btnText:{
        fontsize:14,
        fontWeight:'bold',
        color:colors.black,
    },
    btnTextW:{
        fontsize:14,
        fontWeight:'bold',
        color:colors.white,
    },
    for_border: {
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
    },

    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
    },
    calender_icon: {
        paddingRight: 15,
    },
    dropdown: {
        flex: 1,
        height: 48,
    },
    placeholderStyle: {
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        //paddingLeft:10,
        paddingHorizontal: 10,
        fontFamily: fonts.sfmedium
    },
    required:{
        color:colors.error,
    },

    active:{
        backgroundColor:colors.btnbggreen,
        color:colors.btntextgreen,
        padding:8,
        borderRadius:8,
    },
    inactive:{
        backgroundColor:colors.commomcolorlight,
        color:colors.commoncolor,
        padding:8,
        borderRadius:8,
        
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
    
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingtop: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        fontFamily: fonts.sfbold,
    },


    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    approveBtn: {
        flex: 1, // ✅ ADD THIS
        marginRight: 5, // spacing between buttons
        borderWidth: 1,
        borderColor: colors.btntextgreen,
        backgroundColor: colors.btnbggreen,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
    },

    rejectBtn: {
        flex: 1, // ✅ ADD THIS
        marginRight: 5, // spacing between buttons
        borderWidth: 1,
        borderColor: colors.commoncolor,
        backgroundColor: colors.commomcolorlight,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
        
    },





})

export default commonstyles;