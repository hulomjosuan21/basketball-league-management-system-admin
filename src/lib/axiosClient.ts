import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'
dotenv.config()

class AxiosClient {
    private _client: AxiosInstance

    constructor() {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
        this._client = axios.create({
            baseURL,
            timeout: 5 * 1000,
            timeoutErrorMessage: 'Request timed out',
            withCredentials: true,
        })

        this._client.interceptors.request.use((config) => {
            console.log('[Request]', {
                url: config.url,
                method: config.method,
                data: config.data,
                headers: config.headers,
                withCredentials: config.withCredentials,
            })
            return config
        })

        this._client.interceptors.response.use(
            (response) => {
                console.log('[Response]', {
                    url: response.config.url,
                    status: response.status,
                    data: response.data,
                })
                return response
            },
            (error) => {
                console.error('[Error]', error)
                return Promise.reject(error)
            }
        )
    }

    get client(): AxiosInstance {
        return this._client
    }

    get baseUrl(): string {
        return this._client.defaults.baseURL || ''
    }
}

export default new AxiosClient()
