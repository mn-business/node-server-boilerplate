import React from 'react';
import { useFormContext } from 'react-hook-form';
import { fetchDelete, fetchPost } from '@/js/common/common';

export function ModalCompany() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useFormContext({ mode: 'onBlur' });

  const wtId = watch('Company.id', '');
  const wtPhone = watch('Company.phone', '');

  const onValid = (data) => {
    data.Company.phone = wtPhone.replace(/-/g, ''); // - 제거
    fetchPost('/worklog/company', data.Company)
      .then((response) => response.json())
      .then((data) => {
        alert(`시공사 ${data.name}이/가 저장되었습니다.`);
        document.getElementById('modalCompany').close();
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert(`오류가 발생했습니다.\n${error}`);
      });
  };

  const handlePhoneChange = (event) => {
    let inputValue = event.target.value.replace(/-/g, ''); // - 제거
    if (!isNaN(inputValue)) {
      // 숫자인지 확인
      if (inputValue.length === 11) {
        inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      }
      setValue('Company.phone', inputValue); // 'phone' 필드 업데이트
    }
  };

  const onClickBtnDelete = (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      fetchDelete(`/worklog/companies/${wtId}`)
        .then((response) => {
          if (response.status !== 200) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          alert(`삭제 되었습니다.`);
          document.getElementById('modalCompany').close();
          window.location.reload();
        })
        .catch((error) => {
          alert(`오류가 발생했습니다.\n관리자에게 문의하세요.`);
        });
    }
  };

  return (
    <form method="dialog" className="modal-box" onSubmit={handleSubmit(onValid)}>
      <input type="hidden" {...register('Company.id')} />
      <h3 id="modal-title" className="font-bold text-xs"></h3>
      <div className="modal-action flex flex-col items-center">
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4 w-full">
            <label className="input-group input-group-xs input-group-vertical">
              <span>시공사</span>
              <input
                {...register('Company.name', { required: '시공사명을 입력해주세요.' })}
                type="text"
                placeholder="시공사명"
                className={`${
                  Boolean(errors.Company?.name?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              ></input>
              {errors.Company?.name?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>주소</span>
              <textarea
                {...register('Company.address')}
                placeholder="주소"
                className={`${
                  Boolean(errors.Company?.address?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              ></textarea>
              {errors.Company?.address?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>담당자</span>
              <input
                {...register('Company.manager')}
                type="text"
                placeholder="이름"
                className={`${
                  Boolean(errors.Company?.manager?.message)
                    ? 'input input-bordered input-xs input-error '
                    : 'input input-bordered input-xs'
                }`}
              />
              {errors.Company?.manager?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>연락처</span>
              <input
                {...register('Company.phone')}
                value={wtPhone}
                type="text"
                placeholder="01012345678"
                onChange={handlePhoneChange}
                className={`${
                  Boolean(errors.Company?.phone?.message)
                    ? 'input input-bordered input-xs input-error  number-input'
                    : 'input input-bordered input-xs number-input'
                }`}
              />
              {errors.Company?.phone?.message}
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
                reset();
                document.getElementById('modalCompany').close();
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
