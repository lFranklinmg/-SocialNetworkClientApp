import axios, { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { config } from 'process';
import { toast } from 'react-toastify';
import { Activity, ActivityFormValues } from '../models/activity';
import { User } from '../models/user';
import { UserFormValues } from '../models/userFormValues';
import { router } from '../router/Routes';
import { store } from '../stores/store';

const sleep = (delay: number) =>{
    return new Promise((resolve) =>{
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'https://localhost:7175/';

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

//Axios way out Interceptors | Request
axios.interceptors.request.use(config => {
    
    const token = store.commonStore.token;
    //config.headers = {...config.headers} as AxiosHeaders;
    if(token && config.headers)  (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);

    //if(token && config.headers) config.headers.set('Authorization','Bearer ${token}');
        
    return config;
})


//Axios way back Interceptors | response
axios.interceptors.response.use(async response => {
        await sleep(1000);
        return response;
}, (error: AxiosError)=>{
    const {data, status, config} = error.response as AxiosResponse;

    switch (status){
        case 400:
            if(config.method === 'get' && data.errors.hasOwnProperty('id')){
                router.navigate('/not-found');
            }
            if(data.errors){
                const modalStateErrors = [];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            }
            else{
                toast.error(data);
            }
            toast.error('bad request')
            break;
        case 401:
            toast.error('unauthorized')
            break;
        case 403:
            toast.error('Forbidden')
            break;
        case 404:
            //toast.error('Not Found')
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error')
            break;
    }
    return Promise.reject(error);
})

const requests = {
    get:    <T> (url: string)           => axios.get<T>(url).then(responseBody),
    post:   <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put:    <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del:    <T> (url: string)           => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: () => requests.get<Activity[]>('/Activities'),
    details: (id: string) => requests.get<Activity>(`/Activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/Activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/Activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/Activities/${id}`),
    attend: (id: string) => requests.post<void>(`/Activities/attend/${id}`, {})
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const agent = {
    Activities,
    Account
}

export default agent;