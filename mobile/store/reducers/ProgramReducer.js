const initialState = {
    selectedProgram: "",
    programs: {}
    /*{id: 1, name: "Poterie", segments: [{target: 573, slope: 0.027777}, {target: 1200, duration: 7200}, {target: 50, slope: -0.027777}, {}]},
    {id: 2, name: "Email cuit", segments: [{target: 1100, duration: 14400}, {target: 1000, duration: 7200}, {}]},
    {id: 3, name: "Email non cuit", segments: [{target: 1100, duration: 14400}, {target: 1000, duration: 3600}, {}]},
    {id: 4, name: "Verre", segments: [{target: 1100, duration: 14400}, {target: 1000, duration: 9000}, {}]},
    {id: 5, name: "Engobe", segments: [{target: 1100, duration: 14400}, {target: 1000, duration: 7200}, {}]},
    {id: 6, name: "Cookie", segments: [{target: 130, duration: 3600}, {}]}*/
};

function togglePrograms(state = initialState, action) {
    let nextState;
    switch(action.type) {
        case "SELECT_PROGRAM":
            nextState = {
                ...state,
                selectedProgram: (action.value === state.selectedProgram) ? "" : action.value
            };
            return nextState || state;

        case "ADD_PROGRAM":
            nextState = {
                ...state,
                selectedProgram: action.value.uuid
            };
            nextState.programs[action.value.uuid] = action.value;
            return nextState;

        case "DELETE_PROGRAM":
            nextState = { ...state };
            delete nextState.programs[action.value];
            return nextState;

        case "UPDATE_PROGRAMS":
            nextState = { ...state };
            for (let i = 0; i < action.value.length; i++) {
                nextState.programs[action.value[i].uuid] = action.value[i];
            }
            return nextState;

        default:
            return state;
    }
}

export default togglePrograms;