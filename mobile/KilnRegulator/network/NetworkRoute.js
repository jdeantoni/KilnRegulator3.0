export default class NetworkRoute {
    static myInstance = null;
    address = "";

    static getInstance() {
        if (NetworkRoute.myInstance == null) {
            NetworkRoute.myInstance = new NetworkRoute();
        }

        return this.myInstance;
    }

    getAddress() {
        return this.address;
    }

    setAddress(address) {
        this.address = address;
    }
}