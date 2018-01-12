/* @noflow */

import React from 'react';
import PropTypes from 'prop-types';

// Helper component for rendering external links with the proper `rel`
// attributes
const ExternalLink = ({ href, children, className, style, ...props }) => (
  <a
    href={href}
    style={style}
    className={className}
    target="_blank"
    rel="noopener noreferrer"
    {...props}>
    {children}
  </a>
);

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ExternalLink;
