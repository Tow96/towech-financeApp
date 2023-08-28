import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

// Types ----------------------------------------------------------------------
export type NavIcon = {
  title: string;
  icon: IconProp;
  route: string;
};
export type state = {
  collapsed: boolean;
  items: NavIcon[];
  title: string;
};

// NGRX -----------------------------------------------------------------------
export const navBarActions = createActionGroup({
  source: 'Navbar',
  events: {
    forceCollapse: emptyProps(),
    toggleCollapse: emptyProps(),
    changeTitle: props<{ payload: string }>(),
  },
});

export const navContents: NavIcon[] = [
  { title: 'Transactions', icon: 'money-check-dollar', route: '' },
  { title: 'Settings', icon: 'gear', route: 'settings' },
];

export const getTitleFromRoute = (items: NavIcon[], route: string): string =>
  items.find(x => x.route === route)!.title; // eslint-disable-line
