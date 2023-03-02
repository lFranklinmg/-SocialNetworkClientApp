import axios, { AxiosError, AxiosResponse } from 'axios';
import { Console } from 'console';
import { toast } from 'react-toastify';
import { Activity } from '../models/activity';
import { router } from '../router/Routes';
import { store } from '../stores/store';

const sleep = (delay: number) =>{
    return new Promise((resolve) =>{
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'https://localhost:7175/';

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


const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get:    <T> (url: string)           => axios.get<T>(url).then(responseBody),
    post:   <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put:    <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url: string)           => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: () => requests.get<Activity[]>('/Activities'),
    details: (id: string) => requests.get<Activity>(`/Activities/${id}`),
    create: (activity: Activity) => requests.post<void>('/Activities', activity),
    update: (activity: Activity) => requests.put<void>(`/Activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/Activities/${id}`)

}

const agent = {
    Activities
}

export default agent;