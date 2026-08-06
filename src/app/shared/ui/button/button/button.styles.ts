import { ButtonSize, ButtonVariant } from './button.types';

export const BUTTON_VARIANTS_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export const BUTTON_SIZES_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const BUTTON_BASE_CLASSES =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
