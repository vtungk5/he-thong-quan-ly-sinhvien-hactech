import React from 'react';

import 'simplebar-react/dist/simplebar.min.css';


const HomePage: React.FC = () => {

  return (
    <>
      <div className='px-6 pt-6 pb-[17rem]'>
        <div className='py-4 px-6 rounded-xl bg-[#ce1628] '>
          <div className='font-medium text-lg lg:mb-0 mb-4 text-white'>
            Chương trình đào tạo
          </div>
        
        </div>
        <div className='mt-4 justify-between flex items-center'>
          <div className="font-semibold text-lg ">Thông tin sinh viên</div>
          <button className='bg-[#ce1628] rounded-lg text-white text-[13px] font-medium px-3 py-2'><i className="fa-solid fa-pen-to-square text-sm mr-1"></i> Cập nhập thông tin </button>
        </div>

      </div>
    </>
  );
};
export default HomePage;