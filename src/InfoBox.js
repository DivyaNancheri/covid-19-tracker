import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
// import CountUp from 'react-countup';

import './InfoBox.css';
function InfoBox({ title, cases, active, isRed, total, ...props }) {
    return (
        <Card
            onClick={props.onClick}
            className={`infoBox ${active && "infoBox--selected"} 
            ${isRed && "infoBox--red"}`
            }>
            <CardContent>
                <Typography className="infoBox_title" color="textSecondary">
                    {title}
                </Typography>

                {/* <CountUp start={0} end={cases} duration={2.5} separator= "," /> */}
                <h2 className={`infoBox_cases ${!isRed && "infoBox_cases--green"}`}>
                    {cases}
                </h2>

                <Typography className="infoBox_total" color="textSecondary">
                    Total: {total} 
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;
