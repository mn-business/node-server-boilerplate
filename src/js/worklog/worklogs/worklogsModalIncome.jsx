import 'js-datepicker/dist/datepicker.min.css';
import '@/styles/worklog/datepicker.scss';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { formatDate, fetchPost, fetchDelete } from '@/js/common/common';
import { WORKLOG_TYPE } from '@/js/worklog/worklogEnum';
import datepicker from 'js-datepicker';

export function WorklogsModalIncome({
  worklogProfile,
  callbackIncomeOrExpenseSaved,
  callbackIncomeOrExpenseDeleted,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext({ mode: 'onBlur' });

  let wtId = watch('Income.id', '');
  let wtIncome = watch(
    'Income.income',
    worklogProfile.worklogEquipments[0] === undefined
      ? ''
      : worklogProfile.worklogEquipments[0]?.laborWage
  );
  let wtCollectionDate = watch('Income.collectionDate', '');
  let wtPaymentDate = watch('Income.paymentDate', '');
  let wtLaborDay = watch('Income.laborDay', '1');

  const onValid = (data) => {
    data.Income.collectionDate = wtCollectionDate.replace(/\./g, '-'); // 날짜 변환
    data.Income.paymentDate = wtPaymentDate.replace(/\./g, '-'); // 날짜 변환
    data.Income.incomeDate = document.getElementById('modal-title').innerText.replace(/\./g, '-');
    fetchPost(`/worklog/equipments/${data.Income.worklogEquipment.id}/incomes`, data.Income)
      .then((response) => response.json())
      .then((data) => {
        alert(`저장 되었습니다.`);
        window.modal.close();
        callbackIncomeOrExpenseSaved(WORKLOG_TYPE.INCOME, data);
        // window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert(`오류가 발생했습니다.\n${error}`);
      });
  };

  const onClickBtnDelete = (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      fetchDelete(`/worklog/equipments/incomes/${wtId}`)
        .then((response) => {
          if (response.status !== 200) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          alert(`삭제 되었습니다.`);
          window.modal.close();
          callbackIncomeOrExpenseDeleted(WORKLOG_TYPE.INCOME, data);
          // window.location.reload();
        })
        .catch((error) => {
          alert(`오류가 발생했습니다.\n관리자에게 문의하세요.`);
        });
    }
  };

  useEffect(() => {
    let now = new Date();
    let nextMonth = now.setMonth(now.getMonth() + 1);
    datepicker('#collectionDate', {
      alwaysShow: false,
      dateSelected: new Date(nextMonth),
      // startDate: new Date(nextMonth),
      position: 'br',
      customMonths: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      customDays: ['일', '월', '화', '수', '목', '금', '토'],
      // startDay: 1,
      formatter: (input, date, instance) => {
        setValue('Income.collectionDate', formatDate(date, '.')); // 'collectionDate' 필드 업데이트
      },
      onSelect: (instance, date) => {
        instance.hide();
      },
    });

    datepicker('#paymentDate', {
      alwaysShow: false,
      // dateSelected: new Date(nextMonth),
      // startDate: new Date(nextMonth),
      position: 'br',
      customMonths: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      customDays: ['일', '월', '화', '수', '목', '금', '토'],
      // startDay: 1,
      formatter: (input, date, instance) => {
        setValue('Income.paymentDate', formatDate(date, '.')); // 'paymentDate' 필드 업데이트
      },
      onSelect: (instance, date) => {
        instance.hide();
      },
    });
  }, []);
  return (
    <>
      <form className="modal-action flex flex-col items-center" onSubmit={handleSubmit(onValid)}>
        <input type="hidden" {...register('Income.id')} />
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4 w-full">
            <label className="input-group input-group-xs input-group-vertical">
              <span>장비</span>
              <select
                {...register('Income.worklogEquipment.id', {
                  validate: (value) => value !== '' || '장비를 선택하세요.',
                  onChange: (e) => {
                    if (e.target.value === '') {
                      window.location.href = '/worklog/master';
                    } else {
                      let equipment = worklogProfile.worklogEquipments?.find(
                        (item) => item.id == e.target.value
                      );
                      setValue('Income.income', equipment.laborWage);
                    }
                  },
                })}
                className={`${
                  Boolean(errors.Income?.worklogEquipment?.id?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              >
                {worklogProfile.worklogEquipments?.length === 0 ? (
                  <option value="">장비를 선택하세요.</option>
                ) : (
                  worklogProfile.worklogEquipments?.map((itiem) => (
                    <option key={itiem.id} value={itiem.id}>
                      {itiem.name}
                    </option>
                  ))
                )}
                <option value="">장비 등록하기</option>
              </select>
              {errors.Income?.worklogEquipment?.id?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>매출</span>
              <input
                {...register('Income.income', {
                  required: '매출을 입력해주세요.',
                  maxLength: { value: 15, message: '15자리를 넘을 수 없습니다.' },
                })}
                type="number"
                placeholder="700000"
                value={wtIncome}
                className={`${
                  Boolean(errors.Income?.income?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              />
              {errors.Income?.income?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>시공사</span>
              <select
                {...register('Income.worklogCompany.id', {
                  validate: (value) => value !== '' || '시공사를 선택하세요.',
                  onChange: (e) => {
                    if (e.target.value === '') {
                      window.location.href = '/worklog/master';
                    }
                  },
                })}
                className={`${
                  Boolean(errors.Income?.worklogCompany?.id?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              >
                {worklogProfile.worklogCompanies?.length === 0 ? (
                  <option value="">시공사를 선택해주세요.</option>
                ) : (
                  worklogProfile.worklogCompanies?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))
                )}
                <option value="">시공사 등록하기</option>
              </select>
              {errors.Income?.worklogCompany?.id?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>수금일</span>
              <input
                id="collectionDate"
                {...register('Income.collectionDate', {
                  required: '수금일을 입력해주세요.',
                  onChange: (e) => {
                    document.querySelector('.qs-datepicker-container').classList.add('qs-hidden');
                  },
                })}
                type="text"
                placeholder="수금일"
                value={wtCollectionDate}
                readOnly={true}
                className={`${
                  Boolean(errors.Income?.collectionDate?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              />
              {errors.Income?.collectionDate?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>공수(작업일수)</span>
              <input
                {...register('Income.laborDay', {
                  required: '공수(작업일수)를 입력해주세요',
                  max: { value: 30, message: '30일을 넘을 수 없습니다.' },
                })}
                type="number"
                step="0.1"
                placeholder="1"
                value={wtLaborDay}
                className={`${
                  Boolean(errors.Income?.laborDay?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              />
              {errors.Income?.laborDay?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>지급일</span>
              <input
                id="paymentDate"
                {...register('Income.paymentDate')}
                type="text"
                placeholder="수금을 완료한(지급) 일자"
                value={wtPaymentDate}
                readOnly={true}
                className={`${
                  Boolean(errors.Income?.paymentDate?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              />
              {errors.Income?.paymentDate?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>비고</span>
              <textarea
                {...register('Income.remarks', { required: false })}
                placeholder="비고"
                className={`${
                  Boolean(errors.Income?.remarks?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              ></textarea>
              {errors.Income?.remarks?.message}
            </label>
          </div>
          <div className="flex justify-center mt-4 gap-2">
            {wtId && (
              <button
                type="button"
                className="btn btn-xs btn-error"
                onClick={() => onClickBtnDelete()}
              >
                삭제
              </button>
            )}
            <button type={'submit'} className="btn btn-xs">
              저장
            </button>
            <button
              type={'button'}
              className="btn btn-xs"
              onClick={() => {
                // reset();
                document.getElementById('modal').close();
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
