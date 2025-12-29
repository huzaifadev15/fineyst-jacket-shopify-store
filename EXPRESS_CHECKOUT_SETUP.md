# How to Enable Express Checkout Buttons on Shopify

## Step 1: Enable Payment Methods in Shopify Admin

1. **Go to Shopify Admin**
   - Log in to your Shopify admin panel
   - Navigate to **Settings** > **Payments**

2. **Enable Express Checkout Options**
   - **Shop Pay**: Automatically enabled if you use Shopify Payments
   - **Apple Pay**: Enable in the "Accelerated checkout" section
   - **Google Pay**: Enable in the "Accelerated checkout" section
   - **PayPal**: Enable PayPal as a payment provider
   - **Amazon Pay**: Enable Amazon Pay if available in your region

## Step 2: Enable Dynamic Checkout Buttons in Theme Settings

1. **Access Theme Customization**
   - Go to **Online Store** > **Themes**
   - Click **Customize** on your active theme

2. **Enable Dynamic Checkout on Product Pages**
   - In the theme editor, select **Products** from the page selector
   - Choose **Default product** template
   - Find the **Buy buttons** section
   - Check the box **"Show dynamic checkout button"**
   - Click **Save**

3. **Enable Dynamic Checkout on Cart Page** (if available)
   - In theme editor, select **Cart** page
   - Look for checkout button settings
   - Enable **"Show dynamic checkout buttons"**

## Step 3: Verify Express Checkout is Working

1. **Test on Product Page**
   - Visit a product page on your storefront
   - You should see express checkout buttons (Shop Pay, Apple Pay, etc.) below the "Add to Cart" button

2. **Test on Cart Page**
   - Add items to cart
   - Go to cart page
   - Express checkout buttons should appear

3. **Test in Cart Sidebar**
   - Add items to cart
   - Open the cart sidebar
   - Express checkout buttons should appear below the regular checkout button

## Important Notes

- **Shopify Payments Required**: Shop Pay requires Shopify Payments to be set up
- **HTTPS Required**: Express checkout buttons only work on HTTPS-enabled stores
- **Browser Support**: Apple Pay works on Safari (iOS/macOS), Google Pay works on Chrome/Android
- **Geographic Availability**: Some express checkout options may not be available in all countries

## Troubleshooting

If express checkout buttons don't appear:

1. **Check Payment Settings**
   - Ensure payment methods are enabled in Settings > Payments
   - Verify your store accepts payments

2. **Check Theme Compatibility**
   - Some older themes may not support dynamic checkout buttons
   - Update your theme to the latest version

3. **Check Browser Console**
   - Open browser developer tools (F12)
   - Look for any JavaScript errors
   - Check if Shopify.dynamicPaymentButtons is available

4. **Clear Cache**
   - Clear your browser cache
   - Clear Shopify's theme cache (if using a caching app)

## Additional Resources

- [Shopify Help: Dynamic Checkout Buttons](https://help.shopify.com/en/manual/online-store/dynamic-checkout/add-buttons)
- [Shopify Help: Accelerated Checkouts](https://help.shopify.com/en/manual/payments/accelerated-checkouts)
- [Shopify Payments Setup](https://help.shopify.com/en/manual/payments/shopify-payments)

