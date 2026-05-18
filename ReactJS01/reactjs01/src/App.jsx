import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";

function App() {

    const {
        setAuth,
        appLoading,
        setAppLoading
    } = useContext(AuthContext);

    useEffect(() => {

        const fetchAccount = async () => {

            setAppLoading(true);

            const res = await axios.get(
                `/v1/api/account`
            );

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

            <div
                className="
                    h-screen
                    flex
                    items-center
                    justify-center
                    bg-gray-100
                "
            >

                <div
                    className="
                        w-16
                        h-16
                        border-4
                        border-blue-500
                        border-t-transparent
                        rounded-full
                        animate-spin
                    "
                />

            </div>
        );
    }

    return (

        <div className="min-h-screen w-full bg-gray-100">

            <Header />

            <main
                className="
                    w-full
                    px-4
                    sm:px-6
                    lg:px-8
                    py-4
                "
            >
                <Outlet />
            </main>

        </div>
    );
}

export default App;