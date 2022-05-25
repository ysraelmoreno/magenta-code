class Magenta {
  constructor(codes) {
    this.codes = codes;
    this.keywords = ["print"];
    this.varChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
    this.operators = "+-*/";
  }

  tokenize() {
    const length = this.codes.length;
    // pos keeps track of current position/index
    let pos = 0;
    let tokens = [];
    // allowed characters for variable/keyword
    while (pos < length) {
      let currentChar = this.codes[pos];
      // if current char is space or newline,  continue
      if (currentChar === " " || currentChar === "\n") {
        pos++;
        continue;
      } else if (currentChar === '"') {
        // if current char is " then we have a string
        let res = "";
        pos++;
        // while next char is not " or \n and we are not at the end of the code
        while (
          this.codes[pos] !== '"' &&
          this.codes[pos] !== "\n" &&
          pos < length
        ) {
          // adding the char to the string
          res += this.codes[pos];
          pos++;
        }
        // if the loop ended because of the end of the code and we didn't find the closing "
        if (this.codes[pos] !== '"') {
          return {
            error: `Unterminated string`,
          };
        }
        pos++;
        // adding the string to the tokens
        tokens.push({
          type: "string",
          value: res,
        });
      } else if (!isNaN(currentChar) && currentChar !== " ") {
        let res = "";

        while (
          !isNaN(this.codes[pos]) &&
          this.codes[pos] !== "\n" &&
          this.codes[pos] !== " " &&
          pos < length
        ) {
          res += this.codes[pos];
          pos++;
        }

        tokens.push({
          type: "number",
          value: Number(res),
        });
      } else if (this.operators.includes(currentChar)) {
        let res = "";

        while (this.operators.includes(this.codes[pos])) {
          res += this.codes[pos];
          pos++;
        }

        tokens.push({
          type: "operator",
          value: res,
        });
      } else if (this.varChars.includes(currentChar)) {
        let res = currentChar;
        pos++;
        // while the next char is a valid variable/keyword charater
        while (this.varChars.includes(this.codes[pos]) && pos < length) {
          // adding the char to the string
          res += this.codes[pos];
          pos++;
        }
        // if the keyword is not a built in keyword
        if (!this.keywords.includes(res)) {
          return {
            error: `Unexpected token ${res}`,
          };
        }
        // adding the keyword to the tokens
        tokens.push({
          type: "keyword",
          value: res,
        });
      } else {
        // we have a invalid character in our code
        return {
          error: `Unexpected character ${this.codes[pos]}`,
        };
      }
    }
    // returning the tokens
    return {
      error: false,
      tokens,
    };
  }

  parse(tokens) {
    const len = tokens.length;
    let pos = 0;

    while (pos < len) {
      let currentToken = tokens[pos];

      pos++;

      if (currentToken.type === "keyword") {
        if (currentToken.value === "print") {
          let nextToken = tokens[pos];
          pos++;

          if (nextToken.type !== "string") {
            return {
              error: `Expected a string`,
            };
          }
          if (nextToken.type === "string") {
            console.log(nextToken.value);
          }
        }
      }

      if (currentToken.type === "number") {
        let nextToken = tokens[pos];

        if (!nextToken) {
          return;
        }

        let operation = [];

        operation.push(currentToken);

        pos++;

        if (nextToken.type === "operator") {
          let numberToOperate = tokens[pos];

          if (numberToOperate.type !== "number") {
            return {
              error: `Expected a number`,
            };
          }

          operation.push(
            {
              ...nextToken,
            },
            {
              ...numberToOperate,
            }
          );

          const result = `${operation[0].value} ${operation[1].value} ${operation[2].value}`;

          console.log(eval(result));
        }
      }
    }
  }

  run() {
    const { tokens, error } = this.tokenize();

    if (error) return console.log(error);

    this.parse(tokens);
  }
}

module.exports = Magenta;
