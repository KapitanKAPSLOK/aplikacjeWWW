"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//klasa generująca liczby fibonacciego
class Fibonacci {
    constructor() {
        this.fib1 = 0;
        this.fib2 = 1;
    }
    nextFib() {
        const temp = this.fib2;
        this.fib2 = this.fib1 + this.fib2;
        this.fib1 = temp;
        return this.fib1;
    }
    fib(n) {
        let a = 0;
        let b = 1;
        let c = 0;
        for (let i = 0; i < n; ++i) {
            c = b;
            b = a + b;
            a = c;
        }
        return c;
    }
}
exports.Fibonacci = Fibonacci;
//# sourceMappingURL=fib.js.map