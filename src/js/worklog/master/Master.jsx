import 'datatables.net-dt/css/jquery.dataTables.min.css';
import React, { useEffect, useState } from 'react';
import 'datatables.net-responsive-dt';
import DataTable from 'datatables.net-dt';
import { useFormContext } from 'react-hook-form';
import { ModalEquipment } from '@/js/worklog/master/MasterEquipment';
import { ModalCompany } from '@/js/worklog/master/MasterCompany';

let dtWorklogEquipments, dtWorklogCompanies;

export function Master({ worklogProfile }) {
  const { setValue } = useFormContext();
  const [openModal, setOpenModal] = useState(null);
  useEffect(() => {
    dtWorklogEquipments = new DataTable('#dtWorklogEquipments', {
      dom: 'frtip',
      columns: [
        {
          data: 'name',
          render: function (data, type, row) {
            if (type === 'display') {
              return `<a class="link link-primary" data-id="${row.id}" href="#">${data}</a>`; // 링크 생성
            }
            return data; // 다른 경우에는 그대로 반환
          },
        },
        { data: 'operator' },
        {
          data: 'laborWage',
          render: function (data, type, row) {
            if (type === 'display') {
              return Number(data).toLocaleString();
            }
            return data; // 다른 경우에는 그대로 반환
          },
        },
      ],
      data: worklogProfile.worklogEquipments,
    });

    dtWorklogCompanies = new DataTable('#dtWorklogCompanies', {
      dom: 'frtip',
      columns: [
        {
          data: 'name',
          render: function (data, type, row) {
            if (type === 'display') {
              return `<a class="link link-primary" data-id="${row.id}" href="#">${data}</a>`; // 링크 생성
            }
            return data; // 다른 경우에는 그대로 반환
          },
        },
        { data: 'manager' },
        {
          data: 'phone',
          render: function (data, type, row) {
            if (type === 'display') {
              return data.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            }
            return data;
          },
        },
      ],
      data: worklogProfile.worklogCompanies,
    });

    document.getElementById('btnNewEquipment').addEventListener('click', () => {
      setOpenModal('Equipment');
      setValue('Equipment.id', '');
      setValue('Equipment.name', '');
      setValue('Equipment.laborWage', '');
      setValue('Equipment.operator', '');
      setValue('Equipment.phone', '');
      document.getElementById('modalEquipment').showModal();
    });

    document.getElementById('btnNewCompany').addEventListener('click', () => {
      setOpenModal('Company');
      setValue('Company.id', '');
      setValue('Company.name', '');
      setValue('Company.address', '');
      setValue('Company.manager', '');
      setValue('Company.phone', '');
      document.getElementById('modalCompany').showModal();
    });

    document.querySelector('#dtWorklogEquipments').addEventListener('click', function (event) {
      if (event.target.classList.contains('link-primary')) {
        event.preventDefault();
        worklogProfile.worklogEquipments.forEach((worklogEquipment) => {
          if (worklogEquipment.id == event.target.dataset.id) {
            setOpenModal('Equipment');
            setValue('Equipment.id', worklogEquipment.id);
            setValue('Equipment.name', worklogEquipment.name);
            setValue('Equipment.laborWage', parseInt(worklogEquipment.laborWage).toLocaleString());
            setValue('Equipment.operator', worklogEquipment.operator);
            setValue('Equipment.phone', phoneChange(worklogEquipment.phone));
          }
        });

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

        document.getElementById('modalEquipment').showModal();
      }
    });

    document.querySelector('#dtWorklogCompanies').addEventListener('click', function (event) {
      if (event.target.classList.contains('link-primary')) {
        event.preventDefault();
        worklogProfile.worklogCompanies.forEach((worklogCompany) => {
          if (worklogCompany.id == event.target.dataset.id) {
            setOpenModal('Company');
            setValue('Company.id', worklogCompany.id);
            setValue('Company.name', worklogCompany.name);
            setValue('Company.address', worklogCompany.address);
            setValue('Company.manager', worklogCompany.manager);
            setValue('Company.phone', phoneChange(worklogCompany.phone));
          }
        });

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

        document.getElementById('modalCompany').showModal();
      }
    });
  }, []);

  return (
    <>
      <div className="text-base-content glass rounded-box grid gap-4 bg-opacity-60 xl:pb-0">
        <div className="p-2">
          <div className="mx-2 flex-1 justify-center px-2 flex justify-between">
            <span className="text-lg font-bold">장비</span>
            <button className="btn btn-xs btn-primary" id="btnNewEquipment">
              등록
            </button>
          </div>
          <table id="dtWorklogEquipments" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>장비</th>
                <th>기사</th>
                <th>단가/일당</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div className="text-base-content glass rounded-box grid gap-4 bg-opacity-60 xl:pb-0 mt-4">
        <div className="p-2">
          <div className="mx-2 flex-1 justify-center px-2 flex justify-between">
            <span className="text-lg font-bold">시공사</span>
            <button className="btn btn-xs btn-primary" id="btnNewCompany">
              등록
            </button>
          </div>
          <table id="dtWorklogCompanies" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>시공사</th>
                <th>담당자</th>
                <th>연락처</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <dialog id="modalEquipment" className="modal">
        {openModal === 'Equipment' && <ModalEquipment />}
      </dialog>
      <dialog id="modalCompany" className="modal">
        {openModal === 'Company' && <ModalCompany />}
      </dialog>
    </>
  );
}
