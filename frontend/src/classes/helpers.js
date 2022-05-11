import { toast } from 'react-toastify';

export function formatCurrency(amount) {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  });

  return formatter.format(amount);
}

export function handleServerError(error) {
  try {
    toast.error(error.response.data.message);
  } catch (_e) {
    toast.error(error.message);
  }
}