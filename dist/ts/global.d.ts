/// <reference types="node" />
import * as http from "http";
import { ErrorHandler } from "./models";
import { ViewEngine, XmlParser } from "./abstracts";
import { EtagOption, FolderMap } from "./types";
import { GenericSessionProvider, GenericWall } from "./generics";
export declare class Global {
    static request: http.IncomingMessage;
    static response: http.ServerResponse;
    static port: number;
    static viewPath: string;
    static shouldParseCookie: boolean;
    static shouldParsePost: boolean;
    static sessionProvider: typeof GenericSessionProvider;
    static sessionTimeOut?: number;
    static viewEngine: ViewEngine;
    static walls: Array<typeof GenericWall>;
    static errorHandler: typeof ErrorHandler;
    static defaultPath?: string;
    static connectonKeepAliveTimeout?: number;
    static appName?: string;
    static eTag?: EtagOption;
    static folders?: FolderMap[];
    static appSessionIdentifier: string;
    static xmlParser: typeof XmlParser;
}
