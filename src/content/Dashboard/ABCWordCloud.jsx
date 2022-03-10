import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { TagCloud } from 'react-tagcloud';

const ANTECEDENT = 'antecedent';
const BEHAVIOR = 'behavior';
const CONSEQUENCE = 'consequence';

const ABCWordCloud = (props) => {

    const incidents = props.incidents;

    const [abcs, setAbcs] = useState([ANTECEDENT, BEHAVIOR, CONSEQUENCE]);
    const [words, setWords] = useState([]);

    useEffect(() => {

        let wordCount = [];
      
        incidents.forEach(incident => {
            let allWords = [];

            if ( abcs.includes(ANTECEDENT) ) {
                allWords = allWords.concat(incident.antecedents);
            }
            if ( abcs.includes(BEHAVIOR) ) {
                allWords = allWords.concat(incident.behaviors);
            }
            if ( abcs.includes(CONSEQUENCE) ) {
                allWords = allWords.concat(incident.consequences);
            }

            allWords.forEach(a => {
                let word = wordCount.find(w => { return w.value === a.typeValue});
                if ( word ) {
                    word.count++;
                }
                else {
                    wordCount.push({value: a.typeValue, count: 1});
                }
            });

            setWords(wordCount);
        });

      
    }, [incidents, abcs]);

    const handleChange = (event, newAbcs) => {
        setAbcs(newAbcs);
    }


    return (
        <Box sx={{ mb: 1, pt: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexGrow: 1 }}>

            <ToggleButtonGroup
                value={abcs}
                onChange={handleChange}
                aria-label="text formatting"
                size="small"
                color="primary"
                orientation="vertical"
                sx={{ mr: { xs: 0, md: 3 }, mb: { xs: 2, md: 0 } }}
            >
                <ToggleButton value={ANTECEDENT} aria-label="bold">
                    Antecendents
                </ToggleButton>
                <ToggleButton value={BEHAVIOR} aria-label="italic">
                    Behaviors
                </ToggleButton>
                <ToggleButton value={CONSEQUENCE} aria-label="underlined">
                    Consequences
                </ToggleButton>
            </ToggleButtonGroup>

            <TagCloud
                minSize={12}
                maxSize={35}
                tags={words}
            />
        </Box>
    );

}

export default ABCWordCloud;