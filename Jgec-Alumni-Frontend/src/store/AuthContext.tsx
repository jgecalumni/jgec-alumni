"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useLoginMutation, useLogoutMutation } from "./baseApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface User {
	email: string;
	exp: number;
	iat: number;
	name: string;
	userId: number;
	userPhoto: string;
}

interface AuthContextType {
	token: string | null;
	user: User | null;
	loading: boolean;
	setToken: (token: string | null) => void;
	handleLogin: (values: ILoginType, setSubmitting: any) => void;
	handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [login, { isError: isLoginError, error: loginError }] =
		useLoginMutation();
	const [loading, setLoading] = useState<boolean>(false);
	const [logout] = useLogoutMutation();

	const router = useRouter();

	const decodeToken = (token: string | null): User | null => {
		if (!token) return null;
		try {
			return jwtDecode<User>(token);
		} catch (error) {
			console.error("Invalid token:", error);
			return null;
		}
		setLoading(false);
	};

	useEffect(() => {
		setLoading(true);	
		const storedToken = localStorage.getItem("token") || null;
		setToken(storedToken);
		setUser(decodeToken(storedToken));
	}, []);

	useEffect(() => {
		if (isLoginError) {
			toast.error((loginError as any)?.data?.message || "User login failed");
		}
	}, [isLoginError, loginError]);

	const handleLogin = async (values: ILoginType, setSubmitting: any) => {
		const res = await login(values);
		if (res?.data?.success) {
			toast.success("Logged in successfully");
			router.push("/");

			const accessToken = res.data.accessToken;
			localStorage.setItem("token", accessToken);
			setToken(accessToken);
			setUser(decodeToken(accessToken));
		}
		return setSubmitting(false);
	};

	const handleLogout = async () => {
		const res = await logout();
		if (res?.data?.success) {
			toast.success("Logout successful");
			setToken("");
			localStorage.removeItem("token");
			Cookies.remove("token");
			setUser(null);
			router.push("/login")
		}
	};

	return (
		<AuthContext.Provider
			value={{ token, user, setToken, handleLogin, handleLogout, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

// Custom hook to use auth context
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
