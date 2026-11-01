/**
 * Medical Blood Group Compatibility Matrix for all 8 blood groups
 */

export const ALL_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BLOOD_COMPATIBILITY = {
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    rarity: 'Common (~31% in India)',
    notes: 'Can safely receive from A and O types.'
  },
  'A-': {
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-'],
    rarity: 'Rare (~1.5% in India)',
    notes: 'Crucial for Rh-negative recipients.'
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    rarity: 'Very Common (~34% in India)',
    notes: 'Most prevalent blood group in India.'
  },
  'B-': {
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-'],
    rarity: 'Rare (~1.8% in India)',
    notes: 'Essential for B-negative patients.'
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    rarity: 'Uncommon (~8% in India)',
    notes: 'Universal Red Cell Recipient. Can receive any blood group.'
  },
  'AB-': {
    canDonateTo: ['AB+', 'AB-'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    rarity: 'Very Rare (~0.5% in India)',
    notes: 'Can receive from all Rh-negative donors.'
  },
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    rarity: 'Common (~30% in India)',
    notes: 'Can donate to any positive blood group.'
  },
  'O-': {
    canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    canReceiveFrom: ['O-'],
    rarity: 'Rare (~1.4% in India)',
    notes: 'Universal Red Cell Donor. Critically needed in trauma emergencies.'
  }
};

/**
 * Checks if donor blood is compatible with recipient
 */
export const isCompatible = (donorGroup, recipientGroup) => {
  if (!BLOOD_COMPATIBILITY[recipientGroup]) return false;
  return BLOOD_COMPATIBILITY[recipientGroup].canReceiveFrom.includes(donorGroup);
};

/**
 * Returns array of compatible donor blood groups for a given patient/recipient
 */
export const getCompatibleDonorGroups = (recipientGroup) => {
  return BLOOD_COMPATIBILITY[recipientGroup]?.canReceiveFrom || [];
};
