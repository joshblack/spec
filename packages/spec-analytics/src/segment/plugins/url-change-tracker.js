type Tracker = {|
  +set: (properties: mixed) => void,
  +send: (event: string, properties: mixed) => void,
|};

// The path value of the current URL.
const getPath = (): string => location.pathname + location.search;

const handleUrlChange = (tracker, historyDidUpdate) => {
  setTimeout(() => {}, 0);
};

export default (tracker: Tracker): void => {
  const { pushState, replaceState } = window.history;

  window.history.pushState = (...args) => {
    pushState(...args);
    // Our behavior
    handleUrlChange(tracker, true);
  };
  window.history.replaceState = (...args) => {
    replaceState(...args);
    // Our behavior
    handleUrlChange(tracker, false);
  };
};
