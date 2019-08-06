import { ActionApi, CookingsApi, DebugApi, ErrorsApi, ProgramsApi, StatusApi, ApiClient } from './jsclient';

class APIClient extends ApiClient {
    constructor(address) {
        super();
        this.basePath = ('http://'+address).replace(/\/+$/, '');
    }

    callApi(path, httpMethod, pathParams, queryParams, collectionQueryParams, headerParams, formParams,
            bodyParam, authNames, contentTypes, accepts, returnType, callback) {
        return fetch(this.buildUrlForCall(path, pathParams, queryParams),
            {
                method: httpMethod,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: bodyParam === null ? null : JSON.stringify(bodyParam),
            });
    }

    buildUrlForCall(path, pathParams, queryParams) {
        if (!path.match(/^\//)) {
            path = '/' + path;
        }
        let url = this.basePath + path;
        let _this = this;
        url = url.replace(/\{([\w-]+)\}/g, function(fullMatch, key) {
            let value;
            if (pathParams.hasOwnProperty(key)) {
                value = _this.paramToString(pathParams[key]);
            } else {
                value = fullMatch;
            }
            return encodeURIComponent(value);
        });
        return url;
    };
}

class ActionAPI extends ActionApi {
    constructor(address) {
        super(new APIClient(address));
    }
}

class CookingsAPI extends CookingsApi {
    constructor(address) {
        super(new APIClient(address));
    }
}

class DebugAPI extends DebugApi {
    constructor(address) {
        super(new APIClient(address));
    }
}

class ErrorsAPI extends ErrorsApi {
    constructor(address) {
        super(new APIClient(address));
    }
}

class ProgramsAPI extends ProgramsApi {
    constructor(address) {
        super(new APIClient(address));
    }
}

class StatusAPI extends StatusApi {
    constructor(address) {
        super(new APIClient(address));
    }
}

export {
    ActionAPI,
    DebugAPI,
    CookingsAPI,
    ErrorsAPI,
    ProgramsAPI,
    StatusAPI
}
