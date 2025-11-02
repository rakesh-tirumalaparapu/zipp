// Utility functions to convert backend enum values to user-friendly display names

export function formatLoanType(loanType) {
  if (!loanType) return '';
  const type = String(loanType).toUpperCase();
  switch (type) {
    case 'PERSONAL_LOAN':
    case 'PERSONAL LOAN':
      return 'Personal Loan';
    case 'HOME_LOAN':
    case 'HOME LOAN':
      return 'Home Loan';
    case 'VEHICLE_LOAN':
    case 'VEHICLE LOAN':
      return 'Vehicle Loan';
    default:
      // Fallback: convert snake_case to Title Case
      return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}

export function formatMaritalStatus(status) {
  if (!status) return '';
  const s = String(status).toUpperCase();
  switch (s) {
    case 'SINGLE':
      return 'Single';
    case 'MARRIED':
      return 'Married';
    case 'DIVORCED':
      return 'Divorced';
    case 'WIDOWED':
      return 'Widowed';
    default:
      // Fallback: capitalize first letter
      return s.charAt(0) + s.slice(1).toLowerCase();
  }
}

export function formatGender(gender) {
  if (!gender) return '';
  const g = String(gender).toUpperCase();
  switch (g) {
    case 'MALE':
      return 'Male';
    case 'FEMALE':
      return 'Female';
    case 'OTHER':
      return 'Other';
    default:
      return g.charAt(0) + g.slice(1).toLowerCase();
  }
}

export function formatOccupationType(occupationType) {
  if (!occupationType) return '';
  const type = String(occupationType).toUpperCase();
  switch (type) {
    case 'SALARIED':
      return 'Salaried';
    case 'SELF_EMPLOYED':
    case 'SELF EMPLOYED':
      return 'Self-Employed';
    default:
      return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}


