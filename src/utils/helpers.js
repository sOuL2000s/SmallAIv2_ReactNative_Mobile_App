// src/utils/helpers.js

import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';

export const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const fileToBase64 = (uri, mimeType) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Remove data:image/jpeg;base64, prefix if it exists, keep only the base64 string
                const base64Data = reader.result.split(',')[1];
                resolve({ mimeType, data: base64Data });
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = function () {
            reject(new Error('XMLHttpRequest failed.'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
};

export const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
        base64: true, // Request base64 directly
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
            uri: asset.uri,
            mimeType: asset.mimeType || 'image/jpeg', // Fallback for mimeType
            data: asset.base64, // Base64 data from the picker
            name: asset.fileName || `image-${generateUniqueId()}.${asset.mimeType.split('/')[1] || 'jpeg'}`
        };
    }
    return null;
};

export const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
        type: [
            'application/pdf',
            'text/*', // text, csv, markdown
            'application/json',
            'application/xml',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
        ],
        copyToCacheDirectory: true,
        base64: true, // Request base64 directly
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
            uri: asset.uri,
            mimeType: asset.mimeType || 'application/octet-stream', // Fallback mimeType
            data: asset.base64, // Base64 data from the picker
            name: asset.name
        };
    }
    return null;
};


// Function to get Lucide icon name based on MIME type
export function getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType === 'application/pdf') return 'FileText';
    if (mimeType.includes('text/')) return 'FileText';
    if (mimeType.includes('csv') || mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'FileSpreadsheet';
    if (mimeType.includes('json') || mimeType.includes('xml') || mimeType.includes('code') || mimeType.includes('markdown')) return 'FileCode';
    return 'File';
}

// Simple Toast/Snackbar-like message function for React Native
let currentTimeout = null;
export const showMessage = (message, type = 'success', duration = 3000) => {
    // In a real app, you'd use a dedicated React Native Toast library (e.g., 'react-native-toast-message')
    // For this example, we'll use a simple console log and Alert for critical errors.
    console.log(`MESSAGE (${type.toUpperCase()}): ${message}`);
    // If you want a basic visual alert for non-success messages:
    if (type === 'error' || type === 'warning') {
        Alert.alert(type.charAt(0).toUpperCase() + type.slice(1), message);
    }
};
