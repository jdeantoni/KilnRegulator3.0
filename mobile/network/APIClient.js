import { ActionApi, CookingsApi, DebugApi, ErrorsApi, ProgramsApi, StatusApi, ApiClient } from './jsclient';

class APIClient extends ApiClient {
    constructor(address) {
        super();
        this.setAddress(address);
    }

    callApi(path, httpMethod, pathParams, queryParams, collectionQueryParams, headerParams, formParams,
            bodyParam, authNames, contentTypes, accepts, returnType, callback) {
        return fetch(this.buildUrl(path, pathParams),
            {
                method: httpMethod,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: bodyParam === null ? null : JSON.stringify(bodyParam)
            });
    }
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
