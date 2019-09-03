import { configure, addParameters } from '@storybook/react';
import { themes } from '@storybook/theming';

// Option defaults.
addParameters({
  options: {
    theme: themes.dark,
  },
});

const req = require.context('../stories', true, /.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);