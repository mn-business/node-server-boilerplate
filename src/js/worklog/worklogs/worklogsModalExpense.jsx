import 'js-datepicker/dist/datepicker.min.css';
import '@/styles/worklog/datepicker.scss';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { fetchPost, fetchDelete } from '@/js/common/common';
import { WORKLOG_TYPE } from '@/js/worklog/worklogEnum';

export function WorklogsModalExpense({ worklogProfile, callbackIncomeOrExpenseSaved, callbackIncomeOrExpenseDeleted }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext({ mode: 'onBlur' });

  let wtId = watch('Expense.id', '');
  let wtExpense = watch('Expense.expense', '');

  const onValid = (data) => {
    data.Expense.expenseDate = document.getElementById('modal-title').innerText.replace(/\./g, '-');
    fetchPost(`/worklog/equipments/${data.Expense.worklogEquipment.id}/expenses`, data.Expense)
      .then((response) => response.json())
      .then((data) => {
        alert(`저장 되었습니다.`);
        window.modal.close();
        callbackIncomeOrExpenseSaved(WORKLOG_TYPE.EXPENSE, data);
        // window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert(`오류가 발생했습니다.\n${error}`);
      });
  };

  const onClickBtnDelete = (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      fetchDelete(`/worklog/equipments/expenses/${wtId}`)
        .then((response) => {
          if (response.status !== 200) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          alert(`삭제 되었습니다.`);
          window.modal.close();
          callbackIncomeOrExpenseDeleted(WORKLOG_TYPE.EXPENSE, data);
          // window.location.reload();
        })
        .catch((error) => {
          alert(`오류가 발생했습니다.\n관리자에게 문의하세요.`);
        });
    }
  };

  return (
    <>
      <form className="modal-action flex flex-col items-center" onSubmit={handleSubmit(onValid)}>
        <input type="hidden" {...register('Expense.id')} />
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4 w-full">
            <label className="input-group input-group-xs input-group-vertical">
              <span>장비</span>
              <select
                {...register('Expense.worklogEquipment.id', {
                  validate: (value) => value !== '' || '장비를 선택하세요.',
                })}
                className={`${
                  Boolean(errors.Expense?.worklogEquipment?.id?.message)
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
              {errors.Expense?.worklogEquipment?.id?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>비고</span>
              <textarea
                {...register('Expense.remarks', { required: false })}
                placeholder="비고"
                className={`${
                  Boolean(errors.Expense?.remarks?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              ></textarea>
              {errors.Expense?.remarks?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>사용내역</span>
              <input
                {...register('Expense.name', { required: '사용내역을 입력해주세요.' })}
                type="text"
                placeholder="사용내역"
                className={`${
                  Boolean(errors.Expense?.name?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              ></input>
              {errors.Expense?.name?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>금액</span>
              <input
                {...register('Expense.expense', {
                  required: '금액을 입력해주세요.',
                  maxLength: { value: 15, message: '15자리를 넘을 수 없습니다.' },
                })}
                type="number"
                placeholder="금액"
                value={wtExpense}
                className={`${
                  Boolean(errors.Expense?.expense?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              />
              {errors.Expense?.expense?.message}
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
