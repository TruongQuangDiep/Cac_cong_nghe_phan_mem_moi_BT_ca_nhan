import {
    Swiper,
    SwiperSlide
}
from "swiper/react";

import {
    Navigation,
    Pagination,
    Autoplay
}
from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL;

const ProductSwiper = ({ images }) => {

    return (

        <div
            className="
                rounded-3xl
                overflow-hidden
                shadow-2xl
                bg-white
            "
        >

            <Swiper
                modules={[
                    Navigation,
                    Pagination,
                    Autoplay
                ]}
                navigation
                pagination={{
                    clickable: true
                }}
                autoplay={{
                    delay: 3000
                }}
                loop={true}
                spaceBetween={20}
                slidesPerView={1}
            >

                {images?.map((item, index) => (

                    <SwiperSlide key={index}>

                        <div
                            className="
                                overflow-hidden
                                bg-gray-100
                            "
                        >

                            <img
                                src={
                                    item.startsWith("http")
                                        ? item
                                        : `${BACKEND_URL}${item}`
                                }
                                alt=""
                                className="
                                    w-full
                                    h-[300px]
                                    md:h-[500px]
                                    object-cover
                                    hover:scale-105
                                    transition-transform
                                    duration-500
                                "
                            />

                        </div>

                    </SwiperSlide>

                ))}

            </Swiper>

        </div>
    );
};

export default ProductSwiper;