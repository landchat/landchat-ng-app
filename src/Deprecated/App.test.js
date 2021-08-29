import { render, screen } from '@testing-library/react';
import Welcome from './Welcome';

test('Renders LandChat 2021 Title', () => {
  render(<Welcome/>);
  const titleElement = screen.getByText(/LandChat 2021/i);
  expect(titleElement).toBeInTheDocument();
});
