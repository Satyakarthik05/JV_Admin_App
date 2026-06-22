import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { responsiveHeight } from "react-native-responsive-dimensions";
import Entypo from 'react-native-vector-icons/Entypo';
import { GetCallQuestions, QuestionsPost } from "../../redux/reducers/TelecallerLogin/AddCallers";
import commonstyles from "../../commonstyles/commonstyles";

const QuestionAndAnsForm = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
            dispatch(GetCallQuestions())
        }, [])
    )
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [call, setCall] = useState('');
    const CallsData = [
        { label: "First Call", value: "First Call" },
        { label: "Second Call", value: "Second Call" },
    ]

    const [questions, setQuestions] = useState([
        { id: 1, question: '' }
    ]);

    const addQuestion = () => {
        setQuestions(prev => [
            ...prev,
            { id: Date.now(), question: '' }
        ]);
    };

    const removeQuestion = (id) => {
        if (questions.length === 1) return;
        setQuestions(prev => prev.filter(item => item.id !== id));
    };

    const { GetQnData } = useSelector((state) => state.GetQuestionsData);
    console.log("Get Qtn Data  in Qns form ----------->", GetQnData);

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        // Call Type validation
        if (!call) {
            newErrors.call = "Please select call type";
        }
        //  Questions validation (LIKE your material screen)
        questions.forEach((item, index) => {
            if (!item.question || !item.question.trim()) {
                newErrors[`question_${index}`] = "Question is required";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {

        if (isSubmitting) return; //  prevent multiple clicks

        const isValid = validateForm();
        if (!isValid) return;

       

        //  Check if questionType already exists
        const alreadyExists = GetQnData?.some(
            item => item.questionType === call
        );

        if (alreadyExists) {
            Alert.alert(
                "Already Exists",
                `${call} questions already exist. Please edit instead of adding again.`
            );
            return;
        }

        setIsSubmitting(true); //  move here


        // payload
        const payload = {
            questionType: call,
            questions: questions.map(q => q.question)
        };
        console.log("Final Payload:", payload);

        // API call here

        try {

            const response = await dispatch(QuestionsPost(payload)).unwrap();
            Alert.alert(
                "Success", response?.data?.message || response?.message || "Added Question Successfully",
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
            setIsSubmitting(false); //  stop loading
        }

    };



    return (
        <View style={[styles.container]}>

            <SafeAreaView>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Add Questions</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: responsiveHeight(5) }}>

                <View style={styles.date}>
                    <Text style={styles.first}>Select Call Type<Text style={styles.red}>*</Text></Text>

                    <View style={[styles.for_border_dropdown, errors.call ? styles.errorBorder : null, { zIndex: 1000 }]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={CallsData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Call Type"
                            value={call}
                            onChange={item => {
                                setCall(item.value)
                                setErrors(prev => ({ ...prev, call: null }));
                            }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                    {
                        errors.call ? (
                            <Text style={styles.error_text}>{errors.call}</Text>
                        ) : null
                    }

                </View>



                {/* questions */}

                <View style={{ marginTop: 20 }}>
                    <Text style={styles.title}>Questions</Text>

                    {
                        questions.map((item, index) => (
                            <View key={item.id} style={styles.card}>

                                <View style={styles.rowBetween}>
                                    <Text style={styles.subTitle}>Question {index + 1}</Text>
                                    <TouchableOpacity onPress={() => removeQuestion(item.id)}>
                                        <Feather name="trash-2" size={16} color="red" />
                                    </TouchableOpacity>
                                </View>

                                <View style={[commonstyles.for_border, errors[`question_${index}`] && styles.errorBorder]}>
                                    <TextInput
                                        placeholder="Enter Question"
                                        value={item.question}
                                        style={commonstyles.inputfield}
                                        placeholderTextColor="#888"
                                        multiline={true}
                                        onChangeText={(text) => {
                                            setQuestions(prev =>
                                                prev.map(q =>
                                                    q.id === item.id ? { ...q, question: text } : q
                                                )
                                            )
                                            setErrors(prev => ({ ...prev, [`question_${index}`]: null }));
                                        }}
                                    />
                                </View>
                                {errors[`question_${index}`] && (
                                    <Text style={styles.error_text}>{errors[`question_${index}`]}</Text>
                                )}

                            </View>
                        ))
                    }
                </View>


                <TouchableOpacity style={styles.botted} onPress={addQuestion}>
                    <Entypo name="plus" size={20} color="#4A5565" />
                    <Text style={styles.bottedText}>Add Question</Text>
                </TouchableOpacity>


                {/* <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.btn_text}>Submit</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={[styles.button, isSubmitting && { opacity: 0.6 }]}  onPress={handleSubmit} disabled={isSubmitting} >
                    {isSubmitting ? (
                        <Text style={styles.btn_text}>Submitting...</Text>
                    ) : (
                        <Text style={styles.btn_text}>Submit</Text>
                    )}
                </TouchableOpacity>





            </ScrollView>

        </View>
    )
}
export default QuestionAndAnsForm
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
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    date: {
        marginTop: 13,
    },
    first: {
        color: colors.formtitlegry,
        fontSize: 16,
        fontWeight: 500,
        marginBottom: responsiveHeight(1),
        fontFamily: fonts.sfmedium,
    },
    red: {
        color: colors.error,
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
        //paddingLeft:10,
        paddingHorizontal: 10,
    },
    calender_icon: {
        paddingRight: 15,
    },


    // for questions
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 12,
        elevation: 3,
        marginTop: 12,
        margin: responsiveHeight(1),
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        fontFamily: fonts.sfmedium,
    },
    inputBox: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 8,
    },
    input: {
        height: 45,
        fontSize: 16,
        color: colors.black,
        fontFamily: fonts.sfmedium,
    },
    /* Add Button (reuse your existing if already there) */
    botted: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.commoncolor,
        paddingVertical: 10,
        borderRadius: 6,
    },

    bottedText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.formtitlegry,
        marginLeft: 6,
        fontFamily: fonts.sfmedium,
    },

    /* Submit Button */
    button: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        marginTop: 20,
    },

    btn_text: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
        textAlign: 'center',
        paddingVertical: 14,
        fontFamily: fonts.sfbold,
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
