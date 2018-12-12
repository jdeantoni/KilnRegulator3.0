import {
    ADD_PROGRAM,
    CLEAN_PROGRAMS,
    DELETE_PROGRAM,
    NO_PROG_SELECTED,
    SELECT_PROGRAM,
    UPDATE_PROGRAMS
} from "../../helpers/Constants";

const initialState = {
    selectedProgram: NO_PROG_SELECTED,
    programs: []
};

function togglePrograms(state = initialState, action) {
    let nextState;
    switch(action.type) {
        case SELECT_PROGRAM:
            nextState = {
                ...state,
                selectedProgram: (action.value === state.selectedProgram) ? NO_PROG_SELECTED : action.value
            };
            return nextState || state;

        case ADD_PROGRAM:
            nextState = {
                programs: state.programs.concat(action.value),
                selectedProgram: action.value.uuid
            };
            return nextState;

        case DELETE_PROGRAM:
            let newArray = state.programs.slice();
            for (let i in newArray) {
                if (newArray[parseInt(i)].uuid === action.value) {
                    newArray.splice(parseInt(i), 1);
                    break;
                }
            }
            nextState = {
                ...state,
                programs: newArray
            };
            return nextState;

        case UPDATE_PROGRAMS:
            nextState = {
                ...state,
                programs: action.value
            };
            return nextState;

        case CLEAN_PROGRAMS:
            return initialState;

        default:
            return state;
    }
}

export default togglePrograms;
