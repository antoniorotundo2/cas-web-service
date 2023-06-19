import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Modal from 'react-bootstrap/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import UserService from '../../services/user-service';
import TableLoader from '../../components/table-loader/table-loader';

function Users() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState(() => []);
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();

  const loadUsers = () => {
    UserService.getAllUsers().then((response) => {
      const users = response.data.users ? response.data.users : [];
      const auxcolumns = [];
      if (users.length > 0) {
        for (let key in users[0]) {
          if (key == "__v" || key == "_id" || key == "idUser" || key == "userInfo") {
            continue;
          }
          auxcolumns.push({
            name: key,
            selector: row => row[key],
            sortable: true,
            reorder: true
          });

        }
      }

      auxcolumns.push({
        name: "Actions",
        //button: true,
        cell: (row) => {
          return <>
            <button type="button" class="btn btn-primary btn-sm btn-addon" onClick={() => {
              navigate(row._id);
            }} ><i class="ti-info" ></i>Show Info</button>
          </>
        }

      });
      setColumns(auxcolumns);
      setData(users);
      setPending(false);
    });
  }

  useEffect(
    () => {
      loadUsers();
    }, [])

  return (
    <>
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="bootstrap-data-table-panel">
              <div class="table-responsive">
                <DataTable columns={columns} data={data} pagination progressPending={pending} title="Users" progressComponent={<TableLoader />} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

    </>
  )
}

export default Users