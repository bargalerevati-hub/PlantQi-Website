# Collecting orders in Google Sheets

Every order placed on the website becomes a row in a Google Sheet, and you get an email at hello@plantqi.com. Contact-form messages go to a second tab in the same sheet.

```
Checkout  →  /api/order (Vercel)  →  Google Apps Script  →  "Orders" tab + email
                 checks details,          checks the secret,
                 sets prices from         adds the row
                 the catalogue
```

The customer sees "Order placed" only after the sheet confirms the row was saved.

Setup takes about 5 minutes. Do it while signed in to the Google account that should own the orders.

## 1. Create the sheet and add the script

1. Go to [sheets.new](https://sheets.new) and name the sheet, for example **Plant Qi orders**.
2. Open **Extensions → Apps Script**.
3. Delete everything in `Code.gs`, then paste in the contents of [`google-apps-script/Code.gs`](../google-apps-script/Code.gs).
4. Click **Save** (the disk icon).

## 2. Set the secret

The secret stops anyone except your website from adding rows.

1. Make up a long random password, for example by running `openssl rand -hex 24` in Terminal, or use a password manager.
2. In Apps Script, click **Project Settings** (gear icon) → **Script Properties** → **Add script property**.
3. Property: `SECRET`. Value: your password. Click **Save script properties**.

## 3. Deploy the script as a web app

1. Click **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
2. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
   "Anyone" is needed so Vercel can reach the script. The secret is what keeps others out.
3. Click **Deploy**, then **Authorize access**, and allow the permissions. Google may say the app isn't verified: click **Advanced → Go to (project name)**. This is your own script.
4. Copy the **Web app URL** (it ends in `/exec`). Opening it in a browser should show `{"ok":true,"service":"Plant Qi orders"}`.

## 4. Add the settings in Vercel

In Vercel, open **Project → Settings → Environment Variables** and add:

| Name                | Value                         |
| ------------------- | ----------------------------- |
| `SHEET_WEBHOOK_URL` | the Web app URL from step 3   |
| `SHEET_SECRET`      | the same password as step 2   |

Then go to **Deployments**, open the latest one, and click **⋯ → Redeploy**. Environment variables only take effect after a redeploy.

## 5. Test

Place a test order on the live site. Within a few seconds you should see:

- a new **Orders** tab in the sheet with your order as a row
- an email at hello@plantqi.com

Delete the test row afterwards. Contact messages create a **Messages** tab the first time one arrives.

## Day to day

- The **Status**, **Paid**, **Shipped** and **Tracking** columns are yours to fill in as you confirm orders on WhatsApp. The website only ever adds new rows.
- Don't rename the tabs or change the header row. The script matches columns by their header text. You can add your own columns to the right.
- **Changed the script?** Use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. This keeps the same URL. A "New deployment" creates a new URL that you'd have to update in Vercel.

## Troubleshooting

If checkout says "Your order could not be sent", open Vercel → **Logs** and look for `order save failed`:

- `SHEET_WEBHOOK_URL and SHEET_SECRET are not set`: add both variables, then redeploy.
- `unauthorised`: the two secrets don't match exactly. Check for extra spaces.
- An HTML error or a 401/403 status: the web app's access isn't set to **Anyone**, or the URL is a `/dev` URL rather than `/exec`.

Running locally with `npm run dev` has no API, so checkout runs in preview mode and saves nothing. To test the API locally, use `npx vercel dev` with a `.env` file (see `.env.example`).
