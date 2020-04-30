import { Fibonacci } from "./fib";
import { expect } from "chai";
import "mocha";

const fibo =new Fibonacci();
describe("Fibonacci", () => {
    it("should equal 0 for call with 0", () => {
        expect(fibo.fib(0)).to.equal(0);
    });
    it("should equal 1 for call with 1", () => {
        expect(fibo.fib(1)).to.equal(1);
    });
    it("should equal 1 for call with 2", () => {
        expect(fibo.fib(2)).to.equal(1);
    });
    it("should equal 2 for call with 3", () => {
        expect(fibo.fib(3)).to.equal(2);
    });
    it("should equal 144 for call with 12", () => {
        expect(fibo.fib(12)).to.equal(144);
    });
});
