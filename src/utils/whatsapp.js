export const sendWhatsAppInquiry = (config, phoneNumber = "916383236623") => {
  const formatNum = (val) => (val !== undefined && val !== null ? Number(val).toFixed(1) : "0.0");

  const message = 
`*New Custom Door Inquiry* 🚪\n` +
`--------------------------------\n` +
`• *Company:* JANA FIBRE GLASS\n` +
`• *Door Style:* Custom Parametric Door & Frame\n` +
`• *Dimensions:*\n` +
`   - Width: ${formatNum(config.width)} cm\n` +
`   - Height (Left): ${formatNum(config.leftHeight)} cm\n` +
`   - Height (Right): ${formatNum(config.rightHeight)} cm\n` +
`   - Thickness: ${formatNum(config.thickness)} cm\n` +
`• *Finish / Color:* ${config.colorName} (${config.colorHex})\n` +
`--------------------------------\n` +
`Hi, I would like to get a price quote and lead time for this custom configuration.`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
};
