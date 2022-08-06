import axios from "axios";
const instance = axios.create({ baseURL: "http://LOCALHOST:2305" });
export default instance;
