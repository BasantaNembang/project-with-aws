# 🚀 Deploy React + Vite App on AWS EC2 with Auto Scaling & Load Balancer

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![AWS EC2](https://img.shields.io/badge/Amazon_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![AWS ALB](https://img.shields.io/badge/AWS_Load_Balancer-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)

This guide explains how to deploy a **React + Vite** application on AWS EC2 private instances using a **Bastion Server**, **Auto Scaling Group**, and an **Application Load Balancer (ALB)**.

---

## Architecture Overview

The setup includes:

- ☁️ **VPC** — isolated network environment
- 🖥️ **Auto Scaling Group** — two private EC2 instances
- 🔐 **Bastion / Jump Server** — SSH access to private instances
- ⚖️ **Application Load Balancer (ALB)** — distributes incoming traffic
- 🎯 **Target Group** — connected to private instances
- 🌐 **Nginx** — serves static build files

```
Internet
   │
Application Load Balancer (HTTP : 80)
   │
Target Group
   │
Private EC2 Instances (Nginx + React Build)
   │
Bastion Server (SSH Access)
```

---

##  Deployment Steps

### Step 1: Connect to Private EC2 via Bastion Server

SSH into your private instance through the Bastion server:

```bash
ssh -i my-key.pem ubuntu@YOUR_PRIVATE_IP
```

---

### Step 2: Update the Server

```bash
sudo apt update
sudo apt upgrade -y
```

---

### Step 3: Install Node.js

```bash
sudo apt install nodejs npm -y
```

Verify installation:

```bash
node -v
npm -v
```

---

### Step 4: Clone the React + Vite Project

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

---

### Step 5: Install Dependencies

```bash
npm install
```

---

###  `npm run dev` Should NOT Be Used in Production

Running `npm run dev` starts the Vite **development server**, which is unsuitable for production because:



✅**Solution — Build Static Files:**

```bash
npm run build
```

This generates a `dist/` folder containing fully optimized static files ready for production.

---

### Step 6: Install Nginx

```bash
sudo apt install nginx -y
```

---

### Step 7: Remove Default Nginx Files

```bash
sudo rm -rf /var/www/html/*
```

---

### Step 8: Copy React Build Files to Nginx

```bash
sudo cp -r /home/ubuntu/app/dist/* /var/www/html/
```

> Replace `/home/ubuntu/app` with your actual project path.

---

### Step 9: Restart Nginx

```bash
sudo systemctl restart nginx
```

Check the status:

```bash
sudo systemctl status nginx
```

---

### Step 10: Test Locally

```bash
curl http://localhost
```

If you receive HTML output, the deployment is working correctly. ✅

---

##  Load Balancer Configuration

### Security Group (Load Balancer)

| Port | `80` |
| Source | `0.0.0.0/0` |


---

## Final Result

```
User Request
     │
Application Load Balancer
     │
Target Group
     │
Private EC2 Instances
     │
Nginx
     │
React + Vite Static Build (dist/)
```

---

| 7 | Configure Load Balancer to use port `80` |

Your React + Vite application is now **production-ready and scalable** 

