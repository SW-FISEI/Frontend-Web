import React, { useState } from 'react';
import { DatePicker, DatePickerProps, Button } from '@nextui-org/react';
import { CalendarDate, CalendarDateTime, parseDate, ZonedDateTime } from '@internationalized/date';
import '@/styles/selector-fecha.scss'

interface SelectorFechaProps extends DatePickerProps {
    onChange?: (value: CalendarDate | CalendarDateTime | ZonedDateTime) => void;
}

const SelectorFecha: React.FC<SelectorFechaProps> = (props) => {
    const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);

    const handleTodayClick = () => {
        const today = parseDate(new Date().toISOString().split('T')[0]);
        setSelectedDate(today);
        if (props.onChange) {
            props.onChange(today);
        }
    };

    const handleDateChange = (value: CalendarDate | CalendarDateTime | ZonedDateTime) => {
        setSelectedDate(value as CalendarDate); // Casting to CalendarDate since we expect a CalendarDate
        if (props.onChange) {
            props.onChange(value);
        }
    };

    return (
        <DatePicker
            className='selectorFecha'
            {...props}
            value={selectedDate}
            onChange={handleDateChange}
            CalendarBottomContent={
                <Button
                    onPress={handleTodayClick}
                    className="text-default-500 border-default-200/60"
                    variant="bordered"
                    radius="full"
                    size="sm"
                >
                    Hoy
                </Button>
            }
            placeholderValue={parseDate(new Date().toISOString().split('T')[0])}
        />
    );
};

export default SelectorFecha;
