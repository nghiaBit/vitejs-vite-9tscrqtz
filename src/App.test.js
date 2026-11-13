import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TopBar with author name', () => {
  render(<App />);
  const authorElement = screen.getByText(/Vũ Quốc Nghĩa/i);
  expect(authorElement).toBeInTheDocument();
});
