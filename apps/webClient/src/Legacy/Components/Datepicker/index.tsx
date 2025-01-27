/** Datepicker.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Custom datepicker component
 */
// Libraries
import React, { useEffect, useRef } from 'react';

// Hooks
import useDatapicker from './UseDatepicker';

// Styles
import './Datepicker.css';

interface Props {
  label: string;
  name?: string;
  onChange?: any;
  value?: Date;
}

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const displayDate = (date: Date): string => {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${day}/${month}/${year}`;
};

const Datepicker = (props: Props): JSX.Element => {
  const [state, dispatch] = useDatapicker(props.value ? new Date(props.value) : new Date());

  const pickerRef = useRef();

  useEffect(() => {
    dispatch({ type: 'SET-DATE', payload: { date: props.value ? new Date(props.value) : new Date() } });
  }, [props.value]);

  // Functions
  const setDayCallback = (day: Date): void => {
    if (props.onChange) {
      props.onChange({
        target: {
          type: 'custom-select',
          name: props.name,
          value: day,
        },
      });
    }

    dispatch({ type: 'SET-DATE', payload: { date: day } });
  };

  const closePickerRef = (e: any) => {
    if (pickerRef.current === e.target) {
      dispatch({ type: 'SET-PICKER', payload: { bool: false } });
    }
  };

  const getDayKey = (i: number, j?: number): string => {
    return `${state.selectedDate.getFullYear}${state.selectedDate.getMonth}${i}_${j}`;
  };

  const compareDates = (a: Date | null, b: Date | null): boolean => {
    if (a === null || b === null) return false;

    if (a.getFullYear() === b.getFullYear()) {
      if (a.getMonth() === b.getMonth()) {
        if (a.getDate() === b.getDate()) {
          return true;
        }
      }
    }

    return false;
  };

  const compareMonths = (a: Date | null, b: Date | null): boolean => {
    if (a === null || b === null) return false;

    if (a.getFullYear() === b.getFullYear()) {
      if (a.getMonth() === b.getMonth()) {
        return true;
      }
    }

    return false;
  };

  const changeView = (change: number): void => {
    let nuDate = new Date(state.viewedDate.getFullYear(), state.viewedDate.getMonth() + change, 1);

    if (state.yearMode) {
      nuDate = new Date(state.viewedDate.getFullYear() + change, state.viewedDate.getMonth(), 1);
    }

    dispatch({ type: 'SET-VIEW', payload: { date: nuDate } });
  };

  // // Keypress detector
  // const keyPress = useCallback(
  //   (e: KeyboardEvent) => {
  //     if (e.key === 'Escape' && showPicker) {
  //       closePickerRef(e);
  //     }
  //   },
  //   [setShowPicker, showPicker],
  // );

  // // useEffect for the keypress
  // useEffect(() => {
  //   document.addEventListener('keydown', keyPress);
  //   return () => document.removeEventListener('keydown', keyPress);
  // }, [keyPress]);

  return (
    <>
      {/* Input field */}
      <div className="Datepicker" onClick={() => dispatch({ type: 'SET-PICKER', payload: { bool: true } })}>
        <input className="Datepicker__field" value={displayDate(state.selectedDate)} />
        {props.label && <label className="Datepicker__label">{props.label}</label>}
      </div>

      {/* Selector, doesn't use the modal component so this component is independent */}
      <div className={state.showPicker ? 'Datepicker__Container active' : 'Datepicker__Container'}>
        <div className="Datepicker__Container__Background" ref={pickerRef as any} onClick={closePickerRef}>
          <div className="Datepicker__Container__Content">
            {/* Month and year selector */}
            <div className="Datepicker__Container__Content__Title">
              <div className="Datepicker__Container__Content__Title__Button" onClick={() => changeView(-1)}>
                {'<'}
              </div>
              <div
                className="Datepicker__Container__Content__Title__Name"
                onClick={() => dispatch({ type: 'SET-MODE', payload: { bool: !state.yearMode } })}
              >
                {!state.yearMode && `${months[state.viewedDate.getMonth()]},`} {state.viewedDate.getFullYear()}
              </div>
              <div className="Datepicker__Container__Content__Title__Button" onClick={() => changeView(1)}>
                {'>'}
              </div>
            </div>

            {/* Month selector */}
            {state.yearMode && (
              <>
                <div className="Datepicker__Container__Content__Month">
                  {/* Month grid */}
                  {state.monthGrid.map((row, indexA) => (
                    <div role="row" key={getDayKey(indexA)} className="Datepicker__Container__Content__Month__Week">
                      {row.map((month, indexB) => (
                        <div
                          key={getDayKey(indexA, indexB)}
                          className={
                            compareMonths(month, state.selectedDate)
                              ? 'Datepicker__Container__Content__Month__Week__M selected'
                              : 'Datepicker__Container__Content__Month__Week__M'
                          }
                          onClick={() => dispatch({ type: 'SET-MONTH', payload: { date: month } })}
                        >
                          {months[month.getMonth()].substring(0, 3)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Day Selector */}
            {!state.yearMode && (
              <>
                <div className="Datepicker__Container__Content__Month">
                  {/* Day of the week view */}
                  <div className="Datepicker__Container__Content__Month__Weekdays">
                    {weekdays.map((day) => (
                      <div className="Datepicker__Container__Content__Month__Weekdays__Day" key={day}>
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Day grid */}
                  {state.weekGrid.map((week, indexA) => (
                    <div role="row" key={getDayKey(indexA)} className="Datepicker__Container__Content__Month__Week">
                      {week.map((day, indexB) => (
                        <div
                          key={getDayKey(indexA, indexB)}
                          className={
                            compareDates(day, state.selectedDate)
                              ? 'Datepicker__Container__Content__Month__Week__Day selected'
                              : compareMonths(day, state.viewedDate)
                              ? 'Datepicker__Container__Content__Month__Week__Day'
                              : 'Datepicker__Container__Content__Month__Week__Day outside'
                          }
                          onClick={() => {
                            setDayCallback(day);
                          }}
                        >
                          {day?.getDate()}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="Datepicker__Container__Content__Bottom">
              <div
                className="Datepicker__Container__Content__Bottom__Item"
                onClick={() => dispatch({ type: 'SET-TODAY', payload: {} })}
              >
                Today
              </div>
              <div className="Datepicker__Container__Content__Bottom__Spacer"></div>
              <div
                className="Datepicker__Container__Content__Bottom__Item"
                onClick={() => dispatch({ type: 'SET-PICKER', payload: { bool: false } })}
              >
                Close
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Datepicker;
