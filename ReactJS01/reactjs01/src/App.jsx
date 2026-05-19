import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";

function App() {
    const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

    useEffect(() => {
        const fetchAccount = async () => {
            setAppLoading(true);
            const res = await axios.get(`/v1/api/account`);
            if (res && !res.message) {
                setAuth({
                    isAuthenticated: true,
                    user: {
                        email: res.email,
                        name: res.name,
                        role: res.role,
                        avatar: res.avatar
                    }
                });
            }
            setAppLoading(false);
        };
        fetchAccount();
    }, []);

    if (appLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        // Đã gỡ bỏ inline style, chỉ xài Tailwind cơ bản
        <div className="min-h-screen w-full bg-gray-100 flex flex-col overflow-x-hidden">
            <Header />
            
            {/* THÊM pt-16 vào đây để nội dung không bị header che mất */}
            <main className="w-full flex-grow pt-16">
                <Outlet />
            </main>
        </div>
    );
}

export default App;