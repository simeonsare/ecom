export const redirectToWhatsApp = (productName: string, productPrice: number, phoneNumber: string = "+1234567890") => {
  const message = `I need this ${productName} - $${productPrice}`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};

export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/[^\d]/g, '');
};