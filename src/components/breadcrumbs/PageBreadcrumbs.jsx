import React from 'react';
import { Link as RouterLink  } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const trails = [
    {
        page: 'Home',
        trail: []
    },
    {
        page: 'Dashboard',
        trail: [
            { label: 'Home', route: '/'}
        ]
    },
    {
        page: 'Incident Log',
        trail: [
            { label: 'Home', route: '/'},
            { label: 'Dashboard', route: '/dashboard'}
        ]
    },
    {
        page: 'Incident View',
        trail: [
            { label: 'Home', route: '/'},
            { label: 'Dashboard', route: '/dashboard'},
            { label: 'Incident Log', route: '/log'}
        ]
    },
    {
        page: 'Settings',
        trail: [
            { label: 'Home', route: '/'},
            { label: 'Dashboard', route: '/dashboard'}
        ]
    },
];

const PageBreadcrumbs = (props) => {
    
    function displayBreadcrumbs() {

        // This allows for a custom breadcrumb trail
        if ( props.children ) {
            return props.children;
        }
        
        const page = trails.find(t => {
            return t.page === props.page;
        });

        let breadcrumbTrail = page.trail.map(t => {
            return <Link key={t.label} color="inherit" component={RouterLink} to={t.route}>{t.label}</Link>
        });

        return (
            <Breadcrumbs aria-label="breadcrumb">
                {breadcrumbTrail}
                <Typography color="textPrimary">{props.page}</Typography>
            </Breadcrumbs>
        );
    }

    return (
        <div>
            {displayBreadcrumbs()}
        </div>
    );
}

export default PageBreadcrumbs;