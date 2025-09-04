import React from "react";

const Fogotpassword = () => {
  return (
    <section className="bg-gray-100">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="mb-4">
          <div className="flex items-center justify-center mb-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-400 relative">
              <span className="text-black font-bold">1</span>
            </div>
            <div className="w-60 h-px bg-gray-300 mx-2"></div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 relative">
              <span className="text-black font-bold">2</span>
            </div>
          </div>
          <span className="mt-1 mr-36 text-gray-600">1.Xác nhận tài khoản</span>
          <span className="mt-1 text-gray-600">2.Đặt lại mật khẩu</span>
        </div>

        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-50 dark:border-gray-100 sm:p-8 text-black">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-800">
            Thay đổi mật khẩu
          </h2>
          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
            <div>
              <label
                htmlFor="token"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Hãy nhập email của bạn *
              </label>
              <input
                type="token"
                name="token"
                id="token"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Nhập Email"
                required
              />
            </div>
            <div className="flex items-start pb-2">
              <div className="flex items-center h-5">
                <input
                  id="newsletter"
                  aria-describedby="newsletter"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="newsletter"
                  className="font-light text-gray-800 dark:text-gray-300"
                >
                  Tôi đã đọc và đồng ý mọi{" "}
                  <a
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    href="#"
                  >
                    Điều khoản dịch vụ
                  </a>
                </label>
              </div>
            </div>
            <a href="/resetpassword/fogotpassword">
              <button
                type="submit"
                className="w-full text-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#002D74] dark:hover:bg-blue-600 dark:focus:ring-primary-800"
              >
                Gửi mã xác thực
              </button>
            </a>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Fogotpassword;
