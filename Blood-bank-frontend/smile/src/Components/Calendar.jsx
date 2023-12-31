import React, { useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay } from '@mui/x-date-pickers';
import { Badge } from '@mui/material';





//Function to Display Badges on Dates

function ServerDay(props) {
    const { highlightedDays = [], day, ...other } = props;
    const isSelected = !props.disabled && (props.day.date() in highlightedDays) ;

    return (
        <Badge
            key={props.day.toString()}
            overlap="circular"
            color='warning'
            badgeContent={isSelected ? highlightedDays[props.day.date()] : undefined}
        >
            <PickersDay {...other}  day={day} />
        </Badge>
    );
}



//Function Disables 15 Days Ahead in the Calendar
const disable7Days = (date) => date > dayjs().add(7 , 'day') 
const tomorrow = dayjs().add(1 ,'day')

const CalendarComp = (props) => {

    const handleMonthChange = () => {setIsLoading(true);}
     //Calendar Animation
    const [isLoading, setIsLoading] = useState(false);
    //Days with Number of Slots
    const highlightedDays = props.highlightedDays

    // console.log(highlightedDays)


    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                    showDaysOutsideCurrentMonth
                    fixedWeekNumber={6}
                    defaultValue={dayjs()}
                    readOnly
                    minDate={tomorrow}
                    loading={isLoading}
                    onMonthChange={handleMonthChange}
                    slots={{
                        day: ServerDay,
                    }}
                    slotProps={{
                        day: {
                            highlightedDays,
                        },
                    }}
                    shouldDisableDate={disable7Days}
                />
            </LocalizationProvider>
        </>
    )
}

export default CalendarComp