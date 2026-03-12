"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.isStrongPassword = isStrongPassword;
exports.isValidCPF = isValidCPF;
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isStrongPassword(password) {
    // At least 8 chars, with upper/lower letters, number and special char.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return passwordRegex.test(password);
}
function isValidCPF(cpf) {
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11)
        return false;
    if (/^(\d)\1{10}$/.test(cleanCpf))
        return false;
    const digits = cleanCpf.split("").map(Number);
    const calcDigit = (base, factor) => {
        const total = base.reduce((acc, value) => {
            const result = acc + value * factor;
            factor -= 1;
            return result;
        }, 0);
        const mod = (total * 10) % 11;
        return mod === 10 ? 0 : mod;
    };
    const d1 = calcDigit(digits.slice(0, 9), 10);
    const d2 = calcDigit(digits.slice(0, 10), 11);
    return d1 === digits[9] && d2 === digits[10];
}
