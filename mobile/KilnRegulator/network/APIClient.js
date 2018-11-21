import { ActionApi, DebugApi, StatusApi, ApiClient } from './jsclient';

class APIClient extends ApiClient {
    constructor(address) {
        super();
        this.setAddress(address);
    }

    callApi(path, httpMethod, pathParams, queryParams, collectionQueryParams, headerParams, formParams,
            bodyParam, authNames, contentTypes, accepts, returnType, callback) {
        return fetch(`${this.basePath}${path}`,
            {
                method: httpMethod
            });
    }
}

class ActionAPI extends ActionApi {
    constructor(address) {
        super(new APIClient(address));
    }
}

class DebugAPI extends DebugApi {
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
    StatusAPI
}