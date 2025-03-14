/**
 * Formats a number as Ugandan Shillings (UGX)
 * @param amount - The amount to format
 * @param includeSymbol - Whether to include the UGX symbol
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string | undefined, includeSymbol = true): string {
  // Handle undefined, NaN or invalid values
  if (amount === undefined || amount === null || amount === '') {
    return includeSymbol ? 'UGX 0' : '0';
  }
  
  // Convert string to number if necessary
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check for NaN after conversion
  if (isNaN(numericAmount)) {
    return includeSymbol ? 'UGX 0' : '0';
  }
  
  // Format with comma separators for thousands
  const formattedAmount = numericAmount.toLocaleString('en-UG');
  
  // Return with or without currency symbol
  return includeSymbol ? `UGX ${formattedAmount}` : formattedAmount;
} 