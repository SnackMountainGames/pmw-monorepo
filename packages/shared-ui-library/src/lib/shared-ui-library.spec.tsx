import { render } from '@testing-library/react';

import SharedUiLibrary from './shared-ui-library';

describe('SharedUiLibrary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SharedUiLibrary />);
    expect(baseElement).toBeTruthy();
  });
});
