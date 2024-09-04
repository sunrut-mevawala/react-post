import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: ' Title',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Desc',
    width: 150,
    editable: true,
  },
  {
  field: 'imgage',
  headerName: 'Images',
  width: 150,
  editable: true,
  },
  {
  field: 'cid',
  headerName: 'Category Id',
  width: 150,
  editable: true,
  },
  {
  field: 'date',
  headerName: 'Created Date',
   width: 150,
  editable: true,
  },
  {
  field: 'uid',
  headerName: 'Updated Id',
  width: 150,
  editable: true,
  },
  {
  field: 'price',
  headerName: 'Price',
  width: 150,
  editable: true,
  },
  {
  field: 'disprice',
  headerName: 'Discounted Price',
  width: 150,
  editable: true,
  },
  {
  field: 'dispercent',
  headerName: 'Discount Precentagenpm start',
  width: 150,
  editable: true,
  },
    
  ];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function ProductTable() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
