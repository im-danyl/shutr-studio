# GPT Image 1 Product-in-Scene Implementation Guide

## 🧠 Goal

Enable users to upload:
- A **product image** (with or without background)
- A **lifestyle/reference image** (scene)
- (Optional) a **mask image** for controlled blending
- Automatically **blend them** into photorealistic images using `gpt-image-1` while preserving **brand accuracy**

## ✅ Why Use GPT Image 1 for This

- Supports **multiple image inputs**
- Allows **compositional prompting** (place product in scene)
- Optional **masking** to control areas being changed
- Superior **text/logo rendering** compared to previous models

## 📦 Required Setup

### 🔧 Tools
- ✅ OpenAI API access (with org verified for image endpoint)
- ✅ Backend server (Node.js/React existing stack)
- ✅ File storage (Supabase - already implemented)
- ✅ Frontend upload UI (React - existing)

## 🪜 Step-by-Step Implementation

### STEP 1: User Upload Flow
Users upload:
1. **Product image** (`product.jpg/png`) — ideally transparent PNG
2. **Scene image** (`scene.jpg`) — natural/lifestyle background
3. (Optional) **Mask image** (`mask.png`) — defines overwrite areas

### STEP 2: Store and Get Public URLs
- Save to Supabase storage (existing system)
- Get **public URLs or base64 blobs** (OpenAI supports both)
- Base64 encoding before API call for reliability

### STEP 3: Prepare Prompt and Parameters

**Goal of prompt**: Clear, visually focused instructions

#### ✅ Prompt Template:
```text
Place the product from the first image naturally into the scene from the second image. Make it appear realistic and consistent with the scene lighting, shadows, and materials.
```

### STEP 4: GPT Image 1 API Call (Pseudocode)

```javascript
async function generateProductInScene(productImage, sceneImage, maskImage = null) {
  const productBase64 = await convertToBase64(productImage);
  const sceneBase64 = await convertToBase64(sceneImage);
  const maskBase64 = maskImage ? await convertToBase64(maskImage) : null;

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: "Place the product from the first image into the second image as a realistic lifestyle scene.",
    images: [sceneBase64, productBase64],
    mask: maskBase64,
    size: "1024x1024",
    quality: "high",
    output_format: "png",
    response_format: "b64_json"
  });

  return response.data[0].b64_json;
}
```

### STEP 5: Decode and Display

```javascript
const generatedImageBase64 = await generateProductInScene(product, scene);
const generatedImage = decodeBase64(generatedImageBase64);
// Display to user
```

## 🧪 Optional: GPT-4o QA Filter

After generation, verify with GPT-4o:
```text
Does the generated image preserve the exact branding and appearance of the original product? Is the placement visually accurate?
```

## 📐 Optional: Masking Strategy

Generate mask programmatically:
- **White** = area to change (scene zone)
- **Black** = protected area (product zone)
- Use tools like `rembg` or manual creation

## 🧰 Final API Payload Shape

```json
{
  "model": "gpt-image-1",
  "prompt": "Place the product from the first image into the second image as a realistic lifestyle scene.",
  "images": ["base64_scene", "base64_product"],
  "mask": "base64_mask", // optional
  "size": "1024x1024",
  "quality": "high",
  "response_format": "b64_json",
  "output_format": "png"
}
```

## 📌 Tips for Best Results

| Tip | Why It Matters |
|-----|----------------|
| Use transparent product PNG | Better compositing, no background interference |
| Keep prompt concise | gpt-image-1 doesn't like long prompts |
| Mask only if needed | Scene only needs overwriting if very specific |
| Use "high" quality | Worth the small cost increase |
| Base64 images preferred | Faster and more reliable for API payload |

## 🚀 Example Use Case Flow

```
User uploads product & scene images
    ↓
Backend encodes to base64
    ↓
Prompt is auto-inserted
    ↓
Call GPT-Image-1 API with images + prompt
    ↓
Receive base64 image → decode
    ↓
Show final image to user
```

## ✅ Integration with Existing Shutr Studio Architecture

### Current System Integration Points:
- **`/src/lib/openai.js`** - Add new productInScene function
- **`/src/hooks/useGeneration.js`** - Extend for dual-image workflow
- **`/src/pages/Generate.jsx`** - Add product-in-scene mode UI
- **`/src/lib/generations.js`** - Update database schema for dual images

### Implementation Strategy:
1. Extend existing OpenAI integration
2. Add new generation mode alongside current style transfer
3. Reuse existing UI components with dual upload capability
4. Maintain current persistence and download functionality

## 🔧 Technical Implementation Notes

- **Preserve existing fallback system** (GPT Image 1 → DALL-E 3)
- **Reuse credit management** and generation tracking
- **Extend database schema** to support product+scene image pairs
- **Maintain mobile responsiveness** for dual image uploads

---

*This guide provides the framework for implementing GPT Image 1 product-in-scene generation while leveraging the existing Shutr Studio architecture and maintaining backward compatibility with current features.*