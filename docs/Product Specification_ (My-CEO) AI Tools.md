# **(My-CEO) AI Entrepreneurship Suite: Product Guide**

## **1\. Project Overview**

This platform provides a suite of AI-powered creative and educational tools designed specifically for students (ages 9–13). The goal is to gamify the entrepreneurship journey, allowing students to build their business identity and practice sales skills in a safe, guided environment.  
**Core Philosophy:**

* **Safe & Age-Appropriate:** All AI interactions are guard-railed for safety and positivity.  
* **Action-Oriented:** Tools focus on tangible outputs (a logo, a sales script, a profit margin).  
* **Bilingual:** Fully supports **English** and **Bahasa Melayu (Colloquial/Pasar)** to suit the local demographic.

## **2\. The Tool Suite (Scope)**

| Module Name | Status | Function |
| :---- | :---- | :---- |
| **1\. AI Logo Maker** | ✅ Ready | Generates professional business logos based on student prompts. |
| **2\. AI Sales Buddy** | ✅ Ready | Interactive roleplay simulation to practice sales pitching. |
| **3\. Profit Calculator** | ✅ Ready | Simple tool to calculate costs, selling price, and margin. |
| **4\. Mini Website** | ✅ Ready | Web builder for students to create a professional splash page. |

## **3\. Feature Spotlight: AI Sales Buddy (New)**

The **AI Sales Buddy** is a text-based roleplay simulation where students attempt to sell their product to a virtual customer. It bridges the gap between theory and the real-world "Video Pitch" assignment.

### **3.1 The "6-Turn Golden Flow"**

To maintain student focus and simulate real-world constraints (where customers are busy), the chat is strictly limited to **6 turns**.

* **Turn 1:** Greeting & First Impression.  
* **Turn 2:** The Pitch (Unique Selling Proposition).  
* **Turn 3:** Handling Objections (Quality/Taste issues).  
* **Turn 4:** Negotiation & Math (Discounts/Bundles).  
* **Turn 5:** Closing the Deal.  
* **Turn 6:** Payment & Gratitude.

### **3.2 Dynamic Customer Personas**

The AI generates a random persona every session to ensure students don't just memorize a script. They must adapt to who is in front of them.

* **Friendly:** Supportive neighbors, teachers, or peers (High budget, easy to please).  
* **Picky:** Health-conscious moms, perfectionists, or skeptical teens (High budget, high standards).  
* **Bargain Hunter:** Students with low pocket money or hagglers (Low budget, requires negotiation).

### **3.3 Educational Guardrails**

* **Math Verification:** If a student miscalculates the price (e.g., *RM5 x 2 \= RM8*), the AI will reject the sale and ask them to recalculate. It distinguishes between a **Math Error** and a **Strategic Discount**.  
* **Mood Meter:** A visual indicator (0-100) showing if the customer is happy or annoyed based on the student's politeness and responsiveness.  
* **Cultural Context:** The AI understands Malaysian context, utilizing titles like *Makcik, Adik, Bro, Boss* correctly based on the age gap between the student and the persona.

### **3.4 Post-Game Feedback (The "Reflection")**

At the end of the simulation, the student receives a report card:

1. **Social Media Review:** A fun, generated Facebook/TikTok style review from the customer (e.g., *"Sedap gila\! Seller pun friendly. 5 stars\! 🌟"*).  
2. **Coach's Corner:**  
   * **Good Point:** Highlights their strongest skill (e.g., *Politeness*).  
   * **Suggestion:** Highlights one area for improvement (e.g., *Upselling*).

## **4\. Feature Spotlight: AI Logo Maker**

This tool allows students to visualize their company brand. It uses a tiered system to manage costs while ensuring access for all.

### **4.1 Plan Tiers & Capabilities**

| Feature | Free Plan | Premium Plan |
| :---- | :---- | :---- |
| **AI Provider** | Standard (Fast) | High-Quality (Imagen 4\) |
| **Generations** | Unlimited | Max 10  Attempts |
| **Images per Gen** | 3 Variations | 1 Variation |
| **Quality** | Conceptual/Draft | Production/HD Quality |
| **Access** | Available to all | Available with limit |

### 

### **4.2 Workflow**

1. **Input:** Student enters Company Name, Business Type (e.g., Food & Bev), and Vibe (e.g., Fun, Modern).  
2. **Generate:** AI creates unique images based on inputs.  
3. **Select:** Student selects their "Final Logo". This locks the choice and associates it with their company profile in the database.

## **5\. Feature Spotlight: Profit Calculator**

A utility tool to teach financial literacy.

* **Inputs:** Cost of Raw Materials, Packaging Cost, Other Costs.  
* **Process:** Student sets a desired **Selling Price**.  
* **Output:** The system calculates:  
  * **Profit per Unit** (RM)  
  * **Profit Margin** (%)  
  * **Verdict:** system advises if the margin is too low (\<20%), healthy (20-50%), or too high/expensive (\>70%).

## **6\. Feature Spotlight: Mini Website**  
A simple, block-based builder that lets students launch a "Mobile-Ready" business page in minutes. No coding required.

**6.1 "Pick & Mix" Design Blocks**  
Instead of starting from scratch, students choose from professional pre-set layouts for:

* **Hero Section:** First impressions (e.g., Cinematic video or Split-screen).  
* **Unique Selling Points (USP):** Highlight why they are special (e.g., Timeline or Badges).  
* **Social Proof:** Show off reviews (e.g., Chat Bubbles or Photo Grid).  
* **Products:** Showcase items (e.g., Carousel or Bundles).

**6.2 Built-in Marketing Coach**  
An assistant that watches them build. It gives real-time tips (e.g., *"Add 2 more reviews to increase trust!"*) and awards a **Marketing Score (0-100)**. It's not just a builder; it's a teacher.

**6.3 Instant Mobile Publishing**  
* **Live Preview:** Toggle between Desktop and Mobile views while editing.
* **One-Click Launch:** Generates a public link instantly (e.g., `myceo.tools/site/my-cookie-shop`).

## **7\. User Roles & Permissions**

| Role | Access Rights |
| :---- | :---- |
| **Student** | **Creator.** Can generate logos, play simulations, and save their results. Can only view their own data. |
| **Parent** | **Viewer.** Can view the creations (logos/scores) of their linked children. Cannot edit or delete. |
| **Admin/Teacher** | **Moderator.** Full view of all student activities. Can moderate inappropriate content (though AI filters prevent most of this). |

## 

## **8\. Safety & Compliance**

* **Privacy First:** No student personal data (PII) is sent to the AI models. Only generic prompts (e.g., "A logo for a cookie shop") are processed.  
* **Content Filtering:** The AI models are configured to reject inappropriate, violent, or unsafe prompts automatically.  
* **Data Retention:**  
  * **Persisted:** Selected Logos, Sales Buddy Scores/Feedback.  
  * **Not Persisted:** Draft logos, intermediate chat logs (to save storage and costs).