const NAME_REGEX = /^[A-Za-z]+( [A-Za-z]+)*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateFirstName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return 'First name is required';
  if (trimmed.length < 2) return 'Must be at least 2 characters';
  if (!NAME_REGEX.test(trimmed)) return 'Letters and single spaces only';
  return null;
}

export function validateLastName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return 'Last name is required';
  if (trimmed.length < 3) return 'Must be at least 3 characters';
  if (!NAME_REGEX.test(trimmed)) return 'Letters and single spaces only';
  return null;
}

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return 'Email is required';
  if (!EMAIL_REGEX.test(trimmed)) return 'Enter a valid email address';
  return null;
}

export function calculateAge(dob: Date, today: Date = new Date()): number {
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

export function validateDob(dob: Date | null): string | null {
  if (!dob) return 'Date of birth is required';
  if (calculateAge(dob) < 16) return 'You must be at least 16 years old';
  return null;
}
