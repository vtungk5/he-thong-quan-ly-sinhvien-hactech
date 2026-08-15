import React, { useEffect, useState } from 'react';
import Image from "next/image";
import 'simplebar-react/dist/simplebar.min.css';
import { useAuthContext } from "@/context/AuthContext";
import axiosInstance, { API_ENDPOINTS } from "@/utils/axios";
import Cookies from "js-cookie";

// --- Định nghĩa các Interface để thay thế 'any' ---
interface ScoreSubject {
  paidFeeState?: {
    theory?: { needed: boolean; feeType?: string };
    practice?: { needed: boolean; feeType?: string };
  };
  historyPaidfees?: Array<{ total?: number }>;
  score?: { avgSubjectScore?: number };
  theoretical_value?: number;
  practical_value?: number;
}

interface SemesterData {
  data: ScoreSubject[];
}

interface ScoresResponse {
  currentSemesterIndex?: number;
  subjectsStudyAgain?: {
    data: ScoreSubject[];
  };
  data?: Record<number, SemesterData>;
}

const HomePage: React.FC = () => {
  const { user } = useAuthContext();
  const [scoresData, setScores] = useState<ScoresResponse | null>(null);
  const [studyAgainCount, setStudyAgainCount] = useState(0);
  const [retestCount, setRetestCount] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [currentGPA, setCurrentGPA] = useState(0);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const toRoman = (num: number | string | undefined): string => {
    const n = Number(num);
    if (!n || isNaN(n)) return 'I';
    const romanMap: { [key: number]: string } = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
      6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X'
    };
    return romanMap[n] || n.toString();
  };

  const convertTo4 = (score: number): number => {
    if (score >= 8.5) return 4.0;
    if (score >= 8.0) return 3.5;
    if (score >= 7.0) return 3.0;
    if (score >= 6.5) return 2.5;
    if (score >= 5.5) return 2.0;
    if (score >= 5.0) return 1.5;
    if (score >= 4.0) return 1.0;
    return 0;
  };

  useEffect(() => {
    const fetchScores = async () => {
      const studentId = Cookies.get("student_id");
      if (!studentId) return;
      const ctrl = new AbortController();
      try {
        const scoresEndpoint = typeof API_ENDPOINTS.scores === 'function'
          ? API_ENDPOINTS.scores(studentId)
          : API_ENDPOINTS.scores;
        
        const response = await axiosInstance.get(scoresEndpoint, {
          signal: ctrl.signal,
        });
        
        const data: ScoresResponse = response.data;
        setScores(data);

        // ==== TÍNH TOÁN NỢ, HỌC LẠI, THI LẠI ====
        if (data?.subjectsStudyAgain?.data) {
          let studyAgain = 0;
          let retest = 0;
          let debt = 0;
          data.subjectsStudyAgain.data.forEach((item) => {
            const theory = item.paidFeeState?.theory;
            const practice = item.paidFeeState?.practice;

            let isStudyAgain = false;
            let isRetest = false;

            if (theory?.needed) {
              if (theory.feeType === "studyAgain") isStudyAgain = true;
              else if (theory.feeType === "retesting") isRetest = true;
              else isStudyAgain = true;
            }

            if (practice?.needed) {
              if (practice.feeType === "studyAgain") isStudyAgain = true;
              else if (practice.feeType === "retesting") isRetest = true;
              else isStudyAgain = true;
            }

            if (isStudyAgain) studyAgain++;
            if (!isStudyAgain && isRetest) retest++;

            if (item.historyPaidfees && item.historyPaidfees.length > 0) {
              item.historyPaidfees.forEach((fee) => {
                debt += fee.total || 0;
              });
            }
          });
          setStudyAgainCount(studyAgain);
          setRetestCount(retest);
          setTotalDebt(debt);
        }

        // ==== TÍNH GPA KỲ HIỆN TẠI ====
        const currentSemIndex = data?.currentSemesterIndex || 1;
        const currentSemData = data?.data?.[currentSemIndex]?.data || [];
        let totalPoints = 0;
        let totalCredits = 0;
        currentSemData.forEach((item) => {
          const score10 = item.score?.avgSubjectScore || 0;
          if (score10 > 0) {
            const credits = (item.theoretical_value || 0) + (item.practical_value || 0);
            const score4 = convertTo4(score10);
            totalPoints += score4 * credits;
            totalCredits += credits;
          }
        });
        const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
        setCurrentGPA(Number(gpa.toFixed(2)));

      } catch (error) {
        console.error("Lỗi khi lấy thông tin điểm:", error);
      }
    };
    fetchScores();
  }, []);

  return (
    <>
      <div className='px-6 pt-6 pb-[17rem]'>
        <div className='py-4 px-6 rounded-xl bg-[#ce1628] '>
          <div className='font-medium text-lg lg:mb-0 mb-4 text-white'>
            Thống kê sinh viên
          </div>
          <div className="grid lg:grid-cols-11 items-center gap-y-3 lg:gap-y-5">
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-8">
                <div className="text-white">
                  <div className="text-sm font-semibold text-[#ffd6da]">Học Kỳ</div>
                  <div className="mt-2 font-semibold">
                    {toRoman(scoresData?.currentSemesterIndex || user?.specifiedClass?.trainingPlan?.subjects?.reduce((max: number, s: { semester_index: number }) => Math.max(max, s.semester_index), 0) || '1')}
                  </div>
                </div>
                <div className="text-white">
                  <div className="text-sm font-semibold text-[#ffd6da]">Môn học lại</div>
                  <div className="mt-2 font-semibold">{studyAgainCount}</div>
                </div>
                <div className="text-white">
                  <div className="text-sm font-semibold text-[#ffd6da]">Môn thi lại</div>
                  <div className="mt-2 font-semibold">{retestCount}</div>
                </div>
                <div className="text-white">
                  <div className="text-sm font-semibold text-[#ffd6da]">Số tiền nợ</div>
                  <div className="mt-2 font-semibold">{totalDebt.toLocaleString('vi-VN')}₫</div>
                </div>
                <div className="text-white">
                  <div className="text-sm font-semibold text-[#ffd6da]">Hệ</div>
                  <div className="mt-2 font-semibold">
                    {user?.specifiedClass?.trainingPlan?.training_type === "NORMAL" ? "Đại trà" : "CLC"}
                  </div>
                </div>
                <div className="text-white">
                  <div className="text-sm font-semibold text-[#ffd6da]">Khoá</div>
                  <div className="mt-2 font-semibold">{user?.course?.name || "K64"}</div>
                </div>
                <div className="text-white">
                  <div className="text-sm font-semibold text-[#ffd6da]">GPA</div>
                  <div className="mt-2 font-semibold">{currentGPA} / 4.0 </div>
                </div>
                <div className="text-white">
                  <div className="text-sm font-semibold text-[#ffd6da]">Class</div>
                  <div className="mt-2 font-semibold text-sm">
                    {user?.specifiedClass?.code || "IT1012"}
                    {user?.specifiedClass?.trainingPlan?.subjects?.[0]?.institute?.code ? ` (${user?.specifiedClass?.trainingPlan?.subjects?.[0]?.institute?.code})` : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 ">
              <div className='bg-white py-2 px-3  rounded-t-md border-b-2 border-[#ce1628]'>
                <div className='font-medium'>Lịch học hôm nay</div>
                <p className='text-gray-500 text-xs'> (Thứ tư 13/05/2026 Tuần 43 )</p>
              </div>
              <div className='bg-white p-3  rounded-b-md space-y-1'>
                <div className='flex flex-wrap gap-1'>
                  <span className='bg-red-500 rounded-md px-1.5 py-0.5 text-white text-xs'>
                    {user?.specifiedClass?.trainingPlan?.subjects?.find((s: { code: string; name: string }) => s.code === 'LMH21')?.name || "Không xác định"}
                  </span>
                  <span className='bg-[#21bf86] rounded-md px-1.5 py-0.5 text-white text-xs'>Tiết 5</span>
                  <span className='bg-[#ff8831] rounded-md px-1.5 py-0.5 text-white text-xs'>13:15</span>
                  <span className='bg-[#43bc00] rounded-md px-1.5 py-0.5 text-white text-xs'>Thực hành</span>
                  <span className='bg-[#007cbc] rounded-md px-1.5 py-0.5 text-white text-xs'>Chính khóa</span>
                </div>
                <div className='text-gray-600 text-sm mt-1'>
                  {user?.specifiedClass?.trainingPlan?.subjects?.[0]?.institute?.name || "Khoa Công Nghệ Thông Tin"} - Phòng thực hành - 205
                </div>
                <div className='text-red-800 font-medium text-xs'>
                  Giảng viên: {user?.specifiedClass?.teacher_name || "Trần Viết Cường"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-4 justify-between flex items-center'>
          <div className="font-semibold text-lg ">Thông tin sinh viên</div>
          <button className='bg-[#ce1628] rounded-lg text-white text-[13px] font-medium px-3 py-2'><i className="fa-solid fa-pen-to-square text-sm mr-1"></i> Cập nhập thông tin </button>
        </div>
        <div className="grid mt-6 lg:grid-cols-8 gap-3">
          <div className='lg:col-span-1'>
            <div className='flex justify-start'>
              <Image alt='' src="https://marketplace.canva.com/PIJuQ/MAFOL3PIJuQ/1/tl/canva-male-avatar-profile-MAFOL3PIJuQ.png" width={50} height={50} className='rounded-lg !w-[120px] !h-[150px] bg-[#eee] px-3 pt-6' />
            </div>
          </div>
          <div className='lg:col-span-7'>
            <div className="grid grid-cols-3 xl:grid-cols-4 lg:grid-cols-3 gap-x-3 gap-y-5 lg:gap-y-10 mt-0 ">
              <div className='flex flex-col space-y-2 lg:col-span-1 col-span-3'>
                <div className="text-base font-semibold ">Họ và tên</div>
                <div className="mt-2 text-gray-700">{user?.firstname} {user?.lastname}</div>
              </div>
              <div className='flex flex-col space-y-2 '>
                <div className="text-base font-semibold ">Ngày sinh</div>
                <div className="mt-2 text-gray-700">{formatDate(user?.birthday)}</div>
              </div>
              <div className='flex flex-col space-y-2'>
                <div className="text-base font-semibold ">Nơi sinh</div>
                <div className="mt-2 text-gray-700">{user?.place_of_birth || "Chưa cập nhật"}</div>
              </div>
              <div className='flex flex-col space-y-2'>
                <div className="text-base font-semibold ">Số điện thoại</div>
                <div className="mt-2 text-gray-700">{user?.phone || "Chưa cập nhật"}</div>
              </div>
              <div className='flex flex-col space-y-2 lg:col-span-1 col-span-3'>
                <div className="text-base font-semibold ">Email Sinh viên</div>
                <div className="mt-2 text-gray-700">{user?.student_email || "Chưa cập nhật"}</div>
              </div>
              <div className='flex flex-col space-y-2'>
                <div className="text-base font-semibold ">Mã sinh viên</div>
                <div className="mt-2 text-gray-700">{user?.code || "Chưa cập nhật"}</div>
              </div>
              <div className='flex flex-col space-y-2'>
                <div className="text-base font-semibold ">Số CCCD</div>
                <div className="mt-2 text-gray-700">{user?.identified_number || "Chưa cập nhập"}</div>
              </div>
              <div className='flex flex-col space-y-2'>
                <div className="text-base font-semibold ">Mã thẻ BHYT</div>
                <div className="mt-2 text-gray-700">{user?.health_insurance_number || "Chưa cập nhập"}</div>
              </div>
              <div className='flex flex-col space-y-2 lg:col-span-1 col-span-3'>
                <div className="text-base font-semibold ">Email cá nhân</div>
                <div className="mt-2 text-gray-700">{user?.email || "Chưa cập nhật"}</div>
              </div>
              <div className='flex flex-col space-y-2'>
                <div className="text-base font-semibold ">Dân tộc</div>
                <div className="mt-2 text-gray-700">{user?.ethnic || "Chưa cập nhật"}</div>
              </div>
              <div className='flex flex-col space-y-2'>
                <div className="text-base font-semibold ">Khóa</div>
                <div className="mt-2 text-gray-700">{user?.course?.name} {user?.course?.start_year ? `(${user?.course?.start_year}-${user?.course?.end_year})` : ""}</div>
              </div>
              <div className='flex flex-col space-y-2'>
                <div className="text-base font-semibold ">Trạng thái</div>
                <div className="mt-2 text-gray-700">{user?.status === 1 ? "Đang học" : "Chưa cập nhật"}</div>
              </div>
              <div className='flex flex-col space-y-2 lg:col-span-1 col-span-3'>
                <div className="text-base font-semibold ">Hộ khẩu thường trú:</div>
                <div className="mt-2 text-gray-700">{user?.hometown || "Chưa cập nhật"}</div>
              </div>
              <div className='flex flex-col space-y-2 lg:col-span-1 col-span-3'>
                <div className="text-base font-semibold ">Địa chỉ bố mẹ đang ở:</div>
                <div className="mt-2 text-gray-700">{user?.address || "Chưa cập nhật"}</div>
              </div>
              <div className="col-span-3 lg:col-span-2 grid grid-cols-2 gap-x-3">
                <div className='flex flex-col space-y-2'>
                  <div className="text-base font-semibold ">TT tài khoản ngân hàng:</div>
                  <div className='mt-2 flex flex-col space-y-3'>
                    <div className='flex flex-col space-y-1 text-sm'>
                      <div className="font-semibold ">Ngân hàng:</div>
                      <div className=" text-gray-700">{user?.student_bank?.bank_name?.short_name || "Chưa cập nhật"}</div>
                    </div>
                    <div className='flex flex-col space-y-1 text-sm'>
                      <div className="font-semibold ">Tên chủ tài khoản:</div>
                      <div className=" text-gray-700">{user?.student_bank?.account_name || "Chưa cập nhật"}</div>
                    </div>
                    <div className='flex flex-col space-y-1 text-sm'>
                      <div className="font-semibold "> Số tài khoản: </div>
                      <div className=" text-gray-700">{user?.student_bank?.account_number || "Chưa cập nhật"}</div>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col space-y-2'>
                  <div className="text-base font-semibold ">TT liên hệ gia đình:</div>
                  <div className='mt-2 flex flex-col space-y-3'>
                    <div className='flex flex-col space-y-1 text-sm'>
                      <div className="font-semibold ">Họ và tên (1):</div>
                      <div className=" text-gray-700">{user?.relationships?.[0]?.fullname || "Chưa cập nhật"}</div>
                    </div>
                    <div className='flex flex-col space-y-1 text-sm'>
                      <div className="font-semibold ">Số điện thoại (1):</div>
                      <div className=" text-gray-700">{user?.relationships?.[0]?.phone?.[0] || "Chưa cập nhật"}</div>
                    </div>
                    <div className='flex flex-col space-y-1 text-sm'>
                      <div className="font-semibold ">Họ và tên (2):</div>
                      <div className=" text-gray-700">{user?.relationships?.[1]?.fullname || "Chưa cập nhật"}</div>
                    </div>
                    <div className='flex flex-col space-y-1 text-sm'>
                      <div className="font-semibold ">Số điện thoại (2):</div>
                      <div className=" text-gray-700">{user?.relationships?.[1]?.phone?.[0] || "Chưa cập nhật"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;