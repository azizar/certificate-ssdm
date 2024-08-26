# Changelog

## [2.1.0] 2024-06-19

### Vulnerabilities removed

## [2.0.0] 2024-02-06

### Next 14

Updated the dash to run on Next.js 14.0.2

## [1.0.0] 2023-09-29

### Official Release

Added Tailwind CSS, TypeScript & NextJS


docker build \    
-t araziz/apps:certificate-generator --file Dockerfile.prod \
--build-arg DATABASE_URL=postgresql://postgres:IiOTkToJTkCqdn8X7foI4dtG9ULneMsNa0iLK1bY@db:5432/certificate-generator?schema=public \
--platform linux/amd64
