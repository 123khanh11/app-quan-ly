/**
 * Parse shipping address from full address string
 * Splits address into: street, ward, district, city, postal_code
 */

export const parseAddress = (fullAddress) => {
  if (!fullAddress) {
    return {
      street: '',
      ward: '',
      district: '',
      city: '',
      postal_code: '',
    };
  }

  // Split by comma to get components
  const parts = fullAddress.split(',').map(p => p.trim());

  // Detect city (usually contains "Hà Nội", "TP HCM", "Đà Nẵng", etc.)
  let city = '';
  let district = '';
  let ward = '';
  let street = '';
  let postal_code = '';

  if (parts.length > 0) {
    // Last part is usually city
    city = parts[parts.length - 1];
    
    // Check for postal code in last part
    const postalMatch = city.match(/\d{5,6}/);
    if (postalMatch) {
      postal_code = postalMatch[0];
      city = city.replace(postal_code, '').trim();
    }

    // Second to last is usually district
    if (parts.length > 1) {
      district = parts[parts.length - 2];
    }

    // Third to last is usually ward
    if (parts.length > 2) {
      ward = parts[parts.length - 3];
    }

    // Remaining parts are street
    if (parts.length > 3) {
      street = parts.slice(0, parts.length - 3).join(', ');
    } else if (parts.length === 1) {
      street = parts[0];
    }
  }

  return {
    street: street || '',
    ward: ward || '',
    district: district || '',
    city: city || '',
    postal_code: postal_code || '',
  };
};

export const formatAddress = (address) => {
  if (!address) return '';
  
  const { street, ward, district, city, postal_code } = address;
  const parts = [street, ward, district, city, postal_code].filter(p => p && p.trim());
  
  return parts.join(', ');
};

export default parseAddress;
