import { ActionApi, DebugApi, StatusApi, ApiClient } from './jsclient';

class APIClient extends ApiClient {
    callApi(path, httpMethod, pathParams, queryParams, collectionQueryParams, headerParams, formParams,
            bodyParam, authNames, contentTypes, accepts, returnType, callback) {
        return fetch(`${this.basePath}${path}`,
            {
                method: httpMethod
            });
    }
}

class ActionAPI extends ActionApi {
    constructor() {
        super(new APIClient());
    }
}

class DebugAPI extends DebugApi {
    constructor() {
        super(new APIClient());
    }
}

class StatusAPI extends StatusApi {
    constructor() {
        super(new APIClient());
    }
}

export {
    ActionAPI,
    DebugAPI,
    StatusAPI
}