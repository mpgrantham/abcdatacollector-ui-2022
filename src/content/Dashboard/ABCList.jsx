import React, {useEffect, useState} from 'react';
import { Typography } from '@mui/material';

import { ResponsivePie } from '@nivo/pie';

//const colors = ['hsl(98, 70%, 50%)', '#2e7d32', '#d32f2f', '#1565c0', '#9c27b0'];
const colors = ['#ff9800', '#2e7d32', '#d32f2f', '#1565c0', '#9c27b0'];

const ABCList = ({title, incidents, limit}) => {

    const displayLimit = limit ? limit : 5;

    const [values, setValues] = useState([]);

    useEffect(() => {

        let isAB = title.startsWith('Antecedent');

        let allCombos = [];
        let idx = 0;
      
        incidents.forEach(incident => {

            let listOne;
            let listTwo;
            
            if ( isAB ) {
                listOne = incident.antecedents.map(a => { return a.typeValue });
                listTwo = incident.behaviors.map(b => { return b.typeValue });
            }
            else {
                listOne = incident.behaviors.map(a => { return a.typeValue });
                listTwo = incident.consequences.map(b => { return b.typeValue });
            }

            listOne.forEach(a => {
                listTwo.forEach(b => {
                    const combo = a + ' - ' + b;
                    
                    let word = allCombos.find(w => { return w.label === combo});
                    if ( word ) {
                        word.value++;
                    }
                    else {
                        allCombos.push({'id': combo, 'label': combo, 'value': 1, 'color': colors[idx]});
                        idx++;
                    }
                });
            });
       });
      
       allCombos.sort(function(a, b){return b.value - a.value});

       setValues(allCombos.length > displayLimit ? allCombos.slice(0, displayLimit) : allCombos);
    }, [incidents, title, displayLimit]);

    return (
        <React.Fragment>
            <Typography gutterBottom variant="subtitle1" className="list-title" style={{fontSize: '1.1rem'}}>
                {title}
            </Typography>

            <div style={{height: '400px'}}>
                <ResponsivePie 
                    data={values}
                    margin={{ top: 10, right: 140, bottom: 110, left: 0}}
                    borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                    enableArcLabels={true}
                    enableArcLinkLabels={false}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
                    legends={[
                        {
                            anchor: 'right',
                            direction: 'column',
                            justify: false,
                            translateX: -10,
                            translateY: 200,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 18,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000'
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </div>

{/*
            <List>
                {
                    values.map(v => { 
                        const text = v.label + ' (' + v.value + ')';
                        return (<ListItem> <ListItemText primary={text}/> </ListItem>);
                        }
                    )
                }
            </List>
            */}

        </React.Fragment>
    );
}

export default ABCList;
