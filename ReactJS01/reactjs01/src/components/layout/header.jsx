import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HomeOutlined, ShoppingCartOutlined, UserOutlined, AppstoreOutlined } from "@ant-design/icons";
import { AuthContext } from "../context/auth.context";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const logout = () => {
        localStorage.removeItem("access_token");
        setAuth({
            isAuthenticated: false,
            user: { email: "", name: "", role: "", avatar: "" }
        });
        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b w-full">
            {/* THÊM CONTAINER Ở ĐÂY: Giới hạn độ rộng và căn giữa nội dung Header */}
            <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                
                {/* LEFT */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        DShop
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 font-medium transition hover:text-blue-600 ${isActive("/") ? "text-blue-600" : "text-gray-700"}`}
                        >
                            <HomeOutlined /> Home
                        </Link>
                        {auth?.user?.role === "Admin" && (
                            <>
                                <Link
                                    to="/admin/products"
                                    className={`flex items-center gap-2 font-medium transition hover:text-blue-600 ${isActive("/admin/products") ? "text-blue-600" : "text-gray-700"}`}
                                >
                                    <ShoppingCartOutlined /> Products
                                </Link>
                                <Link
                                    to="/admin/categories"
                                    className={`flex items-center gap-2 font-medium transition hover:text-blue-600 ${isActive("/admin/categories") ? "text-blue-600" : "text-gray-700"}`}
                                >
                                    <AppstoreOutlined /> Categories
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                    {auth?.isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link to="/profile" className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600">
                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <UserOutlined />
                                </div>
                                <span className="hidden md:block">{auth?.user?.name}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;