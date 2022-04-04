export const loginDetailsReducer = (state = { loading: false }, action) => {
	switch (action.type) {
		case "SET_LOGIN_DETAILS":
			return action.payload;
		case "SET_LOGIN_LOADING":
			return {
				...state,
				loading: action.payload,
			};
		default:
			return state;
	}
};
