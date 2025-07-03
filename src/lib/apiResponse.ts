export class ApiResponse<T> {
    status: boolean;
    message: string;
    redirect?: string;
    payload?: T;

    constructor(params: {
        status: boolean;
        message: string;
        redirect?: string;
        payload?: T;
    }) {
        this.status = params.status;
        this.message = params.message;
        this.redirect = params.redirect;
        this.payload = params.payload;
    }

    static fromJson<T>(
        json: any,
        fromJsonT?: (json: any) => T
    ): ApiResponse<T> {
        return new ApiResponse<T>({
            status: json.status ?? false,
            message: json.message ?? '',
            redirect: json.redirect,
            payload: json.payload
                ? fromJsonT
                    ? fromJsonT(json.payload)
                    : (json.payload as T)
                : undefined,
        });
    }

    static fromJsonNoPayload<T>(json: any): ApiResponse<T> {
        return new ApiResponse<T>({
            status: json.status ?? false,
            message: json.message ?? '',
            redirect: json.redirect,
            payload: undefined, // No payload at all
        });
    }
}
