# 🛒 E-commerce Application

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![AWS S3](https://img.shields.io/badge/Amazon_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![DynamoDB](https://img.shields.io/badge/Amazon_DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Maven](https://img.shields.io/badge/Apache_Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

A full-stack e-commerce application using **serverless architecture** for backend and **React** for frontend.  
Supports image uploads via **Cloudinary** (Lambda) or **S3** (Spring Boot) and uses **DynamoDB** for product storage.

---

## 📁 Project Structure

```
.
├── aws-lambda/     # Lambda function backend (Cloudinary + DynamoDB)
├── ecommerce/      # Spring Boot backend (S3 + DynamoDB)
└── my-app/         # React frontend
```

---

## ✨ Features

- 📦 Upload product images via **Cloudinary** or **S3**
- 🗄️ Store product data in **DynamoDB**
- ⚡ Serverless backend using **AWS Lambda**
- ⚛️ React frontend integrated with backend APIs
- 🔀 API Gateway supports **binary media types** for image uploads

---

## 🚀 Quick Start

1. Fill in all environment variables in your properties or Lambda configuration
2. Build and deploy backend (`aws-lambda/` or `ecommerce/`)
3. Build and deploy frontend (`my-app/dist/`)
4. Test all endpoints and upload functionality

---

## ⚛️ Frontend Deployment (React)

### 1. Update `vite.config.js`

Navigate to `my-app/` and open `vite.config.js`. Change the base path:

```javascript
// Before
base: './'

// After
base: '/'
```

### 2. Build the Frontend

```bash
cd my-app
npm install
npm run build
```

### 3. Deploy

Upload all contents of the `dist/` folder to your hosting platform (e.g., S3, Netlify, Vercel).

---

## ⚡ AWS Lambda Deployment

### 1. Build and Package

```bash
cd aws-lambda
mvn clean package
```

### 2. Deploy to AWS

- Create a Lambda function in the AWS Console
- Upload the generated `.zip` file

### 3. Configure Environment Variables

| Variable | Description |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `DYNAMODB_TABLE_NAME` | Your DynamoDB table name |
| `AWS_REGION` | Your AWS region |

---

## 🔌 API Gateway Configuration

### Enable Binary Media Types

Add the following binary media types in your API Gateway settings:

- `multipart/form-data`
- `image/png`
- `image/jpeg`

### Connect & Test

1. Connect the API Gateway to your Lambda function
2. Test endpoints to ensure image upload works correctly

---

## 🌱 Backend Deployment (Spring Boot)

### 1. Build the Backend

```bash
cd ecommerce
mvn clean package
```

### 2. Deploy

Deploy the generated Spring Boot `.jar` to your server (EC2, ECS, or any hosting platform).

### 3. Configure Environment Variables

| Variable | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | Your AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key |
| `AWS_REGION` | Your AWS region |
| `S3_BUCKET_NAME` | Your S3 bucket name |
| `DYNAMODB_TABLE_NAME` | Your DynamoDB table name |

---

## 📝 Notes

- Ensure proper **IAM roles and permissions** for Lambda, API Gateway, S3, and DynamoDB
- Frontend must point to the **correct API endpoint URLs**
- For image uploads via Lambda, make sure `multipart/form-data` is enabled in API Gateway
- **DynamoDB tables** should be pre-created or configured in your environment
- Use **HTTPS** endpoints in production for all API calls

