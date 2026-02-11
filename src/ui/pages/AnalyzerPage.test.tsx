// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnalyzerPage } from './AnalyzerPage';

describe('AnalyzerPage smoke', () => {
  it('filters industry options by search text', () => {
    render(<AnalyzerPage />);
    fireEvent.change(screen.getByPlaceholderText('Buscar industria por nombre o código…'), { target: { value: 'bank' } });
    const options = within(document.getElementById('industrySelect') as HTMLElement).getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('Banks');
  });

  it('persists language switch to localStorage', () => {
    render(<AnalyzerPage />);
    fireEvent.change(screen.getByLabelText('Idioma'), { target: { value: 'en' } });
    expect(localStorage.getItem('fundamentalAnalyzerLang')).toBe('en');
  });
});
