import useAuth from '../../../service/applicable/auth.sa/Auth.sa';

const useAuthHeader = async () => {
    const { getCredentials } = useAuth();
    const { token } = await getCredentials();
    const headerConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    return headerConfig;
}

export { useAuthHeader };