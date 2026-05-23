import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { useEffect, useState } from "react"; 
import { useDispatch } from "react-redux"; 
import { setAuthData } from "./redux/authSlice"; 

function App() {
    
    const dispatch = useDispatch();
    const [appLoading, setAppLoading] = useState(true);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const res = await axios.get(`/v1/api/account`);

                if (res && !res.message) {
                    dispatch(setAuthData({
                        isAuthenticated: true,
                        user: {
                            email: res.email,
                            name: res.name,
                            role: res.role,
                            avatar: res.avatar
                        }
                    }));
                }
            } catch (error) {
                console.log("Lỗi tự động đăng nhập ngầm:", error);
            } finally {
                setAppLoading(false);
            }
        };
        
        fetchAccount();
    }, [dispatch]);

    if (appLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col overflow-x-hidden">
            <Header />
            <main className="w-full flex-grow pt-16">
                <Outlet />
            </main>
        </div>
    );
}

export default App;