/** UseDatapicker.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Hook that holds all the variables for the datapicker, is used
 * to reduce the amount of reloads that the datepicker does
 */
import React, { useReducer } from 'react';

export interface DatepickerState {
  selectedDate: Date;
  viewedDate: Date;
  weekGrid: Date[][];
  monthGrid: Date[][];
  showPicker: boolean;
  yearMode: boolean;
}

export interface DatepickerAction {
  type: 'SET-PICKER' | 'SET-VIEW' | 'SET-MODE' | 'SET-MONTH' | 'SET-DATE' | 'SET-TODAY';
  payload: {
    bool?: boolean;
    date?: Date;
  };
}

const getWeeksForMonth = (date: Date): Date[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstOfMonth.getDay();
  const weeks: Date[][] = [[]];

  // Sets the current week as the 0 element
  let currentWeek = weeks[0];

  // Sets the first date as the first of the month minus the amount of days to the sunday
  let currentDate = new Date(year, month, 1 - firstDayOfWeek);

  // Fills 42 days (6 weeks)
  let counter = 0;
  while (counter < 42) {
    // If the current week has 7 days, the currentWeek gets reset and is pushed as a new week
    if (currentWeek.length === 7) {
      currentWeek = [];
      weeks.push(currentWeek);
    }

    // Adds the date and goes to the next
    currentWeek.push(currentDate);
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
    counter++;
  }

  return weeks;
};

const getMonthsForYear = (date: Date): Date[][] => {
  const year = date.getFullYear();
  const months: Date[][] = [[]];

  // Sets the current month as the 0 element
  let currentRow = months[0];

  // Sets the first month as January of the given year
  let currentMonth = new Date(year, 0, 1);

  let counter = 0;
  while (counter < 12) {
    if (currentRow.length === 4) {
      currentRow = [];
      months.push(currentRow);
    }

    currentRow.push(currentMonth);
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    counter++;
  }

  return months;
};

const reducer = (state: DatepickerState, action: DatepickerAction): DatepickerState => {
  let item: DatepickerState;
  switch (action.type.toUpperCase()) {
    case 'SET-PICKER':
      item = {
        ...state,
        showPicker: action.payload.bool ? true : false,
        viewedDate: state.selectedDate,
        weekGrid: getWeeksForMonth(state.selectedDate),
        monthGrid: getMonthsForYear(state.selectedDate),
        yearMode: false,
      };
      return item;
    case 'SET-VIEW':
      if (!action.payload.date) return state;
      item = {
        ...state,
        viewedDate: action.payload.date,
        weekGrid: getWeeksForMonth(action.payload.date),
        monthGrid: getMonthsForYear(action.payload.date),
      };
      return item;
    case 'SET-MODE':
      item = {
        ...state,
        yearMode: action.payload.bool ? true : false,
      };
      return item;
    case 'SET-MONTH':
      if (!action.payload.date) return state;
      item = {
        ...state,
        viewedDate: action.payload.date,
        weekGrid: getWeeksForMonth(action.payload.date),
        monthGrid: getMonthsForYear(action.payload.date),
        yearMode: false,
      };
      return item;
    case 'SET-DATE':
      if (!action.payload.date) return state;
      item = {
        ...state,
        selectedDate: action.payload.date,
        yearMode: false,
        showPicker: false,
      };
      return item;
    case 'SET-TODAY':
      item = {
        ...state,
        selectedDate: new Date(),
        yearMode: false,
        showPicker: false,
      };
      return item;
    default:
      return state;
  }
};

const UseDatepicker = (initial?: Date): [DatepickerState, React.Dispatch<DatepickerAction>] => {
  const initialState: DatepickerState = {
    selectedDate: initial || new Date(),
    viewedDate: initial || new Date(),
    weekGrid: [[]],
    monthGrid: [[]],
    showPicker: false,
    yearMode: false,
  };

  const [datepickerState, dispacth] = useReducer(reducer, initialState);
  return [datepickerState, dispacth];
};

export default UseDatepicker;
