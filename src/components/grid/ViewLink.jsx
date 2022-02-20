import React from 'react';
import { Link as RouterLink  } from 'react-router-dom';

const ViewLink = props => {
    const toLink = '/view/' + props.data.id;
    return <RouterLink to={toLink} className="log-link">{props.value}</RouterLink> 
};

export default ViewLink;