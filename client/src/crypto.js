export async function generateKeyPair() {
    const keySize = 2048;
    const e = 0x10001; // 65537
    const key = crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: keySize,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );

    return key;
}

export async function exportKey(key) {
    const exported = await crypto.subtle.exportKey("jwk", key);
    return JSON.stringify(exported);
}

export async function importKey(jwk, isPrivate = false) {
    return await crypto.subtle.importKey(
        "jwk",
        JSON.parse(jwk),
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        isPrivate ? ["decrypt"] : ["encrypt"]
    );
}

export async function encryptMessage(message, publicKeyJwk) {
    const publicKey = await importKey(publicKeyJwk, false);
    const encodedMessage = new TextEncoder().encode(message);
    const encryptedMessage = await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        publicKey,
        encodedMessage
    );
    return btoa(String.fromCharCode(...new Uint8Array(encryptedMessage)));
}

export async function decryptMessage(encryptedMessage, privateKeyJwk) {
    console.log("Private key 4:", privateKeyJwk);
    console.log("Mess 4:", encryptedMessage);
    const privateKey = await importKey(privateKeyJwk, true);
    console.log("Private key 5:", privateKey);
    const decodedMessage = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));
    const decryptedMessage = await crypto.subtle.decrypt(
        {
            name: "RSA-OAEP"
        },
        privateKey,
        decodedMessage
    );
    return new TextDecoder().decode(decryptedMessage);
}

export async function encryptPrivateKey(privateKeyJwk, password) {
    const encodedPassword = new TextEncoder().encode(password);
    const passwordHash = await crypto.subtle.digest("SHA-256", encodedPassword);
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        passwordHash,
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    const encryptionKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: new Uint8Array(16),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        {
            name: "AES-GCM",
            length: 256
        },
        false,
        ["encrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const privateKeyData = new TextEncoder().encode(privateKeyJwk);
    const encryptedPrivateKey = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        encryptionKey,
        privateKeyData
    );

    return {
        iv: btoa(String.fromCharCode(...iv)),
        d: btoa(String.fromCharCode(...new Uint8Array(encryptedPrivateKey)))
    };
}
export async function decryptPrivateKey(encryptedPrivateKey, password, iv) {
    const encodedPassword = new TextEncoder().encode(password);
    const passwordHash = await crypto.subtle.digest("SHA-256", encodedPassword);
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        passwordHash,
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    const decryptionKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: new Uint8Array(16),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        {
            name: "AES-GCM",
            length: 256
        },
        false,
        ["decrypt"]
    );
    const ivArray = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    const encryptedDataArray = Uint8Array.from(atob(encryptedPrivateKey), c => c.charCodeAt(0));
    const decryptedPrivateKey = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: ivArray
        },
        decryptionKey,
        encryptedDataArray
    );
    return new TextDecoder().decode(decryptedPrivateKey);
}
