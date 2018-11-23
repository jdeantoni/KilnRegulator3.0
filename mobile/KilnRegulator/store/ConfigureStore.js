import { createStore } from "redux";
import togglePrograms from "./reducers/ProgramReducer";

export default createStore(togglePrograms);