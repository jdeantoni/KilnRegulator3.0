import {ADD_PROGRAM, DELETE_PROGRAM, NO_PROG_SELECTED, SELECT_PROGRAM, UPDATE_PROGRAMS} from "../../helpers/Constants";

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
                ...state,
                selectedProgram: action.value.uuid
            };
            nextState.programs.push(action.value);
            return nextState;

        case DELETE_PROGRAM:
            nextState = { ...state };
            for (let i in nextState.programs) {
                if (nextState.programs[i].uuid === action.value) {
                    delete nextState.programs[i];
                }
            }
            return nextState;

        case UPDATE_PROGRAMS:
            nextState = {
                ...state,
                programs: action.value
            };
            return nextState;

        default:
            return state;
    }
}

export default togglePrograms;
