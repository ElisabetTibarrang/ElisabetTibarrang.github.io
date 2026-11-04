// src/config/contact.mjs
//
// Contact form. It is OFF in this starter: /contact-us/ shows your contact
// cards and a note, and the API route answers 404.
//
// To turn it on:
//   1. Get an email handler as described in docs/features/contact-form.md.
//      You need its URL, a tenant ID and a token.
//   2. Set `enabled: true` and paste the URL into `handlerUrl` below.
//   3. Keep the tenant ID and token OUT of this file:
//        local:   TENANT_ID and TENANT_API_TOKEN in .dev.vars
//        deploy:  wrangler secret put TENANT_ID
//                 wrangler secret put TENANT_API_TOKEN
//
// When on, the browser posts to /api/contact/ (src/pages/api/contact.ts), which
// forwards the message to the handler. The handler sends the email; there is
// nothing to configure per mail provider.

export const contactConfig = {
  // false = no form on /contact-us/ and /api/contact/ answers 404.
  enabled: false,

  // EDIT when you turn the form on: the https URL of your email handler.
  handlerUrl: "",

  // EDIT: options in the Subject dropdown. The API accepts only these values.
  subjects: [
    "General question",
    "Support",
    "Feedback",
    "Business enquiry",
  ],
};

export default contactConfig;
