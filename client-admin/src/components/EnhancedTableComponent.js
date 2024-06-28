import React, { useRef, useEffect} from "react";
import { useDownloadExcel } from 'react-export-table-to-excel';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,Button,
    
    Box,TableSortLabel
  } from "@mui/material";



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function EnhancedTable({ rows, headCells , onRowClick ,onCanClick, onAppClick,name}) {

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");


  const handleRowClick = (item) => {
    // Gọi hàm onRowClick đã được truyền từ Component A
    onRowClick(item);
  };


  const lnkCancelClick = (id) => {
    // Gọi hàm onRowClick đã được truyền từ Component A
    onCanClick(id);
  };

  const lnkApproveClick = (id) => {
    // Gọi hàm onRowClick đã được truyền từ Component A
    onAppClick(id);
  };
 


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: name + ' table',
    sheet: name
})
  return (
    <div>
      <Box sx={{display: "flex",justifyContent: "flex-end"}}>
        <Button variant="outlined" onClick={onDownload}> Export excel </Button>
      </Box>
      <Paper sx={{ display: "flex", flexDirection: "column", alignItems: "center" , boxShadow : 0}}>
        <TableContainer sx={{ maxWidth: "80vw", my: 4 ,borderRadius: '16px',border: '2px solid #000',overflow: 'auto'}} >
          <Table
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
            sx={{ maxWidth: "80vw", }}
            ref={tableRef}
          >
            <EnhancedTableHead

              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy)).map(
                (row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover 
                      key={index}
                      onClick={() => handleRowClick(row)}>
                      {headCells.map((cell) => (
                        <TableCell
                          key={cell.id}
                          align={cell.numeric ? "right" : "left"}
                          style={{ whiteSpace: 'normal', textOverflow: 'ellipsis' }}
                        >
                          {cell.id === 'image' ? (
                            <img src={`data:image/jpg;base64,${row.image}`} width="100px" height="100px" alt="" />
                          ) : cell.id === 'category' ? (
                            row.category.name
                          ) : cell.id === 'device' ? (
                            row.product.name
                          ) : cell.id === 'customer' ? (
                            row.customer.name
                          ) : cell.id === 'cdate' ? (
                            new Date(row.cdate).toLocaleString()
                          ) : cell.id === 'status' && row.status === "PENDING" ? (
                            <Box 
                              display="flex"
                              alignItems="center"
                              justifyContent="space-around"
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => lnkApproveClick(row._id)}
                              >
                                APPROVE
                              </Button>
                              <Box component="span" mx={1} />
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => lnkCancelClick(row._id)}
                              >
                                CANCEL
                              </Button>
                            </Box>
                          ) : cell.id === 'state' ? (
                            row.state == 0 ? "Not Available" :
                            row.state == 1 ? "Available" :
                            row.state == 2 ? "In Use" :
                            "Out of stock"
                          ) :
                          
                          (
                            // Render other data
                            row[cell.id]
                          )}

                        </TableCell>
                      ))}
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

function EnhancedTableHead(props) {
  const {order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span>
                  {order === "desc"
                    ? ""
                    : ""}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
