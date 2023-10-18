import React from 'react';
import { useFormContext } from 'react-hook-form';
import { fetchDelete, fetchPost } from '@/js/common/common';

export function ModalEquipment() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useFormContext({ mode: 'onBlur' });

  const wtId = watch('Equipment.id', '');
  const wtLaborWage = watch('Equipment.laborWage', '');
  const wtPhone = watch('Equipment.phone', '');

  function handleLaborWageChange(event) {
    let inputValue = event.target.value.replace(/,/g, ''); // 콤마 제거
    if (!isNaN(inputValue)) {
      // 숫자인지 확인
      if (inputValue.length > 0) {
        // 숫자가 입력되었을 때만 콤마 추가
        inputValue = parseInt(inputValue).toLocaleString();
      }
      setValue('Equipment.laborWage', inputValue); // 'laborWage' 필드 업데이트
    }
  }

  function handlePhoneChange(event) {
    setValue('Equipment.phone', phoneChange(event.target.value)); // 'phone' 필드 업데이트
  }

  function phoneChange(value) {
    let inputValue = value.replace(/-/g, ''); // - 제거
    if (!isNaN(inputValue)) {
      // 숫자인지 확인
      if (inputValue.length === 11) {
        inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      }
    }
    return inputValue;
  }

  const onValid = (data) => {
    data.Equipment.laborWage = wtLaborWage.replace(/,/g, ''); // 콤마 제거
    data.Equipment.phone = wtPhone.replace(/-/g, ''); // - 제거
    fetchPost('/worklog/equipment', data.Equipment)
      .then((response) => response.json())
      .then((data) => {
        alert(`장비 : ${data.name}이/가 저장되었습니다.`);
        document.getElementById('modalEquipment').close();
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert(`오류가 발생했습니다.\n${error}`);
      });
  };

  const onClickBtnDelete = (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      fetchDelete(`/worklog/equipments/${wtId}`)
        .then((response) => {
          if (response.status !== 200) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          alert(`삭제 되었습니다.`);
          document.getElementById('modalEquipment').close();
          window.location.reload();
        })
        .catch((error) => {
          alert(`오류가 발생했습니다.\n관리자에게 문의하세요.`);
        });
    }
  };

  return (
    <form method="dialog" className="modal-box" onSubmit={handleSubmit(onValid)}>
      <input type="hidden" {...register('Equipment.id')} />
      <h3 id="modal-title" className="font-bold text-xs"></h3>
      <div className="modal-action flex flex-col items-center">
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4 w-full">
            <label className="input-group input-group-xs input-group-vertical">
              <span>장비명</span>
              <input
                {...register('Equipment.name', { required: '장비명을 입력해주세요.' })}
                type="text"
                placeholder="장비명 or 차대번호"
                className={`${
                  Boolean(errors.Equipment?.name?.message)
                    ? 'input input-bordered input-xs input-error  number-input'
                    : 'input input-bordered input-xs number-input'
                }`}
              ></input>
              {errors.Equipment?.name?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>단가/일당</span>
              <input
                {...register('Equipment.laborWage', {
                  required: '단가/일당을 입력해주세요.',
                  maxLength: { value: 15, message: '15자리를 넘을 수 없습니다.' },
                })}
                type="text"
                placeholder="700000"
                value={wtLaborWage}
                onChange={handleLaborWageChange}
                className={`${
                  Boolean(errors.Equipment?.laborWage?.message)
                    ? 'input input-bordered input-xs input-error  number-input'
                    : 'input input-bordered input-xs number-input'
                }`}
              />
              {errors.Equipment?.laborWage?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>기사</span>
              <input
                {...register('Equipment.operator')}
                type="text"
                placeholder="기사님 이름"
                className={`${
                  Boolean(errors.Equipment?.operator?.message)
                    ? 'input input-bordered input-xs input-error  number-input'
                    : 'input input-bordered input-xs number-input'
                }`}
              ></input>
              {errors.Equipment?.operator?.message}
            </label>
            <label className="input-group input-group-xs input-group-vertical">
              <span>연락처</span>
              <input
                {...register('Equipment.phone')}
                value={wtPhone}
                type="text"
                placeholder="01012345678"
                onChange={handlePhoneChange}
                className={`${
                  Boolean(errors.Equipment?.phone?.message)
                    ? 'input input-bordered input-xs input-error  number-input'
                    : 'input input-bordered input-xs number-input'
                }`}
              />
              {errors.Equipment?.phone?.message}
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
                document.getElementById('modalEquipment').close();
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
