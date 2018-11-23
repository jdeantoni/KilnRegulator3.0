const initialState = {
    selectedProgram: -1,
    programs: [
        {id: 1, name: "Poterie", segments: [{target: 573, slope: 0.027777}, {target: 1200, duration: 7200}, {target: 50, slope: -0.027777}, {}]},
        {id: 2, name: "Email cuit", segments: [{target: 1100, duration: 14400}, {target: 1000, duration: 7200}, {}]},
        {id: 3, name: "Email non cuit", segments: [{target: 1100, duration: 14400}, {target: 1000, duration: 3600}, {}]},
        {id: 4, name: "Verre", segments: [{target: 1100, duration: 14400}, {target: 1000, duration: 9000}, {}]},
        {id: 5, name: "Engobe", segments: [{target: 1100, duration: 14400}, {target: 1000, duration: 7200}, {}]},
        {id: 6, name: "Cookie", segments: [{target: 130, duration: 3600}, {}]}
    ]
};

function togglePrograms(state = initialState, action) {
    let nextState;
    switch(action.type) {
        case "SELECT_PROGRAM":
            if (action.value === state.selectedProgram) {
                nextState = {
                    ...state, selectedProgram: -1
                }
            } else {
                nextState = {
                    ...state, selectedProgram: action.value
                }
            }
            return nextState || state;
        case "EDIT_PROGRAM":
            nextState = { ...state };
            nextState.programs[action.value.id-1] = action.value;
            nextState.selectedProgram = action.value.id;
            return nextState;
        default:
            return state;
    }
}

export default togglePrograms;