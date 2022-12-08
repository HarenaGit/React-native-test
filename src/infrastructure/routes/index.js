
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSelector, useDispatch } from 'react-redux';

import { setAuth } from '../../service/applicable/auth.sa/Auth.redux.sa';
import useAuth from '../../service/applicable/auth.sa/Auth.sa';
import DrawerNavigator from './DrawerNavigator';
import Login from '../../presentation/pages/Login';

const Stack = createNativeStackNavigator();

const Route = () => {

    const { getCredentials } = useAuth();

    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector((state) => {
        return {
            isAuthenticated: state.auth.isAuthenticated
        }
    })

    const [isLoading, setIsLoading] = useState(true);

    const credentials = () => {
        setIsLoading(true);
        getCredentials()
            .then(({ token, roleName, id }) => {
                setIsLoading(false);
                dispatch(setAuth({ token, roleName, id }));
            })
            .catch((error) => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        credentials();
    }, [])

    return (

        <React.Fragment>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#4eac6d" />
                </View>) :
                <NavigationContainer  >
                    <Stack.Navigator screenOptions={{
                        headerShown: false
                    }} >
                        {!isAuthenticated ?
                            (<Stack.Screen name="Login" component={Login} />) :
                            (<Stack.Screen name="App" component={DrawerNavigator} />)
                        }

                    </Stack.Navigator>
                </NavigationContainer>
            }
        </React.Fragment>
    );
}

export default Route;