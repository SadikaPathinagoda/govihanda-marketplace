export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount) {
  return `Rs. ${Number(amount).toLocaleString('en-LK')}`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export const DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Moneragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
];

export const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Legumes', 'Spices', 'Tubers', 'Herbs', 'Other'];

export const UNITS = ['kg', 'g', 'lbs', 'ton', 'bushel', 'crate', 'bag', 'piece'];

export const QUALITY_GRADES = ['Grade A', 'Grade B', 'Grade C', 'Organic', 'Standard'];
