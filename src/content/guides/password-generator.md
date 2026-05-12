---
title: "Generating Cryptographically Secure Passwords"
description: "Why Math.random() is not enough and how Lumea ensures your passwords are truly secure."
category: "dev"
toolId: "password-generator"
---

In the world of cybersecurity, randomness is everything. A password that "looks" random to a human might be easily guessable by a computer if the randomness source is weak.

### The Problem with Standard Tools
Many websites use `Math.random()` to generate passwords. This is a pseudo-random number generator (PRNG) that is not designed for security. It can be predictable under certain conditions.

### The Lumea Solution
We use the **Web Crypto API**'s `crypto.getRandomValues()` method. This is a cryptographically strong source of randomness provided by your browser. It's the same technology used for digital signatures and encryption.

### Tips for Strong Passwords
- **Length**: Use at least 16 characters.
- **Complexity**: Include numbers and symbols.
- **Uniqueness**: Never reuse a password across different sites.

Our generator allows you to customize all these factors and gives you a secure string instantly, without ever sending that string to a server.
