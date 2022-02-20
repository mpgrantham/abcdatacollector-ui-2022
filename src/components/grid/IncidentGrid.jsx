import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import ViewLink from './ViewLink';

const columnDefs =  [
    { 
        field: 'incidentDtStr', headerName: 'Date/Time', resizable: true, width: 200, sortable: true,  
        comparator: function(valueA, valueB, nodeA, nodeB) {

            if ( nodeA.data.incidentDt > nodeB.data.incidentDt ) {
                return 1;
            }

            if ( nodeB.data.incidentDt > nodeA.data.incidentDt ) {
                return -1;
            }

            return 0;
        },
        sort: 'desc',
        cellRenderer: 'lnkRenderer'
    },
    { field: 'intensity', headerName: 'Intensity', resizable: true, sortable: true, width: 130  },
    { field: 'durationStr', headerName: 'Duration', resizable: true, sortable: true  },
    { field: 'location', headerName: 'Location', resizable: true, sortable: true, width: 150  },
    { field: 'antecedentStr', headerName: 'Antecedent', resizable: true, flex: 1  },
    { field: 'behaviorStr', headerName: 'Behavior', resizable: true, flex: 1  },
    { field: 'consequenceStr', headerName: 'Consequence', resizable: true, flex: 1  },
    { field: 'description', headerName: 'Description', resizable: true, flex: 1  }
];

function IncidentGrid(props, ref) {
    
    const incidents = props.incidents;
   
    let noRowsMessage = 'No Incidents in the time period';

    const [gridApi, setGridApi] = useState(null);
    
    const onGridReady = (params) => {
        setGridApi(params.api);
    };
    
    useImperativeHandle(ref, () => ({
        exportToCsv() {
            gridApi.exportDataAsCsv();
        }
      }), [gridApi])
    
    return (
        <AgGridReact
            columnDefs={columnDefs}
            rowData={incidents}
            overlayNoRowsTemplate={noRowsMessage}
            onGridReady={onGridReady}
            frameworkComponents={{
                lnkRenderer: ViewLink,
            }}
        >
        </AgGridReact>
    );
}

export default forwardRef(IncidentGrid);