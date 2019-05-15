// See https://observablehq.com/@mbostock/streaming-csv
const tokenDefaultLength = 1 << 7; // default token length to allocate
const CODE_QUOTE = '"'.charCodeAt(0);
const CODE_COMMA = ','.charCodeAt(0);
const CODE_LINE_FEED = '\n'.charCodeAt(0);
const CODE_CARRIAGE_RETURN = '\r'.charCodeAt(0);
const STATE_FIELD = Symbol('field'); // inside an unquoted value
const STATE_QUOTE = Symbol('quote'); // inside a quoted value
const STATE_AFTER_QUOTE_IN_QUOTE = Symbol('afterquote'); // after a quote (") in a quoted value
const STATE_AFTER_CARRIAGE_RETURN = Symbol('aftercr'); // after a carriage return in an unquoted value
const STATE_END_OF_LINE = Symbol('eol'); // after the last field in a line

class CsvReader {
  constructor(reader, encoding, delimiterCode) {
    this._reader = reader;
    this._parser = new CsvParser(encoding);
    if (delimiterCode) this._parser.delimiterCode = delimiterCode;
  }
  [Symbol.asyncIterator]() {
    return this;
  }
  async next() {
    const {done, value} = await this._reader.read();
    return done
      ? this._parser.ended()
        ? {done: true}
        : {done: false, value: this._parser.end()}
      : {done: false, value: this._parser.parse(value)};
  }
}

class CsvParser {
  constructor(encoding) {
    this._decoder = new TextDecoder(encoding);
    this._readOffset = 0; // number of bytes we’ve read from buffer
    this._readLength = 0; // number of bytes available in buffer
    this._row = null; // the current row
    this._state = STATE_FIELD; // parser finite state machine
    this._lineEmpty = true; // true if the line was completely empty (to skip)
    this._tokenOffset = 0; // number of bytes we’ve written for the current token
    this._tokenLength = tokenDefaultLength; // current token length (doubles as needed)
    this._token = new Uint8Array(this._tokenLength); // current token accumulation buffer
    this.delimiterCode = CODE_COMMA;
  }

  *parse(buffer) {
    let token;
    this._readOffset = 0;
    this._readLength = buffer.length;
    while ((token = this._readToken(buffer)) != null) {
      if (this._row === null) this._row = [];
      this._row.push(this._decoder.decode(token));
      if (this._state === STATE_END_OF_LINE) {
        if (!this._lineEmpty) yield this._row;
        this._row = null;
        this._state = STATE_FIELD;
        this._lineEmpty = true;
      }
    }
  }

  ended() {
    return this._row === null;
  }

  *end() {
    if (this._row !== null) {
      this._row.push(this._decoder.decode(this._readDelimiter()));
      yield this._row;
      this._row = null;
    }
  }

  // TODO Optimize special case of non-quoted, not-fragmented field.
  _readToken(buffer) {
    while (this._readOffset < this._readLength) {
      const code = buffer[this._readOffset++];
      if (this._state === STATE_FIELD) {
        if (code === CODE_QUOTE) {
          // entered a quoted value
          this._state = STATE_QUOTE;
          this._lineEmpty = false;
        } else if (code === CODE_CARRIAGE_RETURN) {
          // possible CRLF
          this._state = STATE_AFTER_CARRIAGE_RETURN;
        } else if (code === CODE_LINE_FEED) {
          // ended an unquoted field & row
          this._state = STATE_END_OF_LINE;
          return this._readDelimiter();
        } else if (code === this.delimiterCode) {
          // ended an unquoted field
          this._lineEmpty = false;
          return this._readDelimiter();
        } else {
          // read an unquoted character
          this._lineEmpty = false;
          this._readCharacter(code);
          continue;
        }
      } else if (this._state === STATE_QUOTE) {
        if (code === CODE_QUOTE) {
          // read a quote within a quoted value
          this._state = STATE_AFTER_QUOTE_IN_QUOTE;
        } else {
          // read a quoted character
          this._readCharacter(code);
          continue;
        }
      } else if (this._state === STATE_AFTER_QUOTE_IN_QUOTE) {
        if (code === CODE_QUOTE) {
          // read a quoted quote
          this._state = STATE_QUOTE;
          this._readCharacter(CODE_QUOTE);
        } else {
          // exited a quoted value
          this._state = STATE_FIELD;
          --this._readOffset;
        }
      } else if (this._state === STATE_AFTER_CARRIAGE_RETURN) {
        this._state = STATE_END_OF_LINE;
        if (code === CODE_LINE_FEED) {
          return this._readDelimiter();
        } else {
          --this._readOffset;
        }
      }
    }
    return null;
  }

  _readCharacter(code) {
    if (this._tokenOffset >= this._tokenLength) {
      const token = this._token;
      this._token = new Uint8Array((this._tokenLength <<= 1));
      this._token.set(token);
    }
    this._token[this._tokenOffset++] = code;
  }

  _readDelimiter() {
    const token = this._token.subarray(0, this._tokenOffset);
    this._token = new Uint8Array((this._tokenLength = tokenDefaultLength));
    this._tokenOffset = 0;
    return token;
  }
}

export async function* csvReader(url, process, separator, loadLimit, table) {
  let a = [];
  const response = await fetch(url);
  const reader = response.body.getReader();
  let n = 0;
  for await (const rows of new CsvReader(
    reader,
    undefined,
    separator.charCodeAt(0)
  )) {
    for (const row of rows) {
      if (!a.columns) a.columns = row;
      else {
        const b = {};
        let i = 0;
        for (const col of a.columns) b[col] = row[i++];
        a.push(process ? process(b) : b);
      }
    }
    if (n++ === 10) yield table ? table(a) : a;
    if (a.length > loadLimit) break;
  }
  a = a.slice(0, loadLimit);
  yield table ? table(a) : a;
}
