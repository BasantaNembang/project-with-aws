# CloudVault 

CloudVault is a cloud storage platform similar to Google Drive. It stores **images on Cloudinary** and **videos on AWS S3**. Videos are served via **HLS (HTTP Live Streaming)** through an Nginx proxy, enabling smooth adaptive streaming. The backend runs on an AWS EC2 instance using Docker, and the frontend is hosted on Vercel.

---
# Application Glimpse

# Deployment 

---

## 1. Launch EC2 Instance

 **Launch Instance**

Under **Network Settings**, add these inbound rules to the Security Group:
- SSH → Port 22 → Your IP
- HTTP → Port 80 → Anywhere
- HTTPS → Port 443 → Anywhere

After launching, go to **Elastic IPs → Allocate** and associate it with your instance so the IP stays fixed.

if not work also open 8080 and 9292 port

---

## 2. SSH Into the Instance



## 3. Install Docker & Docker Compose


```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
```

Verify it worked:
```bash
docker --version
docker compose version
```

---

## 4. Create the Deployment Folder

```bash
mkdir deployment
cd /deployment
mkdir /deployment/videos/hls
mkdir /deployment/videos/thumbnails
touch nginx.conf
```

---

## 6. Edit `nginx.conf`

Open the file:
```bash
nano nginx.conf
```

Find this line:
```nginx
set $s3_host "BUCKET_NAME.s3.REGION.amazonaws.com";
```

Replace `BUCKET_NAME` with your actual S3 bucket name and `REGION` with your AWS region (e.g. `us-east-1`). So it should look like:
```nginx
set $s3_host "my-app-bucket.s3.us-east-1.amazonaws.com";
```

Save 

---

## 7. Edit `docker-compose.yml`

Open the file:
```bash
nano ~/deployment/docker-compose.yml
```

Find the environment variables section and replace the placeholder values with your real credentials:

```yaml
AWS_ACCESS_KEY_ID: your_actual_aws_access_key
AWS_SECRET_ACCESS_KEY: your_actual_aws_secret_key
CLOUDINARY_API_KEY: your_actual_cloudinary_key
CLOUDINARY_API_SECRET: your_actual_cloudinary_secret
and so on.........................................
```
### do`t forgot to add VERCEL_URL as well 

Save and exit.
(copy the nginx.conf and docker-compose.yml form deployment folder of repo)

---

## 8. Add TLS (HTTPS) with Certbot

Before running this, make sure your domain's **DNS A record** points to your EC2 Elastic IP. You can set this in your domain registrar (GoDaddy, etc.).

Then on the EC2 instance run:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

Certbot will automatically update your Nginx config with SSL. It will also auto-renew the certificate before it expires.

---

## 9. Start Everything

```bash
cd ~/deployment
docker compose up -d
```

Check that all containers are running:
```bash
docker compose ps
```

---

## 10. Deploy Frontend on Vercel



---


