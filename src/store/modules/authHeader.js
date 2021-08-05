export function authHeader() {
    // return authorization header with jwt token
    let vuex = JSON.parse(localStorage.getItem('vuex'));
    console.log('authHeader', vuex);

    if (vuex.auth.user && vuex.auth.user.token) {
    	console.log('authHeader if');
        return { 'Authorization': 'Bearer ' + vuex.auth.user.token };
    } else {
    	console.log('authHeader else');
        return {};
    }
}
