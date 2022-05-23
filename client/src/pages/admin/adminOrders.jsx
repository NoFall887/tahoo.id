import { IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Admin from "../../components/admin/adminTemplate";
import AdminEmptyOrders from "../../components/admin/orders/adminEmptyOrders";
import { _ } from "gridjs-react";
import { Grid } from "gridjs";
import { Badge } from "react-bootstrap";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CurrencyText from "../../components/currencyText";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(true);
  const tableCont = useRef(null);

  useEffect(() => {
    const grid = new Grid({
      style: {},
      columns: [
        "ID",
        "Pemesan",
        "Tanggal",
        {
          name: "Total",
          sort: {
            compare: (a, b) => {
              const getValue = (elem) => elem.props.element.props.value;

              if (getValue(a) > getValue(b)) {
                return 1;
              } else if (getValue(b) > getValue(a)) {
                return -1;
              } else {
                return 0;
              }
            },
          },
        },

        {
          name: "Status",
          sort: {
            compare: (a, b) => {
              console.log(a);
              return -1;
            },
          },
        },
        { name: " ", sort: false, id: "action" },
      ],
      sort: true,
      server: {
        url: "http://localhost:5000/admin/get-all-orders",
        data: (opts) => {
          return new Promise((resolve, reject) => {
            axios.get(opts.url, { withCredentials: true }).then((response) => {
              if (!response.data.success) return reject();
              const respData = response.data.data;
              if (respData === 0) return setOrders([]);
              resolve({
                data: respData.map((row) => {
                  return [
                    row.id_pesanan,
                    row.nama,
                    row.tanggal,
                    _(<CurrencyText value={row.total} />),

                    _(
                      row.id_status_pesanan === 1 ? (
                        <Badge bg="success" style={{ height: "fit-content" }}>
                          Selesai
                        </Badge>
                      ) : (
                        <Badge bg="warning" style={{ height: "fit-content" }}>
                          Menunggu
                        </Badge>
                      )
                    ),
                    _(
                      <IconButton
                        color="primary"
                        onClick={() => {
                          navigate(`/admin/transaksi/${row.id_pesanan}`);
                        }}
                      >
                        <ArrowForwardIosRoundedIcon />
                      </IconButton>
                    ),
                  ];
                }),
              });
            });
          });
        },
      },
    });
    if (orders === true) grid.render(tableCont.current);
  }, [orders, navigate]);

  if (orders.length === 0)
    return (
      <Admin>
        <AdminEmptyOrders />
      </Admin>
    );

  return (
    <Admin>
      <div id="table-cont" ref={tableCont} />
    </Admin>
  );
}
