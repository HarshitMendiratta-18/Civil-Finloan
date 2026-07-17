import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialToken = localStorage.getItem("token") || null;
const initialUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const initialState = {
    user: initialUser,
    token: initialToken,
    services: []
};

const reducer = (state, action) => {
    switch (action.type) {
        case "Login":
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            return { ...state, user: action.payload.user, token: action.payload.token }
        case "Logout":
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return { ...state, user: null, token: null }
        case "Service":
            return { ...state, services: action.payload.services }
        default:
            return state;
    }
};

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const setLogin = ({ user, token }) => {
        dispatch({ type: "Login", payload: { user, token } });
    }
    const setLogout = () => {
        dispatch({ type: "Logout" });
    }

    const setServices = (services) => {
        dispatch({ type: "Service", payload: { services } });
    }

    return (
        <AuthContext.Provider value={{ state, setLogin, setLogout, setServices }}>
            {children}
        </AuthContext.Provider>
    );
}
