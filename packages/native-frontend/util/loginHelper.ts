import { fetchLogin } from "@/fetchers/authFetchers";

/**
 * returns a promise that is either true for logged in or false for not logged in.
 * When logged in authorization token needs to be saved
 */
function login(email: string, password: string): Promise<boolean>
{
    return fetchLogin(email, password)
        .then((res: Response) => {
            if (res.ok) { // 200s status
                console.log(`Authorized.`);
                return res.text() // get the authorization token.
                    .then((res_data) => {
                        // NOTE: login token is being retrieved, but not being stored anywhere yet for protected routing
                        console.log((`auth token: ${res_data}`));
                        return true; // sucessful loggin.
                    });
            } else { // non 200s status.
                console.log(`Unauthorized`)
                return false; // failed loggin.
            }
        })
        .catch((error: Error) => {
            console.log(`fetchLogin err: ${error.message}`);
            return false // failed login even more so.
        })
}

export {
    login,
}