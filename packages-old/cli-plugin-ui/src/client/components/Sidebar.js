import React from 'react';
import { css } from 'glamor';
import { NavLink } from 'react-router-dom';

const links = [
  {
    to: '/plugins',
    text: 'Plugins',
  },
  {
    to: '/tasks',
    text: 'Tasks',
  },
];
const Sidebar = () => {
  return (
    <aside {...sidebar}>
      <ul {...list}>
        {links.map(link => (
          <li key={link.to} {...listItem}>
            <NavLink
              to={link.to}
              activeClassName={`${activeLink}`}
              {...listLink}>
              {link.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const sidebar = css({
  width: '240px',
  backgroundColor: '#ffffff',
});

const list = css({
  padding: 0,
  margin: 0,
  listStyle: 'none',
});

const listItem = css({
  height: '3rem',
});

const listLink = css({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  textDecoration: 'none',
  color: '#171717',
  paddingLeft: '1rem',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: '#0062FF',
    color: '#ffffff',
  },
});

const activeLink = css({
  backgroundColor: '#0062FF',
  color: '#ffffff',
});

export default Sidebar;
