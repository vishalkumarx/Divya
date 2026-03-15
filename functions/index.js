const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const axios = require("axios");
const logger = require("firebase-functions/logger");

admin.initializeApp();

// META WHATSAPP API CONFIGURATION
// These are TEMPORARY sandbox values! The user MUST replace these with their own values from the Meta Developer Dashboard.
const WHATSAPP_PHONE_NUMBER_ID = "1029725366891131"; 
const WHATSAPP_ACCESS_TOKEN = "EAATMge9AI4cBQ71Yh1j0LA5rZBvH9tUsxjGu9OzmlmOisFLTHau38Y3EWvn1NyxP8ZC7ZB6CgCZAZBGGOnTcvBG1789TeeGgUJ6nR99FcQGFltvsG1CKV4KdoGMRjK8nqoG6yZBZCqqSByGhSqTv57aPAI83MpfxOZBv3nUGZAZCRB9wMgemZAmiC7MB1QT6cTATjert4EWGJ4OZBubE1z4gfQofMsgZAnaQ0rwelBv4TJiya7vMbQGdWdBsGJT61G9itrZBHXhnxDePkYlR3srFU9gFJiNVmmwwZDZD";

exports.sendWhatsAppConfirmation = onDocumentCreated("appointments/{docId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.log("No data associated with the event");
    return;
  }
  
  const data = snapshot.data();
  const patientPhone = data.phone;
  const patientName = data.name;

  // Format the phone number (WhatsApp API typically requires the country code without the '+' sign)
  // For safety, let's strip out any non-numeric characters the user might have typed.
  const formattedPhone = patientPhone.replace(/\D/g, '');

  logger.log(`New appointment booked! Sending WhatsApp message to: ${formattedPhone}`);

  try {
    const response = await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: "hello_world", // Using the default Meta test template name
          language: {
            code: "en_US"
          }
        }
      }
    });

    logger.log("WhatsApp message sent successfully:", response.data);
    
    // Optionally flag the document in Firestore to show the confirmation was sent
    await snapshot.ref.update({ confirmationSent: true });

  } catch (error) {
    logger.error("Failed to send WhatsApp message:", error.response ? error.response.data : error.message);
  }
});
