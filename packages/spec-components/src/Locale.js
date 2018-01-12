/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, addLocaleData } from 'react-intl';

import type { Node } from 'react';

type Props = {
  language: string,
  locale?: string,
  loadMessages: (
    language: string,
    locale?: string
  ) => Promise<{ [key: string]: string }>,
  render: (error: ?Error, isLoading: boolean) => Node,
};

type State = {
  error: ?Error,
  messages: ?{ [key: string]: string },
  isLoading: boolean,
};

export default class Locale extends React.Component<Props, State> {
  static propTypes = {
    language: PropTypes.string.isRequired,
    locale: PropTypes.string,
    loadMessages: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired,
  };

  state = {
    error: null,
    messages: null,
    isLoading: true,
  };

  componentDidMount() {
    const { language, locale, loadMessages } = this.props;
    const handleSuccess = ([messages]) => {
      this.setState({ error: null, isLoading: false, messages });
    };
    const handleError = error => {
      this.setState({ error, isLoading: false });
    };

    Promise.all([loadMessages(language, locale), this.loadLocaleData(language)])
      .then(handleSuccess, handleError)
      .catch(handleError);
  }

  loadLocaleData = (language: string) =>
    // $FlowFixMe
    import(`react-intl/locale-data/${language}`).then(localeData => {
      addLocaleData(localeData);
    });

  render() {
    const { language, locale, render } = this.props;
    const { error, isLoading, messages } = this.state;

    if (error !== null || isLoading) {
      return render(error, isLoading);
    }

    const providerLocale = locale === undefined ? language : locale;

    return (
      <IntlProvider locale={providerLocale} messages={messages}>
        {render(error, isLoading)}
      </IntlProvider>
    );
  }
}
