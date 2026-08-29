"use client"

import Image from 'next/image'
import React from 'react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const Testimonials = () => {
    return (
        <div className=" flex gap-8 flex-col items-center py-16 bg-neutral-50 pb-24 w-full">
            <div className="flex flex-col items-center w-full ">
                <div className="md:text-4xl sm:text-3xl text-2xl text-center font-medium">
                    Insights from Our Honored Alumni
                </div>
                <div className="w-[15%] my-2 border-2 rounded-full border-primary"></div>
            </div>
            <div className="w-full max-w-screen-max_screen mx-auto px-4 md:px-10 h-auto">
                <Swiper
                    pagination={{
                        clickable: false,
                    }}
                    slidesPerView={1}
                    spaceBetween={10}
                    breakpoints={{
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 16,
                        },
                    }}
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: true,
                    }}
                    modules={[Pagination, Autoplay]}
                    className="mySwiper px-2"
                >
                    {[0, 1, 2, 3, 4, 5, 6].map(ele => (
                        <SwiperSlide key={ele}>
                            <div className="h-60 mb-20 group hover:scale-105 duration-200 bg-white shadow-md rounded-md relative w-full max-w-sm mx-auto mt-20">
                                <div className="h-full w-full flex justify-center absolute -top-[3em]">
                                    <div className="w-28 group-hover:border-2 duration-200  group-hover:border-primary/40 h-28 rounded-full">
                                        <Image
                                            loading="lazy"
                                            src="https://codeboxr.net/themedemo/unialumni/html/assets/images/testimonial/testi-3.png"
                                            className="h-full w-full object-cover rounded-full"
                                            alt="person photo"
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                </div>
                                <div className="flex text-sm text-neutral-950 pt-20 px-4 justify-end items-end  mb-16">
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni
                                    rerum nihil totam nobis qui molestiae modi quae neque ut non
                                    animi accusantium harum dolores officia enim quidem dicta,
                                    laboriosam ipsa?
                                </div>
                                <div className="h-12 flex justify-end w-full -bottom-6 absolute rotate-0">
                                    <div className="bg-primary/30 h-full rounded-md w-72 text-sm text-neutral-950 flex items-center justify-center p-2 gap-1">
                                        <p>~  Jyotirmoy Jhampati, 2002 Batch</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper> 
            </div>
        </div>
    )
}

export default Testimonials
