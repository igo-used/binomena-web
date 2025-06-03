# BNM Token Presale Implementation Guide

## 🚀 **Current Status**
✅ **Presale page created** with 3-stage structure  
✅ **Payment flow designed** for USDT integration  
✅ **API framework ready** for blockchain integration  
⏳ **Next: Configure payment address and blockchain connection**

## 📊 **Presale Structure**
- **Stage 1**: 35M BNM @ $0.09 (June 1 - Dec 31, 2025)
- **Stage 2**: 20M BNM @ $0.40  
- **Stage 3**: 20M BNM @ $0.80
- **Public Launch**: $1.00+

---

## 🛠 **Implementation Options**

### **Option A: Quick Start (Semi-Automated)**
*Recommended for immediate launch*

#### **Step 1: Configure USDT Address**
1. Open `lib/presale-api.ts`
2. Replace `YOUR_BINANCE_USDT_ADDRESS_HERE` with your actual Binance USDT address
3. Ensure it supports both TRC20 and ERC20 networks

#### **Step 2: Set Up Monitoring System**
Create a script to monitor USDT deposits:

```javascript
// scripts/monitor-payments.js
const axios = require('axios')

async function monitorUSDTPayments() {
  // Check Binance API or blockchain explorer for new USDT deposits
  // Match amounts with pending purchases
  // Automatically send BNM tokens when confirmed
}

setInterval(monitorUSDTPayments, 60000) // Check every minute
```

#### **Step 3: Integrate with Binomena Blockchain**
Update the `sendBNMTokens` function in `lib/presale-api.ts`:

```typescript
static async sendBNMTokens(walletAddress: string, amount: number) {
  const response = await fetch('https://binomena-node.onrender.com/api/transfer', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_NODE_API_KEY'
    },
    body: JSON.stringify({
      from: 'YOUR_PRESALE_WALLET',
      to: walletAddress,
      amount: amount,
      currency: 'BNM'
    })
  })
  return response.json()
}
```

---

### **Option B: Smart Contract (Recommended Long-term)**
*Most professional and automated*

#### **Smart Contract Features Needed:**
```solidity
contract BNMPresale {
    // Track presale stages and pricing
    struct Stage {
        uint256 tokenAmount;
        uint256 pricePerToken;
        uint256 soldTokens;
        bool active;
    }
    
    // Accept USDT payments
    function buyTokens(uint256 usdtAmount) external {
        // Verify USDT transfer
        // Calculate BNM tokens based on current stage
        // Transfer BNM tokens to buyer
        // Update stage progress
    }
    
    // Automatic stage progression
    function advanceStage() internal {
        // Move to next stage when current stage is sold out
    }
}
```

---

## ⚙️ **Required Configurations**

### **1. Environment Variables**
Create `.env.local`:
```bash
NEXT_PUBLIC_PRESALE_API_URL=https://binomena-node.onrender.com
BINANCE_USDT_ADDRESS=your_binance_usdt_address
BINOMENA_NODE_API_KEY=your_api_key
PRESALE_WALLET_PRIVATE_KEY=your_presale_wallet_key
```

### **2. Database Setup**
Choose one:
- **Supabase** (recommended for quick setup)
- **Firebase** (Google-based)
- **PostgreSQL** (self-hosted)
- **Simple JSON files** (for testing)

Store purchase records:
```json
{
  "purchaseId": "BNM_1685123456_abc123",
  "walletAddress": "0x...",
  "tokenAmount": 10000,
  "usdtAmount": 900,
  "status": "pending_payment",
  "createdAt": "2025-06-01T10:00:00Z",
  "confirmedAt": null,
  "txHash": null
}
```

### **3. Payment Monitoring**
Options for monitoring USDT payments:

#### **A. Binance API**
```javascript
const binance = require('node-binance-api')
// Monitor deposit history for your USDT address
```

#### **B. Blockchain Explorers**
- **Tron (TRC20)**: https://apilist.tronscan.org/
- **Ethereum (ERC20)**: https://api.etherscan.io/

#### **C. Webhook Services**
- **Moralis**: Real-time blockchain webhooks
- **Alchemy**: Ethereum notifications

---

## 🔒 **Security Considerations**

### **Critical Security Steps:**
1. **Separate Hot/Cold Wallets**
   - Use hot wallet for small amounts only
   - Store bulk BNM tokens in cold storage
   
2. **Rate Limiting**
   - Prevent spam purchases
   - Implement CAPTCHA for large amounts

3. **Transaction Verification**
   - Always verify USDT payments on-chain
   - Don't rely on centralized APIs alone

4. **Audit Trail**
   - Log all transactions
   - Keep detailed records for compliance

---

## 📧 **Communication Setup**

### **Email Notifications**
Integrate with:
- **SendGrid**
- **Mailgun** 
- **AWS SES**

Send emails for:
- Purchase confirmation
- Payment instructions
- Token delivery confirmation
- Payment issues

### **Support System**
Current contact methods:
- Email: juxhino.kap@yahoo.com
- Instagram: @juxhino_kapllanaj

Consider adding:
- Live chat widget
- Telegram support group
- FAQ section

---

## 🚦 **Launch Checklist**

### **Before Going Live:**
- [ ] Replace placeholder USDT address
- [ ] Test payment flow with small amounts
- [ ] Verify blockchain connectivity
- [ ] Set up monitoring systems
- [ ] Configure email notifications
- [ ] Test token transfer functionality
- [ ] Security audit (if using smart contracts)
- [ ] Legal compliance check
- [ ] Prepare customer support

### **Marketing Preparation:**
- [ ] Update website with presale details
- [ ] Prepare social media content
- [ ] Create presale announcement
- [ ] Set up analytics tracking
- [ ] Prepare press releases

---

## 🎯 **Recommended Next Steps**

1. **Immediate (Today)**:
   - Add your real Binance USDT address
   - Test the payment flow

2. **This Week**:
   - Set up basic payment monitoring
   - Configure blockchain API connection
   - Test end-to-end token delivery

3. **Before Launch**:
   - Implement proper database storage
   - Set up automated monitoring
   - Security testing

4. **Future Enhancements**:
   - Smart contract implementation
   - Advanced analytics
   - Mobile app integration

---

## 💡 **My Recommendation**

**Start with Option A (Semi-Automated)** for these reasons:

✅ **Quick to implement** - Can be live within days  
✅ **Lower complexity** - Easier to debug issues  
✅ **Proven approach** - Many successful presales use this method  
✅ **Cost effective** - No smart contract development costs  
✅ **Full control** - You manage all aspects

Once you've successfully run Stage 1, you can upgrade to a smart contract for Stages 2 and 3.

**Would you like me to help implement any specific part of this setup?** 