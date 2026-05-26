import { Link, useLocation, useNavigate } from "react-router-dom";
import { HomeOutlined, ShoppingCartOutlined, UserOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux"; 
import { setAuthData } from "../../redux/authSlice"; 

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const logout = () => {
        localStorage.removeItem("access_token");
        
        dispatch(setAuthData({
            isAuthenticated: false,
            user: { email: "", name: "", role: "", avatar: "" }
        }));
        
        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b w-full">
            <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                
                {/* LEFT SECTION */}
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
                        
                        {/* Quyền điều hướng riêng của tài khoản Admin */}
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

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-5">
                    {/* 🔥 THÊM MỚI: Icon Giỏ hàng thần thánh kết nối trực tiếp đến trang /cart */}
                    <Link 
                        to="/cart" 
                        className={`flex items-center gap-1.5 font-medium transition hover:text-blue-600 ${isActive("/cart") ? "text-blue-600" : "text-gray-700"}`}
                    >
                        <ShoppingCartOutlined className="text-xl" />
                        <span className="hidden sm:block">Giỏ hàng</span>
                    </Link>

                    {auth?.isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            {/* Link dẫn vào xem hồ sơ và lịch sử đơn hàng */}
                            <Link to="/profile" className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600">
                                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                    <UserOutlined />
                                </div>
                                <span className="hidden md:block font-semibold">{auth?.user?.name}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition cursor-pointer text-sm shadow-sm"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm text-sm">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;