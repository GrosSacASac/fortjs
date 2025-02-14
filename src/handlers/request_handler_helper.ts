import { HTTP_STATUS_CODE, MIME_TYPE, HTTP_METHOD } from "../enums";
import * as http from "http";
import { __ContentType } from "../constant";
import { Global } from "../global";
import * as Negotiator from "negotiator";
import { CookieManager } from "../models";
import { Wall } from "../abstracts";
import { IException } from "../interfaces";
import { Util } from "../util";
import { JsonHelper } from "../helpers";


export class RequestHandlerHelper {
    protected cookieManager: CookieManager;
    protected response: http.ServerResponse;
    protected request: http.IncomingMessage;

    protected wallInstances: Wall[] = [];

    protected isNullOrEmpty(value) {
        return Util.isNullOrEmpty(value);
    }

    protected async runWallOutgoing() {
        return Promise.all(this.wallInstances.reverse().map(function (wallObj) {
            if (wallObj.onOutgoing != null) {
                return wallObj.onOutgoing();
            }
        }));
    }

    protected getContentTypeFromNegotiation(type: MIME_TYPE) {
        const negotiator = new Negotiator(this.request);
        let availableTypes: MIME_TYPE[] = this.getAvailableTypes_(type);
        if (availableTypes == null) {
            availableTypes = [type];
        }
        return negotiator.mediaType(availableTypes) as MIME_TYPE;
    }

    protected getContentTypeFromNegotiationHavingMultipleTypes(types: MIME_TYPE[]) {
        const negotiator = new Negotiator(this.request);
        return negotiator.mediaType(types) as MIME_TYPE;
    }

    private getAvailableTypes_(type: MIME_TYPE) {
        switch (type) {
            case MIME_TYPE.Json:
            case MIME_TYPE.Xml:
                return [MIME_TYPE.Json, MIME_TYPE.Xml];
            case MIME_TYPE.Html:
            case MIME_TYPE.Css:
            case MIME_TYPE.Csv:
            case MIME_TYPE.Js:
            case MIME_TYPE.Rtf:
            case MIME_TYPE.Text:
                return [MIME_TYPE.Text, MIME_TYPE.Html, MIME_TYPE.Js,
                MIME_TYPE.Css, MIME_TYPE.Rtf, MIME_TYPE.Csv];
        }
        return null;
    }

    private onExceptionOccured_(ex) {
        this.response.writeHead(HTTP_STATUS_CODE.InternalServerError, { [__ContentType]: MIME_TYPE.Html });
        this.response.end(JsonHelper.stringify(ex));
    }

    protected async onBadRequest(error) {
        let errMessage;
        try {
            errMessage = await new Global.errorHandler().onBadRequest(error);
        }
        catch (ex) {
            return this.onExceptionOccured_(ex);
        }
        this.response.writeHead(HTTP_STATUS_CODE.BadRequest, { [__ContentType]: MIME_TYPE.Html });
        this.response.end(errMessage);
    }

    protected async onForbiddenRequest() {
        let errMessage;
        try {
            errMessage = await new Global.errorHandler().onForbiddenRequest();
        }
        catch (ex) {
            return this.onExceptionOccured_(ex);
        }
        this.response.writeHead(HTTP_STATUS_CODE.Forbidden, { [__ContentType]: MIME_TYPE.Html });
        this.response.end(errMessage);
    }

    protected async onNotAcceptableRequest() {
        let errMessage;
        try {
            errMessage = await new Global.errorHandler().onNotAcceptableRequest();
        }
        catch (ex) {
            return this.response.end(JsonHelper.stringify(ex));
        }
        this.response.writeHead(HTTP_STATUS_CODE.NotAcceptable, { [__ContentType]: MIME_TYPE.Html });
        this.response.end(errMessage);
    }

    protected async onNotFound() {
        let errMessage;
        try {
            errMessage = await new Global.errorHandler().onNotFound(this.request.url);
        }
        catch (ex) {
            return this.onExceptionOccured_(ex);
        }
        this.response.writeHead(HTTP_STATUS_CODE.NotFound, { [__ContentType]: MIME_TYPE.Html });
        this.response.end(errMessage);
    }

    protected async onMethodNotAllowed(allowedMethods: HTTP_METHOD[]) {
        let errMessage;
        try {
            errMessage = await new Global.errorHandler().onMethodNotAllowed();

        }
        catch (ex) {
            return this.onExceptionOccured_(ex);
        }
        this.response.setHeader("Allow", allowedMethods.join(","));
        this.response.writeHead(HTTP_STATUS_CODE.MethodNotAllowed, { [__ContentType]: MIME_TYPE.Html });
        this.response.end(errMessage);
    }

    protected async onErrorOccured(error) {
        if (typeof error === 'string') {
            error = {
                message: error
            } as IException;
        }
        let errMessage;
        try {
            errMessage = await new Global.errorHandler().onServerError(error);
        }
        catch (ex) {
            return this.onExceptionOccured_(ex);
        }
        this.response.writeHead(HTTP_STATUS_CODE.InternalServerError, { [__ContentType]: MIME_TYPE.Html });
        this.response.end(errMessage);
    }
}