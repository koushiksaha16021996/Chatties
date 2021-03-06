import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signin from './screen/Signin';
import Signup from './screen/Signup';
import Daskboard from './screen/Dashboard/Daskboard';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from './screen/splash/Splash';
import FingerPrintCheck from './screen/Fingerprint/FingerPrintCheck';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth'
import { authentication } from './redux/actions/auth/Auth';


export default function Start() {
    const [isloading, setisloading] = useState(true)
    const state = useSelector(state => state)
    const dispatch= useDispatch()
    //console.log("________________check user------------------->",auth().onAuthStateChanged(user=>{}))
    
    console.log("------------------redux---------->", state)
    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user.uid)
                //dispatch(authentication(true))
                AsyncStorage.getItem("userData").then(res=>{
                    console.log("is token present",res)
                    if(res==user.uid){
                        console.log("action login ")
                        dispatch(authentication(true))
                    }
                    else{
                        console.log("action failed login ")
                    }
                })
            } else {
                dispatch(authentication(false))
            }
        });
        setTimeout(() => {
            setisloading(false)
        }, 2000)
    }, [])
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {
                    isloading ? <Stack.Screen name="Splash" component={Splash} />
                        : state.Auth.authentication_status === true ? (
                            <>
                                <Stack.Screen name="FingerPrintCheck" component={FingerPrintCheck} />
                                <Stack.Screen name="Daskboard" component={Daskboard} />
                            </>
                        ) : (
                            <>
                                <Stack.Screen name="Signin" component={Signin} />
                                <Stack.Screen name="Signup" component={Signup} />
                            </>
                        )
                }


            </Stack.Navigator>
        </NavigationContainer>
    )
}
