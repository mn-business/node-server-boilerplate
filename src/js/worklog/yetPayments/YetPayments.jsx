import 'datatables.net-dt/css/jquery.dataTables.min.css';
import React, { useEffect } from 'react';
import 'datatables.net-responsive-dt';
import DataTable from 'datatables.net-dt';

let dtYetPayments;

export function YetPayments({ worklogProfile }) {
  // const { setValue } = useFormContext();
  // const [openModal, setOpenModal] = useState(null);
  let worklogIncomes = worklogProfile.worklogEquipments.reduce((acc, equipment) => {
    equipment.worklogIncomes.forEach((income) => {
      income.worklogEquipment = {
        id: equipment.id,
        name: equipment.name,
        operator: equipment.operator,
      };
    });
    return acc.concat(equipment.worklogIncomes);
  }, []);
  // console.log(worklogIncomes);

  useEffect(() => {
    dtYetPayments = new DataTable('#dtYetPayments', {
      dom: 'frtip',
      columns: [
        // {
        //   data: 'worklogEquipment.name',
        //   render: function (data, type, row) {
        //     if (type === 'display') {
        //       return `<a class="link link-primary" data-id="${row.id}" href="#">${data}</a>`; // 링크 생성
        //     }
        //     return data; // 다른 경우에는 그대로 반환
        //   },
        // },
        { data: 'incomeDate' },
        { data: 'collectionDate' },
        { data: 'paymentDate' },
        {
          data: 'income',
          render: function (data, type, row) {
            if (type === 'display') {
              return Number(data).toLocaleString();
            }
            return data; // 다른 경우에는 그대로 반환
          },
        },
        { data: 'worklogCompany.name' },
      ],
      order: [
        [2, 'asc'],
        [1, 'asc'],
      ],
      data: worklogIncomes,
    });
  }, []);

  return (
    <>
      <div className="text-base-content glass rounded-box grid gap-4 bg-opacity-60 xl:pb-0">
        <div className="p-2">
          <div className="mx-2 flex-1 justify-center px-2 flex justify-between">
            <span className="text-lg font-bold">미수금</span>
            <button className="btn btn-xs btn-primary" id="btnNewEquipment">
              등록
            </button>
          </div>
          <table id="dtYetPayments" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>매출일</th>
                <th>수금일</th>
                <th>지급일</th>
                <th>매출</th>
                <th>시공사</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      {/*<dialog id="modalEquipment" className="modal">*/}
      {/*  {openModal === 'Equipment' && <ModalEquipment />}*/}
      {/*</dialog>*/}
      {/*<dialog id="modalCompany" className="modal">*/}
      {/*  {openModal === 'Company' && <ModalCompany />}*/}
      {/*</dialog>*/}
    </>
  );
}
