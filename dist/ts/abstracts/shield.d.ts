import { HttpRequest, HttpResponse, HttpResult } from "../types";
import { CookieManager } from "../models";
import { SessionProvider, Controller } from ".";
export declare abstract class Shield implements Controller {
    request: HttpRequest;
    response: HttpResponse;
    query: {
        [key: string]: string;
    };
    session: SessionProvider;
    cookie: CookieManager;
    data: {
        [key: string]: any;
    };
    abstract protect(): Promise<HttpResult>;
}
