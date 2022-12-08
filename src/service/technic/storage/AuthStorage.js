import AsyncStorage from '@react-native-async-storage/async-storage';

const useStorage = () => {
    return {
        getAuthStore: () =>
            new Promise(async (success, error) => {
                try {
                    const token = await AsyncStorage.getItem('token');
                    const roleName = await AsyncStorage.getItem('role');
                    const id = await AsyncStorage.getItem('userId');
                    success({ token, roleName, id });
                } catch (exception) {
                    error(exception);
                }
            }),
        setAuthStore: (token, roleName, id) =>
            new Promise(async (success, error) => {
                try {
                    await AsyncStorage.setItem('token', token);
                    await AsyncStorage.setItem('role', roleName);
                    await AsyncStorage.setItem('userId', `${id}`);
                    success({ token, roleName, id });
                } catch (exception) {
                    error(exception);
                }
            }),
        resetAuthStore: () =>
            new Promise(async (success, error) => {
                try {
                    await AsyncStorage.clear();
                    success("Successfuly cleared");
                } catch (exception) {
                    error(exception);
                }
            })
    }
}

export default useStorage