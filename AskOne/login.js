import * as queryString from 'query-string';

const stringifiedParams = queryString.stringify({
    client_id: '1018539630194-dm5b3ek8funh8lt8sa352m5emlo60end.apps.googleusercontent.com',
    redirect_uri: 'https://www.example.com/authenticate/google',
    scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '), // space seperated string
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
});

const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;