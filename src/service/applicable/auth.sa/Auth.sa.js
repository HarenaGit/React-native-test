import { login } from '../../business_delegate/Auth.bdl';
import useStorage from '../../technic/storage/AuthStorage';

const { getAuthStore, setAuthStore, resetAuthStore } = useStorage();

const useAuth = () => {

    return {
        login: (email, password) =>
            new Promise(async (success, error) => {
                login(email, password)
                    .then(async (response) => {
                        const authData = response;
                        await setAuthStore(authData?.token, authData?.data?.roleName, authData?.data?.id);
                        success(authData)
                    })
                    .catch((exception) => error(exception))
            }),
        logout: () =>
            new Promise(async (success, error) => {
                const response = await resetAuthStore()
                    .catch((exception) => error(exception));
                success(response);
            }),
        getCredentials: () =>
            new Promise(async (success, error) => {
                const response = await getAuthStore()
                    .catch((exception) => error(exception));
                success({
                    token: response.token,
                    roleName: response.roleName,
                    id: response.id
                });
            })
    }
}

export default useAuth;