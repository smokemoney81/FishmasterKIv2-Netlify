#!/bin/bash

# FishMasterKI APK Build Script for Replit + Expo

echo "🔐 Logging in with Expo Token..."
npx expo login --token ZkeKJt0Dc8ZdiObFT6WO6OcFURtFRJA81SpZtDQm

echo "🚀 Starting Android APK build..."
npx eas build -p android --profile production
