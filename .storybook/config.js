import { configure, addParameters, addDecorator } from '@storybook/react';
import { themes } from '@storybook/theming';

// Option defaults.
addParameters({
  options: {
    theme: themes.dark,
  },
});

configure(require.context('../src', true, /.stories.tsx$/), module);