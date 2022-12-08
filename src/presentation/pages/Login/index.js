import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    KeyboardAvoidingView,
    Keyboard,
    Dimensions,
    TextInput,
    Modal,
    ActivityIndicator
} from "react-native";

import { useDispatch } from 'react-redux'

import { setAuth } from '../../../service/applicable/auth.sa/Auth.redux.sa';
import useAuth from '../../../service/applicable/auth.sa/Auth.sa';

import ImageSrc from '../../../data/constant/ImageSrc';
import Button from '../../components/Button';
import Typography from '../../components/Typography';
import { useNavigation } from '@react-navigation/native';
import { useForm } from "react-hook-form";
import WavyFooter from '../../components/Svg/WavyFooter';

const styles = StyleSheet.create({
    img: {
        paddingTop: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    welcome: {
        fontSize: 25,
        textAlign: 'center',
        margin: 7,
        fontWeight: 'bold',
    },
    inputGroup: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 2
    },
    container: {
        width: "80%",
        padding: 5,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.3)',
        marginBottom: 5,
        fontSize: 18,
        borderRadius: 10,
    },
    inputError: {
        borderColor: "#FF0000"
    },
    container1: {
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
        marginTop: 60,
    },
    love: {
        fontSize: 14,
        fontFamily: "Nunito-Bold",
        color: "#ffffff",
        marginBottom: 15
    },
    link: {
        color: "#4eac6d",
    }
});

const Login = () => {

    const navigation = useNavigation(true);

    const dispatch = useDispatch();

    const { login } = useAuth();

    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const {
        handleSubmit,
        formState: { errors: errorData },
        setValue,
        register,
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [isLoading, setIsLoading] = useState(false);

    const [onInputError, setOnInputError] = useState({
        isEmailError: false,
        emailErrorMessage: "",
        isPasswordError: false,
        passwordErrorMessage: ""
    })

    const onSignIn = (data) => {
        if (data.email === "") {
            emailInputRef.current.focus();
            setOnInputError({
                ...onInputError,
                isEmailError: true,
                emailErrorMessage: "Please fill with a correct email adress"
            });
            return;
        }
        if (data.password === "") {
            passwordInputRef.current.focus();
            setOnInputError({
                ...onInputError,
                isPasswordError: true,
                passwordErrorMessage: "please fill with a correct password"
            })
            return;
        }
        setIsLoading(true);
        login(data.email, data.password)
            .then(({ token, data }) => {
                dispatch(setAuth({ token: token, roleName: data?.roleName, id: data?.id }));
            })
            .catch((error) => {
                setIsLoading(false);
                emailInputRef.current.focus();
                setOnInputError({
                    isEmailError: true,
                    emailErrorMessage: "Invalid email",
                    isPasswordError: true,
                    passwordErrorMessage: "Invalid password"
                })
            })
    }

    const [viewHide, setViewHide] = useState({
        height: 250,
        flex: 1
    });



    const onError = (errors) => {
        if (errors.email) {
            emailInputRef.current.focus();
        } else if (errors.password) {
            passwordInputRef.current.focus();
        }
    };

    useEffect(() => {
        if (errorData.email) {
            emailInputRef.current.focus();
        } else if (errorData.password) {
            passwordInputRef.current.focus();
        }
    }, [errorData.email?.message, errorData.password?.message]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setViewHide({
                    height: 0,
                    flex: 1
                })
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setViewHide({
                    height: 250,
                    flex: 1
                })
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <Modal visible={isLoading}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#4eac6d" />
                </View>
            </Modal>
            <View style={{ flex: viewHide.flex, justifyContent: "center" }}>
                <View style={[styles.img]}>
                    <Image
                        source={ImageSrc.loginImage}
                        style={[{ width: 250, height: viewHide.height }]}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <View style={[{ justifyContent: 'center', alignItems: 'center', marginVertical: 10, backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 20 }]}>
                    <Typography variant="title" style={{ fontSize: 20 }} >Welcome to Mada<Typography style={{ fontSize: 20, color: "#4eac6d" }} >Meals</Typography></Typography>
                </View>
                <View style={styles.container}>
                    <TextInput
                        style={[styles.input, errorData.email || onInputError.isEmailError ? styles.inputError : {}]}
                        {...register("email", {
                            required: true,
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                        })}
                        placeholder='email'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        autoCompleteType='email'
                        onChangeText={(text) => {
                            setOnInputError({
                                ...onInputError,
                                isEmailError: false,
                                emailErrorMessage: ""
                            });
                            setValue("email", text);
                        }}
                        returnKeyType='next'
                        onSubmitEditing={() => passwordInputRef.current.focus()}
                        ref={emailInputRef}
                    />
                    <Typography variant="subTitle" style={{ marginLeft: 5, color: "#FF0000" }} >{onInputError.isEmailError ? onInputError.emailErrorMessage : errorData.email && errorData.email?.message}</Typography>
                </View>
                <View style={styles.container}>
                    <TextInput
                        style={[styles.input, errorData.password || onInputError.isPasswordError ? styles.inputError : {}]}
                        placeholder='password'
                        {...register("password", {
                            required: true,
                            minLength: { value: 8, message: "Password should have minimum 8 characters" },
                            maxLength: { value: 15, message: "Password should have maximum 8 characters" },
                        })}
                        onChangeText={(text) => {
                            setOnInputError({
                                ...onInputError,
                                isPasswordError: false,
                                passwordErrorMessage: ""
                            });
                            setValue("password", text);
                        }}
                        keyboardType='visible-password'
                        returnKeyType='go'
                        ref={passwordInputRef}
                        onSubmitEditing={handleSubmit(onSignIn, onError)}
                        secureTextEntry={true}
                    />
                    <Typography variant="subTitle" style={{ marginLeft: 5, color: "#FF0000" }} >{onInputError.isPasswordError ? onInputError.passwordErrorMessage : errorData.password && errorData.password?.message}</Typography>
                </View>
                <View style={[styles.container, { marginTop: 0 }]}>
                    <Button title='Sign in' textStyle={{
                        fontSize: 18,
                        fontFamily: "Nunito-Bold"
                    }} onPress={handleSubmit(onSignIn, onError)} />
                </View>
            </View>
            <View style={[styles.container1, viewHide.height === 0 ? { height: 0 } : {}]}>
                <WavyFooter
                    style={{
                        position: "absolute",
                        width: Dimensions.get("window").width,

                    }}

                    height={viewHide.height === 0 ? 0 : 90}
                    bottom={-10}
                    bgColor={"#212529"}
                    wavePattern="M0,256L80,240C160,224,320,192,480,165.3C640,139,800,117,960,122.7C1120,128,1280,160,1360,176L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                // https://getwaves.io/ to get wavePattern value :)
                />
                <Text style={[styles.love, viewHide.height === 0 ? { height: 0 } : {}]}>
                    Made with ❤ by{" "}
                    <Text
                        style={[styles.acc, styles.link]}
                    >
                        Ny :)
                    </Text>
                </Text>
            </View>
        </View>
    );
}

export default Login;