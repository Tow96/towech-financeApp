import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { createAdapter } from '@state-adapt/core';

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

// Constants ------------------------------------------------------------------
export const adapter = createAdapter<state>()({
  changeTitle$: (state, route: string) => ({
    ...state,
    title: getTitleFromRoute(state.items, route),
  }),
  forceCollapse: state => ({ ...state, collapsed: true }),
  toggleCollapse: state => ({ ...state, collapsed: !state.collapsed }),
  selectors: {
    isCollapsed: state => state.collapsed,
    items: state => state.items,
    currentTitle: state => state.title,
  },
});

export const getTitleFromRoute = (items: NavIcon[], route: string): string =>
  items.find(x => x.route === route)!.title; // eslint-disable-line

export const navContents: NavIcon[] = [
  { title: 'Transactions', icon: 'money-check-dollar', route: '' },
  { title: 'Settings', icon: 'gear', route: 'settings' },
];
