import React, { useState } from 'react';
import { DatePicker, DatePickerProps, Button } from '@nextui-org/react';
import { CalendarDate, CalendarDateTime, ZonedDateTime, DateValue } from '@internationalized/date';
import '@/styles/selector-fecha.scss';

interface SelectorFechaProps extends Omit<DatePickerProps, 'onChange' | 'placeholderValue'> {
    onChange?: (value: CalendarDate | CalendarDateTime | ZonedDateTime | null) => void;
}

const SelectorFecha: React.FC<SelectorFechaProps> = (props) => {
    const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);

    const handleTodayClick = () => {
        const today = new Date();
        const calendarDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
        setSelectedDate(calendarDate);
        if (props.onChange) {
            props.onChange(calendarDate);
        }
    };

    const handleDateChange = (value: DateValue | null) => {
        if (value) {
            setSelectedDate(value instanceof CalendarDate ? value : null);
            if (props.onChange) {
                props.onChange(value);
            }
        } else {
            setSelectedDate(null);
            if (props.onChange) {
                props.onChange(null);
            }
        }
    };

    const placeholderDate = new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());

    return (
        <DatePicker
            className='selectorFecha'
            {...props}
            value={selectedDate || undefined}  // Handle `null` case
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
            placeholderValue={placeholderDate}
        />
    );
};

export default SelectorFecha;
