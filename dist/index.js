var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// yamma/server/node_modules/vscode-jsonrpc/lib/common/ral.js
var require_ral = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/ral.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var _ral;
    function RAL() {
      if (_ral === void 0) {
        throw new Error(`No runtime abstraction layer installed`);
      }
      return _ral;
    }
    (function(RAL2) {
      function install(ral) {
        if (ral === void 0) {
          throw new Error(`No runtime abstraction layer provided`);
        }
        _ral = ral;
      }
      RAL2.install = install;
    })(RAL || (RAL = {}));
    exports.default = RAL;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/common/disposable.js
var require_disposable = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/disposable.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Disposable = void 0;
    (function(Disposable2) {
      function create(func) {
        return {
          dispose: func
        };
      }
      Disposable2.create = create;
    })(exports.Disposable || (exports.Disposable = {}));
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/common/events.js
var require_events = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/events.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Emitter = exports.Event = void 0;
    var ral_1 = require_ral();
    (function(Event2) {
      const _disposable = { dispose() {
      } };
      Event2.None = function() {
        return _disposable;
      };
    })(exports.Event || (exports.Event = {}));
    var CallbackList = class {
      add(callback, context = null, bucket) {
        if (!this._callbacks) {
          this._callbacks = [];
          this._contexts = [];
        }
        this._callbacks.push(callback);
        this._contexts.push(context);
        if (Array.isArray(bucket)) {
          bucket.push({ dispose: () => this.remove(callback, context) });
        }
      }
      remove(callback, context = null) {
        if (!this._callbacks) {
          return;
        }
        let foundCallbackWithDifferentContext = false;
        for (let i = 0, len = this._callbacks.length; i < len; i++) {
          if (this._callbacks[i] === callback) {
            if (this._contexts[i] === context) {
              this._callbacks.splice(i, 1);
              this._contexts.splice(i, 1);
              return;
            } else {
              foundCallbackWithDifferentContext = true;
            }
          }
        }
        if (foundCallbackWithDifferentContext) {
          throw new Error("When adding a listener with a context, you should remove it with the same context");
        }
      }
      invoke(...args) {
        if (!this._callbacks) {
          return [];
        }
        const ret = [], callbacks = this._callbacks.slice(0), contexts = this._contexts.slice(0);
        for (let i = 0, len = callbacks.length; i < len; i++) {
          try {
            ret.push(callbacks[i].apply(contexts[i], args));
          } catch (e) {
            ral_1.default().console.error(e);
          }
        }
        return ret;
      }
      isEmpty() {
        return !this._callbacks || this._callbacks.length === 0;
      }
      dispose() {
        this._callbacks = void 0;
        this._contexts = void 0;
      }
    };
    var Emitter = class _Emitter {
      constructor(_options) {
        this._options = _options;
      }
      /**
       * For the public to allow to subscribe
       * to events from this Emitter
       */
      get event() {
        if (!this._event) {
          this._event = (listener, thisArgs, disposables) => {
            if (!this._callbacks) {
              this._callbacks = new CallbackList();
            }
            if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) {
              this._options.onFirstListenerAdd(this);
            }
            this._callbacks.add(listener, thisArgs);
            const result = {
              dispose: () => {
                if (!this._callbacks) {
                  return;
                }
                this._callbacks.remove(listener, thisArgs);
                result.dispose = _Emitter._noop;
                if (this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) {
                  this._options.onLastListenerRemove(this);
                }
              }
            };
            if (Array.isArray(disposables)) {
              disposables.push(result);
            }
            return result;
          };
        }
        return this._event;
      }
      /**
       * To be kept private to fire an event to
       * subscribers
       */
      fire(event) {
        if (this._callbacks) {
          this._callbacks.invoke.call(this._callbacks, event);
        }
      }
      dispose() {
        if (this._callbacks) {
          this._callbacks.dispose();
          this._callbacks = void 0;
        }
      }
    };
    exports.Emitter = Emitter;
    Emitter._noop = function() {
    };
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/common/messageBuffer.js
var require_messageBuffer = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/messageBuffer.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AbstractMessageBuffer = void 0;
    var CR = 13;
    var LF = 10;
    var CRLF = "\r\n";
    var AbstractMessageBuffer = class {
      constructor(encoding = "utf-8") {
        this._encoding = encoding;
        this._chunks = [];
        this._totalLength = 0;
      }
      get encoding() {
        return this._encoding;
      }
      append(chunk) {
        const toAppend = typeof chunk === "string" ? this.fromString(chunk, this._encoding) : chunk;
        this._chunks.push(toAppend);
        this._totalLength += toAppend.byteLength;
      }
      tryReadHeaders() {
        if (this._chunks.length === 0) {
          return void 0;
        }
        let state = 0;
        let chunkIndex = 0;
        let offset = 0;
        let chunkBytesRead = 0;
        row: while (chunkIndex < this._chunks.length) {
          const chunk = this._chunks[chunkIndex];
          offset = 0;
          while (offset < chunk.length) {
            const value = chunk[offset];
            switch (value) {
              case CR:
                switch (state) {
                  case 0:
                    state = 1;
                    break;
                  case 2:
                    state = 3;
                    break;
                  default:
                    state = 0;
                }
                break;
              case LF:
                switch (state) {
                  case 1:
                    state = 2;
                    break;
                  case 3:
                    state = 4;
                    offset++;
                    break row;
                  default:
                    state = 0;
                }
                break;
              default:
                state = 0;
            }
            offset++;
          }
          chunkBytesRead += chunk.byteLength;
          chunkIndex++;
        }
        if (state !== 4) {
          return void 0;
        }
        const buffer = this._read(chunkBytesRead + offset);
        const result = /* @__PURE__ */ new Map();
        const headers = this.toString(buffer, "ascii").split(CRLF);
        if (headers.length < 2) {
          return result;
        }
        for (let i = 0; i < headers.length - 2; i++) {
          const header = headers[i];
          const index = header.indexOf(":");
          if (index === -1) {
            throw new Error("Message header must separate key and value using :");
          }
          const key = header.substr(0, index);
          const value = header.substr(index + 1).trim();
          result.set(key, value);
        }
        return result;
      }
      tryReadBody(length) {
        if (this._totalLength < length) {
          return void 0;
        }
        return this._read(length);
      }
      get numberOfBytes() {
        return this._totalLength;
      }
      _read(byteCount) {
        if (byteCount === 0) {
          return this.emptyBuffer();
        }
        if (byteCount > this._totalLength) {
          throw new Error(`Cannot read so many bytes!`);
        }
        if (this._chunks[0].byteLength === byteCount) {
          const chunk = this._chunks[0];
          this._chunks.shift();
          this._totalLength -= byteCount;
          return this.asNative(chunk);
        }
        if (this._chunks[0].byteLength > byteCount) {
          const chunk = this._chunks[0];
          const result2 = this.asNative(chunk, byteCount);
          this._chunks[0] = chunk.slice(byteCount);
          this._totalLength -= byteCount;
          return result2;
        }
        const result = this.allocNative(byteCount);
        let resultOffset = 0;
        let chunkIndex = 0;
        while (byteCount > 0) {
          const chunk = this._chunks[chunkIndex];
          if (chunk.byteLength > byteCount) {
            const chunkPart = chunk.slice(0, byteCount);
            result.set(chunkPart, resultOffset);
            resultOffset += byteCount;
            this._chunks[chunkIndex] = chunk.slice(byteCount);
            this._totalLength -= byteCount;
            byteCount -= byteCount;
          } else {
            result.set(chunk, resultOffset);
            resultOffset += chunk.byteLength;
            this._chunks.shift();
            this._totalLength -= chunk.byteLength;
            byteCount -= chunk.byteLength;
          }
        }
        return result;
      }
    };
    exports.AbstractMessageBuffer = AbstractMessageBuffer;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/browser/ril.js
var require_ril = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/browser/ril.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ral_1 = require_ral();
    var disposable_1 = require_disposable();
    var events_1 = require_events();
    var messageBuffer_1 = require_messageBuffer();
    var MessageBuffer = class _MessageBuffer extends messageBuffer_1.AbstractMessageBuffer {
      constructor(encoding = "utf-8") {
        super(encoding);
        this.asciiDecoder = new TextDecoder("ascii");
      }
      emptyBuffer() {
        return _MessageBuffer.emptyBuffer;
      }
      fromString(value, _encoding) {
        return new TextEncoder().encode(value);
      }
      toString(value, encoding) {
        if (encoding === "ascii") {
          return this.asciiDecoder.decode(value);
        } else {
          return new TextDecoder(encoding).decode(value);
        }
      }
      asNative(buffer, length) {
        if (length === void 0) {
          return buffer;
        } else {
          return buffer.slice(0, length);
        }
      }
      allocNative(length) {
        return new Uint8Array(length);
      }
    };
    MessageBuffer.emptyBuffer = new Uint8Array(0);
    var ReadableStreamWrapper = class {
      constructor(socket) {
        this.socket = socket;
        this._onData = new events_1.Emitter();
        this._messageListener = (event) => {
          const blob = event.data;
          blob.arrayBuffer().then((buffer) => {
            this._onData.fire(new Uint8Array(buffer));
          });
        };
        this.socket.addEventListener("message", this._messageListener);
      }
      onClose(listener) {
        this.socket.addEventListener("close", listener);
        return disposable_1.Disposable.create(() => this.socket.removeEventListener("close", listener));
      }
      onError(listener) {
        this.socket.addEventListener("error", listener);
        return disposable_1.Disposable.create(() => this.socket.removeEventListener("error", listener));
      }
      onEnd(listener) {
        this.socket.addEventListener("end", listener);
        return disposable_1.Disposable.create(() => this.socket.removeEventListener("end", listener));
      }
      onData(listener) {
        return this._onData.event(listener);
      }
    };
    var WritableStreamWrapper = class {
      constructor(socket) {
        this.socket = socket;
      }
      onClose(listener) {
        this.socket.addEventListener("close", listener);
        return disposable_1.Disposable.create(() => this.socket.removeEventListener("close", listener));
      }
      onError(listener) {
        this.socket.addEventListener("error", listener);
        return disposable_1.Disposable.create(() => this.socket.removeEventListener("error", listener));
      }
      onEnd(listener) {
        this.socket.addEventListener("end", listener);
        return disposable_1.Disposable.create(() => this.socket.removeEventListener("end", listener));
      }
      write(data, encoding) {
        if (typeof data === "string") {
          if (encoding !== void 0 && encoding !== "utf-8") {
            throw new Error(`In a Browser environments only utf-8 text encding is supported. But got encoding: ${encoding}`);
          }
          this.socket.send(data);
        } else {
          this.socket.send(data);
        }
        return Promise.resolve();
      }
      end() {
        this.socket.close();
      }
    };
    var _textEncoder = new TextEncoder();
    var _ril = Object.freeze({
      messageBuffer: Object.freeze({
        create: (encoding) => new MessageBuffer(encoding)
      }),
      applicationJson: Object.freeze({
        encoder: Object.freeze({
          name: "application/json",
          encode: (msg, options) => {
            if (options.charset !== "utf-8") {
              throw new Error(`In a Browser environments only utf-8 text encding is supported. But got encoding: ${options.charset}`);
            }
            return Promise.resolve(_textEncoder.encode(JSON.stringify(msg, void 0, 0)));
          }
        }),
        decoder: Object.freeze({
          name: "application/json",
          decode: (buffer, options) => {
            if (!(buffer instanceof Uint8Array)) {
              throw new Error(`In a Browser environments only Uint8Arrays are supported.`);
            }
            return Promise.resolve(JSON.parse(new TextDecoder(options.charset).decode(buffer)));
          }
        })
      }),
      stream: Object.freeze({
        asReadableStream: (socket) => new ReadableStreamWrapper(socket),
        asWritableStream: (socket) => new WritableStreamWrapper(socket)
      }),
      console,
      timer: Object.freeze({
        setTimeout(callback, ms, ...args) {
          return setTimeout(callback, ms, ...args);
        },
        clearTimeout(handle) {
          clearTimeout(handle);
        },
        setImmediate(callback, ...args) {
          return setTimeout(callback, 0, ...args);
        },
        clearImmediate(handle) {
          clearTimeout(handle);
        }
      })
    });
    function RIL() {
      return _ril;
    }
    (function(RIL2) {
      function install() {
        ral_1.default.install(_ril);
      }
      RIL2.install = install;
    })(RIL || (RIL = {}));
    exports.default = RIL;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/common/is.js
var require_is = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/is.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
    function boolean(value) {
      return value === true || value === false;
    }
    exports.boolean = boolean;
    function string(value) {
      return typeof value === "string" || value instanceof String;
    }
    exports.string = string;
    function number(value) {
      return typeof value === "number" || value instanceof Number;
    }
    exports.number = number;
    function error(value) {
      return value instanceof Error;
    }
    exports.error = error;
    function func(value) {
      return typeof value === "function";
    }
    exports.func = func;
    function array(value) {
      return Array.isArray(value);
    }
    exports.array = array;
    function stringArray(value) {
      return array(value) && value.every((elem) => string(elem));
    }
    exports.stringArray = stringArray;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/common/messages.js
var require_messages = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/messages.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isResponseMessage = exports.isNotificationMessage = exports.isRequestMessage = exports.NotificationType9 = exports.NotificationType8 = exports.NotificationType7 = exports.NotificationType6 = exports.NotificationType5 = exports.NotificationType4 = exports.NotificationType3 = exports.NotificationType2 = exports.NotificationType1 = exports.NotificationType0 = exports.NotificationType = exports.RequestType9 = exports.RequestType8 = exports.RequestType7 = exports.RequestType6 = exports.RequestType5 = exports.RequestType4 = exports.RequestType3 = exports.RequestType2 = exports.RequestType1 = exports.RequestType = exports.RequestType0 = exports.AbstractMessageSignature = exports.ParameterStructures = exports.ResponseError = exports.ErrorCodes = void 0;
    var is = require_is();
    var ErrorCodes;
    (function(ErrorCodes2) {
      ErrorCodes2.ParseError = -32700;
      ErrorCodes2.InvalidRequest = -32600;
      ErrorCodes2.MethodNotFound = -32601;
      ErrorCodes2.InvalidParams = -32602;
      ErrorCodes2.InternalError = -32603;
      ErrorCodes2.jsonrpcReservedErrorRangeStart = -32099;
      ErrorCodes2.serverErrorStart = ErrorCodes2.jsonrpcReservedErrorRangeStart;
      ErrorCodes2.MessageWriteError = -32099;
      ErrorCodes2.MessageReadError = -32098;
      ErrorCodes2.ServerNotInitialized = -32002;
      ErrorCodes2.UnknownErrorCode = -32001;
      ErrorCodes2.jsonrpcReservedErrorRangeEnd = -32e3;
      ErrorCodes2.serverErrorEnd = ErrorCodes2.jsonrpcReservedErrorRangeEnd;
    })(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
    var ResponseError = class _ResponseError extends Error {
      constructor(code, message, data) {
        super(message);
        this.code = is.number(code) ? code : ErrorCodes.UnknownErrorCode;
        this.data = data;
        Object.setPrototypeOf(this, _ResponseError.prototype);
      }
      toJson() {
        return {
          code: this.code,
          message: this.message,
          data: this.data
        };
      }
    };
    exports.ResponseError = ResponseError;
    var ParameterStructures = class _ParameterStructures {
      constructor(kind) {
        this.kind = kind;
      }
      static is(value) {
        return value === _ParameterStructures.auto || value === _ParameterStructures.byName || value === _ParameterStructures.byPosition;
      }
      toString() {
        return this.kind;
      }
    };
    exports.ParameterStructures = ParameterStructures;
    ParameterStructures.auto = new ParameterStructures("auto");
    ParameterStructures.byPosition = new ParameterStructures("byPosition");
    ParameterStructures.byName = new ParameterStructures("byName");
    var AbstractMessageSignature = class {
      constructor(method, numberOfParams) {
        this.method = method;
        this.numberOfParams = numberOfParams;
      }
      get parameterStructures() {
        return ParameterStructures.auto;
      }
    };
    exports.AbstractMessageSignature = AbstractMessageSignature;
    var RequestType0 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 0);
      }
    };
    exports.RequestType0 = RequestType0;
    var RequestType = class extends AbstractMessageSignature {
      constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    exports.RequestType = RequestType;
    var RequestType1 = class extends AbstractMessageSignature {
      constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    exports.RequestType1 = RequestType1;
    var RequestType2 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 2);
      }
    };
    exports.RequestType2 = RequestType2;
    var RequestType3 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 3);
      }
    };
    exports.RequestType3 = RequestType3;
    var RequestType4 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 4);
      }
    };
    exports.RequestType4 = RequestType4;
    var RequestType5 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 5);
      }
    };
    exports.RequestType5 = RequestType5;
    var RequestType6 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 6);
      }
    };
    exports.RequestType6 = RequestType6;
    var RequestType7 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 7);
      }
    };
    exports.RequestType7 = RequestType7;
    var RequestType8 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 8);
      }
    };
    exports.RequestType8 = RequestType8;
    var RequestType9 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 9);
      }
    };
    exports.RequestType9 = RequestType9;
    var NotificationType = class extends AbstractMessageSignature {
      constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    exports.NotificationType = NotificationType;
    var NotificationType0 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 0);
      }
    };
    exports.NotificationType0 = NotificationType0;
    var NotificationType1 = class extends AbstractMessageSignature {
      constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    exports.NotificationType1 = NotificationType1;
    var NotificationType2 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 2);
      }
    };
    exports.NotificationType2 = NotificationType2;
    var NotificationType3 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 3);
      }
    };
    exports.NotificationType3 = NotificationType3;
    var NotificationType4 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 4);
      }
    };
    exports.NotificationType4 = NotificationType4;
    var NotificationType5 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 5);
      }
    };
    exports.NotificationType5 = NotificationType5;
    var NotificationType6 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 6);
      }
    };
    exports.NotificationType6 = NotificationType6;
    var NotificationType7 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 7);
      }
    };
    exports.NotificationType7 = NotificationType7;
    var NotificationType8 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 8);
      }
    };
    exports.NotificationType8 = NotificationType8;
    var NotificationType9 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 9);
      }
    };
    exports.NotificationType9 = NotificationType9;
    function isRequestMessage(message) {
      const candidate = message;
      return candidate && is.string(candidate.method) && (is.string(candidate.id) || is.number(candidate.id));
    }
    exports.isRequestMessage = isRequestMessage;
    function isNotificationMessage(message) {
      const candidate = message;
      return candidate && is.string(candidate.method) && message.id === void 0;
    }
    exports.isNotificationMessage = isNotificationMessage;
    function isResponseMessage(message) {
      const candidate = message;
      return candidate && (candidate.result !== void 0 || !!candidate.error) && (is.string(candidate.id) || is.number(candidate.id) || candidate.id === null);
    }
    exports.isResponseMessage = isResponseMessage;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/common/cancellation.js
var require_cancellation = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/cancellation.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CancellationTokenSource = exports.CancellationToken = void 0;
    var ral_1 = require_ral();
    var Is = require_is();
    var events_1 = require_events();
    var CancellationToken;
    (function(CancellationToken2) {
      CancellationToken2.None = Object.freeze({
        isCancellationRequested: false,
        onCancellationRequested: events_1.Event.None
      });
      CancellationToken2.Cancelled = Object.freeze({
        isCancellationRequested: true,
        onCancellationRequested: events_1.Event.None
      });
      function is(value) {
        const candidate = value;
        return candidate && (candidate === CancellationToken2.None || candidate === CancellationToken2.Cancelled || Is.boolean(candidate.isCancellationRequested) && !!candidate.onCancellationRequested);
      }
      CancellationToken2.is = is;
    })(CancellationToken = exports.CancellationToken || (exports.CancellationToken = {}));
    var shortcutEvent = Object.freeze(function(callback, context) {
      const handle = ral_1.default().timer.setTimeout(callback.bind(context), 0);
      return { dispose() {
        ral_1.default().timer.clearTimeout(handle);
      } };
    });
    var MutableToken = class {
      constructor() {
        this._isCancelled = false;
      }
      cancel() {
        if (!this._isCancelled) {
          this._isCancelled = true;
          if (this._emitter) {
            this._emitter.fire(void 0);
            this.dispose();
          }
        }
      }
      get isCancellationRequested() {
        return this._isCancelled;
      }
      get onCancellationRequested() {
        if (this._isCancelled) {
          return shortcutEvent;
        }
        if (!this._emitter) {
          this._emitter = new events_1.Emitter();
        }
        return this._emitter.event;
      }
      dispose() {
        if (this._emitter) {
          this._emitter.dispose();
          this._emitter = void 0;
        }
      }
    };
    var CancellationTokenSource = class {
      get token() {
        if (!this._token) {
          this._token = new MutableToken();
        }
        return this._token;
      }
      cancel() {
        if (!this._token) {
          this._token = CancellationToken.Cancelled;
        } else {
          this._token.cancel();
        }
      }
      dispose() {
        if (!this._token) {
          this._token = CancellationToken.None;
        } else if (this._token instanceof MutableToken) {
          this._token.dispose();
        }
      }
    };
    exports.CancellationTokenSource = CancellationTokenSource;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/common/messageReader.js
var require_messageReader = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/messageReader.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReadableStreamMessageReader = exports.AbstractMessageReader = exports.MessageReader = void 0;
    var ral_1 = require_ral();
    var Is = require_is();
    var events_1 = require_events();
    (function(MessageReader2) {
      function is(value) {
        let candidate = value;
        return candidate && Is.func(candidate.listen) && Is.func(candidate.dispose) && Is.func(candidate.onError) && Is.func(candidate.onClose) && Is.func(candidate.onPartialMessage);
      }
      MessageReader2.is = is;
    })(exports.MessageReader || (exports.MessageReader = {}));
    var AbstractMessageReader = class {
      constructor() {
        this.errorEmitter = new events_1.Emitter();
        this.closeEmitter = new events_1.Emitter();
        this.partialMessageEmitter = new events_1.Emitter();
      }
      dispose() {
        this.errorEmitter.dispose();
        this.closeEmitter.dispose();
      }
      get onError() {
        return this.errorEmitter.event;
      }
      fireError(error) {
        this.errorEmitter.fire(this.asError(error));
      }
      get onClose() {
        return this.closeEmitter.event;
      }
      fireClose() {
        this.closeEmitter.fire(void 0);
      }
      get onPartialMessage() {
        return this.partialMessageEmitter.event;
      }
      firePartialMessage(info) {
        this.partialMessageEmitter.fire(info);
      }
      asError(error) {
        if (error instanceof Error) {
          return error;
        } else {
          return new Error(`Reader received error. Reason: ${Is.string(error.message) ? error.message : "unknown"}`);
        }
      }
    };
    exports.AbstractMessageReader = AbstractMessageReader;
    var ResolvedMessageReaderOptions;
    (function(ResolvedMessageReaderOptions2) {
      function fromOptions(options) {
        var _a;
        let charset;
        let contentDecoder;
        const contentDecoders = /* @__PURE__ */ new Map();
        let contentTypeDecoder;
        const contentTypeDecoders = /* @__PURE__ */ new Map();
        if (options === void 0 || typeof options === "string") {
          charset = options !== null && options !== void 0 ? options : "utf-8";
        } else {
          charset = (_a = options.charset) !== null && _a !== void 0 ? _a : "utf-8";
          if (options.contentDecoder !== void 0) {
            contentDecoder = options.contentDecoder;
            contentDecoders.set(contentDecoder.name, contentDecoder);
          }
          if (options.contentDecoders !== void 0) {
            for (const decoder of options.contentDecoders) {
              contentDecoders.set(decoder.name, decoder);
            }
          }
          if (options.contentTypeDecoder !== void 0) {
            contentTypeDecoder = options.contentTypeDecoder;
            contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
          }
          if (options.contentTypeDecoders !== void 0) {
            for (const decoder of options.contentTypeDecoders) {
              contentTypeDecoders.set(decoder.name, decoder);
            }
          }
        }
        if (contentTypeDecoder === void 0) {
          contentTypeDecoder = ral_1.default().applicationJson.decoder;
          contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
        }
        return { charset, contentDecoder, contentDecoders, contentTypeDecoder, contentTypeDecoders };
      }
      ResolvedMessageReaderOptions2.fromOptions = fromOptions;
    })(ResolvedMessageReaderOptions || (ResolvedMessageReaderOptions = {}));
    var ReadableStreamMessageReader = class extends AbstractMessageReader {
      constructor(readable, options) {
        super();
        this.readable = readable;
        this.options = ResolvedMessageReaderOptions.fromOptions(options);
        this.buffer = ral_1.default().messageBuffer.create(this.options.charset);
        this._partialMessageTimeout = 1e4;
        this.nextMessageLength = -1;
        this.messageToken = 0;
      }
      set partialMessageTimeout(timeout) {
        this._partialMessageTimeout = timeout;
      }
      get partialMessageTimeout() {
        return this._partialMessageTimeout;
      }
      listen(callback) {
        this.nextMessageLength = -1;
        this.messageToken = 0;
        this.partialMessageTimer = void 0;
        this.callback = callback;
        const result = this.readable.onData((data) => {
          this.onData(data);
        });
        this.readable.onError((error) => this.fireError(error));
        this.readable.onClose(() => this.fireClose());
        return result;
      }
      onData(data) {
        this.buffer.append(data);
        while (true) {
          if (this.nextMessageLength === -1) {
            const headers = this.buffer.tryReadHeaders();
            if (!headers) {
              return;
            }
            const contentLength = headers.get("Content-Length");
            if (!contentLength) {
              throw new Error("Header must provide a Content-Length property.");
            }
            const length = parseInt(contentLength);
            if (isNaN(length)) {
              throw new Error("Content-Length value must be a number.");
            }
            this.nextMessageLength = length;
          }
          const body = this.buffer.tryReadBody(this.nextMessageLength);
          if (body === void 0) {
            this.setPartialMessageTimer();
            return;
          }
          this.clearPartialMessageTimer();
          this.nextMessageLength = -1;
          let p;
          if (this.options.contentDecoder !== void 0) {
            p = this.options.contentDecoder.decode(body);
          } else {
            p = Promise.resolve(body);
          }
          p.then((value) => {
            this.options.contentTypeDecoder.decode(value, this.options).then((msg) => {
              this.callback(msg);
            }, (error) => {
              this.fireError(error);
            });
          }, (error) => {
            this.fireError(error);
          });
        }
      }
      clearPartialMessageTimer() {
        if (this.partialMessageTimer) {
          ral_1.default().timer.clearTimeout(this.partialMessageTimer);
          this.partialMessageTimer = void 0;
        }
      }
      setPartialMessageTimer() {
        this.clearPartialMessageTimer();
        if (this._partialMessageTimeout <= 0) {
          return;
        }
        this.partialMessageTimer = ral_1.default().timer.setTimeout((token, timeout) => {
          this.partialMessageTimer = void 0;
          if (token === this.messageToken) {
            this.firePartialMessage({ messageToken: token, waitingTime: timeout });
            this.setPartialMessageTimer();
          }
        }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout);
      }
    };
    exports.ReadableStreamMessageReader = ReadableStreamMessageReader;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/common/semaphore.js
var require_semaphore = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/semaphore.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Semaphore = void 0;
    var ral_1 = require_ral();
    var Semaphore = class {
      constructor(capacity = 1) {
        if (capacity <= 0) {
          throw new Error("Capacity must be greater than 0");
        }
        this._capacity = capacity;
        this._active = 0;
        this._waiting = [];
      }
      lock(thunk) {
        return new Promise((resolve, reject) => {
          this._waiting.push({ thunk, resolve, reject });
          this.runNext();
        });
      }
      get active() {
        return this._active;
      }
      runNext() {
        if (this._waiting.length === 0 || this._active === this._capacity) {
          return;
        }
        ral_1.default().timer.setImmediate(() => this.doRunNext());
      }
      doRunNext() {
        if (this._waiting.length === 0 || this._active === this._capacity) {
          return;
        }
        const next = this._waiting.shift();
        this._active++;
        if (this._active > this._capacity) {
          throw new Error(`To many thunks active`);
        }
        try {
          const result = next.thunk();
          if (result instanceof Promise) {
            result.then((value) => {
              this._active--;
              next.resolve(value);
              this.runNext();
            }, (err) => {
              this._active--;
              next.reject(err);
              this.runNext();
            });
          } else {
            this._active--;
            next.resolve(result);
            this.runNext();
          }
        } catch (err) {
          this._active--;
          next.reject(err);
          this.runNext();
        }
      }
    };
    exports.Semaphore = Semaphore;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/common/messageWriter.js
var require_messageWriter = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/messageWriter.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WriteableStreamMessageWriter = exports.AbstractMessageWriter = exports.MessageWriter = void 0;
    var ral_1 = require_ral();
    var Is = require_is();
    var semaphore_1 = require_semaphore();
    var events_1 = require_events();
    var ContentLength = "Content-Length: ";
    var CRLF = "\r\n";
    (function(MessageWriter2) {
      function is(value) {
        let candidate = value;
        return candidate && Is.func(candidate.dispose) && Is.func(candidate.onClose) && Is.func(candidate.onError) && Is.func(candidate.write);
      }
      MessageWriter2.is = is;
    })(exports.MessageWriter || (exports.MessageWriter = {}));
    var AbstractMessageWriter = class {
      constructor() {
        this.errorEmitter = new events_1.Emitter();
        this.closeEmitter = new events_1.Emitter();
      }
      dispose() {
        this.errorEmitter.dispose();
        this.closeEmitter.dispose();
      }
      get onError() {
        return this.errorEmitter.event;
      }
      fireError(error, message, count) {
        this.errorEmitter.fire([this.asError(error), message, count]);
      }
      get onClose() {
        return this.closeEmitter.event;
      }
      fireClose() {
        this.closeEmitter.fire(void 0);
      }
      asError(error) {
        if (error instanceof Error) {
          return error;
        } else {
          return new Error(`Writer received error. Reason: ${Is.string(error.message) ? error.message : "unknown"}`);
        }
      }
    };
    exports.AbstractMessageWriter = AbstractMessageWriter;
    var ResolvedMessageWriterOptions;
    (function(ResolvedMessageWriterOptions2) {
      function fromOptions(options) {
        var _a, _b;
        if (options === void 0 || typeof options === "string") {
          return { charset: options !== null && options !== void 0 ? options : "utf-8", contentTypeEncoder: ral_1.default().applicationJson.encoder };
        } else {
          return { charset: (_a = options.charset) !== null && _a !== void 0 ? _a : "utf-8", contentEncoder: options.contentEncoder, contentTypeEncoder: (_b = options.contentTypeEncoder) !== null && _b !== void 0 ? _b : ral_1.default().applicationJson.encoder };
        }
      }
      ResolvedMessageWriterOptions2.fromOptions = fromOptions;
    })(ResolvedMessageWriterOptions || (ResolvedMessageWriterOptions = {}));
    var WriteableStreamMessageWriter = class extends AbstractMessageWriter {
      constructor(writable, options) {
        super();
        this.writable = writable;
        this.options = ResolvedMessageWriterOptions.fromOptions(options);
        this.errorCount = 0;
        this.writeSemaphore = new semaphore_1.Semaphore(1);
        this.writable.onError((error) => this.fireError(error));
        this.writable.onClose(() => this.fireClose());
      }
      async write(msg) {
        return this.writeSemaphore.lock(async () => {
          const payload = this.options.contentTypeEncoder.encode(msg, this.options).then((buffer) => {
            if (this.options.contentEncoder !== void 0) {
              return this.options.contentEncoder.encode(buffer);
            } else {
              return buffer;
            }
          });
          return payload.then((buffer) => {
            const headers = [];
            headers.push(ContentLength, buffer.byteLength.toString(), CRLF);
            headers.push(CRLF);
            return this.doWrite(msg, headers, buffer);
          }, (error) => {
            this.fireError(error);
            throw error;
          });
        });
      }
      async doWrite(msg, headers, data) {
        try {
          await this.writable.write(headers.join(""), "ascii");
          return this.writable.write(data);
        } catch (error) {
          this.handleError(error, msg);
          return Promise.reject(error);
        }
      }
      handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
      }
      end() {
        this.writable.end();
      }
    };
    exports.WriteableStreamMessageWriter = WriteableStreamMessageWriter;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/common/linkedMap.js
var require_linkedMap = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/linkedMap.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LRUCache = exports.LinkedMap = exports.Touch = void 0;
    var Touch;
    (function(Touch2) {
      Touch2.None = 0;
      Touch2.First = 1;
      Touch2.AsOld = Touch2.First;
      Touch2.Last = 2;
      Touch2.AsNew = Touch2.Last;
    })(Touch = exports.Touch || (exports.Touch = {}));
    var LinkedMap = class {
      constructor() {
        this[Symbol.toStringTag] = "LinkedMap";
        this._map = /* @__PURE__ */ new Map();
        this._head = void 0;
        this._tail = void 0;
        this._size = 0;
        this._state = 0;
      }
      clear() {
        this._map.clear();
        this._head = void 0;
        this._tail = void 0;
        this._size = 0;
        this._state++;
      }
      isEmpty() {
        return !this._head && !this._tail;
      }
      get size() {
        return this._size;
      }
      get first() {
        var _a;
        return (_a = this._head) === null || _a === void 0 ? void 0 : _a.value;
      }
      get last() {
        var _a;
        return (_a = this._tail) === null || _a === void 0 ? void 0 : _a.value;
      }
      has(key) {
        return this._map.has(key);
      }
      get(key, touch = Touch.None) {
        const item = this._map.get(key);
        if (!item) {
          return void 0;
        }
        if (touch !== Touch.None) {
          this.touch(item, touch);
        }
        return item.value;
      }
      set(key, value, touch = Touch.None) {
        let item = this._map.get(key);
        if (item) {
          item.value = value;
          if (touch !== Touch.None) {
            this.touch(item, touch);
          }
        } else {
          item = { key, value, next: void 0, previous: void 0 };
          switch (touch) {
            case Touch.None:
              this.addItemLast(item);
              break;
            case Touch.First:
              this.addItemFirst(item);
              break;
            case Touch.Last:
              this.addItemLast(item);
              break;
            default:
              this.addItemLast(item);
              break;
          }
          this._map.set(key, item);
          this._size++;
        }
        return this;
      }
      delete(key) {
        return !!this.remove(key);
      }
      remove(key) {
        const item = this._map.get(key);
        if (!item) {
          return void 0;
        }
        this._map.delete(key);
        this.removeItem(item);
        this._size--;
        return item.value;
      }
      shift() {
        if (!this._head && !this._tail) {
          return void 0;
        }
        if (!this._head || !this._tail) {
          throw new Error("Invalid list");
        }
        const item = this._head;
        this._map.delete(item.key);
        this.removeItem(item);
        this._size--;
        return item.value;
      }
      forEach(callbackfn, thisArg) {
        const state = this._state;
        let current = this._head;
        while (current) {
          if (thisArg) {
            callbackfn.bind(thisArg)(current.value, current.key, this);
          } else {
            callbackfn(current.value, current.key, this);
          }
          if (this._state !== state) {
            throw new Error(`LinkedMap got modified during iteration.`);
          }
          current = current.next;
        }
      }
      keys() {
        const map = this;
        const state = this._state;
        let current = this._head;
        const iterator = {
          [Symbol.iterator]() {
            return iterator;
          },
          next() {
            if (map._state !== state) {
              throw new Error(`LinkedMap got modified during iteration.`);
            }
            if (current) {
              const result = { value: current.key, done: false };
              current = current.next;
              return result;
            } else {
              return { value: void 0, done: true };
            }
          }
        };
        return iterator;
      }
      values() {
        const map = this;
        const state = this._state;
        let current = this._head;
        const iterator = {
          [Symbol.iterator]() {
            return iterator;
          },
          next() {
            if (map._state !== state) {
              throw new Error(`LinkedMap got modified during iteration.`);
            }
            if (current) {
              const result = { value: current.value, done: false };
              current = current.next;
              return result;
            } else {
              return { value: void 0, done: true };
            }
          }
        };
        return iterator;
      }
      entries() {
        const map = this;
        const state = this._state;
        let current = this._head;
        const iterator = {
          [Symbol.iterator]() {
            return iterator;
          },
          next() {
            if (map._state !== state) {
              throw new Error(`LinkedMap got modified during iteration.`);
            }
            if (current) {
              const result = { value: [current.key, current.value], done: false };
              current = current.next;
              return result;
            } else {
              return { value: void 0, done: true };
            }
          }
        };
        return iterator;
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      trimOld(newSize) {
        if (newSize >= this.size) {
          return;
        }
        if (newSize === 0) {
          this.clear();
          return;
        }
        let current = this._head;
        let currentSize = this.size;
        while (current && currentSize > newSize) {
          this._map.delete(current.key);
          current = current.next;
          currentSize--;
        }
        this._head = current;
        this._size = currentSize;
        if (current) {
          current.previous = void 0;
        }
        this._state++;
      }
      addItemFirst(item) {
        if (!this._head && !this._tail) {
          this._tail = item;
        } else if (!this._head) {
          throw new Error("Invalid list");
        } else {
          item.next = this._head;
          this._head.previous = item;
        }
        this._head = item;
        this._state++;
      }
      addItemLast(item) {
        if (!this._head && !this._tail) {
          this._head = item;
        } else if (!this._tail) {
          throw new Error("Invalid list");
        } else {
          item.previous = this._tail;
          this._tail.next = item;
        }
        this._tail = item;
        this._state++;
      }
      removeItem(item) {
        if (item === this._head && item === this._tail) {
          this._head = void 0;
          this._tail = void 0;
        } else if (item === this._head) {
          if (!item.next) {
            throw new Error("Invalid list");
          }
          item.next.previous = void 0;
          this._head = item.next;
        } else if (item === this._tail) {
          if (!item.previous) {
            throw new Error("Invalid list");
          }
          item.previous.next = void 0;
          this._tail = item.previous;
        } else {
          const next = item.next;
          const previous = item.previous;
          if (!next || !previous) {
            throw new Error("Invalid list");
          }
          next.previous = previous;
          previous.next = next;
        }
        item.next = void 0;
        item.previous = void 0;
        this._state++;
      }
      touch(item, touch) {
        if (!this._head || !this._tail) {
          throw new Error("Invalid list");
        }
        if (touch !== Touch.First && touch !== Touch.Last) {
          return;
        }
        if (touch === Touch.First) {
          if (item === this._head) {
            return;
          }
          const next = item.next;
          const previous = item.previous;
          if (item === this._tail) {
            previous.next = void 0;
            this._tail = previous;
          } else {
            next.previous = previous;
            previous.next = next;
          }
          item.previous = void 0;
          item.next = this._head;
          this._head.previous = item;
          this._head = item;
          this._state++;
        } else if (touch === Touch.Last) {
          if (item === this._tail) {
            return;
          }
          const next = item.next;
          const previous = item.previous;
          if (item === this._head) {
            next.previous = void 0;
            this._head = next;
          } else {
            next.previous = previous;
            previous.next = next;
          }
          item.next = void 0;
          item.previous = this._tail;
          this._tail.next = item;
          this._tail = item;
          this._state++;
        }
      }
      toJSON() {
        const data = [];
        this.forEach((value, key) => {
          data.push([key, value]);
        });
        return data;
      }
      fromJSON(data) {
        this.clear();
        for (const [key, value] of data) {
          this.set(key, value);
        }
      }
    };
    exports.LinkedMap = LinkedMap;
    var LRUCache = class extends LinkedMap {
      constructor(limit, ratio = 1) {
        super();
        this._limit = limit;
        this._ratio = Math.min(Math.max(0, ratio), 1);
      }
      get limit() {
        return this._limit;
      }
      set limit(limit) {
        this._limit = limit;
        this.checkTrim();
      }
      get ratio() {
        return this._ratio;
      }
      set ratio(ratio) {
        this._ratio = Math.min(Math.max(0, ratio), 1);
        this.checkTrim();
      }
      get(key, touch = Touch.AsNew) {
        return super.get(key, touch);
      }
      peek(key) {
        return super.get(key, Touch.None);
      }
      set(key, value) {
        super.set(key, value, Touch.Last);
        this.checkTrim();
        return this;
      }
      checkTrim() {
        if (this.size > this._limit) {
          this.trimOld(Math.round(this._limit * this._ratio));
        }
      }
    };
    exports.LRUCache = LRUCache;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/common/connection.js
var require_connection = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/connection.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createMessageConnection = exports.ConnectionOptions = exports.CancellationStrategy = exports.CancellationSenderStrategy = exports.CancellationReceiverStrategy = exports.ConnectionStrategy = exports.ConnectionError = exports.ConnectionErrors = exports.LogTraceNotification = exports.SetTraceNotification = exports.TraceFormat = exports.Trace = exports.NullLogger = exports.ProgressType = void 0;
    var ral_1 = require_ral();
    var Is = require_is();
    var messages_1 = require_messages();
    var linkedMap_1 = require_linkedMap();
    var events_1 = require_events();
    var cancellation_1 = require_cancellation();
    var CancelNotification;
    (function(CancelNotification2) {
      CancelNotification2.type = new messages_1.NotificationType("$/cancelRequest");
    })(CancelNotification || (CancelNotification = {}));
    var ProgressNotification;
    (function(ProgressNotification2) {
      ProgressNotification2.type = new messages_1.NotificationType("$/progress");
    })(ProgressNotification || (ProgressNotification = {}));
    var ProgressType = class {
      constructor() {
      }
    };
    exports.ProgressType = ProgressType;
    var StarRequestHandler;
    (function(StarRequestHandler2) {
      function is(value) {
        return Is.func(value);
      }
      StarRequestHandler2.is = is;
    })(StarRequestHandler || (StarRequestHandler = {}));
    exports.NullLogger = Object.freeze({
      error: () => {
      },
      warn: () => {
      },
      info: () => {
      },
      log: () => {
      }
    });
    var Trace;
    (function(Trace2) {
      Trace2[Trace2["Off"] = 0] = "Off";
      Trace2[Trace2["Messages"] = 1] = "Messages";
      Trace2[Trace2["Verbose"] = 2] = "Verbose";
    })(Trace = exports.Trace || (exports.Trace = {}));
    (function(Trace2) {
      function fromString(value) {
        if (!Is.string(value)) {
          return Trace2.Off;
        }
        value = value.toLowerCase();
        switch (value) {
          case "off":
            return Trace2.Off;
          case "messages":
            return Trace2.Messages;
          case "verbose":
            return Trace2.Verbose;
          default:
            return Trace2.Off;
        }
      }
      Trace2.fromString = fromString;
      function toString(value) {
        switch (value) {
          case Trace2.Off:
            return "off";
          case Trace2.Messages:
            return "messages";
          case Trace2.Verbose:
            return "verbose";
          default:
            return "off";
        }
      }
      Trace2.toString = toString;
    })(Trace = exports.Trace || (exports.Trace = {}));
    var TraceFormat;
    (function(TraceFormat2) {
      TraceFormat2["Text"] = "text";
      TraceFormat2["JSON"] = "json";
    })(TraceFormat = exports.TraceFormat || (exports.TraceFormat = {}));
    (function(TraceFormat2) {
      function fromString(value) {
        value = value.toLowerCase();
        if (value === "json") {
          return TraceFormat2.JSON;
        } else {
          return TraceFormat2.Text;
        }
      }
      TraceFormat2.fromString = fromString;
    })(TraceFormat = exports.TraceFormat || (exports.TraceFormat = {}));
    var SetTraceNotification;
    (function(SetTraceNotification2) {
      SetTraceNotification2.type = new messages_1.NotificationType("$/setTrace");
    })(SetTraceNotification = exports.SetTraceNotification || (exports.SetTraceNotification = {}));
    var LogTraceNotification;
    (function(LogTraceNotification2) {
      LogTraceNotification2.type = new messages_1.NotificationType("$/logTrace");
    })(LogTraceNotification = exports.LogTraceNotification || (exports.LogTraceNotification = {}));
    var ConnectionErrors;
    (function(ConnectionErrors2) {
      ConnectionErrors2[ConnectionErrors2["Closed"] = 1] = "Closed";
      ConnectionErrors2[ConnectionErrors2["Disposed"] = 2] = "Disposed";
      ConnectionErrors2[ConnectionErrors2["AlreadyListening"] = 3] = "AlreadyListening";
    })(ConnectionErrors = exports.ConnectionErrors || (exports.ConnectionErrors = {}));
    var ConnectionError = class _ConnectionError extends Error {
      constructor(code, message) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, _ConnectionError.prototype);
      }
    };
    exports.ConnectionError = ConnectionError;
    var ConnectionStrategy;
    (function(ConnectionStrategy2) {
      function is(value) {
        const candidate = value;
        return candidate && Is.func(candidate.cancelUndispatched);
      }
      ConnectionStrategy2.is = is;
    })(ConnectionStrategy = exports.ConnectionStrategy || (exports.ConnectionStrategy = {}));
    var CancellationReceiverStrategy;
    (function(CancellationReceiverStrategy2) {
      CancellationReceiverStrategy2.Message = Object.freeze({
        createCancellationTokenSource(_) {
          return new cancellation_1.CancellationTokenSource();
        }
      });
      function is(value) {
        const candidate = value;
        return candidate && Is.func(candidate.createCancellationTokenSource);
      }
      CancellationReceiverStrategy2.is = is;
    })(CancellationReceiverStrategy = exports.CancellationReceiverStrategy || (exports.CancellationReceiverStrategy = {}));
    var CancellationSenderStrategy;
    (function(CancellationSenderStrategy2) {
      CancellationSenderStrategy2.Message = Object.freeze({
        sendCancellation(conn, id) {
          conn.sendNotification(CancelNotification.type, { id });
        },
        cleanup(_) {
        }
      });
      function is(value) {
        const candidate = value;
        return candidate && Is.func(candidate.sendCancellation) && Is.func(candidate.cleanup);
      }
      CancellationSenderStrategy2.is = is;
    })(CancellationSenderStrategy = exports.CancellationSenderStrategy || (exports.CancellationSenderStrategy = {}));
    var CancellationStrategy;
    (function(CancellationStrategy2) {
      CancellationStrategy2.Message = Object.freeze({
        receiver: CancellationReceiverStrategy.Message,
        sender: CancellationSenderStrategy.Message
      });
      function is(value) {
        const candidate = value;
        return candidate && CancellationReceiverStrategy.is(candidate.receiver) && CancellationSenderStrategy.is(candidate.sender);
      }
      CancellationStrategy2.is = is;
    })(CancellationStrategy = exports.CancellationStrategy || (exports.CancellationStrategy = {}));
    (function(ConnectionOptions2) {
      function is(value) {
        const candidate = value;
        return candidate && (CancellationStrategy.is(candidate.cancellationStrategy) || ConnectionStrategy.is(candidate.connectionStrategy));
      }
      ConnectionOptions2.is = is;
    })(exports.ConnectionOptions || (exports.ConnectionOptions = {}));
    var ConnectionState;
    (function(ConnectionState2) {
      ConnectionState2[ConnectionState2["New"] = 1] = "New";
      ConnectionState2[ConnectionState2["Listening"] = 2] = "Listening";
      ConnectionState2[ConnectionState2["Closed"] = 3] = "Closed";
      ConnectionState2[ConnectionState2["Disposed"] = 4] = "Disposed";
    })(ConnectionState || (ConnectionState = {}));
    function createMessageConnection(messageReader, messageWriter, _logger, options) {
      const logger = _logger !== void 0 ? _logger : exports.NullLogger;
      let sequenceNumber = 0;
      let notificationSquenceNumber = 0;
      let unknownResponseSquenceNumber = 0;
      const version = "2.0";
      let starRequestHandler = void 0;
      const requestHandlers = /* @__PURE__ */ Object.create(null);
      let starNotificationHandler = void 0;
      const notificationHandlers = /* @__PURE__ */ Object.create(null);
      const progressHandlers = /* @__PURE__ */ new Map();
      let timer;
      let messageQueue = new linkedMap_1.LinkedMap();
      let responsePromises = /* @__PURE__ */ Object.create(null);
      let requestTokens = /* @__PURE__ */ Object.create(null);
      let trace = Trace.Off;
      let traceFormat = TraceFormat.Text;
      let tracer;
      let state = ConnectionState.New;
      const errorEmitter = new events_1.Emitter();
      const closeEmitter = new events_1.Emitter();
      const unhandledNotificationEmitter = new events_1.Emitter();
      const unhandledProgressEmitter = new events_1.Emitter();
      const disposeEmitter = new events_1.Emitter();
      const cancellationStrategy = options && options.cancellationStrategy ? options.cancellationStrategy : CancellationStrategy.Message;
      function createRequestQueueKey(id) {
        if (id === null) {
          throw new Error(`Can't send requests with id null since the response can't be correlated.`);
        }
        return "req-" + id.toString();
      }
      function createResponseQueueKey(id) {
        if (id === null) {
          return "res-unknown-" + (++unknownResponseSquenceNumber).toString();
        } else {
          return "res-" + id.toString();
        }
      }
      function createNotificationQueueKey() {
        return "not-" + (++notificationSquenceNumber).toString();
      }
      function addMessageToQueue(queue, message) {
        if (messages_1.isRequestMessage(message)) {
          queue.set(createRequestQueueKey(message.id), message);
        } else if (messages_1.isResponseMessage(message)) {
          queue.set(createResponseQueueKey(message.id), message);
        } else {
          queue.set(createNotificationQueueKey(), message);
        }
      }
      function cancelUndispatched(_message) {
        return void 0;
      }
      function isListening() {
        return state === ConnectionState.Listening;
      }
      function isClosed() {
        return state === ConnectionState.Closed;
      }
      function isDisposed() {
        return state === ConnectionState.Disposed;
      }
      function closeHandler() {
        if (state === ConnectionState.New || state === ConnectionState.Listening) {
          state = ConnectionState.Closed;
          closeEmitter.fire(void 0);
        }
      }
      function readErrorHandler(error) {
        errorEmitter.fire([error, void 0, void 0]);
      }
      function writeErrorHandler(data) {
        errorEmitter.fire(data);
      }
      messageReader.onClose(closeHandler);
      messageReader.onError(readErrorHandler);
      messageWriter.onClose(closeHandler);
      messageWriter.onError(writeErrorHandler);
      function triggerMessageQueue() {
        if (timer || messageQueue.size === 0) {
          return;
        }
        timer = ral_1.default().timer.setImmediate(() => {
          timer = void 0;
          processMessageQueue();
        });
      }
      function processMessageQueue() {
        if (messageQueue.size === 0) {
          return;
        }
        const message = messageQueue.shift();
        try {
          if (messages_1.isRequestMessage(message)) {
            handleRequest(message);
          } else if (messages_1.isNotificationMessage(message)) {
            handleNotification(message);
          } else if (messages_1.isResponseMessage(message)) {
            handleResponse(message);
          } else {
            handleInvalidMessage(message);
          }
        } finally {
          triggerMessageQueue();
        }
      }
      const callback = (message) => {
        try {
          if (messages_1.isNotificationMessage(message) && message.method === CancelNotification.type.method) {
            const key = createRequestQueueKey(message.params.id);
            const toCancel = messageQueue.get(key);
            if (messages_1.isRequestMessage(toCancel)) {
              const strategy = options === null || options === void 0 ? void 0 : options.connectionStrategy;
              const response = strategy && strategy.cancelUndispatched ? strategy.cancelUndispatched(toCancel, cancelUndispatched) : cancelUndispatched(toCancel);
              if (response && (response.error !== void 0 || response.result !== void 0)) {
                messageQueue.delete(key);
                response.id = toCancel.id;
                traceSendingResponse(response, message.method, Date.now());
                messageWriter.write(response);
                return;
              }
            }
          }
          addMessageToQueue(messageQueue, message);
        } finally {
          triggerMessageQueue();
        }
      };
      function handleRequest(requestMessage) {
        if (isDisposed()) {
          return;
        }
        function reply(resultOrError, method, startTime2) {
          const message = {
            jsonrpc: version,
            id: requestMessage.id
          };
          if (resultOrError instanceof messages_1.ResponseError) {
            message.error = resultOrError.toJson();
          } else {
            message.result = resultOrError === void 0 ? null : resultOrError;
          }
          traceSendingResponse(message, method, startTime2);
          messageWriter.write(message);
        }
        function replyError(error, method, startTime2) {
          const message = {
            jsonrpc: version,
            id: requestMessage.id,
            error: error.toJson()
          };
          traceSendingResponse(message, method, startTime2);
          messageWriter.write(message);
        }
        function replySuccess(result, method, startTime2) {
          if (result === void 0) {
            result = null;
          }
          const message = {
            jsonrpc: version,
            id: requestMessage.id,
            result
          };
          traceSendingResponse(message, method, startTime2);
          messageWriter.write(message);
        }
        traceReceivedRequest(requestMessage);
        const element = requestHandlers[requestMessage.method];
        let type;
        let requestHandler;
        if (element) {
          type = element.type;
          requestHandler = element.handler;
        }
        const startTime = Date.now();
        if (requestHandler || starRequestHandler) {
          const tokenKey = String(requestMessage.id);
          const cancellationSource = cancellationStrategy.receiver.createCancellationTokenSource(tokenKey);
          requestTokens[tokenKey] = cancellationSource;
          try {
            let handlerResult;
            if (requestHandler) {
              if (requestMessage.params === void 0) {
                if (type !== void 0 && type.numberOfParams !== 0) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines ${type.numberOfParams} params but recevied none.`), requestMessage.method, startTime);
                  return;
                }
                handlerResult = requestHandler(cancellationSource.token);
              } else if (Array.isArray(requestMessage.params)) {
                if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byName) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by name but received parameters by position`), requestMessage.method, startTime);
                  return;
                }
                handlerResult = requestHandler(...requestMessage.params, cancellationSource.token);
              } else {
                if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by position but received parameters by name`), requestMessage.method, startTime);
                  return;
                }
                handlerResult = requestHandler(requestMessage.params, cancellationSource.token);
              }
            } else if (starRequestHandler) {
              handlerResult = starRequestHandler(requestMessage.method, requestMessage.params, cancellationSource.token);
            }
            const promise = handlerResult;
            if (!handlerResult) {
              delete requestTokens[tokenKey];
              replySuccess(handlerResult, requestMessage.method, startTime);
            } else if (promise.then) {
              promise.then((resultOrError) => {
                delete requestTokens[tokenKey];
                reply(resultOrError, requestMessage.method, startTime);
              }, (error) => {
                delete requestTokens[tokenKey];
                if (error instanceof messages_1.ResponseError) {
                  replyError(error, requestMessage.method, startTime);
                } else if (error && Is.string(error.message)) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
                } else {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
                }
              });
            } else {
              delete requestTokens[tokenKey];
              reply(handlerResult, requestMessage.method, startTime);
            }
          } catch (error) {
            delete requestTokens[tokenKey];
            if (error instanceof messages_1.ResponseError) {
              reply(error, requestMessage.method, startTime);
            } else if (error && Is.string(error.message)) {
              replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
            } else {
              replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
            }
          }
        } else {
          replyError(new messages_1.ResponseError(messages_1.ErrorCodes.MethodNotFound, `Unhandled method ${requestMessage.method}`), requestMessage.method, startTime);
        }
      }
      function handleResponse(responseMessage) {
        if (isDisposed()) {
          return;
        }
        if (responseMessage.id === null) {
          if (responseMessage.error) {
            logger.error(`Received response message without id: Error is: 
${JSON.stringify(responseMessage.error, void 0, 4)}`);
          } else {
            logger.error(`Received response message without id. No further error information provided.`);
          }
        } else {
          const key = String(responseMessage.id);
          const responsePromise = responsePromises[key];
          traceReceivedResponse(responseMessage, responsePromise);
          if (responsePromise) {
            delete responsePromises[key];
            try {
              if (responseMessage.error) {
                const error = responseMessage.error;
                responsePromise.reject(new messages_1.ResponseError(error.code, error.message, error.data));
              } else if (responseMessage.result !== void 0) {
                responsePromise.resolve(responseMessage.result);
              } else {
                throw new Error("Should never happen.");
              }
            } catch (error) {
              if (error.message) {
                logger.error(`Response handler '${responsePromise.method}' failed with message: ${error.message}`);
              } else {
                logger.error(`Response handler '${responsePromise.method}' failed unexpectedly.`);
              }
            }
          }
        }
      }
      function handleNotification(message) {
        if (isDisposed()) {
          return;
        }
        let type = void 0;
        let notificationHandler;
        if (message.method === CancelNotification.type.method) {
          notificationHandler = (params) => {
            const id = params.id;
            const source = requestTokens[String(id)];
            if (source) {
              source.cancel();
            }
          };
        } else {
          const element = notificationHandlers[message.method];
          if (element) {
            notificationHandler = element.handler;
            type = element.type;
          }
        }
        if (notificationHandler || starNotificationHandler) {
          try {
            traceReceivedNotification(message);
            if (notificationHandler) {
              if (message.params === void 0) {
                if (type !== void 0) {
                  if (type.numberOfParams !== 0 && type.parameterStructures !== messages_1.ParameterStructures.byName) {
                    logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but recevied none.`);
                  }
                }
                notificationHandler();
              } else if (Array.isArray(message.params)) {
                if (type !== void 0) {
                  if (type.parameterStructures === messages_1.ParameterStructures.byName) {
                    logger.error(`Notification ${message.method} defines parameters by name but received parameters by position`);
                  }
                  if (type.numberOfParams !== message.params.length) {
                    logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received ${message.params.length} argumennts`);
                  }
                }
                notificationHandler(...message.params);
              } else {
                if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                  logger.error(`Notification ${message.method} defines parameters by position but received parameters by name`);
                }
                notificationHandler(message.params);
              }
            } else if (starNotificationHandler) {
              starNotificationHandler(message.method, message.params);
            }
          } catch (error) {
            if (error.message) {
              logger.error(`Notification handler '${message.method}' failed with message: ${error.message}`);
            } else {
              logger.error(`Notification handler '${message.method}' failed unexpectedly.`);
            }
          }
        } else {
          unhandledNotificationEmitter.fire(message);
        }
      }
      function handleInvalidMessage(message) {
        if (!message) {
          logger.error("Received empty message.");
          return;
        }
        logger.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(message, null, 4)}`);
        const responseMessage = message;
        if (Is.string(responseMessage.id) || Is.number(responseMessage.id)) {
          const key = String(responseMessage.id);
          const responseHandler = responsePromises[key];
          if (responseHandler) {
            responseHandler.reject(new Error("The received response has neither a result nor an error property."));
          }
        }
      }
      function traceSendingRequest(message) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose && message.params) {
            data = `Params: ${JSON.stringify(message.params, null, 4)}

`;
          }
          tracer.log(`Sending request '${message.method} - (${message.id})'.`, data);
        } else {
          logLSPMessage("send-request", message);
        }
      }
      function traceSendingNotification(message) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose) {
            if (message.params) {
              data = `Params: ${JSON.stringify(message.params, null, 4)}

`;
            } else {
              data = "No parameters provided.\n\n";
            }
          }
          tracer.log(`Sending notification '${message.method}'.`, data);
        } else {
          logLSPMessage("send-notification", message);
        }
      }
      function traceSendingResponse(message, method, startTime) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose) {
            if (message.error && message.error.data) {
              data = `Error data: ${JSON.stringify(message.error.data, null, 4)}

`;
            } else {
              if (message.result) {
                data = `Result: ${JSON.stringify(message.result, null, 4)}

`;
              } else if (message.error === void 0) {
                data = "No result returned.\n\n";
              }
            }
          }
          tracer.log(`Sending response '${method} - (${message.id})'. Processing request took ${Date.now() - startTime}ms`, data);
        } else {
          logLSPMessage("send-response", message);
        }
      }
      function traceReceivedRequest(message) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose && message.params) {
            data = `Params: ${JSON.stringify(message.params, null, 4)}

`;
          }
          tracer.log(`Received request '${message.method} - (${message.id})'.`, data);
        } else {
          logLSPMessage("receive-request", message);
        }
      }
      function traceReceivedNotification(message) {
        if (trace === Trace.Off || !tracer || message.method === LogTraceNotification.type.method) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose) {
            if (message.params) {
              data = `Params: ${JSON.stringify(message.params, null, 4)}

`;
            } else {
              data = "No parameters provided.\n\n";
            }
          }
          tracer.log(`Received notification '${message.method}'.`, data);
        } else {
          logLSPMessage("receive-notification", message);
        }
      }
      function traceReceivedResponse(message, responsePromise) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose) {
            if (message.error && message.error.data) {
              data = `Error data: ${JSON.stringify(message.error.data, null, 4)}

`;
            } else {
              if (message.result) {
                data = `Result: ${JSON.stringify(message.result, null, 4)}

`;
              } else if (message.error === void 0) {
                data = "No result returned.\n\n";
              }
            }
          }
          if (responsePromise) {
            const error = message.error ? ` Request failed: ${message.error.message} (${message.error.code}).` : "";
            tracer.log(`Received response '${responsePromise.method} - (${message.id})' in ${Date.now() - responsePromise.timerStart}ms.${error}`, data);
          } else {
            tracer.log(`Received response ${message.id} without active response promise.`, data);
          }
        } else {
          logLSPMessage("receive-response", message);
        }
      }
      function logLSPMessage(type, message) {
        if (!tracer || trace === Trace.Off) {
          return;
        }
        const lspMessage = {
          isLSPMessage: true,
          type,
          message,
          timestamp: Date.now()
        };
        tracer.log(lspMessage);
      }
      function throwIfClosedOrDisposed() {
        if (isClosed()) {
          throw new ConnectionError(ConnectionErrors.Closed, "Connection is closed.");
        }
        if (isDisposed()) {
          throw new ConnectionError(ConnectionErrors.Disposed, "Connection is disposed.");
        }
      }
      function throwIfListening() {
        if (isListening()) {
          throw new ConnectionError(ConnectionErrors.AlreadyListening, "Connection is already listening");
        }
      }
      function throwIfNotListening() {
        if (!isListening()) {
          throw new Error("Call listen() first.");
        }
      }
      function undefinedToNull(param) {
        if (param === void 0) {
          return null;
        } else {
          return param;
        }
      }
      function nullToUndefined(param) {
        if (param === null) {
          return void 0;
        } else {
          return param;
        }
      }
      function isNamedParam(param) {
        return param !== void 0 && param !== null && !Array.isArray(param) && typeof param === "object";
      }
      function computeSingleParam(parameterStructures, param) {
        switch (parameterStructures) {
          case messages_1.ParameterStructures.auto:
            if (isNamedParam(param)) {
              return nullToUndefined(param);
            } else {
              return [undefinedToNull(param)];
            }
          case messages_1.ParameterStructures.byName:
            if (!isNamedParam(param)) {
              throw new Error(`Recevied parameters by name but param is not an object literal.`);
            }
            return nullToUndefined(param);
          case messages_1.ParameterStructures.byPosition:
            return [undefinedToNull(param)];
          default:
            throw new Error(`Unknown parameter structure ${parameterStructures.toString()}`);
        }
      }
      function computeMessageParams(type, params) {
        let result;
        const numberOfParams = type.numberOfParams;
        switch (numberOfParams) {
          case 0:
            result = void 0;
            break;
          case 1:
            result = computeSingleParam(type.parameterStructures, params[0]);
            break;
          default:
            result = [];
            for (let i = 0; i < params.length && i < numberOfParams; i++) {
              result.push(undefinedToNull(params[i]));
            }
            if (params.length < numberOfParams) {
              for (let i = params.length; i < numberOfParams; i++) {
                result.push(null);
              }
            }
            break;
        }
        return result;
      }
      const connection = {
        sendNotification: (type, ...args) => {
          throwIfClosedOrDisposed();
          let method;
          let messageParams;
          if (Is.string(type)) {
            method = type;
            const first = args[0];
            let paramStart = 0;
            let parameterStructures = messages_1.ParameterStructures.auto;
            if (messages_1.ParameterStructures.is(first)) {
              paramStart = 1;
              parameterStructures = first;
            }
            let paramEnd = args.length;
            const numberOfParams = paramEnd - paramStart;
            switch (numberOfParams) {
              case 0:
                messageParams = void 0;
                break;
              case 1:
                messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                break;
              default:
                if (parameterStructures === messages_1.ParameterStructures.byName) {
                  throw new Error(`Recevied ${numberOfParams} parameters for 'by Name' notification parameter structure.`);
                }
                messageParams = args.slice(paramStart, paramEnd).map((value) => undefinedToNull(value));
                break;
            }
          } else {
            const params = args;
            method = type.method;
            messageParams = computeMessageParams(type, params);
          }
          const notificationMessage = {
            jsonrpc: version,
            method,
            params: messageParams
          };
          traceSendingNotification(notificationMessage);
          messageWriter.write(notificationMessage);
        },
        onNotification: (type, handler) => {
          throwIfClosedOrDisposed();
          let method;
          if (Is.func(type)) {
            starNotificationHandler = type;
          } else if (handler) {
            if (Is.string(type)) {
              method = type;
              notificationHandlers[type] = { type: void 0, handler };
            } else {
              method = type.method;
              notificationHandlers[type.method] = { type, handler };
            }
          }
          return {
            dispose: () => {
              if (method !== void 0) {
                delete notificationHandlers[method];
              } else {
                starNotificationHandler = void 0;
              }
            }
          };
        },
        onProgress: (_type, token, handler) => {
          if (progressHandlers.has(token)) {
            throw new Error(`Progress handler for token ${token} already registered`);
          }
          progressHandlers.set(token, handler);
          return {
            dispose: () => {
              progressHandlers.delete(token);
            }
          };
        },
        sendProgress: (_type, token, value) => {
          connection.sendNotification(ProgressNotification.type, { token, value });
        },
        onUnhandledProgress: unhandledProgressEmitter.event,
        sendRequest: (type, ...args) => {
          throwIfClosedOrDisposed();
          throwIfNotListening();
          let method;
          let messageParams;
          let token = void 0;
          if (Is.string(type)) {
            method = type;
            const first = args[0];
            const last = args[args.length - 1];
            let paramStart = 0;
            let parameterStructures = messages_1.ParameterStructures.auto;
            if (messages_1.ParameterStructures.is(first)) {
              paramStart = 1;
              parameterStructures = first;
            }
            let paramEnd = args.length;
            if (cancellation_1.CancellationToken.is(last)) {
              paramEnd = paramEnd - 1;
              token = last;
            }
            const numberOfParams = paramEnd - paramStart;
            switch (numberOfParams) {
              case 0:
                messageParams = void 0;
                break;
              case 1:
                messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                break;
              default:
                if (parameterStructures === messages_1.ParameterStructures.byName) {
                  throw new Error(`Recevied ${numberOfParams} parameters for 'by Name' request parameter structure.`);
                }
                messageParams = args.slice(paramStart, paramEnd).map((value) => undefinedToNull(value));
                break;
            }
          } else {
            const params = args;
            method = type.method;
            messageParams = computeMessageParams(type, params);
            const numberOfParams = type.numberOfParams;
            token = cancellation_1.CancellationToken.is(params[numberOfParams]) ? params[numberOfParams] : void 0;
          }
          const id = sequenceNumber++;
          let disposable;
          if (token) {
            disposable = token.onCancellationRequested(() => {
              cancellationStrategy.sender.sendCancellation(connection, id);
            });
          }
          const result = new Promise((resolve, reject) => {
            const requestMessage = {
              jsonrpc: version,
              id,
              method,
              params: messageParams
            };
            const resolveWithCleanup = (r) => {
              resolve(r);
              cancellationStrategy.sender.cleanup(id);
              disposable === null || disposable === void 0 ? void 0 : disposable.dispose();
            };
            const rejectWithCleanup = (r) => {
              reject(r);
              cancellationStrategy.sender.cleanup(id);
              disposable === null || disposable === void 0 ? void 0 : disposable.dispose();
            };
            let responsePromise = { method, timerStart: Date.now(), resolve: resolveWithCleanup, reject: rejectWithCleanup };
            traceSendingRequest(requestMessage);
            try {
              messageWriter.write(requestMessage);
            } catch (e) {
              responsePromise.reject(new messages_1.ResponseError(messages_1.ErrorCodes.MessageWriteError, e.message ? e.message : "Unknown reason"));
              responsePromise = null;
            }
            if (responsePromise) {
              responsePromises[String(id)] = responsePromise;
            }
          });
          return result;
        },
        onRequest: (type, handler) => {
          throwIfClosedOrDisposed();
          let method = null;
          if (StarRequestHandler.is(type)) {
            method = void 0;
            starRequestHandler = type;
          } else if (Is.string(type)) {
            method = null;
            if (handler !== void 0) {
              method = type;
              requestHandlers[type] = { handler, type: void 0 };
            }
          } else {
            if (handler !== void 0) {
              method = type.method;
              requestHandlers[type.method] = { type, handler };
            }
          }
          return {
            dispose: () => {
              if (method === null) {
                return;
              }
              if (method !== void 0) {
                delete requestHandlers[method];
              } else {
                starRequestHandler = void 0;
              }
            }
          };
        },
        trace: (_value, _tracer, sendNotificationOrTraceOptions) => {
          let _sendNotification = false;
          let _traceFormat = TraceFormat.Text;
          if (sendNotificationOrTraceOptions !== void 0) {
            if (Is.boolean(sendNotificationOrTraceOptions)) {
              _sendNotification = sendNotificationOrTraceOptions;
            } else {
              _sendNotification = sendNotificationOrTraceOptions.sendNotification || false;
              _traceFormat = sendNotificationOrTraceOptions.traceFormat || TraceFormat.Text;
            }
          }
          trace = _value;
          traceFormat = _traceFormat;
          if (trace === Trace.Off) {
            tracer = void 0;
          } else {
            tracer = _tracer;
          }
          if (_sendNotification && !isClosed() && !isDisposed()) {
            connection.sendNotification(SetTraceNotification.type, { value: Trace.toString(_value) });
          }
        },
        onError: errorEmitter.event,
        onClose: closeEmitter.event,
        onUnhandledNotification: unhandledNotificationEmitter.event,
        onDispose: disposeEmitter.event,
        end: () => {
          messageWriter.end();
        },
        dispose: () => {
          if (isDisposed()) {
            return;
          }
          state = ConnectionState.Disposed;
          disposeEmitter.fire(void 0);
          const error = new Error("Connection got disposed.");
          Object.keys(responsePromises).forEach((key) => {
            responsePromises[key].reject(error);
          });
          responsePromises = /* @__PURE__ */ Object.create(null);
          requestTokens = /* @__PURE__ */ Object.create(null);
          messageQueue = new linkedMap_1.LinkedMap();
          if (Is.func(messageWriter.dispose)) {
            messageWriter.dispose();
          }
          if (Is.func(messageReader.dispose)) {
            messageReader.dispose();
          }
        },
        listen: () => {
          throwIfClosedOrDisposed();
          throwIfListening();
          state = ConnectionState.Listening;
          messageReader.listen(callback);
        },
        inspect: () => {
          ral_1.default().console.log("inspect");
        }
      };
      connection.onNotification(LogTraceNotification.type, (params) => {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        tracer.log(params.message, trace === Trace.Verbose ? params.verbose : void 0);
      });
      connection.onNotification(ProgressNotification.type, (params) => {
        const handler = progressHandlers.get(params.token);
        if (handler) {
          handler(params.value);
        } else {
          unhandledProgressEmitter.fire(params);
        }
      });
      return connection;
    }
    exports.createMessageConnection = createMessageConnection;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/common/api.js
var require_api = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/common/api.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CancellationSenderStrategy = exports.CancellationReceiverStrategy = exports.ConnectionError = exports.ConnectionErrors = exports.LogTraceNotification = exports.SetTraceNotification = exports.TraceFormat = exports.Trace = exports.ProgressType = exports.createMessageConnection = exports.NullLogger = exports.ConnectionOptions = exports.ConnectionStrategy = exports.WriteableStreamMessageWriter = exports.AbstractMessageWriter = exports.MessageWriter = exports.ReadableStreamMessageReader = exports.AbstractMessageReader = exports.MessageReader = exports.CancellationToken = exports.CancellationTokenSource = exports.Emitter = exports.Event = exports.Disposable = exports.ParameterStructures = exports.NotificationType9 = exports.NotificationType8 = exports.NotificationType7 = exports.NotificationType6 = exports.NotificationType5 = exports.NotificationType4 = exports.NotificationType3 = exports.NotificationType2 = exports.NotificationType1 = exports.NotificationType0 = exports.NotificationType = exports.ErrorCodes = exports.ResponseError = exports.RequestType9 = exports.RequestType8 = exports.RequestType7 = exports.RequestType6 = exports.RequestType5 = exports.RequestType4 = exports.RequestType3 = exports.RequestType2 = exports.RequestType1 = exports.RequestType0 = exports.RequestType = exports.RAL = void 0;
    exports.CancellationStrategy = void 0;
    var messages_1 = require_messages();
    Object.defineProperty(exports, "RequestType", { enumerable: true, get: function() {
      return messages_1.RequestType;
    } });
    Object.defineProperty(exports, "RequestType0", { enumerable: true, get: function() {
      return messages_1.RequestType0;
    } });
    Object.defineProperty(exports, "RequestType1", { enumerable: true, get: function() {
      return messages_1.RequestType1;
    } });
    Object.defineProperty(exports, "RequestType2", { enumerable: true, get: function() {
      return messages_1.RequestType2;
    } });
    Object.defineProperty(exports, "RequestType3", { enumerable: true, get: function() {
      return messages_1.RequestType3;
    } });
    Object.defineProperty(exports, "RequestType4", { enumerable: true, get: function() {
      return messages_1.RequestType4;
    } });
    Object.defineProperty(exports, "RequestType5", { enumerable: true, get: function() {
      return messages_1.RequestType5;
    } });
    Object.defineProperty(exports, "RequestType6", { enumerable: true, get: function() {
      return messages_1.RequestType6;
    } });
    Object.defineProperty(exports, "RequestType7", { enumerable: true, get: function() {
      return messages_1.RequestType7;
    } });
    Object.defineProperty(exports, "RequestType8", { enumerable: true, get: function() {
      return messages_1.RequestType8;
    } });
    Object.defineProperty(exports, "RequestType9", { enumerable: true, get: function() {
      return messages_1.RequestType9;
    } });
    Object.defineProperty(exports, "ResponseError", { enumerable: true, get: function() {
      return messages_1.ResponseError;
    } });
    Object.defineProperty(exports, "ErrorCodes", { enumerable: true, get: function() {
      return messages_1.ErrorCodes;
    } });
    Object.defineProperty(exports, "NotificationType", { enumerable: true, get: function() {
      return messages_1.NotificationType;
    } });
    Object.defineProperty(exports, "NotificationType0", { enumerable: true, get: function() {
      return messages_1.NotificationType0;
    } });
    Object.defineProperty(exports, "NotificationType1", { enumerable: true, get: function() {
      return messages_1.NotificationType1;
    } });
    Object.defineProperty(exports, "NotificationType2", { enumerable: true, get: function() {
      return messages_1.NotificationType2;
    } });
    Object.defineProperty(exports, "NotificationType3", { enumerable: true, get: function() {
      return messages_1.NotificationType3;
    } });
    Object.defineProperty(exports, "NotificationType4", { enumerable: true, get: function() {
      return messages_1.NotificationType4;
    } });
    Object.defineProperty(exports, "NotificationType5", { enumerable: true, get: function() {
      return messages_1.NotificationType5;
    } });
    Object.defineProperty(exports, "NotificationType6", { enumerable: true, get: function() {
      return messages_1.NotificationType6;
    } });
    Object.defineProperty(exports, "NotificationType7", { enumerable: true, get: function() {
      return messages_1.NotificationType7;
    } });
    Object.defineProperty(exports, "NotificationType8", { enumerable: true, get: function() {
      return messages_1.NotificationType8;
    } });
    Object.defineProperty(exports, "NotificationType9", { enumerable: true, get: function() {
      return messages_1.NotificationType9;
    } });
    Object.defineProperty(exports, "ParameterStructures", { enumerable: true, get: function() {
      return messages_1.ParameterStructures;
    } });
    var disposable_1 = require_disposable();
    Object.defineProperty(exports, "Disposable", { enumerable: true, get: function() {
      return disposable_1.Disposable;
    } });
    var events_1 = require_events();
    Object.defineProperty(exports, "Event", { enumerable: true, get: function() {
      return events_1.Event;
    } });
    Object.defineProperty(exports, "Emitter", { enumerable: true, get: function() {
      return events_1.Emitter;
    } });
    var cancellation_1 = require_cancellation();
    Object.defineProperty(exports, "CancellationTokenSource", { enumerable: true, get: function() {
      return cancellation_1.CancellationTokenSource;
    } });
    Object.defineProperty(exports, "CancellationToken", { enumerable: true, get: function() {
      return cancellation_1.CancellationToken;
    } });
    var messageReader_1 = require_messageReader();
    Object.defineProperty(exports, "MessageReader", { enumerable: true, get: function() {
      return messageReader_1.MessageReader;
    } });
    Object.defineProperty(exports, "AbstractMessageReader", { enumerable: true, get: function() {
      return messageReader_1.AbstractMessageReader;
    } });
    Object.defineProperty(exports, "ReadableStreamMessageReader", { enumerable: true, get: function() {
      return messageReader_1.ReadableStreamMessageReader;
    } });
    var messageWriter_1 = require_messageWriter();
    Object.defineProperty(exports, "MessageWriter", { enumerable: true, get: function() {
      return messageWriter_1.MessageWriter;
    } });
    Object.defineProperty(exports, "AbstractMessageWriter", { enumerable: true, get: function() {
      return messageWriter_1.AbstractMessageWriter;
    } });
    Object.defineProperty(exports, "WriteableStreamMessageWriter", { enumerable: true, get: function() {
      return messageWriter_1.WriteableStreamMessageWriter;
    } });
    var connection_1 = require_connection();
    Object.defineProperty(exports, "ConnectionStrategy", { enumerable: true, get: function() {
      return connection_1.ConnectionStrategy;
    } });
    Object.defineProperty(exports, "ConnectionOptions", { enumerable: true, get: function() {
      return connection_1.ConnectionOptions;
    } });
    Object.defineProperty(exports, "NullLogger", { enumerable: true, get: function() {
      return connection_1.NullLogger;
    } });
    Object.defineProperty(exports, "createMessageConnection", { enumerable: true, get: function() {
      return connection_1.createMessageConnection;
    } });
    Object.defineProperty(exports, "ProgressType", { enumerable: true, get: function() {
      return connection_1.ProgressType;
    } });
    Object.defineProperty(exports, "Trace", { enumerable: true, get: function() {
      return connection_1.Trace;
    } });
    Object.defineProperty(exports, "TraceFormat", { enumerable: true, get: function() {
      return connection_1.TraceFormat;
    } });
    Object.defineProperty(exports, "SetTraceNotification", { enumerable: true, get: function() {
      return connection_1.SetTraceNotification;
    } });
    Object.defineProperty(exports, "LogTraceNotification", { enumerable: true, get: function() {
      return connection_1.LogTraceNotification;
    } });
    Object.defineProperty(exports, "ConnectionErrors", { enumerable: true, get: function() {
      return connection_1.ConnectionErrors;
    } });
    Object.defineProperty(exports, "ConnectionError", { enumerable: true, get: function() {
      return connection_1.ConnectionError;
    } });
    Object.defineProperty(exports, "CancellationReceiverStrategy", { enumerable: true, get: function() {
      return connection_1.CancellationReceiverStrategy;
    } });
    Object.defineProperty(exports, "CancellationSenderStrategy", { enumerable: true, get: function() {
      return connection_1.CancellationSenderStrategy;
    } });
    Object.defineProperty(exports, "CancellationStrategy", { enumerable: true, get: function() {
      return connection_1.CancellationStrategy;
    } });
    var ral_1 = require_ral();
    exports.RAL = ral_1.default;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/lib/browser/main.js
var require_main = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/lib/browser/main.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createMessageConnection = exports.BrowserMessageWriter = exports.BrowserMessageReader = void 0;
    var ril_1 = require_ril();
    ril_1.default.install();
    var api_1 = require_api();
    __exportStar(require_api(), exports);
    var BrowserMessageReader = class extends api_1.AbstractMessageReader {
      constructor(context) {
        super();
        this._onData = new api_1.Emitter();
        this._messageListener = (event) => {
          this._onData.fire(event.data);
        };
        context.addEventListener("error", (event) => this.fireError(event));
        context.onmessage = this._messageListener;
      }
      listen(callback) {
        return this._onData.event(callback);
      }
    };
    exports.BrowserMessageReader = BrowserMessageReader;
    var BrowserMessageWriter = class extends api_1.AbstractMessageWriter {
      constructor(context) {
        super();
        this.context = context;
        this.errorCount = 0;
        context.addEventListener("error", (event) => this.fireError(event));
      }
      write(msg) {
        try {
          this.context.postMessage(msg);
          return Promise.resolve();
        } catch (error) {
          this.handleError(error, msg);
          return Promise.reject(error);
        }
      }
      handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
      }
      end() {
      }
    };
    exports.BrowserMessageWriter = BrowserMessageWriter;
    function createMessageConnection(reader, writer, logger, options) {
      if (logger === void 0) {
        logger = api_1.NullLogger;
      }
      if (api_1.ConnectionStrategy.is(options)) {
        options = { connectionStrategy: options };
      }
      return api_1.createMessageConnection(reader, writer, logger, options);
    }
    exports.createMessageConnection = createMessageConnection;
  }
});

// yamma/server/node_modules/vscode-jsonrpc/browser.js
var require_browser = __commonJS({
  "yamma/server/node_modules/vscode-jsonrpc/browser.js"(exports, module) {
    module.exports = require_main();
  }
});

// yamma/server/node_modules/vscode-languageserver-types/lib/umd/main.js
var require_main2 = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-types/lib/umd/main.js"(exports, module) {
    (function(factory) {
      if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(__require, exports);
        if (v !== void 0) module.exports = v;
      } else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
      }
    })(function(require2, exports2) {
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.TextDocument = exports2.EOL = exports2.SelectionRange = exports2.DocumentLink = exports2.FormattingOptions = exports2.CodeLens = exports2.CodeAction = exports2.CodeActionContext = exports2.CodeActionKind = exports2.DocumentSymbol = exports2.SymbolInformation = exports2.SymbolTag = exports2.SymbolKind = exports2.DocumentHighlight = exports2.DocumentHighlightKind = exports2.SignatureInformation = exports2.ParameterInformation = exports2.Hover = exports2.MarkedString = exports2.CompletionList = exports2.CompletionItem = exports2.InsertTextMode = exports2.InsertReplaceEdit = exports2.CompletionItemTag = exports2.InsertTextFormat = exports2.CompletionItemKind = exports2.MarkupContent = exports2.MarkupKind = exports2.TextDocumentItem = exports2.OptionalVersionedTextDocumentIdentifier = exports2.VersionedTextDocumentIdentifier = exports2.TextDocumentIdentifier = exports2.WorkspaceChange = exports2.WorkspaceEdit = exports2.DeleteFile = exports2.RenameFile = exports2.CreateFile = exports2.TextDocumentEdit = exports2.AnnotatedTextEdit = exports2.ChangeAnnotationIdentifier = exports2.ChangeAnnotation = exports2.TextEdit = exports2.Command = exports2.Diagnostic = exports2.CodeDescription = exports2.DiagnosticTag = exports2.DiagnosticSeverity = exports2.DiagnosticRelatedInformation = exports2.FoldingRange = exports2.FoldingRangeKind = exports2.ColorPresentation = exports2.ColorInformation = exports2.Color = exports2.LocationLink = exports2.Location = exports2.Range = exports2.Position = exports2.uinteger = exports2.integer = void 0;
      (function(integer2) {
        integer2.MIN_VALUE = -2147483648;
        integer2.MAX_VALUE = 2147483647;
      })(exports2.integer || (exports2.integer = {}));
      var uinteger;
      (function(uinteger2) {
        uinteger2.MIN_VALUE = 0;
        uinteger2.MAX_VALUE = 2147483647;
      })(uinteger = exports2.uinteger || (exports2.uinteger = {}));
      var Position2;
      (function(Position3) {
        function create(line, character) {
          if (line === Number.MAX_VALUE) {
            line = uinteger.MAX_VALUE;
          }
          if (character === Number.MAX_VALUE) {
            character = uinteger.MAX_VALUE;
          }
          return { line, character };
        }
        Position3.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
        }
        Position3.is = is;
      })(Position2 = exports2.Position || (exports2.Position = {}));
      var Range5;
      (function(Range6) {
        function create(one, two, three, four) {
          if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) {
            return { start: Position2.create(one, two), end: Position2.create(three, four) };
          } else if (Position2.is(one) && Position2.is(two)) {
            return { start: one, end: two };
          } else {
            throw new Error("Range#create called with invalid arguments[" + one + ", " + two + ", " + three + ", " + four + "]");
          }
        }
        Range6.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Position2.is(candidate.start) && Position2.is(candidate.end);
        }
        Range6.is = is;
      })(Range5 = exports2.Range || (exports2.Range = {}));
      var Location;
      (function(Location2) {
        function create(uri, range2) {
          return { uri, range: range2 };
        }
        Location2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range5.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
        }
        Location2.is = is;
      })(Location = exports2.Location || (exports2.Location = {}));
      (function(LocationLink2) {
        function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
          return { targetUri, targetRange, targetSelectionRange, originSelectionRange };
        }
        LocationLink2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range5.is(candidate.targetRange) && Is.string(candidate.targetUri) && (Range5.is(candidate.targetSelectionRange) || Is.undefined(candidate.targetSelectionRange)) && (Range5.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
        }
        LocationLink2.is = is;
      })(exports2.LocationLink || (exports2.LocationLink = {}));
      var Color;
      (function(Color2) {
        function create(red, green, blue, alpha) {
          return {
            red,
            green,
            blue,
            alpha
          };
        }
        Color2.create = create;
        function is(value) {
          var candidate = value;
          return Is.numberRange(candidate.red, 0, 1) && Is.numberRange(candidate.green, 0, 1) && Is.numberRange(candidate.blue, 0, 1) && Is.numberRange(candidate.alpha, 0, 1);
        }
        Color2.is = is;
      })(Color = exports2.Color || (exports2.Color = {}));
      (function(ColorInformation2) {
        function create(range2, color) {
          return {
            range: range2,
            color
          };
        }
        ColorInformation2.create = create;
        function is(value) {
          var candidate = value;
          return Range5.is(candidate.range) && Color.is(candidate.color);
        }
        ColorInformation2.is = is;
      })(exports2.ColorInformation || (exports2.ColorInformation = {}));
      (function(ColorPresentation2) {
        function create(label, textEdit, additionalTextEdits) {
          return {
            label,
            textEdit,
            additionalTextEdits
          };
        }
        ColorPresentation2.create = create;
        function is(value) {
          var candidate = value;
          return Is.string(candidate.label) && (Is.undefined(candidate.textEdit) || TextEdit2.is(candidate)) && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit2.is));
        }
        ColorPresentation2.is = is;
      })(exports2.ColorPresentation || (exports2.ColorPresentation = {}));
      (function(FoldingRangeKind2) {
        FoldingRangeKind2["Comment"] = "comment";
        FoldingRangeKind2["Imports"] = "imports";
        FoldingRangeKind2["Region"] = "region";
      })(exports2.FoldingRangeKind || (exports2.FoldingRangeKind = {}));
      (function(FoldingRange2) {
        function create(startLine, endLine, startCharacter, endCharacter, kind) {
          var result = {
            startLine,
            endLine
          };
          if (Is.defined(startCharacter)) {
            result.startCharacter = startCharacter;
          }
          if (Is.defined(endCharacter)) {
            result.endCharacter = endCharacter;
          }
          if (Is.defined(kind)) {
            result.kind = kind;
          }
          return result;
        }
        FoldingRange2.create = create;
        function is(value) {
          var candidate = value;
          return Is.uinteger(candidate.startLine) && Is.uinteger(candidate.startLine) && (Is.undefined(candidate.startCharacter) || Is.uinteger(candidate.startCharacter)) && (Is.undefined(candidate.endCharacter) || Is.uinteger(candidate.endCharacter)) && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
        }
        FoldingRange2.is = is;
      })(exports2.FoldingRange || (exports2.FoldingRange = {}));
      var DiagnosticRelatedInformation;
      (function(DiagnosticRelatedInformation2) {
        function create(location, message) {
          return {
            location,
            message
          };
        }
        DiagnosticRelatedInformation2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
        }
        DiagnosticRelatedInformation2.is = is;
      })(DiagnosticRelatedInformation = exports2.DiagnosticRelatedInformation || (exports2.DiagnosticRelatedInformation = {}));
      (function(DiagnosticSeverity7) {
        DiagnosticSeverity7.Error = 1;
        DiagnosticSeverity7.Warning = 2;
        DiagnosticSeverity7.Information = 3;
        DiagnosticSeverity7.Hint = 4;
      })(exports2.DiagnosticSeverity || (exports2.DiagnosticSeverity = {}));
      (function(DiagnosticTag2) {
        DiagnosticTag2.Unnecessary = 1;
        DiagnosticTag2.Deprecated = 2;
      })(exports2.DiagnosticTag || (exports2.DiagnosticTag = {}));
      (function(CodeDescription2) {
        function is(value) {
          var candidate = value;
          return candidate !== void 0 && candidate !== null && Is.string(candidate.href);
        }
        CodeDescription2.is = is;
      })(exports2.CodeDescription || (exports2.CodeDescription = {}));
      var Diagnostic7;
      (function(Diagnostic8) {
        function create(range2, message, severity, code, source, relatedInformation) {
          var result = { range: range2, message };
          if (Is.defined(severity)) {
            result.severity = severity;
          }
          if (Is.defined(code)) {
            result.code = code;
          }
          if (Is.defined(source)) {
            result.source = source;
          }
          if (Is.defined(relatedInformation)) {
            result.relatedInformation = relatedInformation;
          }
          return result;
        }
        Diagnostic8.create = create;
        function is(value) {
          var _a;
          var candidate = value;
          return Is.defined(candidate) && Range5.is(candidate.range) && Is.string(candidate.message) && (Is.number(candidate.severity) || Is.undefined(candidate.severity)) && (Is.integer(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code)) && (Is.undefined(candidate.codeDescription) || Is.string((_a = candidate.codeDescription) === null || _a === void 0 ? void 0 : _a.href)) && (Is.string(candidate.source) || Is.undefined(candidate.source)) && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
        }
        Diagnostic8.is = is;
      })(Diagnostic7 = exports2.Diagnostic || (exports2.Diagnostic = {}));
      var Command;
      (function(Command2) {
        function create(title, command) {
          var args = [];
          for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
          }
          var result = { title, command };
          if (Is.defined(args) && args.length > 0) {
            result.arguments = args;
          }
          return result;
        }
        Command2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
        }
        Command2.is = is;
      })(Command = exports2.Command || (exports2.Command = {}));
      var TextEdit2;
      (function(TextEdit3) {
        function replace(range2, newText) {
          return { range: range2, newText };
        }
        TextEdit3.replace = replace;
        function insert(position, newText) {
          return { range: { start: position, end: position }, newText };
        }
        TextEdit3.insert = insert;
        function del(range2) {
          return { range: range2, newText: "" };
        }
        TextEdit3.del = del;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.string(candidate.newText) && Range5.is(candidate.range);
        }
        TextEdit3.is = is;
      })(TextEdit2 = exports2.TextEdit || (exports2.TextEdit = {}));
      var ChangeAnnotation;
      (function(ChangeAnnotation2) {
        function create(label, needsConfirmation, description) {
          var result = { label };
          if (needsConfirmation !== void 0) {
            result.needsConfirmation = needsConfirmation;
          }
          if (description !== void 0) {
            result.description = description;
          }
          return result;
        }
        ChangeAnnotation2.create = create;
        function is(value) {
          var candidate = value;
          return candidate !== void 0 && Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.boolean(candidate.needsConfirmation) || candidate.needsConfirmation === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
        }
        ChangeAnnotation2.is = is;
      })(ChangeAnnotation = exports2.ChangeAnnotation || (exports2.ChangeAnnotation = {}));
      var ChangeAnnotationIdentifier;
      (function(ChangeAnnotationIdentifier2) {
        function is(value) {
          var candidate = value;
          return typeof candidate === "string";
        }
        ChangeAnnotationIdentifier2.is = is;
      })(ChangeAnnotationIdentifier = exports2.ChangeAnnotationIdentifier || (exports2.ChangeAnnotationIdentifier = {}));
      var AnnotatedTextEdit;
      (function(AnnotatedTextEdit2) {
        function replace(range2, newText, annotation) {
          return { range: range2, newText, annotationId: annotation };
        }
        AnnotatedTextEdit2.replace = replace;
        function insert(position, newText, annotation) {
          return { range: { start: position, end: position }, newText, annotationId: annotation };
        }
        AnnotatedTextEdit2.insert = insert;
        function del(range2, annotation) {
          return { range: range2, newText: "", annotationId: annotation };
        }
        AnnotatedTextEdit2.del = del;
        function is(value) {
          var candidate = value;
          return TextEdit2.is(candidate) && (ChangeAnnotation.is(candidate.annotationId) || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        AnnotatedTextEdit2.is = is;
      })(AnnotatedTextEdit = exports2.AnnotatedTextEdit || (exports2.AnnotatedTextEdit = {}));
      var TextDocumentEdit;
      (function(TextDocumentEdit2) {
        function create(textDocument, edits) {
          return { textDocument, edits };
        }
        TextDocumentEdit2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument) && Array.isArray(candidate.edits);
        }
        TextDocumentEdit2.is = is;
      })(TextDocumentEdit = exports2.TextDocumentEdit || (exports2.TextDocumentEdit = {}));
      var CreateFile;
      (function(CreateFile2) {
        function create(uri, options, annotation) {
          var result = {
            kind: "create",
            uri
          };
          if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
            result.options = options;
          }
          if (annotation !== void 0) {
            result.annotationId = annotation;
          }
          return result;
        }
        CreateFile2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && candidate.kind === "create" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        CreateFile2.is = is;
      })(CreateFile = exports2.CreateFile || (exports2.CreateFile = {}));
      var RenameFile;
      (function(RenameFile2) {
        function create(oldUri, newUri, options, annotation) {
          var result = {
            kind: "rename",
            oldUri,
            newUri
          };
          if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
            result.options = options;
          }
          if (annotation !== void 0) {
            result.annotationId = annotation;
          }
          return result;
        }
        RenameFile2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && candidate.kind === "rename" && Is.string(candidate.oldUri) && Is.string(candidate.newUri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        RenameFile2.is = is;
      })(RenameFile = exports2.RenameFile || (exports2.RenameFile = {}));
      var DeleteFile;
      (function(DeleteFile2) {
        function create(uri, options, annotation) {
          var result = {
            kind: "delete",
            uri
          };
          if (options !== void 0 && (options.recursive !== void 0 || options.ignoreIfNotExists !== void 0)) {
            result.options = options;
          }
          if (annotation !== void 0) {
            result.annotationId = annotation;
          }
          return result;
        }
        DeleteFile2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && candidate.kind === "delete" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.recursive === void 0 || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === void 0 || Is.boolean(candidate.options.ignoreIfNotExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        DeleteFile2.is = is;
      })(DeleteFile = exports2.DeleteFile || (exports2.DeleteFile = {}));
      var WorkspaceEdit;
      (function(WorkspaceEdit2) {
        function is(value) {
          var candidate = value;
          return candidate && (candidate.changes !== void 0 || candidate.documentChanges !== void 0) && (candidate.documentChanges === void 0 || candidate.documentChanges.every(function(change) {
            if (Is.string(change.kind)) {
              return CreateFile.is(change) || RenameFile.is(change) || DeleteFile.is(change);
            } else {
              return TextDocumentEdit.is(change);
            }
          }));
        }
        WorkspaceEdit2.is = is;
      })(WorkspaceEdit = exports2.WorkspaceEdit || (exports2.WorkspaceEdit = {}));
      var TextEditChangeImpl = (
        /** @class */
        (function() {
          function TextEditChangeImpl2(edits, changeAnnotations) {
            this.edits = edits;
            this.changeAnnotations = changeAnnotations;
          }
          TextEditChangeImpl2.prototype.insert = function(position, newText, annotation) {
            var edit;
            var id;
            if (annotation === void 0) {
              edit = TextEdit2.insert(position, newText);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id = annotation;
              edit = AnnotatedTextEdit.insert(position, newText, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.insert(position, newText, id);
            }
            this.edits.push(edit);
            if (id !== void 0) {
              return id;
            }
          };
          TextEditChangeImpl2.prototype.replace = function(range2, newText, annotation) {
            var edit;
            var id;
            if (annotation === void 0) {
              edit = TextEdit2.replace(range2, newText);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id = annotation;
              edit = AnnotatedTextEdit.replace(range2, newText, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.replace(range2, newText, id);
            }
            this.edits.push(edit);
            if (id !== void 0) {
              return id;
            }
          };
          TextEditChangeImpl2.prototype.delete = function(range2, annotation) {
            var edit;
            var id;
            if (annotation === void 0) {
              edit = TextEdit2.del(range2);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id = annotation;
              edit = AnnotatedTextEdit.del(range2, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.del(range2, id);
            }
            this.edits.push(edit);
            if (id !== void 0) {
              return id;
            }
          };
          TextEditChangeImpl2.prototype.add = function(edit) {
            this.edits.push(edit);
          };
          TextEditChangeImpl2.prototype.all = function() {
            return this.edits;
          };
          TextEditChangeImpl2.prototype.clear = function() {
            this.edits.splice(0, this.edits.length);
          };
          TextEditChangeImpl2.prototype.assertChangeAnnotations = function(value) {
            if (value === void 0) {
              throw new Error("Text edit change is not configured to manage change annotations.");
            }
          };
          return TextEditChangeImpl2;
        })()
      );
      var ChangeAnnotations = (
        /** @class */
        (function() {
          function ChangeAnnotations2(annotations) {
            this._annotations = annotations === void 0 ? /* @__PURE__ */ Object.create(null) : annotations;
            this._counter = 0;
            this._size = 0;
          }
          ChangeAnnotations2.prototype.all = function() {
            return this._annotations;
          };
          Object.defineProperty(ChangeAnnotations2.prototype, "size", {
            get: function() {
              return this._size;
            },
            enumerable: false,
            configurable: true
          });
          ChangeAnnotations2.prototype.manage = function(idOrAnnotation, annotation) {
            var id;
            if (ChangeAnnotationIdentifier.is(idOrAnnotation)) {
              id = idOrAnnotation;
            } else {
              id = this.nextId();
              annotation = idOrAnnotation;
            }
            if (this._annotations[id] !== void 0) {
              throw new Error("Id " + id + " is already in use.");
            }
            if (annotation === void 0) {
              throw new Error("No annotation provided for id " + id);
            }
            this._annotations[id] = annotation;
            this._size++;
            return id;
          };
          ChangeAnnotations2.prototype.nextId = function() {
            this._counter++;
            return this._counter.toString();
          };
          return ChangeAnnotations2;
        })()
      );
      var WorkspaceChange2 = (
        /** @class */
        (function() {
          function WorkspaceChange3(workspaceEdit) {
            var _this = this;
            this._textEditChanges = /* @__PURE__ */ Object.create(null);
            if (workspaceEdit !== void 0) {
              this._workspaceEdit = workspaceEdit;
              if (workspaceEdit.documentChanges) {
                this._changeAnnotations = new ChangeAnnotations(workspaceEdit.changeAnnotations);
                workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                workspaceEdit.documentChanges.forEach(function(change) {
                  if (TextDocumentEdit.is(change)) {
                    var textEditChange = new TextEditChangeImpl(change.edits, _this._changeAnnotations);
                    _this._textEditChanges[change.textDocument.uri] = textEditChange;
                  }
                });
              } else if (workspaceEdit.changes) {
                Object.keys(workspaceEdit.changes).forEach(function(key) {
                  var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
                  _this._textEditChanges[key] = textEditChange;
                });
              }
            } else {
              this._workspaceEdit = {};
            }
          }
          Object.defineProperty(WorkspaceChange3.prototype, "edit", {
            /**
             * Returns the underlying [WorkspaceEdit](#WorkspaceEdit) literal
             * use to be returned from a workspace edit operation like rename.
             */
            get: function() {
              this.initDocumentChanges();
              if (this._changeAnnotations !== void 0) {
                if (this._changeAnnotations.size === 0) {
                  this._workspaceEdit.changeAnnotations = void 0;
                } else {
                  this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                }
              }
              return this._workspaceEdit;
            },
            enumerable: false,
            configurable: true
          });
          WorkspaceChange3.prototype.getTextEditChange = function(key) {
            if (OptionalVersionedTextDocumentIdentifier.is(key)) {
              this.initDocumentChanges();
              if (this._workspaceEdit.documentChanges === void 0) {
                throw new Error("Workspace edit is not configured for document changes.");
              }
              var textDocument = { uri: key.uri, version: key.version };
              var result = this._textEditChanges[textDocument.uri];
              if (!result) {
                var edits = [];
                var textDocumentEdit = {
                  textDocument,
                  edits
                };
                this._workspaceEdit.documentChanges.push(textDocumentEdit);
                result = new TextEditChangeImpl(edits, this._changeAnnotations);
                this._textEditChanges[textDocument.uri] = result;
              }
              return result;
            } else {
              this.initChanges();
              if (this._workspaceEdit.changes === void 0) {
                throw new Error("Workspace edit is not configured for normal text edit changes.");
              }
              var result = this._textEditChanges[key];
              if (!result) {
                var edits = [];
                this._workspaceEdit.changes[key] = edits;
                result = new TextEditChangeImpl(edits);
                this._textEditChanges[key] = result;
              }
              return result;
            }
          };
          WorkspaceChange3.prototype.initDocumentChanges = function() {
            if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
              this._changeAnnotations = new ChangeAnnotations();
              this._workspaceEdit.documentChanges = [];
              this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
            }
          };
          WorkspaceChange3.prototype.initChanges = function() {
            if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
              this._workspaceEdit.changes = /* @__PURE__ */ Object.create(null);
            }
          };
          WorkspaceChange3.prototype.createFile = function(uri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === void 0) {
              operation = CreateFile.create(uri, options);
            } else {
              id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = CreateFile.create(uri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== void 0) {
              return id;
            }
          };
          WorkspaceChange3.prototype.renameFile = function(oldUri, newUri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === void 0) {
              operation = RenameFile.create(oldUri, newUri, options);
            } else {
              id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = RenameFile.create(oldUri, newUri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== void 0) {
              return id;
            }
          };
          WorkspaceChange3.prototype.deleteFile = function(uri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === void 0) {
              operation = DeleteFile.create(uri, options);
            } else {
              id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = DeleteFile.create(uri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== void 0) {
              return id;
            }
          };
          return WorkspaceChange3;
        })()
      );
      exports2.WorkspaceChange = WorkspaceChange2;
      (function(TextDocumentIdentifier2) {
        function create(uri) {
          return { uri };
        }
        TextDocumentIdentifier2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri);
        }
        TextDocumentIdentifier2.is = is;
      })(exports2.TextDocumentIdentifier || (exports2.TextDocumentIdentifier = {}));
      (function(VersionedTextDocumentIdentifier2) {
        function create(uri, version) {
          return { uri, version };
        }
        VersionedTextDocumentIdentifier2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && Is.integer(candidate.version);
        }
        VersionedTextDocumentIdentifier2.is = is;
      })(exports2.VersionedTextDocumentIdentifier || (exports2.VersionedTextDocumentIdentifier = {}));
      var OptionalVersionedTextDocumentIdentifier;
      (function(OptionalVersionedTextDocumentIdentifier2) {
        function create(uri, version) {
          return { uri, version };
        }
        OptionalVersionedTextDocumentIdentifier2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.integer(candidate.version));
        }
        OptionalVersionedTextDocumentIdentifier2.is = is;
      })(OptionalVersionedTextDocumentIdentifier = exports2.OptionalVersionedTextDocumentIdentifier || (exports2.OptionalVersionedTextDocumentIdentifier = {}));
      (function(TextDocumentItem2) {
        function create(uri, languageId, version, text) {
          return { uri, languageId, version, text };
        }
        TextDocumentItem2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.integer(candidate.version) && Is.string(candidate.text);
        }
        TextDocumentItem2.is = is;
      })(exports2.TextDocumentItem || (exports2.TextDocumentItem = {}));
      var MarkupKind;
      (function(MarkupKind2) {
        MarkupKind2.PlainText = "plaintext";
        MarkupKind2.Markdown = "markdown";
      })(MarkupKind = exports2.MarkupKind || (exports2.MarkupKind = {}));
      (function(MarkupKind2) {
        function is(value) {
          var candidate = value;
          return candidate === MarkupKind2.PlainText || candidate === MarkupKind2.Markdown;
        }
        MarkupKind2.is = is;
      })(MarkupKind = exports2.MarkupKind || (exports2.MarkupKind = {}));
      var MarkupContent;
      (function(MarkupContent2) {
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
        }
        MarkupContent2.is = is;
      })(MarkupContent = exports2.MarkupContent || (exports2.MarkupContent = {}));
      (function(CompletionItemKind3) {
        CompletionItemKind3.Text = 1;
        CompletionItemKind3.Method = 2;
        CompletionItemKind3.Function = 3;
        CompletionItemKind3.Constructor = 4;
        CompletionItemKind3.Field = 5;
        CompletionItemKind3.Variable = 6;
        CompletionItemKind3.Class = 7;
        CompletionItemKind3.Interface = 8;
        CompletionItemKind3.Module = 9;
        CompletionItemKind3.Property = 10;
        CompletionItemKind3.Unit = 11;
        CompletionItemKind3.Value = 12;
        CompletionItemKind3.Enum = 13;
        CompletionItemKind3.Keyword = 14;
        CompletionItemKind3.Snippet = 15;
        CompletionItemKind3.Color = 16;
        CompletionItemKind3.File = 17;
        CompletionItemKind3.Reference = 18;
        CompletionItemKind3.Folder = 19;
        CompletionItemKind3.EnumMember = 20;
        CompletionItemKind3.Constant = 21;
        CompletionItemKind3.Struct = 22;
        CompletionItemKind3.Event = 23;
        CompletionItemKind3.Operator = 24;
        CompletionItemKind3.TypeParameter = 25;
      })(exports2.CompletionItemKind || (exports2.CompletionItemKind = {}));
      (function(InsertTextFormat2) {
        InsertTextFormat2.PlainText = 1;
        InsertTextFormat2.Snippet = 2;
      })(exports2.InsertTextFormat || (exports2.InsertTextFormat = {}));
      (function(CompletionItemTag2) {
        CompletionItemTag2.Deprecated = 1;
      })(exports2.CompletionItemTag || (exports2.CompletionItemTag = {}));
      (function(InsertReplaceEdit2) {
        function create(newText, insert, replace) {
          return { newText, insert, replace };
        }
        InsertReplaceEdit2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && Is.string(candidate.newText) && Range5.is(candidate.insert) && Range5.is(candidate.replace);
        }
        InsertReplaceEdit2.is = is;
      })(exports2.InsertReplaceEdit || (exports2.InsertReplaceEdit = {}));
      (function(InsertTextMode2) {
        InsertTextMode2.asIs = 1;
        InsertTextMode2.adjustIndentation = 2;
      })(exports2.InsertTextMode || (exports2.InsertTextMode = {}));
      (function(CompletionItem2) {
        function create(label) {
          return { label };
        }
        CompletionItem2.create = create;
      })(exports2.CompletionItem || (exports2.CompletionItem = {}));
      (function(CompletionList2) {
        function create(items, isIncomplete) {
          return { items: items ? items : [], isIncomplete: !!isIncomplete };
        }
        CompletionList2.create = create;
      })(exports2.CompletionList || (exports2.CompletionList = {}));
      var MarkedString;
      (function(MarkedString2) {
        function fromPlainText(plainText) {
          return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
        }
        MarkedString2.fromPlainText = fromPlainText;
        function is(value) {
          var candidate = value;
          return Is.string(candidate) || Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value);
        }
        MarkedString2.is = is;
      })(MarkedString = exports2.MarkedString || (exports2.MarkedString = {}));
      (function(Hover2) {
        function is(value) {
          var candidate = value;
          return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) || MarkedString.is(candidate.contents) || Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === void 0 || Range5.is(value.range));
        }
        Hover2.is = is;
      })(exports2.Hover || (exports2.Hover = {}));
      (function(ParameterInformation2) {
        function create(label, documentation) {
          return documentation ? { label, documentation } : { label };
        }
        ParameterInformation2.create = create;
      })(exports2.ParameterInformation || (exports2.ParameterInformation = {}));
      (function(SignatureInformation2) {
        function create(label, documentation) {
          var parameters = [];
          for (var _i = 2; _i < arguments.length; _i++) {
            parameters[_i - 2] = arguments[_i];
          }
          var result = { label };
          if (Is.defined(documentation)) {
            result.documentation = documentation;
          }
          if (Is.defined(parameters)) {
            result.parameters = parameters;
          } else {
            result.parameters = [];
          }
          return result;
        }
        SignatureInformation2.create = create;
      })(exports2.SignatureInformation || (exports2.SignatureInformation = {}));
      (function(DocumentHighlightKind2) {
        DocumentHighlightKind2.Text = 1;
        DocumentHighlightKind2.Read = 2;
        DocumentHighlightKind2.Write = 3;
      })(exports2.DocumentHighlightKind || (exports2.DocumentHighlightKind = {}));
      (function(DocumentHighlight2) {
        function create(range2, kind) {
          var result = { range: range2 };
          if (Is.number(kind)) {
            result.kind = kind;
          }
          return result;
        }
        DocumentHighlight2.create = create;
      })(exports2.DocumentHighlight || (exports2.DocumentHighlight = {}));
      (function(SymbolKind2) {
        SymbolKind2.File = 1;
        SymbolKind2.Module = 2;
        SymbolKind2.Namespace = 3;
        SymbolKind2.Package = 4;
        SymbolKind2.Class = 5;
        SymbolKind2.Method = 6;
        SymbolKind2.Property = 7;
        SymbolKind2.Field = 8;
        SymbolKind2.Constructor = 9;
        SymbolKind2.Enum = 10;
        SymbolKind2.Interface = 11;
        SymbolKind2.Function = 12;
        SymbolKind2.Variable = 13;
        SymbolKind2.Constant = 14;
        SymbolKind2.String = 15;
        SymbolKind2.Number = 16;
        SymbolKind2.Boolean = 17;
        SymbolKind2.Array = 18;
        SymbolKind2.Object = 19;
        SymbolKind2.Key = 20;
        SymbolKind2.Null = 21;
        SymbolKind2.EnumMember = 22;
        SymbolKind2.Struct = 23;
        SymbolKind2.Event = 24;
        SymbolKind2.Operator = 25;
        SymbolKind2.TypeParameter = 26;
      })(exports2.SymbolKind || (exports2.SymbolKind = {}));
      (function(SymbolTag2) {
        SymbolTag2.Deprecated = 1;
      })(exports2.SymbolTag || (exports2.SymbolTag = {}));
      (function(SymbolInformation2) {
        function create(name, kind, range2, uri, containerName) {
          var result = {
            name,
            kind,
            location: { uri, range: range2 }
          };
          if (containerName) {
            result.containerName = containerName;
          }
          return result;
        }
        SymbolInformation2.create = create;
      })(exports2.SymbolInformation || (exports2.SymbolInformation = {}));
      (function(DocumentSymbol2) {
        function create(name, detail, kind, range2, selectionRange, children) {
          var result = {
            name,
            detail,
            kind,
            range: range2,
            selectionRange
          };
          if (children !== void 0) {
            result.children = children;
          }
          return result;
        }
        DocumentSymbol2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && Is.string(candidate.name) && Is.number(candidate.kind) && Range5.is(candidate.range) && Range5.is(candidate.selectionRange) && (candidate.detail === void 0 || Is.string(candidate.detail)) && (candidate.deprecated === void 0 || Is.boolean(candidate.deprecated)) && (candidate.children === void 0 || Array.isArray(candidate.children)) && (candidate.tags === void 0 || Array.isArray(candidate.tags));
        }
        DocumentSymbol2.is = is;
      })(exports2.DocumentSymbol || (exports2.DocumentSymbol = {}));
      (function(CodeActionKind2) {
        CodeActionKind2.Empty = "";
        CodeActionKind2.QuickFix = "quickfix";
        CodeActionKind2.Refactor = "refactor";
        CodeActionKind2.RefactorExtract = "refactor.extract";
        CodeActionKind2.RefactorInline = "refactor.inline";
        CodeActionKind2.RefactorRewrite = "refactor.rewrite";
        CodeActionKind2.Source = "source";
        CodeActionKind2.SourceOrganizeImports = "source.organizeImports";
        CodeActionKind2.SourceFixAll = "source.fixAll";
      })(exports2.CodeActionKind || (exports2.CodeActionKind = {}));
      (function(CodeActionContext2) {
        function create(diagnostics, only) {
          var result = { diagnostics };
          if (only !== void 0 && only !== null) {
            result.only = only;
          }
          return result;
        }
        CodeActionContext2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic7.is) && (candidate.only === void 0 || Is.typedArray(candidate.only, Is.string));
        }
        CodeActionContext2.is = is;
      })(exports2.CodeActionContext || (exports2.CodeActionContext = {}));
      (function(CodeAction2) {
        function create(title, kindOrCommandOrEdit, kind) {
          var result = { title };
          var checkKind = true;
          if (typeof kindOrCommandOrEdit === "string") {
            checkKind = false;
            result.kind = kindOrCommandOrEdit;
          } else if (Command.is(kindOrCommandOrEdit)) {
            result.command = kindOrCommandOrEdit;
          } else {
            result.edit = kindOrCommandOrEdit;
          }
          if (checkKind && kind !== void 0) {
            result.kind = kind;
          }
          return result;
        }
        CodeAction2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && Is.string(candidate.title) && (candidate.diagnostics === void 0 || Is.typedArray(candidate.diagnostics, Diagnostic7.is)) && (candidate.kind === void 0 || Is.string(candidate.kind)) && (candidate.edit !== void 0 || candidate.command !== void 0) && (candidate.command === void 0 || Command.is(candidate.command)) && (candidate.isPreferred === void 0 || Is.boolean(candidate.isPreferred)) && (candidate.edit === void 0 || WorkspaceEdit.is(candidate.edit));
        }
        CodeAction2.is = is;
      })(exports2.CodeAction || (exports2.CodeAction = {}));
      (function(CodeLens2) {
        function create(range2, data) {
          var result = { range: range2 };
          if (Is.defined(data)) {
            result.data = data;
          }
          return result;
        }
        CodeLens2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range5.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
        }
        CodeLens2.is = is;
      })(exports2.CodeLens || (exports2.CodeLens = {}));
      (function(FormattingOptions2) {
        function create(tabSize, insertSpaces) {
          return { tabSize, insertSpaces };
        }
        FormattingOptions2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.uinteger(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
        }
        FormattingOptions2.is = is;
      })(exports2.FormattingOptions || (exports2.FormattingOptions = {}));
      (function(DocumentLink2) {
        function create(range2, target, data) {
          return { range: range2, target, data };
        }
        DocumentLink2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range5.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
        }
        DocumentLink2.is = is;
      })(exports2.DocumentLink || (exports2.DocumentLink = {}));
      (function(SelectionRange2) {
        function create(range2, parent) {
          return { range: range2, parent };
        }
        SelectionRange2.create = create;
        function is(value) {
          var candidate = value;
          return candidate !== void 0 && Range5.is(candidate.range) && (candidate.parent === void 0 || SelectionRange2.is(candidate.parent));
        }
        SelectionRange2.is = is;
      })(exports2.SelectionRange || (exports2.SelectionRange = {}));
      exports2.EOL = ["\n", "\r\n", "\r"];
      (function(TextDocument2) {
        function create(uri, languageId, version, content) {
          return new FullTextDocument(uri, languageId, version, content);
        }
        TextDocument2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
        }
        TextDocument2.is = is;
        function applyEdits(document, edits) {
          var text = document.getText();
          var sortedEdits = mergeSort(edits, function(a, b) {
            var diff = a.range.start.line - b.range.start.line;
            if (diff === 0) {
              return a.range.start.character - b.range.start.character;
            }
            return diff;
          });
          var lastModifiedOffset = text.length;
          for (var i = sortedEdits.length - 1; i >= 0; i--) {
            var e = sortedEdits[i];
            var startOffset = document.offsetAt(e.range.start);
            var endOffset = document.offsetAt(e.range.end);
            if (endOffset <= lastModifiedOffset) {
              text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
            } else {
              throw new Error("Overlapping edit");
            }
            lastModifiedOffset = startOffset;
          }
          return text;
        }
        TextDocument2.applyEdits = applyEdits;
        function mergeSort(data, compare) {
          if (data.length <= 1) {
            return data;
          }
          var p = data.length / 2 | 0;
          var left = data.slice(0, p);
          var right = data.slice(p);
          mergeSort(left, compare);
          mergeSort(right, compare);
          var leftIdx = 0;
          var rightIdx = 0;
          var i = 0;
          while (leftIdx < left.length && rightIdx < right.length) {
            var ret = compare(left[leftIdx], right[rightIdx]);
            if (ret <= 0) {
              data[i++] = left[leftIdx++];
            } else {
              data[i++] = right[rightIdx++];
            }
          }
          while (leftIdx < left.length) {
            data[i++] = left[leftIdx++];
          }
          while (rightIdx < right.length) {
            data[i++] = right[rightIdx++];
          }
          return data;
        }
      })(exports2.TextDocument || (exports2.TextDocument = {}));
      var FullTextDocument = (
        /** @class */
        (function() {
          function FullTextDocument2(uri, languageId, version, content) {
            this._uri = uri;
            this._languageId = languageId;
            this._version = version;
            this._content = content;
            this._lineOffsets = void 0;
          }
          Object.defineProperty(FullTextDocument2.prototype, "uri", {
            get: function() {
              return this._uri;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(FullTextDocument2.prototype, "languageId", {
            get: function() {
              return this._languageId;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(FullTextDocument2.prototype, "version", {
            get: function() {
              return this._version;
            },
            enumerable: false,
            configurable: true
          });
          FullTextDocument2.prototype.getText = function(range2) {
            if (range2) {
              var start = this.offsetAt(range2.start);
              var end = this.offsetAt(range2.end);
              return this._content.substring(start, end);
            }
            return this._content;
          };
          FullTextDocument2.prototype.update = function(event, version) {
            this._content = event.text;
            this._version = version;
            this._lineOffsets = void 0;
          };
          FullTextDocument2.prototype.getLineOffsets = function() {
            if (this._lineOffsets === void 0) {
              var lineOffsets = [];
              var text = this._content;
              var isLineStart = true;
              for (var i = 0; i < text.length; i++) {
                if (isLineStart) {
                  lineOffsets.push(i);
                  isLineStart = false;
                }
                var ch = text.charAt(i);
                isLineStart = ch === "\r" || ch === "\n";
                if (ch === "\r" && i + 1 < text.length && text.charAt(i + 1) === "\n") {
                  i++;
                }
              }
              if (isLineStart && text.length > 0) {
                lineOffsets.push(text.length);
              }
              this._lineOffsets = lineOffsets;
            }
            return this._lineOffsets;
          };
          FullTextDocument2.prototype.positionAt = function(offset) {
            offset = Math.max(Math.min(offset, this._content.length), 0);
            var lineOffsets = this.getLineOffsets();
            var low = 0, high = lineOffsets.length;
            if (high === 0) {
              return Position2.create(0, offset);
            }
            while (low < high) {
              var mid = Math.floor((low + high) / 2);
              if (lineOffsets[mid] > offset) {
                high = mid;
              } else {
                low = mid + 1;
              }
            }
            var line = low - 1;
            return Position2.create(line, offset - lineOffsets[line]);
          };
          FullTextDocument2.prototype.offsetAt = function(position) {
            var lineOffsets = this.getLineOffsets();
            if (position.line >= lineOffsets.length) {
              return this._content.length;
            } else if (position.line < 0) {
              return 0;
            }
            var lineOffset = lineOffsets[position.line];
            var nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
            return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
          };
          Object.defineProperty(FullTextDocument2.prototype, "lineCount", {
            get: function() {
              return this.getLineOffsets().length;
            },
            enumerable: false,
            configurable: true
          });
          return FullTextDocument2;
        })()
      );
      var Is;
      (function(Is2) {
        var toString = Object.prototype.toString;
        function defined(value) {
          return typeof value !== "undefined";
        }
        Is2.defined = defined;
        function undefined2(value) {
          return typeof value === "undefined";
        }
        Is2.undefined = undefined2;
        function boolean(value) {
          return value === true || value === false;
        }
        Is2.boolean = boolean;
        function string(value) {
          return toString.call(value) === "[object String]";
        }
        Is2.string = string;
        function number(value) {
          return toString.call(value) === "[object Number]";
        }
        Is2.number = number;
        function numberRange(value, min, max) {
          return toString.call(value) === "[object Number]" && min <= value && value <= max;
        }
        Is2.numberRange = numberRange;
        function integer2(value) {
          return toString.call(value) === "[object Number]" && -2147483648 <= value && value <= 2147483647;
        }
        Is2.integer = integer2;
        function uinteger2(value) {
          return toString.call(value) === "[object Number]" && 0 <= value && value <= 2147483647;
        }
        Is2.uinteger = uinteger2;
        function func(value) {
          return toString.call(value) === "[object Function]";
        }
        Is2.func = func;
        function objectLiteral(value) {
          return value !== null && typeof value === "object";
        }
        Is2.objectLiteral = objectLiteral;
        function typedArray(value, check) {
          return Array.isArray(value) && value.every(check);
        }
        Is2.typedArray = typedArray;
      })(Is || (Is = {}));
    });
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/messages.js
var require_messages2 = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/messages.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProtocolNotificationType = exports.ProtocolNotificationType0 = exports.ProtocolRequestType = exports.ProtocolRequestType0 = exports.RegistrationType = void 0;
    var vscode_jsonrpc_1 = require_main();
    var RegistrationType = class {
      constructor(method) {
        this.method = method;
      }
    };
    exports.RegistrationType = RegistrationType;
    var ProtocolRequestType0 = class extends vscode_jsonrpc_1.RequestType0 {
      constructor(method) {
        super(method);
      }
    };
    exports.ProtocolRequestType0 = ProtocolRequestType0;
    var ProtocolRequestType = class extends vscode_jsonrpc_1.RequestType {
      constructor(method) {
        super(method, vscode_jsonrpc_1.ParameterStructures.byName);
      }
    };
    exports.ProtocolRequestType = ProtocolRequestType;
    var ProtocolNotificationType0 = class extends vscode_jsonrpc_1.NotificationType0 {
      constructor(method) {
        super(method);
      }
    };
    exports.ProtocolNotificationType0 = ProtocolNotificationType0;
    var ProtocolNotificationType = class extends vscode_jsonrpc_1.NotificationType {
      constructor(method) {
        super(method, vscode_jsonrpc_1.ParameterStructures.byName);
      }
    };
    exports.ProtocolNotificationType = ProtocolNotificationType;
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/utils/is.js
var require_is2 = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/utils/is.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.objectLiteral = exports.typedArray = exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
    function boolean(value) {
      return value === true || value === false;
    }
    exports.boolean = boolean;
    function string(value) {
      return typeof value === "string" || value instanceof String;
    }
    exports.string = string;
    function number(value) {
      return typeof value === "number" || value instanceof Number;
    }
    exports.number = number;
    function error(value) {
      return value instanceof Error;
    }
    exports.error = error;
    function func(value) {
      return typeof value === "function";
    }
    exports.func = func;
    function array(value) {
      return Array.isArray(value);
    }
    exports.array = array;
    function stringArray(value) {
      return array(value) && value.every((elem) => string(elem));
    }
    exports.stringArray = stringArray;
    function typedArray(value, check) {
      return Array.isArray(value) && value.every(check);
    }
    exports.typedArray = typedArray;
    function objectLiteral(value) {
      return value !== null && typeof value === "object";
    }
    exports.objectLiteral = objectLiteral;
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.implementation.js
var require_protocol_implementation = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.implementation.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImplementationRequest = void 0;
    var messages_1 = require_messages2();
    (function(ImplementationRequest2) {
      ImplementationRequest2.method = "textDocument/implementation";
      ImplementationRequest2.type = new messages_1.ProtocolRequestType(ImplementationRequest2.method);
    })(exports.ImplementationRequest || (exports.ImplementationRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.typeDefinition.js
var require_protocol_typeDefinition = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.typeDefinition.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeDefinitionRequest = void 0;
    var messages_1 = require_messages2();
    (function(TypeDefinitionRequest2) {
      TypeDefinitionRequest2.method = "textDocument/typeDefinition";
      TypeDefinitionRequest2.type = new messages_1.ProtocolRequestType(TypeDefinitionRequest2.method);
    })(exports.TypeDefinitionRequest || (exports.TypeDefinitionRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.workspaceFolders.js
var require_protocol_workspaceFolders = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.workspaceFolders.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DidChangeWorkspaceFoldersNotification = exports.WorkspaceFoldersRequest = void 0;
    var messages_1 = require_messages2();
    (function(WorkspaceFoldersRequest2) {
      WorkspaceFoldersRequest2.type = new messages_1.ProtocolRequestType0("workspace/workspaceFolders");
    })(exports.WorkspaceFoldersRequest || (exports.WorkspaceFoldersRequest = {}));
    (function(DidChangeWorkspaceFoldersNotification2) {
      DidChangeWorkspaceFoldersNotification2.type = new messages_1.ProtocolNotificationType("workspace/didChangeWorkspaceFolders");
    })(exports.DidChangeWorkspaceFoldersNotification || (exports.DidChangeWorkspaceFoldersNotification = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.configuration.js
var require_protocol_configuration = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.configuration.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfigurationRequest = void 0;
    var messages_1 = require_messages2();
    (function(ConfigurationRequest2) {
      ConfigurationRequest2.type = new messages_1.ProtocolRequestType("workspace/configuration");
    })(exports.ConfigurationRequest || (exports.ConfigurationRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.js
var require_protocol_colorProvider = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ColorPresentationRequest = exports.DocumentColorRequest = void 0;
    var messages_1 = require_messages2();
    (function(DocumentColorRequest2) {
      DocumentColorRequest2.method = "textDocument/documentColor";
      DocumentColorRequest2.type = new messages_1.ProtocolRequestType(DocumentColorRequest2.method);
    })(exports.DocumentColorRequest || (exports.DocumentColorRequest = {}));
    (function(ColorPresentationRequest2) {
      ColorPresentationRequest2.type = new messages_1.ProtocolRequestType("textDocument/colorPresentation");
    })(exports.ColorPresentationRequest || (exports.ColorPresentationRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.js
var require_protocol_foldingRange = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FoldingRangeRequest = exports.FoldingRangeKind = void 0;
    var messages_1 = require_messages2();
    (function(FoldingRangeKind2) {
      FoldingRangeKind2["Comment"] = "comment";
      FoldingRangeKind2["Imports"] = "imports";
      FoldingRangeKind2["Region"] = "region";
    })(exports.FoldingRangeKind || (exports.FoldingRangeKind = {}));
    (function(FoldingRangeRequest2) {
      FoldingRangeRequest2.method = "textDocument/foldingRange";
      FoldingRangeRequest2.type = new messages_1.ProtocolRequestType(FoldingRangeRequest2.method);
    })(exports.FoldingRangeRequest || (exports.FoldingRangeRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.js
var require_protocol_declaration = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DeclarationRequest = void 0;
    var messages_1 = require_messages2();
    (function(DeclarationRequest2) {
      DeclarationRequest2.method = "textDocument/declaration";
      DeclarationRequest2.type = new messages_1.ProtocolRequestType(DeclarationRequest2.method);
    })(exports.DeclarationRequest || (exports.DeclarationRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.js
var require_protocol_selectionRange = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionRangeRequest = void 0;
    var messages_1 = require_messages2();
    (function(SelectionRangeRequest2) {
      SelectionRangeRequest2.method = "textDocument/selectionRange";
      SelectionRangeRequest2.type = new messages_1.ProtocolRequestType(SelectionRangeRequest2.method);
    })(exports.SelectionRangeRequest || (exports.SelectionRangeRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.progress.js
var require_protocol_progress = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.progress.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorkDoneProgressCancelNotification = exports.WorkDoneProgressCreateRequest = exports.WorkDoneProgress = void 0;
    var vscode_jsonrpc_1 = require_main();
    var messages_1 = require_messages2();
    (function(WorkDoneProgress3) {
      WorkDoneProgress3.type = new vscode_jsonrpc_1.ProgressType();
      function is(value) {
        return value === WorkDoneProgress3.type;
      }
      WorkDoneProgress3.is = is;
    })(exports.WorkDoneProgress || (exports.WorkDoneProgress = {}));
    (function(WorkDoneProgressCreateRequest3) {
      WorkDoneProgressCreateRequest3.type = new messages_1.ProtocolRequestType("window/workDoneProgress/create");
    })(exports.WorkDoneProgressCreateRequest || (exports.WorkDoneProgressCreateRequest = {}));
    (function(WorkDoneProgressCancelNotification2) {
      WorkDoneProgressCancelNotification2.type = new messages_1.ProtocolNotificationType("window/workDoneProgress/cancel");
    })(exports.WorkDoneProgressCancelNotification || (exports.WorkDoneProgressCancelNotification = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.callHierarchy.js
var require_protocol_callHierarchy = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.callHierarchy.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CallHierarchyOutgoingCallsRequest = exports.CallHierarchyIncomingCallsRequest = exports.CallHierarchyPrepareRequest = void 0;
    var messages_1 = require_messages2();
    (function(CallHierarchyPrepareRequest2) {
      CallHierarchyPrepareRequest2.method = "textDocument/prepareCallHierarchy";
      CallHierarchyPrepareRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyPrepareRequest2.method);
    })(exports.CallHierarchyPrepareRequest || (exports.CallHierarchyPrepareRequest = {}));
    (function(CallHierarchyIncomingCallsRequest2) {
      CallHierarchyIncomingCallsRequest2.method = "callHierarchy/incomingCalls";
      CallHierarchyIncomingCallsRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyIncomingCallsRequest2.method);
    })(exports.CallHierarchyIncomingCallsRequest || (exports.CallHierarchyIncomingCallsRequest = {}));
    (function(CallHierarchyOutgoingCallsRequest2) {
      CallHierarchyOutgoingCallsRequest2.method = "callHierarchy/outgoingCalls";
      CallHierarchyOutgoingCallsRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyOutgoingCallsRequest2.method);
    })(exports.CallHierarchyOutgoingCallsRequest || (exports.CallHierarchyOutgoingCallsRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.js
var require_protocol_semanticTokens = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SemanticTokensRefreshRequest = exports.SemanticTokensRangeRequest = exports.SemanticTokensDeltaRequest = exports.SemanticTokensRequest = exports.SemanticTokensRegistrationType = exports.TokenFormat = exports.SemanticTokens = exports.SemanticTokenModifiers = exports.SemanticTokenTypes = void 0;
    var messages_1 = require_messages2();
    (function(SemanticTokenTypes2) {
      SemanticTokenTypes2["namespace"] = "namespace";
      SemanticTokenTypes2["type"] = "type";
      SemanticTokenTypes2["class"] = "class";
      SemanticTokenTypes2["enum"] = "enum";
      SemanticTokenTypes2["interface"] = "interface";
      SemanticTokenTypes2["struct"] = "struct";
      SemanticTokenTypes2["typeParameter"] = "typeParameter";
      SemanticTokenTypes2["parameter"] = "parameter";
      SemanticTokenTypes2["variable"] = "variable";
      SemanticTokenTypes2["property"] = "property";
      SemanticTokenTypes2["enumMember"] = "enumMember";
      SemanticTokenTypes2["event"] = "event";
      SemanticTokenTypes2["function"] = "function";
      SemanticTokenTypes2["method"] = "method";
      SemanticTokenTypes2["macro"] = "macro";
      SemanticTokenTypes2["keyword"] = "keyword";
      SemanticTokenTypes2["modifier"] = "modifier";
      SemanticTokenTypes2["comment"] = "comment";
      SemanticTokenTypes2["string"] = "string";
      SemanticTokenTypes2["number"] = "number";
      SemanticTokenTypes2["regexp"] = "regexp";
      SemanticTokenTypes2["operator"] = "operator";
    })(exports.SemanticTokenTypes || (exports.SemanticTokenTypes = {}));
    (function(SemanticTokenModifiers2) {
      SemanticTokenModifiers2["declaration"] = "declaration";
      SemanticTokenModifiers2["definition"] = "definition";
      SemanticTokenModifiers2["readonly"] = "readonly";
      SemanticTokenModifiers2["static"] = "static";
      SemanticTokenModifiers2["deprecated"] = "deprecated";
      SemanticTokenModifiers2["abstract"] = "abstract";
      SemanticTokenModifiers2["async"] = "async";
      SemanticTokenModifiers2["modification"] = "modification";
      SemanticTokenModifiers2["documentation"] = "documentation";
      SemanticTokenModifiers2["defaultLibrary"] = "defaultLibrary";
    })(exports.SemanticTokenModifiers || (exports.SemanticTokenModifiers = {}));
    (function(SemanticTokens2) {
      function is(value) {
        const candidate = value;
        return candidate !== void 0 && (candidate.resultId === void 0 || typeof candidate.resultId === "string") && Array.isArray(candidate.data) && (candidate.data.length === 0 || typeof candidate.data[0] === "number");
      }
      SemanticTokens2.is = is;
    })(exports.SemanticTokens || (exports.SemanticTokens = {}));
    (function(TokenFormat2) {
      TokenFormat2.Relative = "relative";
    })(exports.TokenFormat || (exports.TokenFormat = {}));
    (function(SemanticTokensRegistrationType2) {
      SemanticTokensRegistrationType2.method = "textDocument/semanticTokens";
      SemanticTokensRegistrationType2.type = new messages_1.RegistrationType(SemanticTokensRegistrationType2.method);
    })(exports.SemanticTokensRegistrationType || (exports.SemanticTokensRegistrationType = {}));
    (function(SemanticTokensRequest2) {
      SemanticTokensRequest2.method = "textDocument/semanticTokens/full";
      SemanticTokensRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensRequest2.method);
    })(exports.SemanticTokensRequest || (exports.SemanticTokensRequest = {}));
    (function(SemanticTokensDeltaRequest2) {
      SemanticTokensDeltaRequest2.method = "textDocument/semanticTokens/full/delta";
      SemanticTokensDeltaRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensDeltaRequest2.method);
    })(exports.SemanticTokensDeltaRequest || (exports.SemanticTokensDeltaRequest = {}));
    (function(SemanticTokensRangeRequest2) {
      SemanticTokensRangeRequest2.method = "textDocument/semanticTokens/range";
      SemanticTokensRangeRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensRangeRequest2.method);
    })(exports.SemanticTokensRangeRequest || (exports.SemanticTokensRangeRequest = {}));
    (function(SemanticTokensRefreshRequest2) {
      SemanticTokensRefreshRequest2.method = `workspace/semanticTokens/refresh`;
      SemanticTokensRefreshRequest2.type = new messages_1.ProtocolRequestType0(SemanticTokensRefreshRequest2.method);
    })(exports.SemanticTokensRefreshRequest || (exports.SemanticTokensRefreshRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.js
var require_protocol_showDocument = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShowDocumentRequest = void 0;
    var messages_1 = require_messages2();
    (function(ShowDocumentRequest2) {
      ShowDocumentRequest2.method = "window/showDocument";
      ShowDocumentRequest2.type = new messages_1.ProtocolRequestType(ShowDocumentRequest2.method);
    })(exports.ShowDocumentRequest || (exports.ShowDocumentRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.js
var require_protocol_linkedEditingRange = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LinkedEditingRangeRequest = void 0;
    var messages_1 = require_messages2();
    (function(LinkedEditingRangeRequest2) {
      LinkedEditingRangeRequest2.method = "textDocument/linkedEditingRange";
      LinkedEditingRangeRequest2.type = new messages_1.ProtocolRequestType(LinkedEditingRangeRequest2.method);
    })(exports.LinkedEditingRangeRequest || (exports.LinkedEditingRangeRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.js
var require_protocol_fileOperations = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WillDeleteFilesRequest = exports.DidDeleteFilesNotification = exports.DidRenameFilesNotification = exports.WillRenameFilesRequest = exports.DidCreateFilesNotification = exports.WillCreateFilesRequest = exports.FileOperationPatternKind = void 0;
    var messages_1 = require_messages2();
    (function(FileOperationPatternKind2) {
      FileOperationPatternKind2.file = "file";
      FileOperationPatternKind2.folder = "folder";
    })(exports.FileOperationPatternKind || (exports.FileOperationPatternKind = {}));
    (function(WillCreateFilesRequest2) {
      WillCreateFilesRequest2.method = "workspace/willCreateFiles";
      WillCreateFilesRequest2.type = new messages_1.ProtocolRequestType(WillCreateFilesRequest2.method);
    })(exports.WillCreateFilesRequest || (exports.WillCreateFilesRequest = {}));
    (function(DidCreateFilesNotification2) {
      DidCreateFilesNotification2.method = "workspace/didCreateFiles";
      DidCreateFilesNotification2.type = new messages_1.ProtocolNotificationType(DidCreateFilesNotification2.method);
    })(exports.DidCreateFilesNotification || (exports.DidCreateFilesNotification = {}));
    (function(WillRenameFilesRequest2) {
      WillRenameFilesRequest2.method = "workspace/willRenameFiles";
      WillRenameFilesRequest2.type = new messages_1.ProtocolRequestType(WillRenameFilesRequest2.method);
    })(exports.WillRenameFilesRequest || (exports.WillRenameFilesRequest = {}));
    (function(DidRenameFilesNotification2) {
      DidRenameFilesNotification2.method = "workspace/didRenameFiles";
      DidRenameFilesNotification2.type = new messages_1.ProtocolNotificationType(DidRenameFilesNotification2.method);
    })(exports.DidRenameFilesNotification || (exports.DidRenameFilesNotification = {}));
    (function(DidDeleteFilesNotification2) {
      DidDeleteFilesNotification2.method = "workspace/didDeleteFiles";
      DidDeleteFilesNotification2.type = new messages_1.ProtocolNotificationType(DidDeleteFilesNotification2.method);
    })(exports.DidDeleteFilesNotification || (exports.DidDeleteFilesNotification = {}));
    (function(WillDeleteFilesRequest2) {
      WillDeleteFilesRequest2.method = "workspace/willDeleteFiles";
      WillDeleteFilesRequest2.type = new messages_1.ProtocolRequestType(WillDeleteFilesRequest2.method);
    })(exports.WillDeleteFilesRequest || (exports.WillDeleteFilesRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.js
var require_protocol_moniker = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MonikerRequest = exports.MonikerKind = exports.UniquenessLevel = void 0;
    var messages_1 = require_messages2();
    (function(UniquenessLevel2) {
      UniquenessLevel2["document"] = "document";
      UniquenessLevel2["project"] = "project";
      UniquenessLevel2["group"] = "group";
      UniquenessLevel2["scheme"] = "scheme";
      UniquenessLevel2["global"] = "global";
    })(exports.UniquenessLevel || (exports.UniquenessLevel = {}));
    (function(MonikerKind2) {
      MonikerKind2["import"] = "import";
      MonikerKind2["export"] = "export";
      MonikerKind2["local"] = "local";
    })(exports.MonikerKind || (exports.MonikerKind = {}));
    (function(MonikerRequest2) {
      MonikerRequest2.method = "textDocument/moniker";
      MonikerRequest2.type = new messages_1.ProtocolRequestType(MonikerRequest2.method);
    })(exports.MonikerRequest || (exports.MonikerRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.js
var require_protocol = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/protocol.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DocumentLinkRequest = exports.CodeLensRefreshRequest = exports.CodeLensResolveRequest = exports.CodeLensRequest = exports.WorkspaceSymbolRequest = exports.CodeActionResolveRequest = exports.CodeActionRequest = exports.DocumentSymbolRequest = exports.DocumentHighlightRequest = exports.ReferencesRequest = exports.DefinitionRequest = exports.SignatureHelpRequest = exports.SignatureHelpTriggerKind = exports.HoverRequest = exports.CompletionResolveRequest = exports.CompletionRequest = exports.CompletionTriggerKind = exports.PublishDiagnosticsNotification = exports.WatchKind = exports.FileChangeType = exports.DidChangeWatchedFilesNotification = exports.WillSaveTextDocumentWaitUntilRequest = exports.WillSaveTextDocumentNotification = exports.TextDocumentSaveReason = exports.DidSaveTextDocumentNotification = exports.DidCloseTextDocumentNotification = exports.DidChangeTextDocumentNotification = exports.TextDocumentContentChangeEvent = exports.DidOpenTextDocumentNotification = exports.TextDocumentSyncKind = exports.TelemetryEventNotification = exports.LogMessageNotification = exports.ShowMessageRequest = exports.ShowMessageNotification = exports.MessageType = exports.DidChangeConfigurationNotification = exports.ExitNotification = exports.ShutdownRequest = exports.InitializedNotification = exports.InitializeError = exports.InitializeRequest = exports.WorkDoneProgressOptions = exports.TextDocumentRegistrationOptions = exports.StaticRegistrationOptions = exports.FailureHandlingKind = exports.ResourceOperationKind = exports.UnregistrationRequest = exports.RegistrationRequest = exports.DocumentSelector = exports.DocumentFilter = void 0;
    exports.MonikerRequest = exports.MonikerKind = exports.UniquenessLevel = exports.WillDeleteFilesRequest = exports.DidDeleteFilesNotification = exports.WillRenameFilesRequest = exports.DidRenameFilesNotification = exports.WillCreateFilesRequest = exports.DidCreateFilesNotification = exports.FileOperationPatternKind = exports.LinkedEditingRangeRequest = exports.ShowDocumentRequest = exports.SemanticTokensRegistrationType = exports.SemanticTokensRefreshRequest = exports.SemanticTokensRangeRequest = exports.SemanticTokensDeltaRequest = exports.SemanticTokensRequest = exports.TokenFormat = exports.SemanticTokens = exports.SemanticTokenModifiers = exports.SemanticTokenTypes = exports.CallHierarchyPrepareRequest = exports.CallHierarchyOutgoingCallsRequest = exports.CallHierarchyIncomingCallsRequest = exports.WorkDoneProgressCancelNotification = exports.WorkDoneProgressCreateRequest = exports.WorkDoneProgress = exports.SelectionRangeRequest = exports.DeclarationRequest = exports.FoldingRangeRequest = exports.ColorPresentationRequest = exports.DocumentColorRequest = exports.ConfigurationRequest = exports.DidChangeWorkspaceFoldersNotification = exports.WorkspaceFoldersRequest = exports.TypeDefinitionRequest = exports.ImplementationRequest = exports.ApplyWorkspaceEditRequest = exports.ExecuteCommandRequest = exports.PrepareRenameRequest = exports.RenameRequest = exports.PrepareSupportDefaultBehavior = exports.DocumentOnTypeFormattingRequest = exports.DocumentRangeFormattingRequest = exports.DocumentFormattingRequest = exports.DocumentLinkResolveRequest = void 0;
    var Is = require_is2();
    var messages_1 = require_messages2();
    var protocol_implementation_1 = require_protocol_implementation();
    Object.defineProperty(exports, "ImplementationRequest", { enumerable: true, get: function() {
      return protocol_implementation_1.ImplementationRequest;
    } });
    var protocol_typeDefinition_1 = require_protocol_typeDefinition();
    Object.defineProperty(exports, "TypeDefinitionRequest", { enumerable: true, get: function() {
      return protocol_typeDefinition_1.TypeDefinitionRequest;
    } });
    var protocol_workspaceFolders_1 = require_protocol_workspaceFolders();
    Object.defineProperty(exports, "WorkspaceFoldersRequest", { enumerable: true, get: function() {
      return protocol_workspaceFolders_1.WorkspaceFoldersRequest;
    } });
    Object.defineProperty(exports, "DidChangeWorkspaceFoldersNotification", { enumerable: true, get: function() {
      return protocol_workspaceFolders_1.DidChangeWorkspaceFoldersNotification;
    } });
    var protocol_configuration_1 = require_protocol_configuration();
    Object.defineProperty(exports, "ConfigurationRequest", { enumerable: true, get: function() {
      return protocol_configuration_1.ConfigurationRequest;
    } });
    var protocol_colorProvider_1 = require_protocol_colorProvider();
    Object.defineProperty(exports, "DocumentColorRequest", { enumerable: true, get: function() {
      return protocol_colorProvider_1.DocumentColorRequest;
    } });
    Object.defineProperty(exports, "ColorPresentationRequest", { enumerable: true, get: function() {
      return protocol_colorProvider_1.ColorPresentationRequest;
    } });
    var protocol_foldingRange_1 = require_protocol_foldingRange();
    Object.defineProperty(exports, "FoldingRangeRequest", { enumerable: true, get: function() {
      return protocol_foldingRange_1.FoldingRangeRequest;
    } });
    var protocol_declaration_1 = require_protocol_declaration();
    Object.defineProperty(exports, "DeclarationRequest", { enumerable: true, get: function() {
      return protocol_declaration_1.DeclarationRequest;
    } });
    var protocol_selectionRange_1 = require_protocol_selectionRange();
    Object.defineProperty(exports, "SelectionRangeRequest", { enumerable: true, get: function() {
      return protocol_selectionRange_1.SelectionRangeRequest;
    } });
    var protocol_progress_1 = require_protocol_progress();
    Object.defineProperty(exports, "WorkDoneProgress", { enumerable: true, get: function() {
      return protocol_progress_1.WorkDoneProgress;
    } });
    Object.defineProperty(exports, "WorkDoneProgressCreateRequest", { enumerable: true, get: function() {
      return protocol_progress_1.WorkDoneProgressCreateRequest;
    } });
    Object.defineProperty(exports, "WorkDoneProgressCancelNotification", { enumerable: true, get: function() {
      return protocol_progress_1.WorkDoneProgressCancelNotification;
    } });
    var protocol_callHierarchy_1 = require_protocol_callHierarchy();
    Object.defineProperty(exports, "CallHierarchyIncomingCallsRequest", { enumerable: true, get: function() {
      return protocol_callHierarchy_1.CallHierarchyIncomingCallsRequest;
    } });
    Object.defineProperty(exports, "CallHierarchyOutgoingCallsRequest", { enumerable: true, get: function() {
      return protocol_callHierarchy_1.CallHierarchyOutgoingCallsRequest;
    } });
    Object.defineProperty(exports, "CallHierarchyPrepareRequest", { enumerable: true, get: function() {
      return protocol_callHierarchy_1.CallHierarchyPrepareRequest;
    } });
    var protocol_semanticTokens_1 = require_protocol_semanticTokens();
    Object.defineProperty(exports, "SemanticTokenTypes", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokenTypes;
    } });
    Object.defineProperty(exports, "SemanticTokenModifiers", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokenModifiers;
    } });
    Object.defineProperty(exports, "SemanticTokens", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokens;
    } });
    Object.defineProperty(exports, "TokenFormat", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.TokenFormat;
    } });
    Object.defineProperty(exports, "SemanticTokensRequest", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensRequest;
    } });
    Object.defineProperty(exports, "SemanticTokensDeltaRequest", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensDeltaRequest;
    } });
    Object.defineProperty(exports, "SemanticTokensRangeRequest", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensRangeRequest;
    } });
    Object.defineProperty(exports, "SemanticTokensRefreshRequest", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensRefreshRequest;
    } });
    Object.defineProperty(exports, "SemanticTokensRegistrationType", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensRegistrationType;
    } });
    var protocol_showDocument_1 = require_protocol_showDocument();
    Object.defineProperty(exports, "ShowDocumentRequest", { enumerable: true, get: function() {
      return protocol_showDocument_1.ShowDocumentRequest;
    } });
    var protocol_linkedEditingRange_1 = require_protocol_linkedEditingRange();
    Object.defineProperty(exports, "LinkedEditingRangeRequest", { enumerable: true, get: function() {
      return protocol_linkedEditingRange_1.LinkedEditingRangeRequest;
    } });
    var protocol_fileOperations_1 = require_protocol_fileOperations();
    Object.defineProperty(exports, "FileOperationPatternKind", { enumerable: true, get: function() {
      return protocol_fileOperations_1.FileOperationPatternKind;
    } });
    Object.defineProperty(exports, "DidCreateFilesNotification", { enumerable: true, get: function() {
      return protocol_fileOperations_1.DidCreateFilesNotification;
    } });
    Object.defineProperty(exports, "WillCreateFilesRequest", { enumerable: true, get: function() {
      return protocol_fileOperations_1.WillCreateFilesRequest;
    } });
    Object.defineProperty(exports, "DidRenameFilesNotification", { enumerable: true, get: function() {
      return protocol_fileOperations_1.DidRenameFilesNotification;
    } });
    Object.defineProperty(exports, "WillRenameFilesRequest", { enumerable: true, get: function() {
      return protocol_fileOperations_1.WillRenameFilesRequest;
    } });
    Object.defineProperty(exports, "DidDeleteFilesNotification", { enumerable: true, get: function() {
      return protocol_fileOperations_1.DidDeleteFilesNotification;
    } });
    Object.defineProperty(exports, "WillDeleteFilesRequest", { enumerable: true, get: function() {
      return protocol_fileOperations_1.WillDeleteFilesRequest;
    } });
    var protocol_moniker_1 = require_protocol_moniker();
    Object.defineProperty(exports, "UniquenessLevel", { enumerable: true, get: function() {
      return protocol_moniker_1.UniquenessLevel;
    } });
    Object.defineProperty(exports, "MonikerKind", { enumerable: true, get: function() {
      return protocol_moniker_1.MonikerKind;
    } });
    Object.defineProperty(exports, "MonikerRequest", { enumerable: true, get: function() {
      return protocol_moniker_1.MonikerRequest;
    } });
    var DocumentFilter;
    (function(DocumentFilter2) {
      function is(value) {
        const candidate = value;
        return Is.string(candidate.language) || Is.string(candidate.scheme) || Is.string(candidate.pattern);
      }
      DocumentFilter2.is = is;
    })(DocumentFilter = exports.DocumentFilter || (exports.DocumentFilter = {}));
    var DocumentSelector;
    (function(DocumentSelector2) {
      function is(value) {
        if (!Array.isArray(value)) {
          return false;
        }
        for (let elem of value) {
          if (!Is.string(elem) && !DocumentFilter.is(elem)) {
            return false;
          }
        }
        return true;
      }
      DocumentSelector2.is = is;
    })(DocumentSelector = exports.DocumentSelector || (exports.DocumentSelector = {}));
    (function(RegistrationRequest2) {
      RegistrationRequest2.type = new messages_1.ProtocolRequestType("client/registerCapability");
    })(exports.RegistrationRequest || (exports.RegistrationRequest = {}));
    (function(UnregistrationRequest2) {
      UnregistrationRequest2.type = new messages_1.ProtocolRequestType("client/unregisterCapability");
    })(exports.UnregistrationRequest || (exports.UnregistrationRequest = {}));
    (function(ResourceOperationKind2) {
      ResourceOperationKind2.Create = "create";
      ResourceOperationKind2.Rename = "rename";
      ResourceOperationKind2.Delete = "delete";
    })(exports.ResourceOperationKind || (exports.ResourceOperationKind = {}));
    (function(FailureHandlingKind2) {
      FailureHandlingKind2.Abort = "abort";
      FailureHandlingKind2.Transactional = "transactional";
      FailureHandlingKind2.TextOnlyTransactional = "textOnlyTransactional";
      FailureHandlingKind2.Undo = "undo";
    })(exports.FailureHandlingKind || (exports.FailureHandlingKind = {}));
    (function(StaticRegistrationOptions2) {
      function hasId(value) {
        const candidate = value;
        return candidate && Is.string(candidate.id) && candidate.id.length > 0;
      }
      StaticRegistrationOptions2.hasId = hasId;
    })(exports.StaticRegistrationOptions || (exports.StaticRegistrationOptions = {}));
    (function(TextDocumentRegistrationOptions2) {
      function is(value) {
        const candidate = value;
        return candidate && (candidate.documentSelector === null || DocumentSelector.is(candidate.documentSelector));
      }
      TextDocumentRegistrationOptions2.is = is;
    })(exports.TextDocumentRegistrationOptions || (exports.TextDocumentRegistrationOptions = {}));
    (function(WorkDoneProgressOptions2) {
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && (candidate.workDoneProgress === void 0 || Is.boolean(candidate.workDoneProgress));
      }
      WorkDoneProgressOptions2.is = is;
      function hasWorkDoneProgress(value) {
        const candidate = value;
        return candidate && Is.boolean(candidate.workDoneProgress);
      }
      WorkDoneProgressOptions2.hasWorkDoneProgress = hasWorkDoneProgress;
    })(exports.WorkDoneProgressOptions || (exports.WorkDoneProgressOptions = {}));
    (function(InitializeRequest2) {
      InitializeRequest2.type = new messages_1.ProtocolRequestType("initialize");
    })(exports.InitializeRequest || (exports.InitializeRequest = {}));
    (function(InitializeError2) {
      InitializeError2.unknownProtocolVersion = 1;
    })(exports.InitializeError || (exports.InitializeError = {}));
    (function(InitializedNotification2) {
      InitializedNotification2.type = new messages_1.ProtocolNotificationType("initialized");
    })(exports.InitializedNotification || (exports.InitializedNotification = {}));
    (function(ShutdownRequest2) {
      ShutdownRequest2.type = new messages_1.ProtocolRequestType0("shutdown");
    })(exports.ShutdownRequest || (exports.ShutdownRequest = {}));
    (function(ExitNotification2) {
      ExitNotification2.type = new messages_1.ProtocolNotificationType0("exit");
    })(exports.ExitNotification || (exports.ExitNotification = {}));
    (function(DidChangeConfigurationNotification2) {
      DidChangeConfigurationNotification2.type = new messages_1.ProtocolNotificationType("workspace/didChangeConfiguration");
    })(exports.DidChangeConfigurationNotification || (exports.DidChangeConfigurationNotification = {}));
    (function(MessageType2) {
      MessageType2.Error = 1;
      MessageType2.Warning = 2;
      MessageType2.Info = 3;
      MessageType2.Log = 4;
    })(exports.MessageType || (exports.MessageType = {}));
    (function(ShowMessageNotification2) {
      ShowMessageNotification2.type = new messages_1.ProtocolNotificationType("window/showMessage");
    })(exports.ShowMessageNotification || (exports.ShowMessageNotification = {}));
    (function(ShowMessageRequest2) {
      ShowMessageRequest2.type = new messages_1.ProtocolRequestType("window/showMessageRequest");
    })(exports.ShowMessageRequest || (exports.ShowMessageRequest = {}));
    (function(LogMessageNotification2) {
      LogMessageNotification2.type = new messages_1.ProtocolNotificationType("window/logMessage");
    })(exports.LogMessageNotification || (exports.LogMessageNotification = {}));
    (function(TelemetryEventNotification2) {
      TelemetryEventNotification2.type = new messages_1.ProtocolNotificationType("telemetry/event");
    })(exports.TelemetryEventNotification || (exports.TelemetryEventNotification = {}));
    (function(TextDocumentSyncKind2) {
      TextDocumentSyncKind2.None = 0;
      TextDocumentSyncKind2.Full = 1;
      TextDocumentSyncKind2.Incremental = 2;
    })(exports.TextDocumentSyncKind || (exports.TextDocumentSyncKind = {}));
    (function(DidOpenTextDocumentNotification2) {
      DidOpenTextDocumentNotification2.method = "textDocument/didOpen";
      DidOpenTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidOpenTextDocumentNotification2.method);
    })(exports.DidOpenTextDocumentNotification || (exports.DidOpenTextDocumentNotification = {}));
    (function(TextDocumentContentChangeEvent2) {
      function isIncremental(event) {
        let candidate = event;
        return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range !== void 0 && (candidate.rangeLength === void 0 || typeof candidate.rangeLength === "number");
      }
      TextDocumentContentChangeEvent2.isIncremental = isIncremental;
      function isFull(event) {
        let candidate = event;
        return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range === void 0 && candidate.rangeLength === void 0;
      }
      TextDocumentContentChangeEvent2.isFull = isFull;
    })(exports.TextDocumentContentChangeEvent || (exports.TextDocumentContentChangeEvent = {}));
    (function(DidChangeTextDocumentNotification2) {
      DidChangeTextDocumentNotification2.method = "textDocument/didChange";
      DidChangeTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidChangeTextDocumentNotification2.method);
    })(exports.DidChangeTextDocumentNotification || (exports.DidChangeTextDocumentNotification = {}));
    (function(DidCloseTextDocumentNotification2) {
      DidCloseTextDocumentNotification2.method = "textDocument/didClose";
      DidCloseTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidCloseTextDocumentNotification2.method);
    })(exports.DidCloseTextDocumentNotification || (exports.DidCloseTextDocumentNotification = {}));
    (function(DidSaveTextDocumentNotification2) {
      DidSaveTextDocumentNotification2.method = "textDocument/didSave";
      DidSaveTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidSaveTextDocumentNotification2.method);
    })(exports.DidSaveTextDocumentNotification || (exports.DidSaveTextDocumentNotification = {}));
    (function(TextDocumentSaveReason2) {
      TextDocumentSaveReason2.Manual = 1;
      TextDocumentSaveReason2.AfterDelay = 2;
      TextDocumentSaveReason2.FocusOut = 3;
    })(exports.TextDocumentSaveReason || (exports.TextDocumentSaveReason = {}));
    (function(WillSaveTextDocumentNotification2) {
      WillSaveTextDocumentNotification2.method = "textDocument/willSave";
      WillSaveTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(WillSaveTextDocumentNotification2.method);
    })(exports.WillSaveTextDocumentNotification || (exports.WillSaveTextDocumentNotification = {}));
    (function(WillSaveTextDocumentWaitUntilRequest2) {
      WillSaveTextDocumentWaitUntilRequest2.method = "textDocument/willSaveWaitUntil";
      WillSaveTextDocumentWaitUntilRequest2.type = new messages_1.ProtocolRequestType(WillSaveTextDocumentWaitUntilRequest2.method);
    })(exports.WillSaveTextDocumentWaitUntilRequest || (exports.WillSaveTextDocumentWaitUntilRequest = {}));
    (function(DidChangeWatchedFilesNotification2) {
      DidChangeWatchedFilesNotification2.type = new messages_1.ProtocolNotificationType("workspace/didChangeWatchedFiles");
    })(exports.DidChangeWatchedFilesNotification || (exports.DidChangeWatchedFilesNotification = {}));
    (function(FileChangeType2) {
      FileChangeType2.Created = 1;
      FileChangeType2.Changed = 2;
      FileChangeType2.Deleted = 3;
    })(exports.FileChangeType || (exports.FileChangeType = {}));
    (function(WatchKind2) {
      WatchKind2.Create = 1;
      WatchKind2.Change = 2;
      WatchKind2.Delete = 4;
    })(exports.WatchKind || (exports.WatchKind = {}));
    (function(PublishDiagnosticsNotification2) {
      PublishDiagnosticsNotification2.type = new messages_1.ProtocolNotificationType("textDocument/publishDiagnostics");
    })(exports.PublishDiagnosticsNotification || (exports.PublishDiagnosticsNotification = {}));
    (function(CompletionTriggerKind2) {
      CompletionTriggerKind2.Invoked = 1;
      CompletionTriggerKind2.TriggerCharacter = 2;
      CompletionTriggerKind2.TriggerForIncompleteCompletions = 3;
    })(exports.CompletionTriggerKind || (exports.CompletionTriggerKind = {}));
    (function(CompletionRequest2) {
      CompletionRequest2.method = "textDocument/completion";
      CompletionRequest2.type = new messages_1.ProtocolRequestType(CompletionRequest2.method);
    })(exports.CompletionRequest || (exports.CompletionRequest = {}));
    (function(CompletionResolveRequest2) {
      CompletionResolveRequest2.method = "completionItem/resolve";
      CompletionResolveRequest2.type = new messages_1.ProtocolRequestType(CompletionResolveRequest2.method);
    })(exports.CompletionResolveRequest || (exports.CompletionResolveRequest = {}));
    (function(HoverRequest2) {
      HoverRequest2.method = "textDocument/hover";
      HoverRequest2.type = new messages_1.ProtocolRequestType(HoverRequest2.method);
    })(exports.HoverRequest || (exports.HoverRequest = {}));
    (function(SignatureHelpTriggerKind2) {
      SignatureHelpTriggerKind2.Invoked = 1;
      SignatureHelpTriggerKind2.TriggerCharacter = 2;
      SignatureHelpTriggerKind2.ContentChange = 3;
    })(exports.SignatureHelpTriggerKind || (exports.SignatureHelpTriggerKind = {}));
    (function(SignatureHelpRequest2) {
      SignatureHelpRequest2.method = "textDocument/signatureHelp";
      SignatureHelpRequest2.type = new messages_1.ProtocolRequestType(SignatureHelpRequest2.method);
    })(exports.SignatureHelpRequest || (exports.SignatureHelpRequest = {}));
    (function(DefinitionRequest2) {
      DefinitionRequest2.method = "textDocument/definition";
      DefinitionRequest2.type = new messages_1.ProtocolRequestType(DefinitionRequest2.method);
    })(exports.DefinitionRequest || (exports.DefinitionRequest = {}));
    (function(ReferencesRequest2) {
      ReferencesRequest2.method = "textDocument/references";
      ReferencesRequest2.type = new messages_1.ProtocolRequestType(ReferencesRequest2.method);
    })(exports.ReferencesRequest || (exports.ReferencesRequest = {}));
    (function(DocumentHighlightRequest2) {
      DocumentHighlightRequest2.method = "textDocument/documentHighlight";
      DocumentHighlightRequest2.type = new messages_1.ProtocolRequestType(DocumentHighlightRequest2.method);
    })(exports.DocumentHighlightRequest || (exports.DocumentHighlightRequest = {}));
    (function(DocumentSymbolRequest2) {
      DocumentSymbolRequest2.method = "textDocument/documentSymbol";
      DocumentSymbolRequest2.type = new messages_1.ProtocolRequestType(DocumentSymbolRequest2.method);
    })(exports.DocumentSymbolRequest || (exports.DocumentSymbolRequest = {}));
    (function(CodeActionRequest2) {
      CodeActionRequest2.method = "textDocument/codeAction";
      CodeActionRequest2.type = new messages_1.ProtocolRequestType(CodeActionRequest2.method);
    })(exports.CodeActionRequest || (exports.CodeActionRequest = {}));
    (function(CodeActionResolveRequest2) {
      CodeActionResolveRequest2.method = "codeAction/resolve";
      CodeActionResolveRequest2.type = new messages_1.ProtocolRequestType(CodeActionResolveRequest2.method);
    })(exports.CodeActionResolveRequest || (exports.CodeActionResolveRequest = {}));
    (function(WorkspaceSymbolRequest2) {
      WorkspaceSymbolRequest2.method = "workspace/symbol";
      WorkspaceSymbolRequest2.type = new messages_1.ProtocolRequestType(WorkspaceSymbolRequest2.method);
    })(exports.WorkspaceSymbolRequest || (exports.WorkspaceSymbolRequest = {}));
    (function(CodeLensRequest2) {
      CodeLensRequest2.method = "textDocument/codeLens";
      CodeLensRequest2.type = new messages_1.ProtocolRequestType(CodeLensRequest2.method);
    })(exports.CodeLensRequest || (exports.CodeLensRequest = {}));
    (function(CodeLensResolveRequest2) {
      CodeLensResolveRequest2.method = "codeLens/resolve";
      CodeLensResolveRequest2.type = new messages_1.ProtocolRequestType(CodeLensResolveRequest2.method);
    })(exports.CodeLensResolveRequest || (exports.CodeLensResolveRequest = {}));
    (function(CodeLensRefreshRequest2) {
      CodeLensRefreshRequest2.method = `workspace/codeLens/refresh`;
      CodeLensRefreshRequest2.type = new messages_1.ProtocolRequestType0(CodeLensRefreshRequest2.method);
    })(exports.CodeLensRefreshRequest || (exports.CodeLensRefreshRequest = {}));
    (function(DocumentLinkRequest2) {
      DocumentLinkRequest2.method = "textDocument/documentLink";
      DocumentLinkRequest2.type = new messages_1.ProtocolRequestType(DocumentLinkRequest2.method);
    })(exports.DocumentLinkRequest || (exports.DocumentLinkRequest = {}));
    (function(DocumentLinkResolveRequest2) {
      DocumentLinkResolveRequest2.method = "documentLink/resolve";
      DocumentLinkResolveRequest2.type = new messages_1.ProtocolRequestType(DocumentLinkResolveRequest2.method);
    })(exports.DocumentLinkResolveRequest || (exports.DocumentLinkResolveRequest = {}));
    (function(DocumentFormattingRequest2) {
      DocumentFormattingRequest2.method = "textDocument/formatting";
      DocumentFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentFormattingRequest2.method);
    })(exports.DocumentFormattingRequest || (exports.DocumentFormattingRequest = {}));
    (function(DocumentRangeFormattingRequest2) {
      DocumentRangeFormattingRequest2.method = "textDocument/rangeFormatting";
      DocumentRangeFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentRangeFormattingRequest2.method);
    })(exports.DocumentRangeFormattingRequest || (exports.DocumentRangeFormattingRequest = {}));
    (function(DocumentOnTypeFormattingRequest2) {
      DocumentOnTypeFormattingRequest2.method = "textDocument/onTypeFormatting";
      DocumentOnTypeFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentOnTypeFormattingRequest2.method);
    })(exports.DocumentOnTypeFormattingRequest || (exports.DocumentOnTypeFormattingRequest = {}));
    (function(PrepareSupportDefaultBehavior2) {
      PrepareSupportDefaultBehavior2.Identifier = 1;
    })(exports.PrepareSupportDefaultBehavior || (exports.PrepareSupportDefaultBehavior = {}));
    (function(RenameRequest2) {
      RenameRequest2.method = "textDocument/rename";
      RenameRequest2.type = new messages_1.ProtocolRequestType(RenameRequest2.method);
    })(exports.RenameRequest || (exports.RenameRequest = {}));
    (function(PrepareRenameRequest2) {
      PrepareRenameRequest2.method = "textDocument/prepareRename";
      PrepareRenameRequest2.type = new messages_1.ProtocolRequestType(PrepareRenameRequest2.method);
    })(exports.PrepareRenameRequest || (exports.PrepareRenameRequest = {}));
    (function(ExecuteCommandRequest2) {
      ExecuteCommandRequest2.type = new messages_1.ProtocolRequestType("workspace/executeCommand");
    })(exports.ExecuteCommandRequest || (exports.ExecuteCommandRequest = {}));
    (function(ApplyWorkspaceEditRequest2) {
      ApplyWorkspaceEditRequest2.type = new messages_1.ProtocolRequestType("workspace/applyEdit");
    })(exports.ApplyWorkspaceEditRequest || (exports.ApplyWorkspaceEditRequest = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/connection.js
var require_connection2 = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/connection.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createProtocolConnection = void 0;
    var vscode_jsonrpc_1 = require_main();
    function createProtocolConnection(input, output, logger, options) {
      if (vscode_jsonrpc_1.ConnectionStrategy.is(options)) {
        options = { connectionStrategy: options };
      }
      return vscode_jsonrpc_1.createMessageConnection(input, output, logger, options);
    }
    exports.createProtocolConnection = createProtocolConnection;
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/common/api.js
var require_api2 = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/common/api.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LSPErrorCodes = exports.createProtocolConnection = void 0;
    __exportStar(require_main(), exports);
    __exportStar(require_main2(), exports);
    __exportStar(require_messages2(), exports);
    __exportStar(require_protocol(), exports);
    var connection_1 = require_connection2();
    Object.defineProperty(exports, "createProtocolConnection", { enumerable: true, get: function() {
      return connection_1.createProtocolConnection;
    } });
    (function(LSPErrorCodes2) {
      LSPErrorCodes2.lspReservedErrorRangeStart = -32899;
      LSPErrorCodes2.ContentModified = -32801;
      LSPErrorCodes2.RequestCancelled = -32800;
      LSPErrorCodes2.lspReservedErrorRangeEnd = -32800;
    })(exports.LSPErrorCodes || (exports.LSPErrorCodes = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/lib/browser/main.js
var require_main3 = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/lib/browser/main.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createProtocolConnection = void 0;
    var browser_1 = require_browser();
    __exportStar(require_browser(), exports);
    __exportStar(require_api2(), exports);
    function createProtocolConnection(reader, writer, logger, options) {
      return browser_1.createMessageConnection(reader, writer, logger, options);
    }
    exports.createProtocolConnection = createProtocolConnection;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/semanticTokens.js
var require_semanticTokens = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/semanticTokens.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SemanticTokensBuilder = exports.SemanticTokensFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var SemanticTokensFeature = (Base) => {
      return class extends Base {
        get semanticTokens() {
          return {
            on: (handler) => {
              const type = vscode_languageserver_protocol_1.SemanticTokensRequest.type;
              this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            },
            onDelta: (handler) => {
              const type = vscode_languageserver_protocol_1.SemanticTokensDeltaRequest.type;
              this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            },
            onRange: (handler) => {
              const type = vscode_languageserver_protocol_1.SemanticTokensRangeRequest.type;
              this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports.SemanticTokensFeature = SemanticTokensFeature;
    var SemanticTokensBuilder = class {
      constructor() {
        this._prevData = void 0;
        this.initialize();
      }
      initialize() {
        this._id = Date.now();
        this._prevLine = 0;
        this._prevChar = 0;
        this._data = [];
        this._dataLen = 0;
      }
      push(line, char, length, tokenType, tokenModifiers) {
        let pushLine = line;
        let pushChar = char;
        if (this._dataLen > 0) {
          pushLine -= this._prevLine;
          if (pushLine === 0) {
            pushChar -= this._prevChar;
          }
        }
        this._data[this._dataLen++] = pushLine;
        this._data[this._dataLen++] = pushChar;
        this._data[this._dataLen++] = length;
        this._data[this._dataLen++] = tokenType;
        this._data[this._dataLen++] = tokenModifiers;
        this._prevLine = line;
        this._prevChar = char;
      }
      get id() {
        return this._id.toString();
      }
      previousResult(id) {
        if (this.id === id) {
          this._prevData = this._data;
        }
        this.initialize();
      }
      build() {
        this._prevData = void 0;
        return {
          resultId: this.id,
          data: this._data
        };
      }
      canBuildEdits() {
        return this._prevData !== void 0;
      }
      buildEdits() {
        if (this._prevData !== void 0) {
          const prevDataLength = this._prevData.length;
          const dataLength = this._data.length;
          let startIndex = 0;
          while (startIndex < dataLength && startIndex < prevDataLength && this._prevData[startIndex] === this._data[startIndex]) {
            startIndex++;
          }
          if (startIndex < dataLength && startIndex < prevDataLength) {
            let endIndex = 0;
            while (endIndex < dataLength && endIndex < prevDataLength && this._prevData[prevDataLength - 1 - endIndex] === this._data[dataLength - 1 - endIndex]) {
              endIndex++;
            }
            const newData = this._data.slice(startIndex, dataLength - endIndex);
            const result = {
              resultId: this.id,
              edits: [
                { start: startIndex, deleteCount: prevDataLength - endIndex - startIndex, data: newData }
              ]
            };
            return result;
          } else if (startIndex < dataLength) {
            return { resultId: this.id, edits: [
              { start: startIndex, deleteCount: 0, data: this._data.slice(startIndex) }
            ] };
          } else if (startIndex < prevDataLength) {
            return { resultId: this.id, edits: [
              { start: startIndex, deleteCount: prevDataLength - startIndex }
            ] };
          } else {
            return { resultId: this.id, edits: [] };
          }
        } else {
          return this.build();
        }
      }
    };
    exports.SemanticTokensBuilder = SemanticTokensBuilder;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/utils/is.js
var require_is3 = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/utils/is.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.thenable = exports.typedArray = exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
    function boolean(value) {
      return value === true || value === false;
    }
    exports.boolean = boolean;
    function string(value) {
      return typeof value === "string" || value instanceof String;
    }
    exports.string = string;
    function number(value) {
      return typeof value === "number" || value instanceof Number;
    }
    exports.number = number;
    function error(value) {
      return value instanceof Error;
    }
    exports.error = error;
    function func(value) {
      return typeof value === "function";
    }
    exports.func = func;
    function array(value) {
      return Array.isArray(value);
    }
    exports.array = array;
    function stringArray(value) {
      return array(value) && value.every((elem) => string(elem));
    }
    exports.stringArray = stringArray;
    function typedArray(value, check) {
      return Array.isArray(value) && value.every(check);
    }
    exports.typedArray = typedArray;
    function thenable(value) {
      return value && func(value.then);
    }
    exports.thenable = thenable;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/utils/uuid.js
var require_uuid = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/utils/uuid.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.generateUuid = exports.parse = exports.isUUID = exports.v4 = exports.empty = void 0;
    var ValueUUID = class {
      constructor(_value) {
        this._value = _value;
      }
      asHex() {
        return this._value;
      }
      equals(other) {
        return this.asHex() === other.asHex();
      }
    };
    var V4UUID = class _V4UUID extends ValueUUID {
      constructor() {
        super([
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          "-",
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          "-",
          "4",
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          "-",
          _V4UUID._oneOf(_V4UUID._timeHighBits),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          "-",
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex()
        ].join(""));
      }
      static _oneOf(array) {
        return array[Math.floor(array.length * Math.random())];
      }
      static _randomHex() {
        return _V4UUID._oneOf(_V4UUID._chars);
      }
    };
    V4UUID._chars = ["0", "1", "2", "3", "4", "5", "6", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    V4UUID._timeHighBits = ["8", "9", "a", "b"];
    exports.empty = new ValueUUID("00000000-0000-0000-0000-000000000000");
    function v4() {
      return new V4UUID();
    }
    exports.v4 = v4;
    var _UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    function isUUID(value) {
      return _UUIDPattern.test(value);
    }
    exports.isUUID = isUUID;
    function parse(value) {
      if (!isUUID(value)) {
        throw new Error("invalid uuid");
      }
      return new ValueUUID(value);
    }
    exports.parse = parse;
    function generateUuid() {
      return v4().asHex();
    }
    exports.generateUuid = generateUuid;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/progress.js
var require_progress = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/progress.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.attachPartialResult = exports.ProgressFeature = exports.attachWorkDone = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var uuid_1 = require_uuid();
    var WorkDoneProgressReporterImpl = class _WorkDoneProgressReporterImpl {
      constructor(_connection, _token) {
        this._connection = _connection;
        this._token = _token;
        _WorkDoneProgressReporterImpl.Instances.set(this._token, this);
      }
      begin(title, percentage, message, cancellable) {
        let param = {
          kind: "begin",
          title,
          percentage,
          message,
          cancellable
        };
        this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, param);
      }
      report(arg0, arg1) {
        let param = {
          kind: "report"
        };
        if (typeof arg0 === "number") {
          param.percentage = arg0;
          if (arg1 !== void 0) {
            param.message = arg1;
          }
        } else {
          param.message = arg0;
        }
        this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, param);
      }
      done() {
        _WorkDoneProgressReporterImpl.Instances.delete(this._token);
        this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, { kind: "end" });
      }
    };
    WorkDoneProgressReporterImpl.Instances = /* @__PURE__ */ new Map();
    var WorkDoneProgressServerReporterImpl = class extends WorkDoneProgressReporterImpl {
      constructor(connection, token) {
        super(connection, token);
        this._source = new vscode_languageserver_protocol_1.CancellationTokenSource();
      }
      get token() {
        return this._source.token;
      }
      done() {
        this._source.dispose();
        super.done();
      }
      cancel() {
        this._source.cancel();
      }
    };
    var NullProgressReporter = class {
      constructor() {
      }
      begin() {
      }
      report() {
      }
      done() {
      }
    };
    var NullProgressServerReporter = class extends NullProgressReporter {
      constructor() {
        super();
        this._source = new vscode_languageserver_protocol_1.CancellationTokenSource();
      }
      get token() {
        return this._source.token;
      }
      done() {
        this._source.dispose();
      }
      cancel() {
        this._source.cancel();
      }
    };
    function attachWorkDone(connection, params) {
      if (params === void 0 || params.workDoneToken === void 0) {
        return new NullProgressReporter();
      }
      const token = params.workDoneToken;
      delete params.workDoneToken;
      return new WorkDoneProgressReporterImpl(connection, token);
    }
    exports.attachWorkDone = attachWorkDone;
    var ProgressFeature = (Base) => {
      return class extends Base {
        constructor() {
          super();
          this._progressSupported = false;
        }
        initialize(capabilities) {
          var _a;
          if (((_a = capabilities === null || capabilities === void 0 ? void 0 : capabilities.window) === null || _a === void 0 ? void 0 : _a.workDoneProgress) === true) {
            this._progressSupported = true;
            this.connection.onNotification(vscode_languageserver_protocol_1.WorkDoneProgressCancelNotification.type, (params) => {
              let progress = WorkDoneProgressReporterImpl.Instances.get(params.token);
              if (progress instanceof WorkDoneProgressServerReporterImpl || progress instanceof NullProgressServerReporter) {
                progress.cancel();
              }
            });
          }
        }
        attachWorkDoneProgress(token) {
          if (token === void 0) {
            return new NullProgressReporter();
          } else {
            return new WorkDoneProgressReporterImpl(this.connection, token);
          }
        }
        createWorkDoneProgress() {
          if (this._progressSupported) {
            const token = uuid_1.generateUuid();
            return this.connection.sendRequest(vscode_languageserver_protocol_1.WorkDoneProgressCreateRequest.type, { token }).then(() => {
              const result = new WorkDoneProgressServerReporterImpl(this.connection, token);
              return result;
            });
          } else {
            return Promise.resolve(new NullProgressServerReporter());
          }
        }
      };
    };
    exports.ProgressFeature = ProgressFeature;
    var ResultProgress;
    (function(ResultProgress2) {
      ResultProgress2.type = new vscode_languageserver_protocol_1.ProgressType();
    })(ResultProgress || (ResultProgress = {}));
    var ResultProgressReporterImpl = class {
      constructor(_connection, _token) {
        this._connection = _connection;
        this._token = _token;
      }
      report(data) {
        this._connection.sendProgress(ResultProgress.type, this._token, data);
      }
    };
    function attachPartialResult(connection, params) {
      if (params === void 0 || params.partialResultToken === void 0) {
        return void 0;
      }
      const token = params.partialResultToken;
      delete params.partialResultToken;
      return new ResultProgressReporterImpl(connection, token);
    }
    exports.attachPartialResult = attachPartialResult;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/configuration.js
var require_configuration = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/configuration.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfigurationFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var Is = require_is3();
    var ConfigurationFeature = (Base) => {
      return class extends Base {
        getConfiguration(arg) {
          if (!arg) {
            return this._getConfiguration({});
          } else if (Is.string(arg)) {
            return this._getConfiguration({ section: arg });
          } else {
            return this._getConfiguration(arg);
          }
        }
        _getConfiguration(arg) {
          let params = {
            items: Array.isArray(arg) ? arg : [arg]
          };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ConfigurationRequest.type, params).then((result) => {
            return Array.isArray(arg) ? result : result[0];
          });
        }
      };
    };
    exports.ConfigurationFeature = ConfigurationFeature;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/workspaceFolders.js
var require_workspaceFolders = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/workspaceFolders.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorkspaceFoldersFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var WorkspaceFoldersFeature = (Base) => {
      return class extends Base {
        initialize(capabilities) {
          let workspaceCapabilities = capabilities.workspace;
          if (workspaceCapabilities && workspaceCapabilities.workspaceFolders) {
            this._onDidChangeWorkspaceFolders = new vscode_languageserver_protocol_1.Emitter();
            this.connection.onNotification(vscode_languageserver_protocol_1.DidChangeWorkspaceFoldersNotification.type, (params) => {
              this._onDidChangeWorkspaceFolders.fire(params.event);
            });
          }
        }
        getWorkspaceFolders() {
          return this.connection.sendRequest(vscode_languageserver_protocol_1.WorkspaceFoldersRequest.type);
        }
        get onDidChangeWorkspaceFolders() {
          if (!this._onDidChangeWorkspaceFolders) {
            throw new Error("Client doesn't support sending workspace folder change events.");
          }
          if (!this._unregistration) {
            this._unregistration = this.connection.client.register(vscode_languageserver_protocol_1.DidChangeWorkspaceFoldersNotification.type);
          }
          return this._onDidChangeWorkspaceFolders.event;
        }
      };
    };
    exports.WorkspaceFoldersFeature = WorkspaceFoldersFeature;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/callHierarchy.js
var require_callHierarchy = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/callHierarchy.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CallHierarchyFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var CallHierarchyFeature = (Base) => {
      return class extends Base {
        get callHierarchy() {
          return {
            onPrepare: (handler) => {
              this.connection.onRequest(vscode_languageserver_protocol_1.CallHierarchyPrepareRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
              });
            },
            onIncomingCalls: (handler) => {
              const type = vscode_languageserver_protocol_1.CallHierarchyIncomingCallsRequest.type;
              this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            },
            onOutgoingCalls: (handler) => {
              const type = vscode_languageserver_protocol_1.CallHierarchyOutgoingCallsRequest.type;
              this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports.CallHierarchyFeature = CallHierarchyFeature;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/showDocument.js
var require_showDocument = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/showDocument.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShowDocumentFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var ShowDocumentFeature = (Base) => {
      return class extends Base {
        showDocument(params) {
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowDocumentRequest.type, params);
        }
      };
    };
    exports.ShowDocumentFeature = ShowDocumentFeature;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/fileOperations.js
var require_fileOperations = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/fileOperations.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FileOperationsFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var FileOperationsFeature = (Base) => {
      return class extends Base {
        onDidCreateFiles(handler) {
          this.connection.onNotification(vscode_languageserver_protocol_1.DidCreateFilesNotification.type, (params) => {
            handler(params);
          });
        }
        onDidRenameFiles(handler) {
          this.connection.onNotification(vscode_languageserver_protocol_1.DidRenameFilesNotification.type, (params) => {
            handler(params);
          });
        }
        onDidDeleteFiles(handler) {
          this.connection.onNotification(vscode_languageserver_protocol_1.DidDeleteFilesNotification.type, (params) => {
            handler(params);
          });
        }
        onWillCreateFiles(handler) {
          return this.connection.onRequest(vscode_languageserver_protocol_1.WillCreateFilesRequest.type, (params, cancel) => {
            return handler(params, cancel);
          });
        }
        onWillRenameFiles(handler) {
          return this.connection.onRequest(vscode_languageserver_protocol_1.WillRenameFilesRequest.type, (params, cancel) => {
            return handler(params, cancel);
          });
        }
        onWillDeleteFiles(handler) {
          return this.connection.onRequest(vscode_languageserver_protocol_1.WillDeleteFilesRequest.type, (params, cancel) => {
            return handler(params, cancel);
          });
        }
      };
    };
    exports.FileOperationsFeature = FileOperationsFeature;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/linkedEditingRange.js
var require_linkedEditingRange = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/linkedEditingRange.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LinkedEditingRangeFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var LinkedEditingRangeFeature = (Base) => {
      return class extends Base {
        onLinkedEditingRange(handler) {
          this.connection.onRequest(vscode_languageserver_protocol_1.LinkedEditingRangeRequest.type, (params, cancel) => {
            return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
          });
        }
      };
    };
    exports.LinkedEditingRangeFeature = LinkedEditingRangeFeature;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/moniker.js
var require_moniker = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/moniker.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MonikerFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var MonikerFeature = (Base) => {
      return class extends Base {
        get moniker() {
          return {
            on: (handler) => {
              const type = vscode_languageserver_protocol_1.MonikerRequest.type;
              this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports.MonikerFeature = MonikerFeature;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/server.js
var require_server = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/server.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createConnection = exports.combineFeatures = exports.combineLanguagesFeatures = exports.combineWorkspaceFeatures = exports.combineWindowFeatures = exports.combineClientFeatures = exports.combineTracerFeatures = exports.combineTelemetryFeatures = exports.combineConsoleFeatures = exports._LanguagesImpl = exports.BulkUnregistration = exports.BulkRegistration = exports.ErrorMessageTracker = exports.TextDocuments = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var Is = require_is3();
    var UUID = require_uuid();
    var progress_1 = require_progress();
    var configuration_1 = require_configuration();
    var workspaceFolders_1 = require_workspaceFolders();
    var callHierarchy_1 = require_callHierarchy();
    var semanticTokens_1 = require_semanticTokens();
    var showDocument_1 = require_showDocument();
    var fileOperations_1 = require_fileOperations();
    var linkedEditingRange_1 = require_linkedEditingRange();
    var moniker_1 = require_moniker();
    function null2Undefined(value) {
      if (value === null) {
        return void 0;
      }
      return value;
    }
    var TextDocuments2 = class {
      /**
       * Create a new text document manager.
       */
      constructor(configuration) {
        this._documents = /* @__PURE__ */ Object.create(null);
        this._configuration = configuration;
        this._onDidChangeContent = new vscode_languageserver_protocol_1.Emitter();
        this._onDidOpen = new vscode_languageserver_protocol_1.Emitter();
        this._onDidClose = new vscode_languageserver_protocol_1.Emitter();
        this._onDidSave = new vscode_languageserver_protocol_1.Emitter();
        this._onWillSave = new vscode_languageserver_protocol_1.Emitter();
      }
      /**
       * An event that fires when a text document managed by this manager
       * has been opened or the content changes.
       */
      get onDidChangeContent() {
        return this._onDidChangeContent.event;
      }
      /**
       * An event that fires when a text document managed by this manager
       * has been opened.
       */
      get onDidOpen() {
        return this._onDidOpen.event;
      }
      /**
       * An event that fires when a text document managed by this manager
       * will be saved.
       */
      get onWillSave() {
        return this._onWillSave.event;
      }
      /**
       * Sets a handler that will be called if a participant wants to provide
       * edits during a text document save.
       */
      onWillSaveWaitUntil(handler) {
        this._willSaveWaitUntil = handler;
      }
      /**
       * An event that fires when a text document managed by this manager
       * has been saved.
       */
      get onDidSave() {
        return this._onDidSave.event;
      }
      /**
       * An event that fires when a text document managed by this manager
       * has been closed.
       */
      get onDidClose() {
        return this._onDidClose.event;
      }
      /**
       * Returns the document for the given URI. Returns undefined if
       * the document is not managed by this instance.
       *
       * @param uri The text document's URI to retrieve.
       * @return the text document or `undefined`.
       */
      get(uri) {
        return this._documents[uri];
      }
      /**
       * Returns all text documents managed by this instance.
       *
       * @return all text documents.
       */
      all() {
        return Object.keys(this._documents).map((key) => this._documents[key]);
      }
      /**
       * Returns the URIs of all text documents managed by this instance.
       *
       * @return the URI's of all text documents.
       */
      keys() {
        return Object.keys(this._documents);
      }
      /**
       * Listens for `low level` notification on the given connection to
       * update the text documents managed by this instance.
       *
       * Please note that the connection only provides handlers not an event model. Therefore
       * listening on a connection will overwrite the following handlers on a connection:
       * `onDidOpenTextDocument`, `onDidChangeTextDocument`, `onDidCloseTextDocument`,
       * `onWillSaveTextDocument`, `onWillSaveTextDocumentWaitUntil` and `onDidSaveTextDocument`.
       *
       * Use the corresponding events on the TextDocuments instance instead.
       *
       * @param connection The connection to listen on.
       */
      listen(connection) {
        connection.__textDocumentSync = vscode_languageserver_protocol_1.TextDocumentSyncKind.Full;
        connection.onDidOpenTextDocument((event) => {
          let td = event.textDocument;
          let document = this._configuration.create(td.uri, td.languageId, td.version, td.text);
          this._documents[td.uri] = document;
          let toFire = Object.freeze({ document });
          this._onDidOpen.fire(toFire);
          this._onDidChangeContent.fire(toFire);
        });
        connection.onDidChangeTextDocument((event) => {
          let td = event.textDocument;
          let changes = event.contentChanges;
          if (changes.length === 0) {
            return;
          }
          let document = this._documents[td.uri];
          const { version } = td;
          if (version === null || version === void 0) {
            throw new Error(`Received document change event for ${td.uri} without valid version identifier`);
          }
          document = this._configuration.update(document, changes, version);
          this._documents[td.uri] = document;
          this._onDidChangeContent.fire(Object.freeze({ document }));
        });
        connection.onDidCloseTextDocument((event) => {
          let document = this._documents[event.textDocument.uri];
          if (document) {
            delete this._documents[event.textDocument.uri];
            this._onDidClose.fire(Object.freeze({ document }));
          }
        });
        connection.onWillSaveTextDocument((event) => {
          let document = this._documents[event.textDocument.uri];
          if (document) {
            this._onWillSave.fire(Object.freeze({ document, reason: event.reason }));
          }
        });
        connection.onWillSaveTextDocumentWaitUntil((event, token) => {
          let document = this._documents[event.textDocument.uri];
          if (document && this._willSaveWaitUntil) {
            return this._willSaveWaitUntil(Object.freeze({ document, reason: event.reason }), token);
          } else {
            return [];
          }
        });
        connection.onDidSaveTextDocument((event) => {
          let document = this._documents[event.textDocument.uri];
          if (document) {
            this._onDidSave.fire(Object.freeze({ document }));
          }
        });
      }
    };
    exports.TextDocuments = TextDocuments2;
    var ErrorMessageTracker = class {
      constructor() {
        this._messages = /* @__PURE__ */ Object.create(null);
      }
      /**
       * Add a message to the tracker.
       *
       * @param message The message to add.
       */
      add(message) {
        let count = this._messages[message];
        if (!count) {
          count = 0;
        }
        count++;
        this._messages[message] = count;
      }
      /**
       * Send all tracked messages to the connection's window.
       *
       * @param connection The connection established between client and server.
       */
      sendErrors(connection) {
        Object.keys(this._messages).forEach((message) => {
          connection.window.showErrorMessage(message);
        });
      }
    };
    exports.ErrorMessageTracker = ErrorMessageTracker;
    var RemoteConsoleImpl = class {
      constructor() {
      }
      rawAttach(connection) {
        this._rawConnection = connection;
      }
      attach(connection) {
        this._connection = connection;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      fillServerCapabilities(_capabilities) {
      }
      initialize(_capabilities) {
      }
      error(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Error, message);
      }
      warn(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Warning, message);
      }
      info(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Info, message);
      }
      log(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Log, message);
      }
      send(type, message) {
        if (this._rawConnection) {
          this._rawConnection.sendNotification(vscode_languageserver_protocol_1.LogMessageNotification.type, { type, message });
        }
      }
    };
    var _RemoteWindowImpl = class {
      constructor() {
      }
      attach(connection) {
        this._connection = connection;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      showErrorMessage(message, ...actions) {
        let params = { type: vscode_languageserver_protocol_1.MessageType.Error, message, actions };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
      }
      showWarningMessage(message, ...actions) {
        let params = { type: vscode_languageserver_protocol_1.MessageType.Warning, message, actions };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
      }
      showInformationMessage(message, ...actions) {
        let params = { type: vscode_languageserver_protocol_1.MessageType.Info, message, actions };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
      }
    };
    var RemoteWindowImpl = showDocument_1.ShowDocumentFeature(progress_1.ProgressFeature(_RemoteWindowImpl));
    (function(BulkRegistration2) {
      function create() {
        return new BulkRegistrationImpl();
      }
      BulkRegistration2.create = create;
    })(exports.BulkRegistration || (exports.BulkRegistration = {}));
    var BulkRegistrationImpl = class {
      constructor() {
        this._registrations = [];
        this._registered = /* @__PURE__ */ new Set();
      }
      add(type, registerOptions) {
        const method = Is.string(type) ? type : type.method;
        if (this._registered.has(method)) {
          throw new Error(`${method} is already added to this registration`);
        }
        const id = UUID.generateUuid();
        this._registrations.push({
          id,
          method,
          registerOptions: registerOptions || {}
        });
        this._registered.add(method);
      }
      asRegistrationParams() {
        return {
          registrations: this._registrations
        };
      }
    };
    (function(BulkUnregistration2) {
      function create() {
        return new BulkUnregistrationImpl(void 0, []);
      }
      BulkUnregistration2.create = create;
    })(exports.BulkUnregistration || (exports.BulkUnregistration = {}));
    var BulkUnregistrationImpl = class {
      constructor(_connection, unregistrations) {
        this._connection = _connection;
        this._unregistrations = /* @__PURE__ */ new Map();
        unregistrations.forEach((unregistration) => {
          this._unregistrations.set(unregistration.method, unregistration);
        });
      }
      get isAttached() {
        return !!this._connection;
      }
      attach(connection) {
        this._connection = connection;
      }
      add(unregistration) {
        this._unregistrations.set(unregistration.method, unregistration);
      }
      dispose() {
        let unregistrations = [];
        for (let unregistration of this._unregistrations.values()) {
          unregistrations.push(unregistration);
        }
        let params = {
          unregisterations: unregistrations
        };
        this._connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).then(void 0, (_error) => {
          this._connection.console.info(`Bulk unregistration failed.`);
        });
      }
      disposeSingle(arg) {
        const method = Is.string(arg) ? arg : arg.method;
        const unregistration = this._unregistrations.get(method);
        if (!unregistration) {
          return false;
        }
        let params = {
          unregisterations: [unregistration]
        };
        this._connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).then(() => {
          this._unregistrations.delete(method);
        }, (_error) => {
          this._connection.console.info(`Un-registering request handler for ${unregistration.id} failed.`);
        });
        return true;
      }
    };
    var RemoteClientImpl = class {
      attach(connection) {
        this._connection = connection;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      register(typeOrRegistrations, registerOptionsOrType, registerOptions) {
        if (typeOrRegistrations instanceof BulkRegistrationImpl) {
          return this.registerMany(typeOrRegistrations);
        } else if (typeOrRegistrations instanceof BulkUnregistrationImpl) {
          return this.registerSingle1(typeOrRegistrations, registerOptionsOrType, registerOptions);
        } else {
          return this.registerSingle2(typeOrRegistrations, registerOptionsOrType);
        }
      }
      registerSingle1(unregistration, type, registerOptions) {
        const method = Is.string(type) ? type : type.method;
        const id = UUID.generateUuid();
        let params = {
          registrations: [{ id, method, registerOptions: registerOptions || {} }]
        };
        if (!unregistration.isAttached) {
          unregistration.attach(this.connection);
        }
        return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then((_result) => {
          unregistration.add({ id, method });
          return unregistration;
        }, (_error) => {
          this.connection.console.info(`Registering request handler for ${method} failed.`);
          return Promise.reject(_error);
        });
      }
      registerSingle2(type, registerOptions) {
        const method = Is.string(type) ? type : type.method;
        const id = UUID.generateUuid();
        let params = {
          registrations: [{ id, method, registerOptions: registerOptions || {} }]
        };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then((_result) => {
          return vscode_languageserver_protocol_1.Disposable.create(() => {
            this.unregisterSingle(id, method);
          });
        }, (_error) => {
          this.connection.console.info(`Registering request handler for ${method} failed.`);
          return Promise.reject(_error);
        });
      }
      unregisterSingle(id, method) {
        let params = {
          unregisterations: [{ id, method }]
        };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).then(void 0, (_error) => {
          this.connection.console.info(`Un-registering request handler for ${id} failed.`);
        });
      }
      registerMany(registrations) {
        let params = registrations.asRegistrationParams();
        return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then(() => {
          return new BulkUnregistrationImpl(this._connection, params.registrations.map((registration) => {
            return { id: registration.id, method: registration.method };
          }));
        }, (_error) => {
          this.connection.console.info(`Bulk registration failed.`);
          return Promise.reject(_error);
        });
      }
    };
    var _RemoteWorkspaceImpl = class {
      constructor() {
      }
      attach(connection) {
        this._connection = connection;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      applyEdit(paramOrEdit) {
        function isApplyWorkspaceEditParams(value) {
          return value && !!value.edit;
        }
        let params = isApplyWorkspaceEditParams(paramOrEdit) ? paramOrEdit : { edit: paramOrEdit };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.ApplyWorkspaceEditRequest.type, params);
      }
    };
    var RemoteWorkspaceImpl = fileOperations_1.FileOperationsFeature(workspaceFolders_1.WorkspaceFoldersFeature(configuration_1.ConfigurationFeature(_RemoteWorkspaceImpl)));
    var TracerImpl = class {
      constructor() {
        this._trace = vscode_languageserver_protocol_1.Trace.Off;
      }
      attach(connection) {
        this._connection = connection;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      set trace(value) {
        this._trace = value;
      }
      log(message, verbose) {
        if (this._trace === vscode_languageserver_protocol_1.Trace.Off) {
          return;
        }
        this.connection.sendNotification(vscode_languageserver_protocol_1.LogTraceNotification.type, {
          message,
          verbose: this._trace === vscode_languageserver_protocol_1.Trace.Verbose ? verbose : void 0
        });
      }
    };
    var TelemetryImpl = class {
      constructor() {
      }
      attach(connection) {
        this._connection = connection;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      logEvent(data) {
        this.connection.sendNotification(vscode_languageserver_protocol_1.TelemetryEventNotification.type, data);
      }
    };
    var _LanguagesImpl = class {
      constructor() {
      }
      attach(connection) {
        this._connection = connection;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      attachWorkDoneProgress(params) {
        return progress_1.attachWorkDone(this.connection, params);
      }
      attachPartialResultProgress(_type, params) {
        return progress_1.attachPartialResult(this.connection, params);
      }
    };
    exports._LanguagesImpl = _LanguagesImpl;
    var LanguagesImpl = moniker_1.MonikerFeature(linkedEditingRange_1.LinkedEditingRangeFeature(semanticTokens_1.SemanticTokensFeature(callHierarchy_1.CallHierarchyFeature(_LanguagesImpl))));
    function combineConsoleFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports.combineConsoleFeatures = combineConsoleFeatures;
    function combineTelemetryFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports.combineTelemetryFeatures = combineTelemetryFeatures;
    function combineTracerFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports.combineTracerFeatures = combineTracerFeatures;
    function combineClientFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports.combineClientFeatures = combineClientFeatures;
    function combineWindowFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports.combineWindowFeatures = combineWindowFeatures;
    function combineWorkspaceFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports.combineWorkspaceFeatures = combineWorkspaceFeatures;
    function combineLanguagesFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports.combineLanguagesFeatures = combineLanguagesFeatures;
    function combineFeatures(one, two) {
      function combine(one2, two2, func) {
        if (one2 && two2) {
          return func(one2, two2);
        } else if (one2) {
          return one2;
        } else {
          return two2;
        }
      }
      let result = {
        __brand: "features",
        console: combine(one.console, two.console, combineConsoleFeatures),
        tracer: combine(one.tracer, two.tracer, combineTracerFeatures),
        telemetry: combine(one.telemetry, two.telemetry, combineTelemetryFeatures),
        client: combine(one.client, two.client, combineClientFeatures),
        window: combine(one.window, two.window, combineWindowFeatures),
        workspace: combine(one.workspace, two.workspace, combineWorkspaceFeatures)
      };
      return result;
    }
    exports.combineFeatures = combineFeatures;
    function createConnection(connectionFactory, watchDog, factories) {
      const logger = factories && factories.console ? new (factories.console(RemoteConsoleImpl))() : new RemoteConsoleImpl();
      const connection = connectionFactory(logger);
      logger.rawAttach(connection);
      const tracer = factories && factories.tracer ? new (factories.tracer(TracerImpl))() : new TracerImpl();
      const telemetry = factories && factories.telemetry ? new (factories.telemetry(TelemetryImpl))() : new TelemetryImpl();
      const client = factories && factories.client ? new (factories.client(RemoteClientImpl))() : new RemoteClientImpl();
      const remoteWindow = factories && factories.window ? new (factories.window(RemoteWindowImpl))() : new RemoteWindowImpl();
      const workspace = factories && factories.workspace ? new (factories.workspace(RemoteWorkspaceImpl))() : new RemoteWorkspaceImpl();
      const languages = factories && factories.languages ? new (factories.languages(LanguagesImpl))() : new LanguagesImpl();
      const allRemotes = [logger, tracer, telemetry, client, remoteWindow, workspace, languages];
      function asPromise(value) {
        if (value instanceof Promise) {
          return value;
        } else if (Is.thenable(value)) {
          return new Promise((resolve, reject) => {
            value.then((resolved) => resolve(resolved), (error) => reject(error));
          });
        } else {
          return Promise.resolve(value);
        }
      }
      let shutdownHandler = void 0;
      let initializeHandler = void 0;
      let exitHandler = void 0;
      let protocolConnection = {
        listen: () => connection.listen(),
        sendRequest: (type, ...params) => connection.sendRequest(Is.string(type) ? type : type.method, ...params),
        onRequest: (type, handler) => connection.onRequest(type, handler),
        sendNotification: (type, param) => {
          const method = Is.string(type) ? type : type.method;
          if (arguments.length === 1) {
            connection.sendNotification(method);
          } else {
            connection.sendNotification(method, param);
          }
        },
        onNotification: (type, handler) => connection.onNotification(type, handler),
        onProgress: connection.onProgress,
        sendProgress: connection.sendProgress,
        onInitialize: (handler) => initializeHandler = handler,
        onInitialized: (handler) => connection.onNotification(vscode_languageserver_protocol_1.InitializedNotification.type, handler),
        onShutdown: (handler) => shutdownHandler = handler,
        onExit: (handler) => exitHandler = handler,
        get console() {
          return logger;
        },
        get telemetry() {
          return telemetry;
        },
        get tracer() {
          return tracer;
        },
        get client() {
          return client;
        },
        get window() {
          return remoteWindow;
        },
        get workspace() {
          return workspace;
        },
        get languages() {
          return languages;
        },
        onDidChangeConfiguration: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, handler),
        onDidChangeWatchedFiles: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidChangeWatchedFilesNotification.type, handler),
        __textDocumentSync: void 0,
        onDidOpenTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidOpenTextDocumentNotification.type, handler),
        onDidChangeTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, handler),
        onDidCloseTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidCloseTextDocumentNotification.type, handler),
        onWillSaveTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.WillSaveTextDocumentNotification.type, handler),
        onWillSaveTextDocumentWaitUntil: (handler) => connection.onRequest(vscode_languageserver_protocol_1.WillSaveTextDocumentWaitUntilRequest.type, handler),
        onDidSaveTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidSaveTextDocumentNotification.type, handler),
        sendDiagnostics: (params) => connection.sendNotification(vscode_languageserver_protocol_1.PublishDiagnosticsNotification.type, params),
        onHover: (handler) => connection.onRequest(vscode_languageserver_protocol_1.HoverRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), void 0);
        }),
        onCompletion: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CompletionRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onCompletionResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CompletionResolveRequest.type, handler),
        onSignatureHelp: (handler) => connection.onRequest(vscode_languageserver_protocol_1.SignatureHelpRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), void 0);
        }),
        onDeclaration: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DeclarationRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onDefinition: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DefinitionRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onTypeDefinition: (handler) => connection.onRequest(vscode_languageserver_protocol_1.TypeDefinitionRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onImplementation: (handler) => connection.onRequest(vscode_languageserver_protocol_1.ImplementationRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onReferences: (handler) => connection.onRequest(vscode_languageserver_protocol_1.ReferencesRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onDocumentHighlight: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentHighlightRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onDocumentSymbol: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentSymbolRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onWorkspaceSymbol: (handler) => connection.onRequest(vscode_languageserver_protocol_1.WorkspaceSymbolRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onCodeAction: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CodeActionRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onCodeActionResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CodeActionResolveRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onCodeLens: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CodeLensRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onCodeLensResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CodeLensResolveRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onDocumentFormatting: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentFormattingRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), void 0);
        }),
        onDocumentRangeFormatting: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentRangeFormattingRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), void 0);
        }),
        onDocumentOnTypeFormatting: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentOnTypeFormattingRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onRenameRequest: (handler) => connection.onRequest(vscode_languageserver_protocol_1.RenameRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), void 0);
        }),
        onPrepareRename: (handler) => connection.onRequest(vscode_languageserver_protocol_1.PrepareRenameRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onDocumentLinks: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentLinkRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onDocumentLinkResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentLinkResolveRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onDocumentColor: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentColorRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onColorPresentation: (handler) => connection.onRequest(vscode_languageserver_protocol_1.ColorPresentationRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onFoldingRanges: (handler) => connection.onRequest(vscode_languageserver_protocol_1.FoldingRangeRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onSelectionRanges: (handler) => connection.onRequest(vscode_languageserver_protocol_1.SelectionRangeRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
        }),
        onExecuteCommand: (handler) => connection.onRequest(vscode_languageserver_protocol_1.ExecuteCommandRequest.type, (params, cancel) => {
          return handler(params, cancel, progress_1.attachWorkDone(connection, params), void 0);
        }),
        dispose: () => connection.dispose()
      };
      for (let remote of allRemotes) {
        remote.attach(protocolConnection);
      }
      connection.onRequest(vscode_languageserver_protocol_1.InitializeRequest.type, (params) => {
        watchDog.initialize(params);
        if (Is.string(params.trace)) {
          tracer.trace = vscode_languageserver_protocol_1.Trace.fromString(params.trace);
        }
        for (let remote of allRemotes) {
          remote.initialize(params.capabilities);
        }
        if (initializeHandler) {
          let result = initializeHandler(params, new vscode_languageserver_protocol_1.CancellationTokenSource().token, progress_1.attachWorkDone(connection, params), void 0);
          return asPromise(result).then((value) => {
            if (value instanceof vscode_languageserver_protocol_1.ResponseError) {
              return value;
            }
            let result2 = value;
            if (!result2) {
              result2 = { capabilities: {} };
            }
            let capabilities = result2.capabilities;
            if (!capabilities) {
              capabilities = {};
              result2.capabilities = capabilities;
            }
            if (capabilities.textDocumentSync === void 0 || capabilities.textDocumentSync === null) {
              capabilities.textDocumentSync = Is.number(protocolConnection.__textDocumentSync) ? protocolConnection.__textDocumentSync : vscode_languageserver_protocol_1.TextDocumentSyncKind.None;
            } else if (!Is.number(capabilities.textDocumentSync) && !Is.number(capabilities.textDocumentSync.change)) {
              capabilities.textDocumentSync.change = Is.number(protocolConnection.__textDocumentSync) ? protocolConnection.__textDocumentSync : vscode_languageserver_protocol_1.TextDocumentSyncKind.None;
            }
            for (let remote of allRemotes) {
              remote.fillServerCapabilities(capabilities);
            }
            return result2;
          });
        } else {
          let result = { capabilities: { textDocumentSync: vscode_languageserver_protocol_1.TextDocumentSyncKind.None } };
          for (let remote of allRemotes) {
            remote.fillServerCapabilities(result.capabilities);
          }
          return result;
        }
      });
      connection.onRequest(vscode_languageserver_protocol_1.ShutdownRequest.type, () => {
        watchDog.shutdownReceived = true;
        if (shutdownHandler) {
          return shutdownHandler(new vscode_languageserver_protocol_1.CancellationTokenSource().token);
        } else {
          return void 0;
        }
      });
      connection.onNotification(vscode_languageserver_protocol_1.ExitNotification.type, () => {
        try {
          if (exitHandler) {
            exitHandler();
          }
        } finally {
          if (watchDog.shutdownReceived) {
            watchDog.exit(0);
          } else {
            watchDog.exit(1);
          }
        }
      });
      connection.onNotification(vscode_languageserver_protocol_1.SetTraceNotification.type, (params) => {
        tracer.trace = vscode_languageserver_protocol_1.Trace.fromString(params.value);
      });
      return protocolConnection;
    }
    exports.createConnection = createConnection;
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/common/api.js
var require_api3 = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/common/api.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProposedFeatures = exports.SemanticTokensBuilder = void 0;
    var semanticTokens_1 = require_semanticTokens();
    Object.defineProperty(exports, "SemanticTokensBuilder", { enumerable: true, get: function() {
      return semanticTokens_1.SemanticTokensBuilder;
    } });
    __exportStar(require_main3(), exports);
    __exportStar(require_server(), exports);
    (function(ProposedFeatures2) {
      ProposedFeatures2.all = {
        __brand: "features"
      };
    })(exports.ProposedFeatures || (exports.ProposedFeatures = {}));
  }
});

// yamma/server/node_modules/vscode-languageserver-protocol/browser.js
var require_browser2 = __commonJS({
  "yamma/server/node_modules/vscode-languageserver-protocol/browser.js"(exports, module) {
    module.exports = require_main3();
  }
});

// yamma/server/node_modules/vscode-languageserver/lib/browser/main.js
var require_main4 = __commonJS({
  "yamma/server/node_modules/vscode-languageserver/lib/browser/main.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createConnection = void 0;
    var api_1 = require_api3();
    __exportStar(require_browser2(), exports);
    __exportStar(require_api3(), exports);
    var _shutdownReceived = false;
    var watchDog = {
      initialize: (_params) => {
      },
      get shutdownReceived() {
        return _shutdownReceived;
      },
      set shutdownReceived(value) {
        _shutdownReceived = value;
      },
      exit: (_code) => {
      }
    };
    function createConnection(arg1, arg2, arg3, arg4) {
      let factories;
      let reader;
      let writer;
      let options;
      if (arg1 !== void 0 && arg1.__brand === "features") {
        factories = arg1;
        arg1 = arg2;
        arg2 = arg3;
        arg3 = arg4;
      }
      if (api_1.ConnectionStrategy.is(arg1) || api_1.ConnectionOptions.is(arg1)) {
        options = arg1;
      } else {
        reader = arg1;
        writer = arg2;
        options = arg3;
      }
      const connectionFactory = (logger) => {
        return api_1.createProtocolConnection(reader, writer, logger, options);
      };
      return api_1.createConnection(connectionFactory, watchDog, factories);
    }
    exports.createConnection = createConnection;
  }
});

// browser-shims.js
var browser_shims_exports = {};
__export(browser_shims_exports, {
  EventEmitter: () => EventEmitter,
  Worker: () => Worker,
  browserUnsupported: () => browserUnsupported,
  createInterface: () => createInterface,
  createReadStream: () => createReadStream,
  dirname: () => dirname,
  existsSync: () => existsSync,
  extname: () => extname,
  fileURLToPath: () => fileURLToPath,
  format: () => formatPath,
  isMainThread: () => isMainThread,
  join: () => joinPath,
  normalize: () => normalize,
  parentPort: () => parentPort,
  parse: () => pathParse,
  pathToFileURL: () => pathToFileURL,
  readFileSync: () => readFileSync,
  readdirSync: () => readdirSync,
  realpath: () => realpath,
  workerData: () => workerData,
  writeFileSync: () => writeFileSync
});
var browserUnsupported, EventEmitter, pathParse, formatPath, joinPath, dirname, extname, normalize, Worker, pathToFileURL, isMainThread, parentPort, workerData, readFileSync, createReadStream, realpath, existsSync, readdirSync, writeFileSync, createInterface, fileURLToPath;
var init_browser_shims = __esm({
  "browser-shims.js"() {
    browserUnsupported = (operation) => {
      throw new Error(`${operation} is not available in the browser build`);
    };
    EventEmitter = class {
      listeners = /* @__PURE__ */ new Map();
      on(event, listener) {
        const listeners = this.listeners.get(event) ?? [];
        listeners.push(listener);
        this.listeners.set(event, listeners);
        return this;
      }
      once(event, listener) {
        const wrapped = (...args) => {
          this.removeListener(event, wrapped);
          listener(...args);
        };
        return this.on(event, wrapped);
      }
      removeListener(event, listener) {
        const listeners = this.listeners.get(event);
        if (listeners) {
          this.listeners.set(
            event,
            listeners.filter((candidate) => candidate !== listener)
          );
        }
        return this;
      }
      off(event, listener) {
        return this.removeListener(event, listener);
      }
      emit(event, ...args) {
        const listeners = this.listeners.get(event);
        if (!listeners?.length) {
          return false;
        }
        for (const listener of [...listeners]) {
          listener(...args);
        }
        return true;
      }
      static once(emitter, event) {
        return new Promise((resolve) => {
          emitter.once(event, (...args) => resolve(args));
        });
      }
    };
    pathParse = (value) => {
      const normalized = value.replace(/\\/g, "/");
      const separator = normalized.lastIndexOf("/");
      const dir = separator < 0 ? "" : normalized.slice(0, separator);
      const base = normalized.slice(separator + 1);
      const dot = base.lastIndexOf(".");
      const ext = dot > 0 ? base.slice(dot) : "";
      return {
        root: normalized.startsWith("/") ? "/" : "",
        dir,
        base,
        ext,
        name: ext ? base.slice(0, -ext.length) : base
      };
    };
    formatPath = ({ dir, root, base, name, ext }) => `${dir || root}${dir || root ? "/" : ""}${base ?? `${name ?? ""}${ext ?? ""}`}`;
    joinPath = (...parts) => parts.filter(Boolean).join("/").replace(/\\/g, "/").replace(/\/+/g, "/");
    dirname = (value) => pathParse(value).dir || ".";
    extname = (value) => pathParse(value).ext;
    normalize = (value) => value.replace(/\\/g, "/");
    Worker = class {
      constructor() {
        browserUnsupported("Worker threads");
      }
    };
    pathToFileURL = (value) => new URL(`file://${value.startsWith("/") ? "" : "/"}${value}`);
    isMainThread = true;
    parentPort = null;
    workerData = void 0;
    readFileSync = () => browserUnsupported("Filesystem access");
    createReadStream = () => browserUnsupported("Filesystem access");
    realpath = () => browserUnsupported("Filesystem access");
    existsSync = () => browserUnsupported("Filesystem access");
    readdirSync = () => browserUnsupported("Filesystem access");
    writeFileSync = () => browserUnsupported("Filesystem access");
    createInterface = () => browserUnsupported("Filesystem access");
    fileURLToPath = () => browserUnsupported("Filesystem access");
  }
});

// yamma/server/node_modules/nearley/lib/nearley.js
var require_nearley = __commonJS({
  "yamma/server/node_modules/nearley/lib/nearley.js"(exports, module) {
    (function(root, factory) {
      if (typeof module === "object" && module.exports) {
        module.exports = factory();
      } else {
        root.nearley = factory();
      }
    })(exports, function() {
      function Rule2(name, symbols, postprocess) {
        this.id = ++Rule2.highestId;
        this.name = name;
        this.symbols = symbols;
        this.postprocess = postprocess;
        return this;
      }
      Rule2.highestId = 0;
      Rule2.prototype.toString = function(withCursorAt) {
        var symbolSequence = typeof withCursorAt === "undefined" ? this.symbols.map(getSymbolShortDisplay).join(" ") : this.symbols.slice(0, withCursorAt).map(getSymbolShortDisplay).join(" ") + " \u25CF " + this.symbols.slice(withCursorAt).map(getSymbolShortDisplay).join(" ");
        return this.name + " \u2192 " + symbolSequence;
      };
      function State(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.data = [];
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
      }
      State.prototype.toString = function() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
      };
      State.prototype.nextState = function(child) {
        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
          state.data = state.build();
          state.right = void 0;
        }
        return state;
      };
      State.prototype.build = function() {
        var children = [];
        var node = this;
        do {
          children.push(node.right.data);
          node = node.left;
        } while (node.left);
        children.reverse();
        return children;
      };
      State.prototype.finish = function() {
        if (this.rule.postprocess) {
          this.data = this.rule.postprocess(this.data, this.reference, Parser5.fail);
        }
      };
      function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = {};
        this.scannable = [];
        this.completed = {};
      }
      Column.prototype.process = function(nextColumn) {
        var states = this.states;
        var wants = this.wants;
        var completed = this.completed;
        for (var w = 0; w < states.length; w++) {
          var state = states[w];
          if (state.isComplete) {
            state.finish();
            if (state.data !== Parser5.fail) {
              var wantedBy = state.wantedBy;
              for (var i = wantedBy.length; i--; ) {
                var left = wantedBy[i];
                this.complete(left, state);
              }
              if (state.reference === this.index) {
                var exp = state.rule.name;
                (this.completed[exp] = this.completed[exp] || []).push(state);
              }
            }
          } else {
            var exp = state.rule.symbols[state.dot];
            if (typeof exp !== "string") {
              this.scannable.push(state);
              continue;
            }
            if (wants[exp]) {
              wants[exp].push(state);
              if (completed.hasOwnProperty(exp)) {
                var nulls = completed[exp];
                for (var i = 0; i < nulls.length; i++) {
                  var right = nulls[i];
                  this.complete(state, right);
                }
              }
            } else {
              wants[exp] = [state];
              this.predict(exp);
            }
          }
        }
      };
      Column.prototype.predict = function(exp) {
        var rules = this.grammar.byName[exp] || [];
        for (var i = 0; i < rules.length; i++) {
          var r = rules[i];
          var wantedBy = this.wants[exp];
          var s = new State(r, 0, this.index, wantedBy);
          this.states.push(s);
        }
      };
      Column.prototype.complete = function(left, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
      };
      function Grammar6(rules, start) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
        var byName = this.byName = {};
        this.rules.forEach(function(rule) {
          if (!byName.hasOwnProperty(rule.name)) {
            byName[rule.name] = [];
          }
          byName[rule.name].push(rule);
        });
      }
      Grammar6.fromCompiled = function(rules, start) {
        var lexer = rules.Lexer;
        if (rules.ParserStart) {
          start = rules.ParserStart;
          rules = rules.ParserRules;
        }
        var rules = rules.map(function(r) {
          return new Rule2(r.name, r.symbols, r.postprocess);
        });
        var g = new Grammar6(rules, start);
        g.lexer = lexer;
        return g;
      };
      function StreamLexer() {
        this.reset("");
      }
      StreamLexer.prototype.reset = function(data, state) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
      };
      StreamLexer.prototype.next = function() {
        if (this.index < this.buffer.length) {
          var ch = this.buffer[this.index++];
          if (ch === "\n") {
            this.line += 1;
            this.lastLineBreak = this.index;
          }
          return { value: ch };
        }
      };
      StreamLexer.prototype.save = function() {
        return {
          line: this.line,
          col: this.index - this.lastLineBreak
        };
      };
      StreamLexer.prototype.formatError = function(token, message) {
        var buffer = this.buffer;
        if (typeof buffer === "string") {
          var lines = buffer.split("\n").slice(
            Math.max(0, this.line - 5),
            this.line
          );
          var nextLineBreak = buffer.indexOf("\n", this.index);
          if (nextLineBreak === -1) nextLineBreak = buffer.length;
          var col = this.index - this.lastLineBreak;
          var lastLineDigits = String(this.line).length;
          message += " at line " + this.line + " col " + col + ":\n\n";
          message += lines.map(function(line, i) {
            return pad(this.line - lines.length + i + 1, lastLineDigits) + " " + line;
          }, this).join("\n");
          message += "\n" + pad("", lastLineDigits + col) + "^\n";
          return message;
        } else {
          return message + " at index " + (this.index - 1);
        }
        function pad(n, length) {
          var s = String(n);
          return Array(length - s.length + 1).join(" ") + s;
        }
      };
      function Parser5(rules, start, options) {
        if (rules instanceof Grammar6) {
          var grammar = rules;
          var options = start;
        } else {
          var grammar = Grammar6.fromCompiled(rules, start);
        }
        this.grammar = grammar;
        this.options = {
          keepHistory: false,
          lexer: grammar.lexer || new StreamLexer()
        };
        for (var key in options || {}) {
          this.options[key] = options[key];
        }
        this.lexer = this.options.lexer;
        this.lexerState = void 0;
        var column = new Column(grammar, 0);
        this.table = [column];
        column.wants[grammar.start] = [];
        column.predict(grammar.start);
        column.process();
        this.current = 0;
      }
      Parser5.fail = {};
      Parser5.prototype.feed = function(chunk) {
        var lexer = this.lexer;
        lexer.reset(chunk, this.lexerState);
        var token;
        while (true) {
          try {
            token = lexer.next();
            if (!token) {
              break;
            }
          } catch (e) {
            var nextColumn = new Column(this.grammar, this.current + 1);
            this.table.push(nextColumn);
            var err = new Error(this.reportLexerError(e));
            err.offset = this.current;
            err.token = e.token;
            throw err;
          }
          var column = this.table[this.current];
          if (!this.options.keepHistory) {
            delete this.table[this.current - 1];
          }
          var n = this.current + 1;
          var nextColumn = new Column(this.grammar, n);
          this.table.push(nextColumn);
          var literal = token.text !== void 0 ? token.text : token.value;
          var value = lexer.constructor === StreamLexer ? token.value : token;
          var scannable = column.scannable;
          for (var w = scannable.length; w--; ) {
            var state = scannable[w];
            var expect = state.rule.symbols[state.dot];
            if (expect.test ? expect.test(value) : expect.type ? expect.type === token.type : expect.literal === literal) {
              var next = state.nextState({ data: value, token, isToken: true, reference: n - 1 });
              nextColumn.states.push(next);
            }
          }
          nextColumn.process();
          if (nextColumn.states.length === 0) {
            var err = new Error(this.reportError(token));
            err.offset = this.current;
            err.token = token;
            throw err;
          }
          if (this.options.keepHistory) {
            column.lexerState = lexer.save();
          }
          this.current++;
        }
        if (column) {
          this.lexerState = lexer.save();
        }
        this.results = this.finish();
        return this;
      };
      Parser5.prototype.reportLexerError = function(lexerError) {
        var tokenDisplay, lexerMessage;
        var token = lexerError.token;
        if (token) {
          tokenDisplay = "input " + JSON.stringify(token.text[0]) + " (lexer error)";
          lexerMessage = this.lexer.formatError(token, "Syntax error");
        } else {
          tokenDisplay = "input (lexer error)";
          lexerMessage = lexerError.message;
        }
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
      };
      Parser5.prototype.reportError = function(token) {
        var tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== void 0 ? token.value : token);
        var lexerMessage = this.lexer.formatError(token, "Syntax error");
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
      };
      Parser5.prototype.reportErrorCommon = function(lexerMessage, tokenDisplay) {
        var lines = [];
        lines.push(lexerMessage);
        var lastColumnIndex = this.table.length - 2;
        var lastColumn = this.table[lastColumnIndex];
        var expectantStates = lastColumn.states.filter(function(state) {
          var nextSymbol = state.rule.symbols[state.dot];
          return nextSymbol && typeof nextSymbol !== "string";
        });
        if (expectantStates.length === 0) {
          lines.push("Unexpected " + tokenDisplay + ". I did not expect any more input. Here is the state of my parse table:\n");
          this.displayStateStack(lastColumn.states, lines);
        } else {
          lines.push("Unexpected " + tokenDisplay + ". Instead, I was expecting to see one of the following:\n");
          var stateStacks = expectantStates.map(function(state) {
            return this.buildFirstStateStack(state, []) || [state];
          }, this);
          stateStacks.forEach(function(stateStack) {
            var state = stateStack[0];
            var nextSymbol = state.rule.symbols[state.dot];
            var symbolDisplay = this.getSymbolDisplay(nextSymbol);
            lines.push("A " + symbolDisplay + " based on:");
            this.displayStateStack(stateStack, lines);
          }, this);
        }
        lines.push("");
        return lines.join("\n");
      };
      Parser5.prototype.displayStateStack = function(stateStack, lines) {
        var lastDisplay;
        var sameDisplayCount = 0;
        for (var j = 0; j < stateStack.length; j++) {
          var state = stateStack[j];
          var display = state.rule.toString(state.dot);
          if (display === lastDisplay) {
            sameDisplayCount++;
          } else {
            if (sameDisplayCount > 0) {
              lines.push("    ^ " + sameDisplayCount + " more lines identical to this");
            }
            sameDisplayCount = 0;
            lines.push("    " + display);
          }
          lastDisplay = display;
        }
      };
      Parser5.prototype.getSymbolDisplay = function(symbol) {
        return getSymbolLongDisplay(symbol);
      };
      Parser5.prototype.buildFirstStateStack = function(state, visited) {
        if (visited.indexOf(state) !== -1) {
          return null;
        }
        if (state.wantedBy.length === 0) {
          return [state];
        }
        var prevState = state.wantedBy[0];
        var childVisited = [state].concat(visited);
        var childResult = this.buildFirstStateStack(prevState, childVisited);
        if (childResult === null) {
          return null;
        }
        return [state].concat(childResult);
      };
      Parser5.prototype.save = function() {
        var column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
      };
      Parser5.prototype.restore = function(column) {
        var index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;
        this.results = this.finish();
      };
      Parser5.prototype.rewind = function(index) {
        if (!this.options.keepHistory) {
          throw new Error("set option `keepHistory` to enable rewinding");
        }
        this.restore(this.table[index]);
      };
      Parser5.prototype.finish = function() {
        var considerations = [];
        var start = this.grammar.start;
        var column = this.table[this.table.length - 1];
        column.states.forEach(function(t) {
          if (t.rule.name === start && t.dot === t.rule.symbols.length && t.reference === 0 && t.data !== Parser5.fail) {
            considerations.push(t);
          }
        });
        return considerations.map(function(c) {
          return c.data;
        });
      };
      function getSymbolLongDisplay(symbol) {
        var type = typeof symbol;
        if (type === "string") {
          return symbol;
        } else if (type === "object") {
          if (symbol.literal) {
            return JSON.stringify(symbol.literal);
          } else if (symbol instanceof RegExp) {
            return "character matching " + symbol;
          } else if (symbol.type) {
            return symbol.type + " token";
          } else if (symbol.test) {
            return "token matching " + String(symbol.test);
          } else {
            throw new Error("Unknown symbol type: " + symbol);
          }
        }
      }
      function getSymbolShortDisplay(symbol) {
        var type = typeof symbol;
        if (type === "string") {
          return symbol;
        } else if (type === "object") {
          if (symbol.literal) {
            return JSON.stringify(symbol.literal);
          } else if (symbol instanceof RegExp) {
            return symbol.toString();
          } else if (symbol.type) {
            return "%" + symbol.type;
          } else if (symbol.test) {
            return "<" + String(symbol.test) + ">";
          } else {
            throw new Error("Unknown symbol type: " + symbol);
          }
        }
      }
      return {
        Parser: Parser5,
        Grammar: Grammar6,
        Rule: Rule2
      };
    });
  }
});

// yamma/server/src/mm/TheoryLoader.ts
__toESM(require_main4());

// yamma/server/src/mm/MmParser.ts
init_browser_shims();
init_browser_shims();

// yamma/server/src/mm/DisjointVarMap.ts
var DisjointVarMap = class {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  /**Adds the two vars (in the right order) to the map */
  add(var1, var2) {
    if (var1 == var2)
      throw new Error("This method should be invoked with distinct vars");
    else {
      const orderedVar1 = var1 < var2 ? var1 : var2;
      const orderedVar2 = var1 < var2 ? var2 : var1;
      let varsDisjointFromOrderedVar1 = this.map.get(orderedVar1);
      if (varsDisjointFromOrderedVar1 == void 0) {
        varsDisjointFromOrderedVar1 = /* @__PURE__ */ new Set();
        this.map.set(orderedVar1, varsDisjointFromOrderedVar1);
      }
      varsDisjointFromOrderedVar1.add(orderedVar2);
    }
  }
  containsDjContraint(var1, var2) {
    const orderedVar1 = var1 < var2 ? var1 : var2;
    const orderedVar2 = var1 < var2 ? var2 : var1;
    const varsDisjointFromOrderedVar1 = this.map.get(orderedVar1);
    const result = varsDisjointFromOrderedVar1 != void 0 && varsDisjointFromOrderedVar1.has(orderedVar2);
    return result;
  }
  /**
  * Disjoint Vars are sorted lexicographically (each constraint is returned as an array with two elements)
  */
  get sortedDisjVarPairs() {
    const pairs = [];
    const sortedVar1 = Array.from(this.map.keys()).sort();
    for (const var1 of sortedVar1) {
      const setOfVarsDisjointFromVar1 = this.map.get(var1);
      if (setOfVarsDisjointFromVar1) {
        const sortedVars2 = Array.from(setOfVarsDisjointFromVar1).sort();
        for (const var2 of sortedVars2) {
          pairs.push([var1, var2]);
        }
      }
    }
    return pairs;
  }
};

// yamma/server/src/mm/Utils.ts
__toESM(require_main4());

// yamma/server/src/grammar/MmLexer.ts
var MmToken = class {
  constructor(value, line, column, type, filePath) {
    this.filePath = filePath;
    this.value = value;
    this.line = line;
    this.column = column;
    this.type = type;
  }
  get range() {
    const start = { line: this.line, character: this.column };
    const end = { line: this.line, character: this.column + this.value.length };
    const range2 = { start, end };
    return range2;
  }
  containsTokenValue(value) {
    return this.value == value;
  }
  clone() {
    throw new Error("Method not implemented.");
  }
  static joinValues(tokens, separator) {
    let result = "";
    for (let i = 0; i < tokens.length; i++) {
      result = result.concat(tokens[i].value);
      if (i < tokens.length - 1)
        result = result.concat(separator);
    }
    return result;
  }
  static fromTokensToStrings(tokens) {
    const result = [];
    tokens.forEach((token) => {
      result.push(token.value);
    });
    return result;
  }
};
var MmLexer = class {
  constructor(workingVars) {
    this.tokens = [];
    // tokenRow: number[] = []
    // tokenColumn: number[] = []
    this.tokenLines = [];
    this.textToTokenize = "";
    this.nextTokenIndex = 0;
    this.workingVars = workingVars;
  }
  reset(data, state) {
    if (state != void 0) {
      this.tokens = state.mmTokens;
      this.nextTokenIndex = state.nextTokenIndex;
    } else {
      this.textToTokenize = data;
      const textLines = this.textToTokenize.split("\n");
      const regExp = /[^\s]+/g;
      for (let i = 0; i < textLines.length; i++) {
        const tokensForCurrentLine = splitToTokens(textLines[i], regExp, i, 0);
        this.tokenLines.push(tokensForCurrentLine);
        this.tokens = this.tokens.concat(tokensForCurrentLine);
      }
      this.nextTokenIndex = 0;
    }
  }
  //#region next
  next() {
    let token;
    if (this.nextTokenIndex < this.tokens.length) {
      token = this.tokens[this.nextTokenIndex++];
      token.type = this.workingVars.tokenType(token.value);
    }
    return token;
  }
  //#endregion next
  /** returns the next token, without advancing the index */
  current() {
    let token;
    if (this.nextTokenIndex < this.tokens.length) {
      token = this.tokens[this.nextTokenIndex];
    }
    return token;
  }
  save() {
    const lexerState = {
      nextTokenIndex: this.nextTokenIndex,
      mmTokens: this.tokens
    };
    return lexerState;
  }
  formatError(_token, _message) {
    return "";
  }
};

// yamma/server/src/mm/Utils.ts
function AreArrayTheSame(array1, array2) {
  return array1.length == array2.length && array1.every(function(element, index) {
    return element === array2[index];
  });
}
function splitToTokens(str, regex, currentLine, fistCharColumn) {
  const result = [];
  let nextMatch;
  nextMatch = regex.exec(str);
  while (nextMatch != null) {
    const tokenColumn = nextMatch.index + fistCharColumn;
    const token = new MmToken(nextMatch[0], currentLine, tokenColumn);
    result.push(token);
    nextMatch = regex.exec(str);
  }
  return result;
}
function splitToTokensDefaultInLine(str, line) {
  const result = splitToTokens(str, /[^\s]+/g, line, 0);
  return result;
}
function splitToTokensAllowingForEmptyValues(str, separator, line, fistCharColumn) {
  const result = [];
  let i = 0;
  let j = 0;
  while (j < str.length) {
    j = str.indexOf(separator, i);
    if (j === -1)
      j = str.length;
    const newToken = new MmToken(str.substring(i, j), line, fistCharColumn + i);
    result.push(newToken);
    i = j + 1;
  }
  return result;
}
function splitToTokensDefault(str) {
  const result = [];
  let nextMatch;
  const regExp = /[^\s]+/g;
  nextMatch = regExp.exec(str);
  while (nextMatch != null) {
    const tokenColumn = nextMatch.index;
    const token = new MmToken(nextMatch[0], 0, tokenColumn);
    result.push(token);
    nextMatch = regExp.exec(str);
  }
  return result;
}
function range(token, line, startCharacter) {
  const startPosition = { line, character: startCharacter };
  const endPosition = { line, character: startCharacter + token.length };
  const result = { start: startPosition, end: endPosition };
  return result;
}
function currentDateTimeWithMilliseconds() {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
  const dateTimeWithMilliseconds = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  return dateTimeWithMilliseconds;
}
function consoleLogWithTimestamp(message) {
  const dateTimeWithMilliseconds = currentDateTimeWithMilliseconds();
  const timeStamp = "[ " + dateTimeWithMilliseconds + " ]";
  const messageWithTimeStamp = timeStamp + " " + message;
  console.log(messageWithTimeStamp);
}
function concatWithSpaces(stringArray) {
  let result = "";
  result = stringArray.join(" ");
  return result;
}
function normalizedFormula(stringArray) {
  const result = " " + concatWithSpaces(stringArray) + " ";
  return result;
}
function concatWithSpacesSkippingStart(skip, stringArray) {
  let result = "";
  if (stringArray.length > skip)
    result = stringArray[skip];
  for (let i = skip + 1; i < stringArray.length; i++)
    result = result + " " + stringArray[i];
  return result;
}
function concatTokenValuesWithSeparator(tokens, separator) {
  let result = "";
  if (tokens.length > 0)
    result = tokens[0].value;
  for (let i = 1; i < tokens.length; i++) {
    result = result + separator + tokens[i].value;
  }
  return result;
}
function concatTokenValuesWithSpaces(tokens) {
  let result = "";
  if (tokens.length > 0)
    result = tokens[0].value;
  for (let i = 1; i < tokens.length; i++) {
    result = result + " " + tokens[i].value;
  }
  return result;
}
function oneCharacterRange(position) {
  const start = position;
  const end = { line: position.line, character: position.character + 1 };
  const range2 = { start, end };
  return range2;
}
var dummyRange = oneCharacterRange({ line: 0, character: 0 });
function rebuildOriginalStringFromTokens(tokens) {
  let result = "";
  if (tokens.length > 0)
    result = " ".repeat(tokens[0].range.start.character) + tokens[0].value;
  for (let i = 0; i < tokens.length - 1; i++) {
    const currentToken = tokens[i + 1];
    const previousToken = tokens[i];
    let spaces;
    if (previousToken.range.end.line < currentToken.range.start.line) {
      result += "\n";
      spaces = " ".repeat(currentToken.range.start.character);
    } else
      spaces = " ".repeat(currentToken.range.start.character - previousToken.range.end.character);
    result += spaces + currentToken.value;
  }
  return result;
}
function doesDiagnosticsContain(diagnostics, errorCode) {
  let containsErrorCode = false;
  let i = 0;
  while (!containsErrorCode && i < diagnostics.length) {
    containsErrorCode ||= diagnostics[i].code == errorCode;
    i++;
  }
  return containsErrorCode;
}
function fromTokensToStrings(tokens) {
  return MmToken.fromTokensToStrings(tokens);
}
function fromStringsToTokens(stringArray) {
  const str = concatWithSpaces(stringArray);
  const tokens = splitToTokensDefault(str);
  return tokens;
}
function arrayRange(tokens) {
  if (tokens.length == 0)
    throw new Error("This function should be invoked only with non empty arrays");
  const start = tokens[0].range.start;
  const end = tokens[tokens.length - 1].range.end;
  const range2 = { start, end };
  return range2;
}
function isInIntersection(element, set) {
  let result = true;
  set.forEach((intersectingSet) => {
    result &&= intersectingSet.has(element);
  });
  return result;
}
function intersection(set) {
  let result;
  if (set.size > 0) {
    result = /* @__PURE__ */ new Set();
    const [firstSet] = set;
    firstSet.forEach((element) => {
      if (isInIntersection(element, set))
        result?.add(element);
    });
  }
  return result;
}
function intersection2(a, b) {
  const set = (/* @__PURE__ */ new Set()).add(a).add(b);
  const result = intersection(set);
  return result;
}
function subset(a, b) {
  const isSubset = Array.from(a).every((val) => b.has(val));
  return isSubset;
}
function union2(a, b) {
  const union = /* @__PURE__ */ new Set([...a, ...b]);
  return union;
}
function difference(a, b) {
  const difference2 = new Set(
    [...a].filter((x) => !b.has(x))
  );
  return difference2;
}
function notifyProgress(current, total, message) {
  const previousPercentageOfWorkDone = Math.trunc((current - 1) * 100 / total);
  const percentageOfWorkDone = Math.trunc(current * 100 / total);
  const completeMessage = percentageOfWorkDone;
  if (previousPercentageOfWorkDone < percentageOfWorkDone)
    consoleLogWithTimestamp(completeMessage + "%");
}

// yamma/server/src/mm/Statements.ts
var Statement = class {
  constructor(parentBlock, comment) {
    this._normalizedComment = "";
    this.ParentBlock = parentBlock;
    this.comment = comment;
    if (parentBlock != void 0)
      if (parentBlock.outermostBlock == void 0)
        this.outermostBlock = parentBlock;
      else
        this.outermostBlock = parentBlock.outermostBlock;
  }
  /** returns the formula as a normalized string: normalized means that
  * between each pair of symbols there will be exactly one character, no matter
  * how the formula was originally written */
  get normalizedComment() {
    if (this._normalizedComment?.length === 0 && this.comment) {
      this._normalizedComment = concatTokenValuesWithSpaces(this.comment);
    }
    return this._normalizedComment;
  }
  get isDiscouraged() {
    if (this._isDiscouraged == void 0)
      this._isDiscouraged = this.normalizedComment.indexOf("(New usage is discouraged.)") != -1;
    return this._isDiscouraged;
  }
};
var ZIStatement = class extends Statement {
  constructor() {
    super(void 0);
  }
};
var ZRStatement = class extends Statement {
  constructor(referencedZ) {
    super(void 0);
    this.referencedZ = referencedZ;
  }
};

// yamma/server/src/mm/BlockStatement.ts
var BlockStatement = class extends Statement {
  // varKinds in not used for parsing, it is used for grammar generation
  //TODO use parentBlock? instead of | null (and remove all the "new" with null in the parameter)
  constructor(parentBlock, mmParser, comment) {
    super(parentBlock, comment);
    // varToKindMap is not strictly necessary for parsing/verifying, but it is used for performance improvement
    // contains the set of kinds defined by $f statements
    this.varKinds = /* @__PURE__ */ new Set();
    this.c = /* @__PURE__ */ new Set();
    this.v = /* @__PURE__ */ new Set();
    this.disjVars = new DisjointVarMap();
    this.fHyps = [];
    this.varToFHypMap = /* @__PURE__ */ new Map();
    this.varToKindMap = /* @__PURE__ */ new Map();
    this.eHyps = [];
    this.labelToStatementMap = /* @__PURE__ */ new Map();
    if (parentBlock == void 0)
      this._nextLabeledStatementNumber = 1;
    this.mmParser = mmParser;
  }
  get nextLabeledStatementNumber() {
    let nextNumber;
    if (this.ParentBlock == void 0)
      nextNumber = this._nextLabeledStatementNumber++;
    else
      nextNumber = this.ParentBlock.nextLabeledStatementNumber;
    return nextNumber;
  }
  isConstantAlreadyDefinedInScope(constant) {
    let isAlreadyPresent = this.c.has(constant);
    if (!isAlreadyPresent && this.ParentBlock != null) {
      isAlreadyPresent = this.ParentBlock.c.has(constant);
    }
    return isAlreadyPresent;
  }
  isVariableAlreadyDefinedInScope(variable) {
    let isAlreadyPresent = this.v.has(variable);
    if (!isAlreadyPresent && this.ParentBlock != null) {
      isAlreadyPresent = this.ParentBlock.v.has(variable);
    }
    return isAlreadyPresent;
  }
  // add a variable in the current block
  add_v(variable) {
    if (this.isConstantAlreadyDefinedInScope(variable)) {
      throw new Error("var already defined as const in scope");
    }
    if (this.isVariableAlreadyDefinedInScope(variable)) {
      throw new Error("var already defined in scope");
    }
    this.v.add(variable);
  }
  add_d(statementContent) {
    for (let i = 0; i < statementContent.length; i++) {
      for (let j = i + 1; j < statementContent.length; j++) {
        this.disjVars.add(statementContent[i].value, statementContent[j].value);
      }
    }
  }
  //adds a constant to the current block
  add_c(constant) {
    if (this.ParentBlock != null)
      throw new Error("constants can only be defined in the outermost scope");
    if (this.isConstantAlreadyDefinedInScope(constant)) {
      throw new Error("const already defined in scope");
    }
    if (this.v.has(constant)) {
      throw new Error("const already defined as var in scope");
    }
    this.c.add(constant);
  }
  // add a variable-type (“floating”) hypothesis
  //addFHyp(variable: string, kind: string, label: string) {
  addFHyp(fHyp) {
    if (!this.isVariableAlreadyDefinedInScope(fHyp.Variable)) {
      throw new Error("var in $f not defined:" + fHyp.Variable);
    }
    if (!this.isConstantAlreadyDefinedInScope(fHyp.Kind)) {
      throw new Error("kind in $f not defined:" + fHyp.Kind);
    }
    this.varToFHypMap.set(fHyp.Variable, fHyp);
    this.fHyps.push(fHyp);
    this.varToKindMap.set(fHyp.Variable, fHyp.Kind);
    if (!this.varKinds.has(fHyp.Kind))
      this.varKinds.add(fHyp.Kind);
  }
  //#region lookup_d
  // private getFirst(x: string, y: string): string {
  //     if (x === y) {
  //         throw new Error("Two different variables are expexted");
  //     }
  //     let first = x;
  //     if (y < x) {
  //         first = y;
  //     }
  //     return first;
  // }
  // private getSecond(x: string, y: string): string {
  //     if (x === y) {
  //         throw new Error("Two different variables are expexted");
  //     }
  //     let second = y;
  //     if (y < x) {
  //         second = x;
  //     }
  //     return second;
  // }
  // returns true if the two variables are
  // declared disjoint in the current frame
  lookup_d(x, y) {
    let areDisjoint = this.disjVars.containsDjContraint(x, y);
    if (!areDisjoint && this.ParentBlock != null)
      areDisjoint = this.ParentBlock.lookup_d(x, y);
    return areDisjoint;
  }
  //#endregion lookup_d
  lookup_v(variable) {
    let isAlreadyPresent = this.v.has(variable);
    if (!isAlreadyPresent && this.ParentBlock != null) {
      isAlreadyPresent = this.ParentBlock.lookup_v(variable);
    }
    return isAlreadyPresent;
  }
  //#region get_mand_vars
  addVar(tok, varArray) {
    if (this.lookup_v(tok)) {
      if (!varArray.includes(tok)) {
        varArray.push(tok);
      }
    }
  }
  get_mand_vars(statement, eHyps) {
    const mand_vars = [];
    statement.forEach((tok) => {
      this.addVar(tok, mand_vars);
    });
    eHyps.forEach((e_hyp) => {
      e_hyp.Content.forEach((tok) => {
        this.addVar(tok.value, mand_vars);
      });
    });
    return mand_vars;
  }
  //#endregion get_mand_vars
  //#region getDisjointVars
  //TODO check why _blockStatement is never used
  //TODO I originally added mandatory vars only, I don't know why (mmverify.py has a function add_d that adds all ordered pairs);
  //now I add also non mandatory vars
  // addDisjointVarsForSingleBlock(mand_vars: string[], _blockStatement: BlockStatement,
  addDisjointVarsForSingleBlock(disjVars) {
    this.disjVars.map.forEach((vars2, var1) => {
      vars2.forEach((var2) => {
        disjVars.add(var1, var2);
      });
    });
    return disjVars;
  }
  //returns the disjoint vars for the mandatory variables, only
  // getDisjointVars(mand_vars: string[]): DisjVars {
  // getDisjointVars(mand_vars: string[]): DisjointVarMap {
  getDisjointVars() {
    const disjVars = new DisjointVarMap();
    this.addDisjointVarsForSingleBlock(disjVars);
    if (this.ParentBlock != void 0)
      this.ParentBlock.addDisjointVarsForSingleBlock(disjVars);
    return disjVars;
  }
  //#endregion getDisjointVars
  mandatoryEHyps() {
    let retMandatoryEHyps = this.eHyps;
    if (this.ParentBlock != void 0) {
      const mandatoryEHypsFromOuterBlocks = this.ParentBlock.mandatoryEHyps();
      retMandatoryEHyps = mandatoryEHypsFromOuterBlocks.concat(retMandatoryEHyps);
    }
    return retMandatoryEHyps;
  }
  //#region mandatoryFHyps
  mandatoryFHyps(mandatoryVariables) {
    let retMandatoryFHyps = [];
    this.fHyps.forEach((fHyp) => {
      if (mandatoryVariables.includes(fHyp.Content[1].value)) {
        retMandatoryFHyps.push(fHyp);
      }
    });
    if (this.ParentBlock != void 0) {
      const mandatoryFHypsFromOuterBlocks = this.ParentBlock.mandatoryFHyps(mandatoryVariables);
      retMandatoryFHyps = mandatoryFHypsFromOuterBlocks.concat(
        retMandatoryFHyps
      );
    }
    return retMandatoryFHyps;
  }
  //TODO use this.varToFHypMap to drammatically speedup this method
  mandatoryFHypsRecursive(mandatoryVariables) {
    let retMandatoryFHyps = [];
    mandatoryVariables.forEach((variable) => {
      const fHyp = this.varToFHypMap.get(variable);
      if (fHyp != void 0)
        retMandatoryFHyps.push(fHyp);
    });
    if (this.ParentBlock != void 0) {
      const mandatoryFHypsFromOuterBlocks = this.ParentBlock.mandatoryFHypsRecursive(mandatoryVariables);
      retMandatoryFHyps = mandatoryFHypsFromOuterBlocks.concat(
        retMandatoryFHyps
      );
    }
    return retMandatoryFHyps;
  }
  /** this version is faster then mandatoryFHyps, but the code is more complex, and
   * the gain doesn't seem to be worthwile, thus we keep using mandatoryFHyps, for the
   * time being
   */
  mandatoryFHypsFasterVersion(mandatoryVariables) {
    const retMandatoryFHyps = this.mandatoryFHypsRecursive(mandatoryVariables);
    retMandatoryFHyps.sort((a, b) => a.statementNumber - b.statementNumber);
    return retMandatoryFHyps;
  }
  //#endregion mandatoryFHyps
  /**
   * returns an $f or an $e statement that was defined in the current
   * scope (but not in the outermost scope: those are handeled by
   * the parser, for better performance)
   * @param label 
   */
  getLabeledStatement(label) {
    let labeledStatement = this.labelToStatementMap.get(label);
    if (labeledStatement == void 0 && this.ParentBlock != void 0)
      labeledStatement = this.labelToStatementMap.get(label);
    return labeledStatement;
  }
  /**
   * returns true if the given kind is "active" in the current block (or in its parent blocks)
   * @param kind 
   */
  hasKind(kind) {
    let hasKind = this.varKinds.has(kind);
    if (!hasKind && this.ParentBlock != null)
      hasKind = this.ParentBlock.hasKind(kind);
    return hasKind;
  }
  /**
   * Returns the kind of the given variable.
   * @param variable 
   */
  kindOf(variable) {
    let kind = this.varToKindMap.get(variable);
    if (kind === void 0 && this.ParentBlock != null) {
      kind = this.ParentBlock.kindOf(variable);
    }
    return kind;
  }
  /**
   * given a set of vars, it returns an array of those vars, in RPN order
   * @param vars 
   */
  getVariablesInRPNorder(vars) {
    const unsortedMap = /* @__PURE__ */ new Map();
    vars.forEach((variable) => {
      const fHyp = this.varToFHypMap.get(variable);
      if (fHyp == void 0)
        throw new Error("this method shoul always be invoked with a set of true variables");
      else
        unsortedMap.set(variable, fHyp.statementNumber);
    });
    const sortedMap = new Map([...unsortedMap.entries()].sort((a, b) => a[1] - b[1]));
    const arrayInRPNorder = Array.from(sortedMap.keys());
    return arrayInRPNorder;
  }
  // /**
  //  * Returns the kind of the given variable.
  //  * This method is not strictly needed, but it is used for performance improvement
  //  * 
  //  * @param variable variable for which the kind has to be returned
  //  */
  // kindOf(variable: string): string {
  //     resu
  // 	throw new Error('Method not implemented.');
  // }
};

// yamma/server/src/mm/Frame.ts
var Frame = class _Frame {
  constructor(assertionStatement) {
    const currentBlock = assertionStatement.ParentBlock;
    this.eHyps = currentBlock.mandatoryEHyps();
    const contentForMandVars = assertionStatement.formula;
    const mand_vars = currentBlock.get_mand_vars(contentForMandVars, this.eHyps);
    this.disjVars = currentBlock.getDisjointVars();
    this.fHyps = currentBlock.mandatoryFHyps(mand_vars);
    this.assertionStatement = assertionStatement;
  }
  static createFrame(assertionStatement) {
    const frame = new _Frame(assertionStatement);
    assertionStatement.frame = frame;
  }
};

// yamma/server/src/mm/LabeledStatement.ts
var import_nearley = __toESM(require_nearley());

// yamma/server/src/mm/NonBlockStatement.ts
var NonBlockStatement = class extends Statement {
  constructor(content, parentBlock, comment) {
    super(parentBlock, comment);
    this._formula = [];
    this._normalizedFormula = "";
    this.Content = content;
  }
  /**
   * Return the content as a string array. If the content contains a proof,
   * it returns only the content BEFORE the proof
   */
  get formula() {
    if (this._formula.length === 0) {
      let i = 0;
      while (i < this.Content.length && this.Content[i].value != "$=") {
        this._formula.push(this.Content[i++].value);
      }
    }
    return this._formula;
  }
  /** returns the formula as a normalized string: normalized means that
   * between each pair of symbols there will be exactly one character, no matter
   * how the formula was originally written */
  get normalizedFormula() {
    if (this._normalizedFormula.length === 0) {
      this._normalizedFormula = normalizedFormula(this.formula);
    }
    return this._normalizedFormula;
  }
};

// yamma/server/src/mm/LabeledStatement.ts
init_browser_shims();
var LabeledStatement = class _LabeledStatement extends NonBlockStatement {
  //#endregion parseNodeForSyntaxAxiom
  constructor(labelToken, content, parentBlock, comment) {
    super(content, parentBlock, comment);
    this.labelToken = labelToken;
    this.emitter = new EventEmitter();
    this.on = this.emitter.on.bind(this.emitter);
    this.emit = this.emitter.emit.bind(this.emitter);
    /** this is set to true when the formula is found to be non parsable
     * this avoids trying to parse it again and again: it's tried only once
     * and if it's not parsable, this is set to true and the parseNode is never set
     * (it remains undefined)
     */
    this.isFormulaMarkedAsNonParsable = false;
    this.Label = labelToken.value;
    this.statementNumber = parentBlock.nextLabeledStatementNumber;
  }
  static parseString(formula, grammar, workingVars) {
    let parseNode;
    grammar.lexer = new MmLexer(workingVars);
    const parser = new import_nearley.Parser(grammar);
    let error;
    try {
      parser.feed(formula);
      parseNode = parser.results[0];
    } catch (err) {
      console.log("Unexpected error! - parseStrArray : " + formula);
      error = err;
    }
    return { parseNode, parser, error };
  }
  // parses a formula, without producing diagnostics
  // we invoke it with theory formulas, thus no error is expected
  // TODO Jul 6 2025: the above part of the comment is not accurate, because the theory formula might be invalid
  // for example, it could happen when a 'weird' $e statement is present even though the .mm file is valid
  // or it could happen when a $a statement contains a non parsable formula (but the .mm file is still valid)
  parseStrArray(theoryFormula, grammar, workingVars) {
    const formula = concatWithSpaces(theoryFormula);
    const parseResult = _LabeledStatement.parseString(formula, grammar, workingVars);
    if (parseResult.error) {
      this.isFormulaMarkedAsNonParsable = true;
      const formulaNonParsableEventArgs = { labeledStatement: this, parseResult };
      this.emit("formulaNonParsable" /* formulaNonParsable */, formulaNonParsableEventArgs);
    }
    return parseResult.parseNode;
  }
  isParseNodeDefined() {
    const isDefined = !!this.parseNode;
    return isDefined;
  }
  get parseNode() {
    if (this._parseNode == void 0 && !this.isFormulaMarkedAsNonParsable)
      this._parseNode = this.parseStrArray(
        this.formula,
        this.outermostBlock.grammar,
        this.outermostBlock.mmParser.workingVars
      );
    return this._parseNode;
  }
  setParseNode(parseNode) {
    this._parseNode = parseNode;
  }
  get logicalVariables() {
    if (this._logicalVariables == void 0 && this.parseNode)
      this._logicalVariables = this.parseNode.logicalVariables(this.outermostBlock);
    return this._logicalVariables;
  }
  //#region parseNodeForSyntaxAxiom
  /**
   *
   * @param strToParse
   * @param grammar
   */
  parseForTypecode(typecode, strToParse, grammar) {
    let parseNode;
    grammar.lexer = new MmLexer(this.outermostBlock.mmParser.workingVars);
    grammar.start = typecode;
    const parser = new import_nearley.Parser(grammar);
    try {
      parser.feed(strToParse);
      parseNode = parser.results[0];
    } catch (error) {
      throw new Error("Unexpected error! - parseForTypecode typecode: " + typecode + " - strToParse:" + strToParse);
    }
    grammar.start = "provable";
    return parseNode;
  }
  /** this should be invoked for SyntaxAxioms. The first symbol is replaced by
   * the provable typecode and then the parse method is invoked
   */
  parseNodeForSyntaxAxiom(grammar) {
    if (this._parseNode == void 0) {
      const typecode = this.formula[0];
      const strToParse = concatWithSpacesSkippingStart(1, this.formula);
      this._parseNode = this.parseForTypecode(typecode, strToParse, grammar);
    }
    return this._parseNode;
  }
};

// yamma/server/src/mm/AssertionStatement.ts
var AssertionStatement = class extends LabeledStatement {
  //#endregion eHypsOrderForStepDerivation
  constructor(labelToken, content, parentBlock, comment) {
    super(labelToken, content, parentBlock, comment);
    this.emptySetOfStrings = /* @__PURE__ */ new Set();
  }
  setEHypsWithAdditionalVariablesToBeUnifiedForStepDerivation() {
    const eHypsOrderForStepDerivation = this.eHypsOrderForStepDerivation;
    if (eHypsOrderForStepDerivation != void 0) {
      let result = 0;
      eHypsOrderForStepDerivation.forEach((eHypOrderForStepDerivation) => {
        if (eHypOrderForStepDerivation.additionalVariablesToBeUnified.size > 0)
          result++;
      });
      this._eHypsWithAdditionalVariablesToBeUnifiedForStepDerivation = result;
    }
  }
  /** the number of EHyps that require additional variables to be unified for step
   * derivation; these EHyps require cycling through all previous proof steps, and then
   * exponential complexity
   */
  get eHypsWithAdditionalVariablesToBeUnifiedForStepDerivation() {
    if (this._eHypsWithAdditionalVariablesToBeUnifiedForStepDerivation == void 0)
      this.setEHypsWithAdditionalVariablesToBeUnifiedForStepDerivation();
    return this._eHypsWithAdditionalVariablesToBeUnifiedForStepDerivation;
  }
  //#endregion eHypsWithAdditionalVariablesToBeUnifiedForStepDerivation
  //#region eHypsOrderForStepDerivation
  //#region setEHypsOrderForStepDerivation
  //#region initializeLogicalVarsInEachFormula
  // private initializeLogicalVarsInAssertionStatement() {
  //     if (this.outermostBlock != undefined)
  //         this.logicalVarsInAssertionStatement = this.parseNode.logicalVariables(this.outermostBlock);
  // }
  // private initializeEHypToLogicalVarsMap() {
  //     if (this.outermostBlock != undefined)
  //         this.frame?.eHyps.forEach((eHyp: EHyp) => {
  //             const logicalVariables: Set<string> = eHyp.parseNode.logicalVariables(this.outermostBlock!);
  //             this.eHypToLogicalVarsMap?.set(eHyp, logicalVariables);
  //         });
  // }
  //#region initializeEHypToNotYetUnifiedLogicalVarsMap
  initializeSingleEHypToNotYetUnifiedLogicalVarsMap(eHyp) {
    const logicalVariablesNotYetUnified = /* @__PURE__ */ new Set();
    if (this.logicalVariables != void 0 && eHyp.logicalVariables != void 0)
      eHyp.logicalVariables.forEach((logicalVariable) => {
        if (!this.logicalVariables.has(logicalVariable)) {
          logicalVariablesNotYetUnified.add(logicalVariable);
        }
      });
    this.eHypToNotYetUnifiedLogicalVarsMap?.set(eHyp, logicalVariablesNotYetUnified);
  }
  /** initializes this.eHypToNotYetUnifiedLogicalVarsMap with all the logical variables
   * in each EHyp, minus the logical variables in the assertion
   */
  initializeEHypToNotYetUnifiedLogicalVarsMap() {
    this.eHypToNotYetUnifiedLogicalVarsMap = /* @__PURE__ */ new Map();
    this.frame?.eHyps.forEach((eHyp) => {
      this.initializeSingleEHypToNotYetUnifiedLogicalVarsMap(eHyp);
    });
  }
  //#endregion initializeEHypToNotYetUnifiedLogicalVarsMap
  initializeLogicalVarsInEachFormula() {
    this.initializeEHypToNotYetUnifiedLogicalVarsMap();
  }
  //#endregion initializeLogicalVarsInEachFormula
  //#region setEHypOrderForStepDerivation
  //#region getIndexesWithNoVarsToBeUnified
  getIndexesWithNoVarsToBeUnified(indexesNotAddedYet) {
    const indexesWithNoVarsToBeUnified = [];
    indexesNotAddedYet.forEach((eHypIndex) => {
      const eHyp = this.frame.eHyps[eHypIndex];
      const logicalVarsNotYetUnified = this.eHypToNotYetUnifiedLogicalVarsMap.get(eHyp);
      if (logicalVarsNotYetUnified.size == 0)
        indexesWithNoVarsToBeUnified.push(eHypIndex);
    });
    return indexesWithNoVarsToBeUnified;
  }
  //#endregion getIndexesWithNoVarsToBeUnified
  //#region setEHypsOrderForIndexesWithNoVarsToBeUnified
  /** sorts descending */
  // private compareFormulaLengthDescending(i: number, j: number): number {
  //     if (this.frame == undefined)
  //         i++;
  //     const eHyp1: EHyp = this.frame!.eHyps[i];
  //     const eHyp2: EHyp = this.frame!.eHyps[j];
  //     const formulaLengh1: number = eHyp1.formula.length;
  //     const formulaLengh2: number = eHyp2.formula.length;
  //     // sorts descending
  //     const result = formulaLengh2 - formulaLengh1;
  //     return result;
  // }
  sortIndexesWithNoVarsToBeUnifiedByFormulaLenghtDescending(indexesNotAddedYet) {
    indexesNotAddedYet.sort((i, j) => {
      const eHyp1 = this.frame.eHyps[i];
      const eHyp2 = this.frame.eHyps[j];
      const formulaLengh1 = eHyp1.formula.length;
      const formulaLengh2 = eHyp2.formula.length;
      const result = formulaLengh2 - formulaLengh1;
      return result;
    });
  }
  //#region setEHypOrder
  removeAdditionalVarsUnified(additionalVariablesJustUnified, indexesNotAddedYet) {
    indexesNotAddedYet.forEach((i) => {
      const eHypNotAddedYet = this.frame.eHyps[i];
      const notYetUnifiedLogicalVars = this.eHypToNotYetUnifiedLogicalVarsMap.get(eHypNotAddedYet);
      if (notYetUnifiedLogicalVars.size > 0)
        additionalVariablesJustUnified.forEach((logicalVariable) => {
          notYetUnifiedLogicalVars.delete(logicalVariable);
        });
    });
  }
  setEHypOrder(eHypIndex, additionalVariablesToBeUnified, indexesNotAddedYet) {
    const eHypOrderForStepDerivation = {
      additionalVariablesToBeUnified,
      eHypIndex
    };
    this._eHypsOrderForStepDerivation?.push(eHypOrderForStepDerivation);
    const index = indexesNotAddedYet.indexOf(eHypIndex);
    indexesNotAddedYet.splice(index, 1);
    if (additionalVariablesToBeUnified.size > 0)
      this.removeAdditionalVarsUnified(additionalVariablesToBeUnified, indexesNotAddedYet);
  }
  //#endregion setEHypOrder
  setEHypsOrderForIndexesWithNoVarsToBeUnified(indexesWithNoVarsToBeUnified, indexesNotAddedYet) {
    this.sortIndexesWithNoVarsToBeUnifiedByFormulaLenghtDescending(indexesNotAddedYet);
    indexesWithNoVarsToBeUnified.forEach((eHypIndex) => {
      this.setEHypOrder(eHypIndex, this.emptySetOfStrings, indexesNotAddedYet);
    });
  }
  //#endregion setEHypsOrderForIndexesWithNoVarsToBeUnified
  //#region pickOneEHypWithMaximalNumberOfAdditionalVarsToBeUnified
  /** eHyps with the largest number of additional variables to be unfied, are
   * tried first; when two EHyps have the same number of additional variables to be unified,
   * the longest is tried, first
   */
  sortIndexesNotAddedYetByAdditionalVarsAndLength(indexesNotAddedYet) {
    indexesNotAddedYet.sort((i, j) => {
      const additionalVarsToBeUnifiedi = this.getAdditionalVariablesToBeUnified(i);
      const additionalVarsToBeUnifiedj = this.getAdditionalVariablesToBeUnified(j);
      const numberOfAdditionalVarsToBeUnifiedi = additionalVarsToBeUnifiedi.size;
      const numberOfAdditionalVarsToBeUnifiedj = additionalVarsToBeUnifiedj.size;
      let result = numberOfAdditionalVarsToBeUnifiedj - numberOfAdditionalVarsToBeUnifiedi;
      if (result == 0) {
        const eHypi = this.frame.eHyps[i];
        const eHypj = this.frame.eHyps[j];
        result = eHypj.formula.length - eHypi.formula.length;
      }
      return result;
    });
  }
  getAdditionalVariablesToBeUnified(eHypIndex) {
    const eHyp = this.frame.eHyps[eHypIndex];
    const additionalVariablesToBeUnified = this.eHypToNotYetUnifiedLogicalVarsMap.get(eHyp);
    return additionalVariablesToBeUnified;
  }
  // private compareNumberOfAdditionalVarsToBeUnifiedDescending(i: number, j: number): number {
  //     const additionalVarsToBeUnified1: Set<string> = this.getAdditionalVariablesToBeUnified(i);
  //     const additionalVarsToBeUnified2: Set<string> = this.getAdditionalVariablesToBeUnified(j);
  //     const numberOfAdditionalVarsToBeUnified1: number = additionalVarsToBeUnified1.size;
  //     const numberOfAdditionalVarsToBeUnified2: number = additionalVarsToBeUnified2.size;
  //     // sorts descending
  //     const result = numberOfAdditionalVarsToBeUnified2 - numberOfAdditionalVarsToBeUnified1;
  //     return result;
  // }
  pickOneEHypWithMaximalNumberOfAdditionalVarsToBeUnified(indexesNotAddedYet) {
    this.sortIndexesNotAddedYetByAdditionalVarsAndLength(indexesNotAddedYet);
    const eHypIndex = indexesNotAddedYet[0];
    const additionalVariablesToBeUnified = this.getAdditionalVariablesToBeUnified(eHypIndex);
    this.setEHypOrder(eHypIndex, additionalVariablesToBeUnified, indexesNotAddedYet);
  }
  //#endregion pickOneEHypWithMaximalNumberOfAdditionalVarsToBeUnified
  setEHypOrderForStepDerivation(indexesNotAddedYet) {
    const indexesWithNoVarsToBeUnified = this.getIndexesWithNoVarsToBeUnified(indexesNotAddedYet);
    if (indexesWithNoVarsToBeUnified.length > 0)
      this.setEHypsOrderForIndexesWithNoVarsToBeUnified(indexesWithNoVarsToBeUnified, indexesNotAddedYet);
    else
      this.pickOneEHypWithMaximalNumberOfAdditionalVarsToBeUnified(indexesNotAddedYet);
  }
  //#endregion setEHypOrderForStepDerivation
  setEHypsOrderForStepDerivation() {
    if (this.frame != void 0) {
      this.initializeLogicalVarsInEachFormula();
      const numOfEHyps = this.frame.eHyps.length;
      this._eHypsOrderForStepDerivation = [];
      const indexesNotAddedYet = Array.from(Array(numOfEHyps).keys());
      while (this._eHypsOrderForStepDerivation.length < numOfEHyps) {
        this.setEHypOrderForStepDerivation(indexesNotAddedYet);
      }
    }
  }
  //#endregion setEHypsOrderForStepDerivation
  /** the suggested order to try step derivation; the goal is to
   * have fast failure if no derivation is possible. From heuristics,
   * we first try the longest ones. Furthermore, EHyps with all logical vars
   * substituted are tried first, because they can be addressed using maps (from
   * formulas to MmpProofStep's; assuming the MmpProofStep to be derived
   * has no working vars)
   */
  get eHypsOrderForStepDerivation() {
    if (this._eHypsOrderForStepDerivation == void 0)
      this.setEHypsOrderForStepDerivation();
    return this._eHypsOrderForStepDerivation;
  }
  // returns the mandatory vars for the current AssertionStatement
  mandatoryVars(outermostrBlock) {
    const mandatoryVars = outermostrBlock.get_mand_vars(this.formula, this.frame.eHyps);
    const result = new Set(mandatoryVars);
    return result;
  }
};

// yamma/server/src/mm/AxiomStatement.ts
var AxiomStatement = class extends AssertionStatement {
};

// yamma/server/src/mm/ProvableStatement.ts
var ProvableStatement = class extends AssertionStatement {
  constructor(labelToken, content, parentBlock, comment) {
    super(labelToken, content, parentBlock, comment);
    this.isProofVerified = false;
    this.isProofVerificationFailed = false;
  }
  get proofTokens() {
    if (this._proofTokens == void 0) {
      this._proofTokens = [];
      let hasProofBegun = false;
      this.Content.forEach((token) => {
        if (hasProofBegun)
          this._proofTokens.push(token);
        if (token.value == "$=")
          hasProofBegun = true;
      });
    }
    return this._proofTokens;
  }
  get compressedProofLabelsTokens() {
    if (this.proofTokens[0].value != "(") {
      this._compressedProofLabelsTokens = [];
      throw new Error("This method should be called for compressed proofs only!");
    } else if (this._compressedProofLabelsTokens == void 0) {
      this._compressedProofLabelsTokens = [];
      let i = 1;
      while (this.proofTokens[i].value != ")" && i < this.proofTokens.length) {
        this._compressedProofLabelsTokens.push(this.proofTokens[i]);
        i++;
      }
    }
    return this._compressedProofLabelsTokens;
  }
  //TODO1 use a private var and then proofTokens
  get Proof() {
    const proof = [];
    let hasProofBegun = false;
    this.Content.forEach((token) => {
      if (hasProofBegun)
        proof.push(token.value);
      if (token.value == "$=")
        hasProofBegun = true;
    });
    return proof;
  }
  get compressedProofString() {
    if (this._compressedProofString == void 0) {
      const proof = this.Proof;
      const closeParenthesisIndex = proof.lastIndexOf(")");
      this._compressedProofString = "";
      if (closeParenthesisIndex != -1)
        for (let index = closeParenthesisIndex + 1; index < proof.length; index++) {
          this._compressedProofString += proof[index];
        }
    }
    return this._compressedProofString;
  }
  get CompressedProofLabels() {
    const proofStrings = this.Proof;
    if (proofStrings[0] != "(") {
      throw new Error("This method should be called for compressed proofs only!");
    }
    const closingParIndex = this.Proof.indexOf(")");
    const proofLabels = proofStrings.slice(1, closingParIndex);
    return proofLabels;
  }
  get isUnproven() {
    return this.Proof.length == 1 && this.Proof[0] == "?";
  }
  get hasCompressedProof() {
    return this.Proof.length > 1 && this.Proof[0] == "(";
  }
};

// yamma/server/src/mm/Verifier.ts
var import_vscode_languageserver2 = __toESM(require_main4());

// yamma/server/src/mmp/ProofCompressor.ts
var ProofCompressor = class _ProofCompressor {
  constructor(diagnostics) {
    this.diagnostics = diagnostics;
    this.failed = false;
  }
  //#region DecompressProof
  //#region getDecompressedInts
  static getDecompressedIntsFromString(compressedString) {
    const decompressedInts = [];
    const charCodeA = "A".charCodeAt(0);
    const charCodeT = "T".charCodeAt(0);
    let numStart = 0;
    while (numStart < compressedString.length) {
      let numNext = numStart;
      while (compressedString[numNext] > "T") {
        numNext++;
      }
      let val = 0;
      for (let i = numStart; i < numNext; i++) {
        const curChCode = compressedString.charCodeAt(i);
        val += 4 * Math.pow(5, numNext - i) * (curChCode - charCodeT);
      }
      val += compressedString.charCodeAt(numNext++) - charCodeA + 1;
      decompressedInts.push(val);
      if (compressedString.length > numNext && compressedString[numNext] == "Z") {
        numNext++;
        decompressedInts.push(0);
      }
      numStart = numNext;
    }
    return decompressedInts;
  }
  getDecompressedInts(provableStatement) {
    const compressedString = provableStatement.compressedProofString;
    const decompressedInts = _ProofCompressor.getDecompressedIntsFromString(compressedString);
    return decompressedInts;
  }
  //#endregion getDecompressedInts
  //#region getDecompressedProof
  addDiagnosticForNotALabelForAssertion(provableStatement, labelIndex) {
    const labelToken = provableStatement.compressedProofLabelsTokens[labelIndex];
    const message = `Theorem ${provableStatement.Label} : '${labelToken.value}' is not the label of an assertion or optional hypothesis`;
    MmParser.addDiagnosticError(
      message,
      labelToken.range,
      "notALabelOfAssertionOrOptionalHyp" /* notALabelOfAssertionOrOptionalHyp */,
      this.diagnostics,
      provableStatement.Label,
      labelToken.filePath
    );
    this.failed = true;
  }
  addDiagnosticForLabelOfAProvableStatementWithFailedVerification(provableStatement, labelIndex) {
    const labelToken = provableStatement.compressedProofLabelsTokens[labelIndex];
    const message = `Theorem ${provableStatement.Label} : Provable statement ${labelToken.value} is in the theory, but its verification failed`;
    MmParser.addDiagnosticError(
      message,
      labelToken.range,
      "labelOfAProvableStatementWithFailedVerification" /* labelOfAProvableStatementWithFailedVerification */,
      this.diagnostics,
      provableStatement.Label,
      labelToken.filePath
    );
  }
  // adds the labels of the mandatory hyps ad the beginning of the proof labels
  getDecompressedProof(provableStatement, decompressed_ints, labelToStatementMap) {
    const frame = provableStatement.frame;
    const fHypCount = frame.fHyps.length;
    const eHypCount = frame.eHyps.length;
    const proofLabels = provableStatement.CompressedProofLabels;
    const labelCount = proofLabels.length;
    const zCount = decompressed_ints.filter((i) => i === 0).length;
    const decompressedProof = [];
    let statement;
    let h = 0;
    while (!this.failed && h < decompressed_ints.length) {
      const j = decompressed_ints[h];
      let i = j;
      if (i === 0) {
        statement = new ZIStatement();
      } else {
        i -= 1;
        if (i < fHypCount) {
          statement = frame.fHyps[i];
        } else {
          if (i < fHypCount + eHypCount) {
            statement = frame.eHyps[i - fHypCount];
          } else {
            i -= fHypCount + eHypCount;
            if (i < labelCount) {
              const currentLabel = proofLabels[i];
              statement = Verifier.getProofStatement(
                currentLabel,
                labelToStatementMap,
                provableStatement.ParentBlock
              );
              if (statement == void 0)
                this.addDiagnosticForNotALabelForAssertion(provableStatement, i);
              else if (statement instanceof ProvableStatement && statement.isProofVerificationFailed)
                this.addDiagnosticForLabelOfAProvableStatementWithFailedVerification(
                  provableStatement,
                  i
                );
            } else {
              i -= labelCount;
              if (i < zCount) {
                statement = new ZRStatement(i);
              } else {
                this.failed = true;
              }
            }
          }
        }
      }
      if (statement instanceof Statement)
        decompressedProof.push(statement);
      h++;
    }
    return decompressedProof;
  }
  //#endregion getDecompressedProof
  /** it tries to decompress the proof of a ProvableStatement; it will set the value of the failed property;
   * it will return diagnostics if error are encountered
  */
  DecompressProof(provableStatement, labelToStatementMap) {
    this.failed = false;
    const decompressed_ints = this.getDecompressedInts(provableStatement);
    const decompressedProof = this.getDecompressedProof(provableStatement, decompressed_ints, labelToStatementMap);
    return decompressedProof;
  }
  //#endregion DecompressProof
};

// yamma/server/src/mm/FHyp.ts
var FHyp = class extends LabeledStatement {
  constructor(label, content, parentBlock, comment) {
    if (content.length !== 2) {
      throw new Error("An f hyp expects two strings");
    }
    super(label, content, parentBlock, comment);
  }
  get Variable() {
    return this.Content[1].value;
  }
  get Kind() {
    return this.Content[0].value;
  }
};

// yamma/server/src/mm/EHyp.ts
var EHyp = class extends LabeledStatement {
  constructor(labelToken, content, parentBlock, comment) {
    super(labelToken, content, parentBlock, comment);
  }
};

// yamma/server/src/mm/Verifier.ts
var Verifier = class _Verifier {
  constructor(diagnostics) {
    this.diagnostics = diagnostics;
    this.verificationFailed = false;
  }
  addDiagnosticError(message, assertionStatement, code, range2) {
    if (!this.verificationFailed) {
      const completeMessage = `Theorem ${assertionStatement.Label} : ${message}`;
      const diagnosticRange = range2 != void 0 ? range2 : assertionStatement.labelToken.range;
      const diagnostic = {
        severity: import_vscode_languageserver2.DiagnosticSeverity.Error,
        message: completeMessage,
        range: diagnosticRange,
        code,
        provableStatementLabel: assertionStatement.Label,
        mmFilePath: assertionStatement.labelToken.filePath
      };
      this.diagnostics.push(diagnostic);
      this.verificationFailed = true;
    }
  }
  //#region verifyDecompressedProof
  //#region verifyAxiomStatement
  fHypsStack(frame, stack) {
    const stackFHyps = [];
    const fHypsCount = frame.fHyps.length;
    const eHypsCount = frame.eHyps.length;
    for (let i = stack.length - eHypsCount - fHypsCount; i < stack.length - eHypsCount; i++)
      stackFHyps.push(stack[i]);
    return stackFHyps;
  }
  eHypsStack(frame, stack) {
    const stackEHyps = [];
    const eHypsCount = frame.eHyps.length;
    for (let i = stack.length - eHypsCount; i < stack.length; i++)
      stackEHyps.push(stack[i]);
    return stackEHyps;
  }
  buildSubstitution(frameFHyps, fHypsStack, assertionStatement) {
    const substitution = /* @__PURE__ */ new Map();
    for (let i = 0; i < frameFHyps.length; i++) {
      if (frameFHyps[i].Kind == fHypsStack[i][0])
        substitution.set(frameFHyps[i].Variable, fHypsStack[i].slice(1));
      else if (assertionStatement != void 0) {
        const message = `stack entry doesn't match the kind of the mandatory var number ${i}. The current value on the stack is '${fHypsStack[i][0]} . The $f hyp variable is ${frameFHyps[i].Variable} and the expected kind is ${frameFHyps[i].Kind} .`;
        const code = "eHypDoesntMatchTheStackEntry" /* eHypDoesntMatchTheStackEntry */;
        this.addDiagnosticError(message, assertionStatement, code);
      }
    }
    return substitution;
  }
  //#region checkDisjointViolation
  //returns 
  //  varsInMandatoryDHyp(statementContent: string[], frameFHyps: FHyp[]): Set<string> {
  //     const vars: Set<string> = new Set<string>();
  //     statementContent.forEach((symbol: string) => {
  //         frameFHyps.forEach(frameFHyp => {
  //             if (frameFHyp.Content[1] === symbol)
  //                 vars.add(symbol);
  //         });
  //     });
  //     return vars;
  // }
  selectVars(statementContent, parentBlock) {
    const vars = /* @__PURE__ */ new Set();
    statementContent.forEach((symbol) => {
      const isVar = parentBlock.lookup_v(symbol);
      if (isVar)
        vars.add(symbol);
    });
    return vars;
  }
  checkDisjointViolation1(provableStatement, frameProofStep, disjVar1, disjVar2, substitution1, substitution2) {
    const parentBlock = provableStatement.ParentBlock;
    const xVars = this.selectVars(substitution1, parentBlock);
    const yVars = this.selectVars(substitution2, parentBlock);
    xVars.forEach((x) => {
      if (yVars.has(x))
        throw new Error("Disjoint violation for " + disjVar1 + ", " + disjVar2 + "(" + x + ")");
    });
    xVars.forEach(
      (xVar) => {
        yVars.forEach(
          (yVar) => {
            if (!parentBlock.lookup_d(xVar, yVar)) {
              const message = `There is a disjoint variable ($d) violation at proof step <TODO>.  Assertion ${frameProofStep.assertionStatement.Label} requires that variables  ${disjVar1} and ${disjVar2} be disjoint.  But ${disjVar1} was substituted with ${concatWithSpaces(substitution1)} and ${disjVar2} was substituted with ${concatWithSpaces(substitution2)}. Variables ${xVar} and ${yVar} do not have a disjoint variable requirement in the assertion being proved, ${provableStatement.Label}`;
              const code = "missingDjVarsStatement" /* missingDjVarsStatement */;
              this.addDiagnosticError(message, provableStatement, code);
            }
          }
        );
      }
    );
  }
  checkDisjointViolation(provableStatement, frameProofStep, substitution) {
    frameProofStep.disjVars.map.forEach((vars2, var1) => {
      vars2.forEach((var2) => {
        const substitution1 = substitution.get(var1);
        const substitution2 = substitution.get(var2);
        if (substitution1 != void 0 && substitution2 != void 0)
          this.checkDisjointViolation1(provableStatement, frameProofStep, var1, var2, substitution1, substitution2);
      });
    });
  }
  //#endregion checkDisjointViolation
  applySubstitution(symbolList, substitution) {
    const result = [];
    symbolList.forEach((symbol) => {
      const symbolSubstitution = substitution.get(symbol);
      if (symbolSubstitution === void 0)
        result.push(symbol);
      else
        result.push(...symbolSubstitution);
    });
    return result;
  }
  //#region checkSubstitutionForStakEHyps
  checkSubstitutionForStakEHyps1(currentEHypInTheStack, frameEHyp, substitution, assertionStatement) {
    const frameEHypWithSubstitution = this.applySubstitution(
      frameEHyp,
      substitution
    );
    const areTheSame = AreArrayTheSame(currentEHypInTheStack, frameEHypWithSubstitution);
    if (!areTheSame) {
      const message = `$e hypothesis doesn't match stack entry. The current hypothesis on the stack is '${concatWithSpaces(currentEHypInTheStack)} . The $e hyp with substitution is ${concatWithSpaces(frameEHypWithSubstitution)} .`;
      const code = "eHypDoesntMatchTheStackEntry" /* eHypDoesntMatchTheStackEntry */;
      this.addDiagnosticError(message, assertionStatement, code);
    }
    return areTheSame;
  }
  checkSubstitutionForStakEHyps(eHypsStack, frameEHyps, substitution, assertionStatement) {
    for (let i = 0; i < frameEHyps.length; i++)
      this.checkSubstitutionForStakEHyps1(
        eHypsStack[i],
        frameEHyps[i].formula,
        substitution,
        assertionStatement
      );
  }
  //#endregion
  verifyAssertionStatementActually(assertionStatement, assertionStatementProofStep, stack) {
    const frameProofStep = assertionStatementProofStep.frame;
    const popCount = frameProofStep.fHyps.length + frameProofStep.eHyps.length;
    if (popCount > stack.length) {
      const errorMessage = `Stack underflow. The stack has ${stack.length} items, but the proof step ${assertionStatementProofStep.Label} requires ${popCount} items to be popped.`;
      this.addDiagnosticError(
        errorMessage,
        assertionStatement,
        "stackUnderflow" /* stackUnderflow */,
        assertionStatement.labelToken.range
      );
    } else {
      const fHypsStack = this.fHypsStack(frameProofStep, stack);
      const eHypsStack = this.eHypsStack(frameProofStep, stack);
      const substitution = this.buildSubstitution(frameProofStep.fHyps, fHypsStack, assertionStatement);
      this.checkDisjointViolation(assertionStatement, frameProofStep, substitution);
      this.checkSubstitutionForStakEHyps(
        eHypsStack,
        frameProofStep.eHyps,
        substitution,
        assertionStatement
      );
      for (let i = 0; i < popCount; i++)
        stack.pop();
      const assertionStatementWithSubstitution = this.applySubstitution(
        assertionStatementProofStep.formula,
        substitution
      );
      stack.push(assertionStatementWithSubstitution);
    }
  }
  verifyAssertionStatement(assertionStatement, assertionStatementProofStep, stack) {
    if (assertionStatementProofStep instanceof ProvableStatement && assertionStatementProofStep.isProofVerificationFailed) {
      this.verificationFailed = true;
    } else
      this.verifyAssertionStatementActually(
        assertionStatement,
        assertionStatementProofStep,
        stack
      );
  }
  //#endregion verifyAxiomStatement
  verifyDecompressedProof(provableStatement, proof) {
    const stack = [];
    const stored = [];
    proof.forEach((statement) => {
      if (statement instanceof FHyp) {
        stack.push(statement.formula);
      } else if (statement instanceof EHyp) {
        stack.push(statement.formula);
      } else if (statement instanceof ZIStatement) {
        stored.push(stack[stack.length - 1]);
      } else if (statement instanceof ZRStatement) {
        stack.push(stored[statement.referencedZ]);
      } else if (statement instanceof AssertionStatement)
        this.verifyAssertionStatement(
          provableStatement,
          statement,
          stack
        );
    });
    if (stack.length === 0)
      throw new Error("Stack is empty at end of proof.");
    else if (stack.length > 1) {
      const message = `Stack has more than one item at end of proof.`;
      const code = "stackHasMoreThanOneItemAtEndOfProof" /* stackHasMoreThanOneItemAtEndOfProof */;
      this.addDiagnosticError(message, provableStatement, code);
    }
    const stackOnlyElement = stack.pop();
    const contentBeforeTheProof = provableStatement.formula;
    const areEqual = AreArrayTheSame(stackOnlyElement, contentBeforeTheProof);
    if (!areEqual) {
      const message = `Assertion proven doesn't match. Expected: ${concatWithSpaces(contentBeforeTheProof)} , proven: ${concatWithSpaces(stackOnlyElement)} `;
      const code = "assertionProvenDoesntMatch" /* assertionProvenDoesntMatch */;
      this.addDiagnosticError(message, provableStatement, code);
    }
  }
  //#region GetProofStatements
  static getProofStatement(label, labelToStatementMap, currentBlock) {
    let labeledStatement = labelToStatementMap.get(label);
    if (labeledStatement === void 0)
      labeledStatement = currentBlock.getLabeledStatement(label);
    return labeledStatement;
  }
  static GetProofStatements(proofStrings, labelToStatementMap, currentBlock) {
    const proofStatements = [];
    proofStrings.forEach((label) => {
      const labeledStatement = this.getProofStatement(
        label,
        labelToStatementMap,
        currentBlock
      );
      if (labeledStatement === void 0) {
        throw new Error("no previous statement has label " + label);
      } else {
        proofStatements.push(labeledStatement);
      }
    });
    return proofStatements;
  }
  //#endregion GetProofStatements
  //#region getDecompressedProof
  addDiagnosticForMissingCompressedProofString(provableStatement, proofStrings) {
    const lastToken = provableStatement.Content[provableStatement.Content.length - 1];
    const range2 = lastToken.range;
    if (proofStrings.indexOf(")") == -1) {
      const message = `The $p statement ${provableStatement.Label} does not contain a ')' token`;
      const code = "missingCloseParenthesisInPStatement" /* missingCloseParenthesisInPStatement */;
      this.addDiagnosticError(message, provableStatement, code, range2);
    } else {
      const message = `The $p statement ${provableStatement.Label} does not contain a compressed proof string between ')' and '$.'`;
      const code = "assertionProvenDoesntMatch" /* assertionProvenDoesntMatch */;
      this.addDiagnosticError(message, provableStatement, code, range2);
    }
  }
  decompressExistingProofString(provableStatement, labelToStatementMap) {
    const proofCompressor = new ProofCompressor(this.diagnostics);
    const proof = proofCompressor.DecompressProof(provableStatement, labelToStatementMap);
    if (proofCompressor.failed) {
      const message = `The proof of ${provableStatement.Label} , cannot be uncompressed`;
      const code = "assertionProvenDoesntMatch" /* assertionProvenDoesntMatch */;
      this.addDiagnosticError(message, provableStatement, code);
    }
    return proof;
  }
  getDecompressedProof(provableStatement, proofStrings, labelToStatementMap) {
    let proof;
    if (provableStatement.compressedProofString == "")
      this.addDiagnosticForMissingCompressedProofString(provableStatement, proofStrings);
    else
      proof = this.decompressExistingProofString(provableStatement, labelToStatementMap);
    return proof;
  }
  //#endregion getDecompressedProof
  setVerificationStatus(provableStatement) {
    provableStatement.isProofVerified = !this.verificationFailed;
    provableStatement.isProofVerificationFailed = this.verificationFailed;
  }
  verify(provableStatement, proofStrings, labelToStatementMap) {
    let proof;
    if (proofStrings[0] === "(")
      proof = this.getDecompressedProof(provableStatement, proofStrings, labelToStatementMap);
    else
      proof = _Verifier.GetProofStatements(
        proofStrings,
        labelToStatementMap,
        provableStatement.ParentBlock
      );
    if (!this.verificationFailed)
      this.verifyDecompressedProof(provableStatement, proof);
    this.setVerificationStatus(provableStatement);
  }
};

// yamma/server/src/grammar/GrammarManager.ts
var import_nearley2 = __toESM(require_nearley());

// yamma/server/src/grammar/ParseNode.ts
var InternalNode = class _InternalNode {
  constructor(label, kind, parseNodes) {
    this.label = label;
    this.kind = kind;
    this.parseNodes = parseNodes;
  }
  /** true iff this node represents an $f statement */
  isNodeForFStatement(logicalVars) {
    const result = this.parseNodes.length == 1 && this.parseNodes[0] instanceof MmToken && logicalVars.has(this.parseNodes[0].value);
    return result;
  }
  /**
   * if this InternalNode is the parsing node of an $f statement, it
   * returns the label of the the $f statement; undefined otherwise
   */
  labelForFStatement(logicalVars) {
    let label;
    if (this.isNodeForFStatement(logicalVars)) {
      label = this.label;
    }
    return label;
  }
  get stringFormula() {
    const result = GrammarManager.buildStringFormula(this);
    return result;
  }
  get cachedStringFormula() {
    if (this._cachedStringFormula == void 0)
      this._cachedStringFormula = this.stringFormula;
    return this._cachedStringFormula;
  }
  //#region rpnRepresentation
  childrenRepresentation(parseNodes) {
    let output = "";
    parseNodes.forEach((parseNode) => {
      if (parseNode instanceof _InternalNode)
        output += parseNode.rpnRepresentation;
    });
    return output;
  }
  get rpnRepresentation() {
    const childrenRepresentation = this.childrenRepresentation(this.parseNodes);
    let output;
    if (childrenRepresentation.length == 0)
      output = this.label;
    else
      output = childrenRepresentation + " " + this.label;
    return output;
  }
  //#endregion rpnRepresentation
  // returns a string RPN representation of the node
  get cachedRpnRepresentation() {
    if (this._cachedStringRepresentation == void 0)
      this._cachedStringRepresentation = this.rpnRepresentation;
    return this._cachedStringRepresentation;
  }
  /**
   * returns the set (populated in RPN order) of the labels of the mandatory
   * $f statements for the current parse node
   */
  fStatementLabels(logicalVars) {
    const result = /* @__PURE__ */ new Set();
    this.parseNodes.forEach((parseNode) => {
      if (parseNode instanceof _InternalNode) {
        const subLabels = parseNode.fStatementLabels(logicalVars);
        subLabels.forEach((label) => {
          result.add(label);
        });
      }
    });
    const labelForFStatement = this.labelForFStatement(logicalVars);
    if (labelForFStatement != void 0)
      result.add(labelForFStatement);
    return result;
  }
  /**
   * true iff any of the nodes in the subtree is a MmToken that has the given value
   * @param value 
   */
  containsTokenValue(value) {
    let i = 0;
    let containsTokenValue = false;
    while (!containsTokenValue && i < this.parseNodes.length) {
      containsTokenValue = this.parseNodes[i].containsTokenValue(value);
      i++;
    }
    return containsTokenValue;
  }
  /**
   * Returns the set of alla tokens with value in the given symbols set
   * @param logicalVariables
   */
  mmTokensContaining(symbols) {
    let result = /* @__PURE__ */ new Set();
    this.parseNodes.forEach((parseNode) => {
      if (parseNode instanceof MmToken) {
        if (symbols.has(parseNode.value))
          result = result.add(parseNode);
      } else {
        const subNodeTokens = parseNode.mmTokensContaining(symbols);
        subNodeTokens.forEach((token) => {
          result.add(token);
        });
      }
    });
    return result;
  }
  /**
   * Returns the set of alla tokens values within the given symbols' set
   * @param symbols 
   */
  symbolsSubsetOf(symbols) {
    let result = /* @__PURE__ */ new Set();
    this.parseNodes.forEach((parseNode) => {
      if (parseNode instanceof MmToken) {
        if (symbols.has(parseNode.value))
          result = result.add(parseNode.value);
      } else {
        const subNodeResult = parseNode.symbolsSubsetOf(symbols);
        subNodeResult.forEach((symbol) => {
          result.add(symbol);
        });
      }
    });
    return result;
  }
  /** the logical variables contained in this parse node */
  logicalVariables(outermostBlockStatement) {
    const result = this.symbolsSubsetOf(outermostBlockStatement.v);
    return result;
  }
  // get proofArrayWithoutAnySubstitution(): UProofStatementStep[] {
  // 	const proof: UProofStatementStep[] = [];
  // 	this.parseNodes.forEach((child: ParseNode) => {
  // 		if (child instanceof InternalNode) {
  // 			const childProof: UProofStatementStep[] = child.proofArrayWithoutAnySubstitution;
  // 			proof.push(...childProof);
  // 		}
  // 	});
  // 	proof.push({ label: this.label, parseNode: this });
  // 	return proof;
  // }
  //#region buildSubstitutionInRpnOrder
  //#region buildSubstitution
  buildSubstitutionForLogicalParseNode(logicalSystemParseNode, statementMandatoryVars, substitution) {
    if (logicalSystemParseNode.parseNodes.length === 1 && logicalSystemParseNode.parseNodes[0] instanceof MmToken && statementMandatoryVars.has(logicalSystemParseNode.parseNodes[0].value))
      substitution.set(logicalSystemParseNode.parseNodes[0].value, this);
    else
      for (let i = 0; i < logicalSystemParseNode.parseNodes.length; i++)
        if (logicalSystemParseNode.parseNodes[i] instanceof _InternalNode)
          this.parseNodes[i].buildSubstitutionForLogicalParseNode(
            logicalSystemParseNode.parseNodes[i],
            statementMandatoryVars,
            substitution
          );
  }
  buildSubstitution(outermostBlock, grammar) {
    const substitution = /* @__PURE__ */ new Map();
    const labeledStatement = outermostBlock.mmParser.labelToStatementMap.get(this.label);
    if (labeledStatement instanceof AxiomStatement) {
      const logicalSystemParseNode = labeledStatement.parseNodeForSyntaxAxiom(grammar);
      const mandatoryVars = labeledStatement.mandatoryVars(outermostBlock);
      this.buildSubstitutionForLogicalParseNode(logicalSystemParseNode, mandatoryVars, substitution);
    }
    return substitution;
  }
  //#endregion buildSubstitution
  reorderSubstitution(substitution, outermostBlock) {
    const vars = new Set(substitution.keys());
    const mandatoryVarsInRPNorder = outermostBlock.getVariablesInRPNorder(vars);
    const result = /* @__PURE__ */ new Map();
    mandatoryVarsInRPNorder.forEach((logicalVar) => {
      result.set(logicalVar, substitution.get(logicalVar));
    });
    return result;
  }
  //TODO check not to invoke this method when this parse node contains working vars
  /**
   * returns a substitution for a logical syntax assertion. It is meant to be invoked only when
   * a normal proof is computed, thus it is assumed to be a valid parse node,
   * for the assertion, and then no check is done for failed unification.
   * Notice the difference from
   * the methods provided by USubstitutionBuilder: that class performes a substitution for a full
   * UProofStep (with its EHyps), whereas this method builds a substitution for a syntax axiom
   */
  buildSubstitutionInRpnOrder(outermostBlock, grammar) {
    const substitution = this.buildSubstitution(outermostBlock, grammar);
    const substitutionInRpnOrder = this.reorderSubstitution(substitution, outermostBlock);
    return substitutionInRpnOrder;
  }
  //#endregion buildSubstitutionInRpnOrder
  proofArrayWithSubstitution(outermostBlock, grammar, substitutionInRpnOrder) {
    const proof = [];
    substitutionInRpnOrder.forEach((substitution) => {
      const subProof = substitution.proofArray(outermostBlock, grammar);
      proof.push(...subProof);
    });
    proof.push({ label: this.label, parseNode: this });
    return proof;
  }
  /**
   * returns the syntactic proof corresponding to the internal node
   */
  proofArray(outermostBlock, grammar) {
    const substitutionInRpnOrder = this.buildSubstitutionInRpnOrder(
      outermostBlock,
      grammar
    );
    const proof = this.proofArrayWithSubstitution(
      outermostBlock,
      grammar,
      substitutionInRpnOrder
    );
    return proof;
  }
};

// yamma/server/src/grammar/GrammarManager.ts
var MmpRule = class extends import_nearley2.Rule {
  // the label of the statement generating this rule
  // constructor(label: string, name: string, symbols: NearleyItem[], postprocess: Postprocessor) {
  constructor(label, name, symbols) {
    super(name, symbols, (d) => {
      return new InternalNode(label, name, d);
    });
    this.label = label;
  }
};
var GrammarManager = class _GrammarManager {
  //#region areParseNodesEqual
  static areInternalParseNodeEqual(parseNode1, parseNode2) {
    let areEqual = !(parseNode2 instanceof MmToken) && parseNode1.parseNodes.length === parseNode2.parseNodes.length;
    let i = 0;
    while (areEqual && i < parseNode1.parseNodes.length) {
      areEqual = _GrammarManager.areParseNodesEqual(parseNode1.parseNodes[i], parseNode2.parseNodes[i]);
      i++;
    }
    return areEqual;
  }
  static areParseNodesEqual(parseNode1, parseNode2) {
    let areEqual;
    if (parseNode1 instanceof MmToken)
      areEqual = parseNode2 instanceof MmToken && parseNode1.value == parseNode2.value;
    else
      areEqual = _GrammarManager.areInternalParseNodeEqual(parseNode1, parseNode2);
    return areEqual;
  }
  //#endregion areParseNodesEqual
  //#region areParseNodesCoherent
  static areCoherentInternalParseNode(parseNode1, parseNode2) {
    let areCoherent;
    if (_GrammarManager.isInternalParseNodeForWorkingVar(parseNode1) || _GrammarManager.isInternalParseNodeForWorkingVar(parseNode2))
      areCoherent = true;
    else {
      areCoherent = !(parseNode2 instanceof MmToken) && parseNode1.kind == parseNode2.kind && parseNode1.parseNodes.length === parseNode2.parseNodes.length;
      let i = 0;
      while (areCoherent && i < parseNode1.parseNodes.length) {
        areCoherent = _GrammarManager.areParseNodesCoherent(
          parseNode1.parseNodes[i],
          parseNode2.parseNodes[i]
        );
        i++;
      }
    }
    return areCoherent;
  }
  /** two parse nodes are coherent if they are equal up to working vars */
  static areParseNodesCoherent(parseNode1, parseNode2) {
    let areCoherent;
    if (parseNode1 instanceof MmToken)
      areCoherent = parseNode2 instanceof MmToken && parseNode1.value == parseNode2.value;
    else
      areCoherent = _GrammarManager.areCoherentInternalParseNode(parseNode1, parseNode2);
    return areCoherent;
  }
  //#endregion areParseNodesCoherent
  static CreateRule(label, kind, symbols) {
    return new MmpRule(
      label,
      kind,
      symbols
      // (d) => { return new InternalNode(label, kind, d); }
    );
  }
  //#region CreateGrammar
  //#region addRulesForStatements
  static CreateLiteralForFHyp(statement) {
    const rule = _GrammarManager.CreateRule(statement.Label, statement.Kind, [{ literal: statement.Variable }]);
    return rule;
  }
  static CreateRuleForSyntaxAxiom(statement) {
    const ruleKind = statement.Content[0].value;
    const nearleyItems = [];
    for (let i = 1; i < statement.Content.length; i++) {
      const symbol = statement.Content[i];
      const syntaxKind = statement.ParentBlock?.kindOf(symbol.value);
      if (syntaxKind != void 0)
        nearleyItems.push(syntaxKind);
      else
        nearleyItems.push({ literal: symbol.value });
    }
    const rule = _GrammarManager.CreateRule(statement.Label, ruleKind, nearleyItems);
    return rule;
  }
  static isSyntaxAxiom(statement, syntacticKinds) {
    let isSyntaxAxiom = statement instanceof AxiomStatement;
    if (isSyntaxAxiom) {
      const kind = statement.Content[0].value;
      isSyntaxAxiom = isSyntaxAxiom && (syntacticKinds.has(kind) || statement.ParentBlock.hasKind(kind));
    }
    return isSyntaxAxiom;
  }
  //TODO this is almost identical to GrammarManager.isSyntaxAxiom() , consider creating
  // a single method
  static isSyntaxAxiom2(assertionStatement) {
    const result = assertionStatement.formula.length > 0 && assertionStatement.formula[0] != _GrammarManager.typeCodeForProvable;
    return result;
  }
  static addRulesForStatements(labelToStatementMap, rules) {
    const syntacticKinds = /* @__PURE__ */ new Set();
    labelToStatementMap.forEach((statement) => {
      if (statement instanceof FHyp) {
        if (!syntacticKinds.has(statement.Kind) && statement.ParentBlock?.ParentBlock == null)
          syntacticKinds.add(statement.Kind);
        const rule = _GrammarManager.CreateLiteralForFHyp(statement);
        rules.push(rule);
      } else if (_GrammarManager.isSyntaxAxiom(statement, syntacticKinds)) {
        const rule = _GrammarManager.CreateRuleForSyntaxAxiom(statement);
        rules.push(rule);
      }
    });
  }
  static addRulesForWorkingVars(workingVars, rules) {
    workingVars.prefixToKindMap.forEach((kind) => {
      const tokenType = workingVars.tokenTypeFromKind(kind);
      const rule = _GrammarManager.CreateRule("wvar_" + kind, kind, [{ type: tokenType }]);
      rules.push(rule);
    });
  }
  static {
    //TODO this is hardcoded, it could be done better, may be using $j comments
    this.typeCodeForProvable = "|-";
  }
  static CreateGrammar(labelToStatementMap, workingVars) {
    const rules = [];
    rules.push(_GrammarManager.CreateRule(
      "TOP",
      "provable",
      [{ literal: _GrammarManager.typeCodeForProvable }, "wff"]
    ));
    _GrammarManager.addRulesForStatements(labelToStatementMap, rules);
    _GrammarManager.addRulesForWorkingVars(workingVars, rules);
    const grammar = new import_nearley2.Grammar(rules);
    grammar.start = "provable";
    return grammar;
  }
  //#endregion addRulesForStatements
  //#endregion CreateGrammar
  static isInternalParseNodeForWorkingVar(parseNode) {
    const result = parseNode instanceof InternalNode && parseNode.label.startsWith("wvar_");
    return result;
  }
  /** true iff parseNode is a ParseNode for a fHyp */
  static isInternalParseNodeForFHyp(parseNode, variables) {
    const result = parseNode.parseNodes.length == 1 && parseNode.parseNodes[0] instanceof MmToken && variables.has(parseNode.parseNodes[0].value);
    return result;
  }
  static containsWorkingVar(uStepParseNode) {
    let result = _GrammarManager.isInternalParseNodeForWorkingVar(uStepParseNode);
    let i = 0;
    while (!result && i < uStepParseNode.parseNodes.length) {
      if (uStepParseNode.parseNodes[i] instanceof InternalNode)
        result = _GrammarManager.containsWorkingVar(uStepParseNode.parseNodes[i]);
      i++;
    }
    return result;
  }
  /**
   * this method can be invoded only when parseNode is an InternalNode with
   * a single child, that is a MmToken
   * @param parseNode
   * @returns 
   */
  static getTokenValueFromInternalNode(parseNode) {
    const workingVar = parseNode.parseNodes[0].value;
    return workingVar;
  }
  /**
   * this method can be invoded only when parseNode is an InternalNode with
   * a single child, that is a MmToken
   * @param parseNode
   * @returns 
   */
  static getTokenFromInternalNode(parseNode) {
    const result = parseNode.parseNodes[0];
    return result;
  }
  static createInternalNodeForWorkingVar(workingVar, kind, tokenType) {
    const parseNodes = [new MmToken(workingVar, 0, 0, tokenType)];
    const internalNodeForWorkingVar = new InternalNode(
      "wvar_" + kind,
      kind,
      parseNodes
    );
    return internalNodeForWorkingVar;
  }
  /**
   * builds the array of symbols starting froma a ParseNode
   * @param parseNode the node for which the array of symbols is returned
   * @returns 
   */
  static buildStringArray(parseNode) {
    let result = [];
    if (parseNode instanceof MmToken)
      result = [parseNode.value];
    else {
      const internalNode = parseNode;
      internalNode.parseNodes.forEach((parseNode2) => {
        result = result.concat(_GrammarManager.buildStringArray(parseNode2));
      });
    }
    return result;
  }
  /**
   * rebuilds the origina formula, from the parseNode
   * @param parseNode the node the represents the formula to be rebuilt
   * @returns 
   */
  static buildStringFormula(parseNode) {
    let result = "";
    if (parseNode instanceof MmToken)
      result = parseNode.value;
    else {
      const internalNode = parseNode;
      internalNode.parseNodes.forEach((parseNode2) => {
        result = result + " " + this.buildStringFormula(parseNode2);
      });
    }
    result = result.trim();
    return result;
  }
  /**
   * rebuilds the original formula, from the parseNode, but substitutes
   * variables with the given substitution
   * @param parseNode the node the represents the formula to be rebuilt
   * @param substitution the substitution to be applied to variables
   */
  static buildStringFormulaWithSubstitution(parseNode, substitution) {
    let result = "";
    if (parseNode instanceof MmToken) {
      const substituteWith = substitution.get(parseNode.value);
      if (substituteWith != void 0)
        result = concatWithSpaces(substituteWith);
      else
        result = parseNode.value;
    } else {
      const internalNode = parseNode;
      internalNode.parseNodes.forEach((parseNode2) => {
        result = result + " " + this.buildStringFormulaWithSubstitution(parseNode2, substitution);
      });
    }
    result = result.trim();
    return result;
  }
};

// yamma/server/src/mm/MmParser.ts
var import_vscode_languageserver3 = __toESM(require_main4());

// yamma/server/src/mmp/WorkingVars.ts
var WorkingVars = class {
  constructor(kindToPrefixMap) {
    this.kindToPrefixMap = /* @__PURE__ */ new Map();
    this.prefixToKindMap = /* @__PURE__ */ new Map();
    // prefixSet: Set<string> = new Set<string>();
    // for each var kind, _maxIndex contains the max index already used
    this._maxIndex = /* @__PURE__ */ new Map();
    this._workingVarPrefixes = /* @__PURE__ */ new Set();
    this._alreadyCreatedWorkingVars = /* @__PURE__ */ new Set();
    if (kindToPrefixMap != void 0)
      kindToPrefixMap.forEach((prefix, variableKind) => {
        this.addMap(variableKind, prefix);
      });
    this.kindToPrefixMap.forEach((value, key) => {
      this._maxIndex.set(key, 0);
      this._workingVarPrefixes.add(value);
    });
  }
  //#region constructor
  addMap(varKind, workinVarPrefix) {
    this.kindToPrefixMap.set(varKind, workinVarPrefix);
    this.prefixToKindMap.set(workinVarPrefix, varKind);
  }
  //#endregion constructor
  /** creates a map from theory variable's kinds to working var prefix, given the
   * configuration for working vars
   */
  static getKindToWorkingVarPrefixMap(variableKindsConfiguration) {
    const kindToWorkingVarPrefixMapesult = /* @__PURE__ */ new Map();
    variableKindsConfiguration.forEach((variableKindConfiguration, variableKind) => {
      kindToWorkingVarPrefixMapesult.set(variableKind, variableKindConfiguration.workingVarPrefix);
    });
    return kindToWorkingVarPrefixMapesult;
  }
  //TODO this is note used by anything, and _value is not use. What
  //did you want to do?
  reset() {
    this._alreadyCreatedWorkingVars.clear();
    this.kindToPrefixMap.forEach((_value, key) => {
      this._maxIndex.set(key, 0);
    });
  }
  /**
   * if workingVar is a working var, returns its kind
   * @param workingVar 
   */
  kindOf(workingVar) {
    let kind;
    if (workingVar.length > 1)
      kind = this.prefixToKindMap.get(workingVar.charAt(1));
    return kind;
  }
  /**
   * if workingVar is a working var, returns its index; for instance, for &W12 returns 12 
   * @param workingVar 
   * @returns 
   */
  indexOf(workingVar) {
    const strIndex = workingVar.substring(2);
    const index = parseInt(strIndex);
    return index;
  }
  //#region tokenType
  isAWorkingVarSymbol(value) {
    const isAWorkingVar = value.startsWith("&") && value.length > 2 && this.kindOf(value) != void 0 && !isNaN(parseInt(value.substring(2)));
    return isAWorkingVar;
  }
  tokenType(value) {
    let tokenType;
    if (this.isAWorkingVarSymbol(value)) {
      const kind = this.kindOf(value);
      if (kind != void 0)
        tokenType = this.tokenTypeFromKind(kind);
    }
    return tokenType;
  }
  //#endregion tokenType
  // this gives a nicer error message with Nearley.js
  tokenTypeFromKind(kind) {
    return "workvar_" + kind;
  }
  getNewWorkingVar(variableKind) {
    let newWorkingVar;
    const maxIndex = this._maxIndex.get(variableKind);
    if (maxIndex != void 0) {
      const newMaxIndex = maxIndex + 1;
      newWorkingVar = "&" + this.kindToPrefixMap.get(variableKind) + newMaxIndex;
      this._maxIndex.set(variableKind, newMaxIndex);
      this._alreadyCreatedWorkingVars.add(newWorkingVar);
    }
    return newWorkingVar;
  }
  isAlreadyExistentWorkingVar(symbol) {
    const isWorkingVar = this._alreadyCreatedWorkingVars.has(symbol);
    return isWorkingVar;
  }
  /**
   * if workingVar is a working var, returns the max index already given for that kind
   * of working var
   * @param workingVar 
   * @returns s
   */
  maxIndex(workingVar) {
    let maxIndex;
    if (this.isAWorkingVarSymbol(workingVar)) {
      const kind = this.kindOf(workingVar);
      if (kind != void 0)
        maxIndex = this._maxIndex.get(kind);
    }
    return maxIndex;
  }
  /**
   * if symbol is a Working Var, WorkingVars state is updated
   * @param symbol 
   */
  updateWorkingVarsIfTheCase(symbol) {
    if (this.isAWorkingVarSymbol(symbol)) {
      this._alreadyCreatedWorkingVars.add(symbol);
      const kind = this.kindOf(symbol);
      const currentMaxIndex = this._maxIndex.get(kind);
      const workingVarIndex = this.indexOf(symbol);
      if (currentMaxIndex < workingVarIndex)
        this._maxIndex.set(kind, workingVarIndex);
    }
  }
};

// yamma/server/src/mm/MmParser.ts
init_browser_shims();

// yamma/server/src/parseNodesCreatorThread/ParseNodesCreator.ts
var import_nearley3 = __toESM(require_nearley());
init_browser_shims();

// yamma/server/src/parseNodesCreatorThread/GrammarManagerForThread.ts
var GrammarManagerForThread = class _GrammarManagerForThread {
  //#region convertMmpRules
  static convertMmpRule(mmpRule) {
    const mmpRuleForThread = {
      label: mmpRule.label,
      name: mmpRule.name,
      symbols: mmpRule.symbols
    };
    return mmpRuleForThread;
  }
  static convertMmpRules(mmpRules) {
    const mmpRulesForThread = [];
    mmpRules.forEach((mmpRule) => {
      const mmpRuleForThread = _GrammarManagerForThread.convertMmpRule(mmpRule);
      mmpRulesForThread.push(mmpRuleForThread);
    });
    return mmpRulesForThread;
  }
  //#endregion convertMmpRules
  //#region convertMmpRules
  static convertMmpRuleForThread(mmpRuleForThread) {
    const mmpRule = new MmpRule(
      mmpRuleForThread.label,
      mmpRuleForThread.name,
      mmpRuleForThread.symbols
    );
    return mmpRule;
  }
  static convertMmpRulesForThread(mmpRulesForThread) {
    const mmpRules = [];
    mmpRulesForThread.forEach((mmpRuleForThread) => {
      const mmpRule = _GrammarManagerForThread.convertMmpRuleForThread(mmpRuleForThread);
      mmpRules.push(mmpRule);
    });
    return mmpRules;
  }
  //#endregion convertMmpRules
};

// yamma/server/src/parseNodesCreatorThread/ParseNodeForThread.ts
var ParseNodeForThreadConverter = class _ParseNodeForThreadConverter {
  //#region convertParseNode
  static convertMmToken(mmToken) {
    const mmTokenForThread = {
      value: mmToken.value,
      line: mmToken.line,
      column: mmToken.column
    };
    return mmTokenForThread;
  }
  //#region converInternalParseNode
  static convertParseNodes(parseNodes) {
    const parseNodesForThread = [];
    parseNodes.forEach((parseNode) => {
      const parseNodeForThread = _ParseNodeForThreadConverter.convertParseNode(parseNode);
      parseNodesForThread.push(parseNodeForThread);
    });
    return parseNodesForThread;
  }
  static convertInternalParseNode(parseNode) {
    const subNodes = _ParseNodeForThreadConverter.convertParseNodes(parseNode.parseNodes);
    const internalNodeForThread = {
      label: parseNode.label,
      kind: parseNode.kind,
      parseNodes: subNodes
    };
    return internalNodeForThread;
  }
  //#endregion converInternalParseNode
  static convertParseNode(parseNode) {
    let parseNodeForThread;
    if (parseNode instanceof MmToken)
      parseNodeForThread = _ParseNodeForThreadConverter.convertMmToken(parseNode);
    else
      parseNodeForThread = _ParseNodeForThreadConverter.convertInternalParseNode(parseNode);
    return parseNodeForThread;
  }
  //#endregion convertParseNode
  //#region convertParseNodeForThread
  //#region convertInternalParseNodeForThread
  static convertParseNodesForThread(parseNodesForThreads) {
    const parseNodes = [];
    parseNodesForThreads.forEach((parseNodeForThread) => {
      const parseNode = _ParseNodeForThreadConverter.convertParseNodeForThread(parseNodeForThread);
      parseNodes.push(parseNode);
    });
    return parseNodes;
  }
  static convertInternalParseNodeForThread(internalNodeForThread) {
    const subNodes = _ParseNodeForThreadConverter.convertParseNodesForThread(internalNodeForThread.parseNodes);
    const internalNode = new InternalNode(
      internalNodeForThread.label,
      internalNodeForThread.kind,
      subNodes
    );
    return internalNode;
  }
  //#endregion convertInternalParseNodeForThread
  static convertParseNodeForThread(parseNodeForThread) {
    let parseNode;
    if ("value" in parseNodeForThread)
      parseNode = new MmToken(parseNodeForThread.value, parseNodeForThread.line, parseNodeForThread.column);
    else
      parseNode = _ParseNodeForThreadConverter.convertInternalParseNodeForThread(parseNodeForThread);
    return parseNode;
  }
  //#endregion convertParseNodeForThread
};

// yamma/server/src/parseNodesCreatorThread/ParseNodesCreator.ts
var createMessageProgress = (index, count) => {
  return { kind: "progress", index, count };
};
var createMessageLog = (text) => {
  return { kind: "log", text };
};
var createMessageDone = (labelToParseNodeForThreadMap) => {
  return { kind: "done", labelToParseNodeForThreadMap };
};
var postMessage = (message) => {
  parentPort?.postMessage(message);
};
var defaultProgressCallback = (message) => {
  switch (message.kind) {
    case "progress":
      notifyProgress(message.index, message.count);
      break;
    case "log":
      console.log(message.text);
      break;
  }
};
if (!isMainThread) {
  const { labelToFormulaMap, mmpRulesForThread } = workerData;
  postMessage(createMessageLog("I am the worker thread!!!!!!!!!"));
  postMessage(createMessageLog("Worker thread!!!!: labelToFormulaMap.size = " + labelToFormulaMap.size));
  const labelToParseNodeForThreadMap = createLabelToParseNodeForThreadMap(labelToFormulaMap, mmpRulesForThread);
  postMessage(createMessageDone(labelToParseNodeForThreadMap));
}
function createGrammar(mmpRulesForThread, workingVars) {
  const mmpRules = GrammarManagerForThread.convertMmpRulesForThread(mmpRulesForThread);
  const grammar = new import_nearley3.Grammar(mmpRules);
  grammar.lexer = new MmLexer(workingVars);
  return grammar;
}
function getParseNodeForThread(formula, grammar, workingVars, formulaToParseNodeForThreadCache) {
  let parseNodeForThread = formulaToParseNodeForThreadCache.get(formula);
  if (parseNodeForThread == void 0) {
    const parseResult = LabeledStatement.parseString(formula, grammar, workingVars);
    parseNodeForThread = parseResult.parseNode;
    if (parseNodeForThread != void 0)
      formulaToParseNodeForThreadCache.set(formula, parseNodeForThread);
  }
  return parseNodeForThread;
}
function createLabelToParseNodeForThreadMap(labelToFormulaMap, mmpRulesForThread, progressCallback = postMessage) {
  const labelToParseNodeForThreadMap = /* @__PURE__ */ new Map();
  const workingVars = new WorkingVars(/* @__PURE__ */ new Map());
  const grammar = createGrammar(mmpRulesForThread, workingVars);
  const formulaToParseNodeForThreadCache = /* @__PURE__ */ new Map();
  let i = 0;
  labelToFormulaMap.forEach((formula, label) => {
    progressCallback(createMessageProgress(i++, labelToFormulaMap.size));
    const parseNodeForThread = getParseNodeForThread(
      formula,
      grammar,
      workingVars,
      formulaToParseNodeForThreadCache
    );
    if (parseNodeForThread != void 0)
      labelToParseNodeForThreadMap.set(label, parseNodeForThread);
  });
  progressCallback(createMessageLog("labelToParseNodeForThreadMap.size = " + labelToParseNodeForThreadMap.size));
  progressCallback(createMessageLog("formulaToParseNodeForThreadCache.size = " + formulaToParseNodeForThreadCache.size));
  return labelToParseNodeForThreadMap;
}
function createLabelToFormulaMap(mmParser) {
  const labelToStatementMap = mmParser.labelToStatementMap;
  const labelToFormulaMap = /* @__PURE__ */ new Map();
  labelToStatementMap.forEach((labeledStatement) => {
    if (MmParser.isParsable(labeledStatement)) {
      const formula = concatWithSpaces(labeledStatement.formula);
      labelToFormulaMap.set(labeledStatement.Label, formula);
    }
  });
  return labelToFormulaMap;
}
function addParseNodes(labelToParseNodeForThreadMap, labelToStatementMap) {
  labelToParseNodeForThreadMap.forEach((parseNodeForThread, label) => {
    const parseNode = ParseNodeForThreadConverter.convertParseNodeForThread(parseNodeForThread);
    const labeledStatement = labelToStatementMap.get(label);
    if (labeledStatement != void 0)
      labeledStatement.setParseNode(parseNode);
  });
}
function createParseNodesInANewThread(mmParser, progressCallback) {
  const labelToFormulaMap = createLabelToFormulaMap(mmParser);
  const mmpRulesForThread = GrammarManagerForThread.convertMmpRules(mmParser.grammar.rules);
  progressCallback(createMessageLog("I am the Main thread!!!!!!!: labelToFormulaMap.size = " + labelToFormulaMap.size));
  const workerFileName = __filename.replace("src", "out").replace(".ts", ".js");
  const workerData2 = { labelToFormulaMap, mmpRulesForThread };
  const worker = new Worker(workerFileName, { workerData: workerData2 });
  return new Promise((resolve) => {
    worker.on("message", (message) => {
      if (message.kind === "done") {
        progressCallback(createMessageLog("I am back to the Main thread!!!!!!!"));
        addParseNodes(message.labelToParseNodeForThreadMap, mmParser.labelToStatementMap);
        resolve();
        mmParser.areAllParseNodesComplete = true;
      } else {
        progressCallback(message);
      }
    });
  });
}
function createParseNodesInCurrentThread(mmParser, progressCallback) {
  const labelToFormulaMap = createLabelToFormulaMap(mmParser);
  const mmpRulesForThread = GrammarManagerForThread.convertMmpRules(mmParser.grammar.rules);
  createLabelToParseNodeForThreadMap(labelToFormulaMap, mmpRulesForThread, progressCallback);
  mmParser.areAllParseNodesComplete = true;
}

// yamma/server/src/mm/MmParser.ts
init_browser_shims();

// yamma/server/src/mm/TokenReader.ts
init_browser_shims();
var TokenReader = class {
  constructor(tokens) {
    this.indexForNextToken = 0;
    this.imported_files = /* @__PURE__ */ new Set();
    this.tokens = tokens;
    this._lastComment = [];
  }
  /** retrieves and resets the value of the last comment */
  get lastComment() {
    const output = this._lastComment;
    this._lastComment = [];
    return output;
  }
  // reads the next token and increases the index for the next token
  Read() {
    let tok;
    if (this.indexForNextToken < this.tokens.length)
      tok = this.tokens[this.indexForNextToken++];
    return tok;
  }
  // read an included file
  Readf() {
    const tok = this.Read();
    while (tok?.value === "$[") {
      const localFileName = this.Read();
      const endBracket = this.Read();
      if (endBracket?.value != "$]")
        throw new Error("Inclusion command not terminated");
      realpath(localFileName?.value, (error, fullPathFileName) => {
        if (error) {
          throw new Error("Included file not found!");
        } else {
          if (!this.imported_files.has(fullPathFileName)) {
            throw new Error("Not implemented, yet");
          }
        }
      });
    }
    return tok;
  }
  // read a token and returns it
  // comments are consumed and skipped
  // Readc() {
  //     while (true) {
  //         let tok: MmToken | undefined = this.Readf();
  //         if (tok === undefined)
  //             return undefined;
  //         if (tok.value === '$(')
  //             while (tok?.value != '$)')
  //                 tok = this.Read();
  //         else
  //             return tok;
  //     }
  // }
  // this below has a problem
  Readc() {
    let tok = this.Readf();
    while (tok?.value == "$(") {
      this._lastComment = [];
      while (tok != void 0 && tok?.value != "$)") {
        tok = this.Read();
        if (tok != void 0 && tok?.value != "$)")
          this._lastComment.push(tok);
      }
      if (tok == void 0)
        throw new Error("A comment was never closed");
      else
        tok = this.Read();
    }
    return tok;
  }
  // reaturns a list of tokens inside the statement
  // the first token used to define the statement is NOT returned and
  // the last token '$.' is NOT returned
  readstat() {
    const stat = [];
    let tok = this.Readc();
    while (tok?.value != "$.") {
      if (tok === void 0) {
        throw new Error("EOF before $.");
      }
      stat.push(tok);
      tok = this.Readc();
    }
    return stat;
  }
};

// yamma/server/src/mm/TokensCreator.ts
init_browser_shims();
init_browser_shims();
var TokensCreator = class _TokensCreator {
  constructor() {
    this.isInAComment = false;
    this.imported_files = /* @__PURE__ */ new Set();
  }
  addTokensFromIncludedFile(includedFileName, tokens, includingFileFullPath) {
    if (!this.imported_files.has(includedFileName) && includingFileFullPath) {
      const parsedPath = { ...pathParse(includingFileFullPath), base: includedFileName };
      const includedFileFullPath = formatPath(parsedPath);
      const tokensCreator = new _TokensCreator();
      tokensCreator.addTokensFromFile(includedFileFullPath, tokens);
      this.imported_files.add(includedFileName);
    }
  }
  createTokensFromLine(line, lineNumber, tokens, fileFullPath) {
    const lineTokens = splitToTokensDefaultInLine(line, lineNumber);
    let i = 0;
    while (i < lineTokens.length) {
      if (!this.isInAComment && lineTokens[i].value === "$[" && lineTokens[i + 2].value === "$]") {
        this.addTokensFromIncludedFile(lineTokens[i + 1].value, tokens, fileFullPath);
        i += 3;
      } else {
        if (lineTokens[i].value === "$(" || lineTokens[i].value === "$)")
          this.isInAComment = !this.isInAComment;
        lineTokens[i].filePath = fileFullPath;
        tokens.push(lineTokens[i]);
        i++;
      }
    }
  }
  addTokensFromLines(lines, tokens, fileFullPath) {
    for (let i = 0; i < lines.length; i++) {
      this.createTokensFromLine(lines[i], i, tokens, fileFullPath);
    }
    return tokens;
  }
  addTokensFromText(text, tokens, fileFullPath) {
    this.isInAComment = false;
    const lines = text.split("\n");
    this.addTokensFromLines(lines, tokens, fileFullPath);
    return tokens;
  }
  createTokensFromText(text, fileFullPath) {
    this.isInAComment = false;
    const lines = text.split("\n");
    const tokens = this.addTokensFromLines(lines, [], fileFullPath);
    return tokens;
  }
  addTokensFromFile(fileFullPath, tokens) {
    this.isInAComment = false;
    const text = readFileSync(fileFullPath, "utf-8");
    this.addTokensFromText(text, tokens, fileFullPath);
    return tokens;
  }
  createTokensFromFile(fileFullPath) {
    this.isInAComment = false;
    this.imported_files.add(fileFullPath);
    const text = readFileSync(fileFullPath, "utf-8");
    const tokens = this.createTokensFromText(text, fileFullPath);
    return tokens;
  }
};
var MmParser = class extends EventEmitter {
  constructor(globalState, progressToken) {
    super();
    this.globalState = globalState;
    this.progressToken = progressToken;
    this.isParsingComplete = false;
    this.diagnostics = [];
    /** it will be true if at least one theorme has a $= ? $. unproven marker */
    this.containsUnprovenStatements = false;
    this.outermostBlock = new BlockStatement();
    this.labelToStatementMap = /* @__PURE__ */ new Map();
    this.labelToNonSyntaxAssertionMap = /* @__PURE__ */ new Map();
    this.lastComment = "";
    this.parseFailed = false;
    this.areAllParseNodesComplete = false;
    this._percentageOfWorkDone = 0;
  }
  get grammar() {
    if (this._grammar == void 0)
      this._grammar = GrammarManager.CreateGrammar(this.labelToStatementMap, this.workingVars);
    return this._grammar;
  }
  //TODO now we are passing working vars defined in the configuration file, but in the future
  //this could/should be driven from $j comments in the theory itself
  /** returns the WorkingVars class for this theory */
  get workingVars() {
    if (this._workingVars == void 0) {
      let kindToPrefixMap = /* @__PURE__ */ new Map();
      const lastFetchedSettings = this.globalState?.lastFetchedSettings;
      if (lastFetchedSettings != void 0 && lastFetchedSettings.variableKindsConfiguration != void 0)
        kindToPrefixMap = WorkingVars.getKindToWorkingVarPrefixMap(lastFetchedSettings.variableKindsConfiguration);
      this._workingVars = new WorkingVars(kindToPrefixMap);
    }
    return this._workingVars;
  }
  //#region Parse
  fail(message) {
    this.parseFailed = true;
    throw new Error(message);
  }
  addDiagnosticError(message, range2, code) {
    const diagnostic = {
      message,
      range: range2,
      code
    };
    this.diagnostics.push(diagnostic);
    this.parseFailed = true;
  }
  static addDiagnosticError(message, range2, code, diagnostics, provableStatementLabel, filePath) {
    const diagnostic = {
      severity: import_vscode_languageserver3.DiagnosticSeverity.Error,
      message,
      range: range2,
      code,
      provableStatementLabel,
      mmFilePath: filePath
    };
    diagnostics.push(diagnostic);
  }
  addDiagnosticWarning(message, range2, code, provableStatementLabel, filePath) {
    const diagnostic = {
      severity: import_vscode_languageserver3.DiagnosticSeverity.Warning,
      message,
      range: range2,
      code,
      provableStatementLabel,
      mmFilePath: filePath
    };
    this.diagnostics.push(diagnostic);
  }
  //#region buildLabelToStatementMap
  notifyProgressIfTheCase(tokenReader) {
    const percentageOfWorkDone = Math.trunc(tokenReader.indexForNextToken * 100 / tokenReader.tokens.length);
    if (this._percentageOfWorkDone < percentageOfWorkDone) {
      this._percentageOfWorkDone = percentageOfWorkDone;
      if (this.globalState?.connection != void 0 && this.progressToken != void 0) {
        const parsingProgressArgs = {
          percentageOfWorkDone,
          connection: this.globalState.connection,
          progressToken: this.progressToken
        };
        this.emit("newParsingProgress" /* parsingProgress */, parsingProgressArgs);
      }
    }
  }
  readComment(tokenValue, toks) {
    let comment = "";
    let token;
    while (tokenValue != "$)") {
      comment = comment + " " + tokenValue;
      token = toks.Read();
      if (token == void 0)
        this.fail("The file has ended before the comment was closed!");
      else
        tokenValue = token.value;
    }
    this.lastComment = comment;
  }
  addFStatement(labelToken, toks, currentBlock) {
    const statementContent = toks.readstat();
    if (labelToken === void 0) {
      this.fail("$f must have label");
    } else if (statementContent.length !== 2) {
      this.fail("$f must have length 2");
    } else {
      const fHyp = new FHyp(labelToken, statementContent, currentBlock);
      currentBlock.addFHyp(fHyp);
      currentBlock.labelToStatementMap.set(labelToken.value, fHyp);
      if (currentBlock.ParentBlock == null)
        this.labelToStatementMap.set(labelToken.value, fHyp);
      labelToken = void 0;
    }
  }
  // Implements the control required by the spec in the Metamath book P. 114:
  // "Each variable in a $e, $a, or $p statement must exist in an active $f statement"
  // see also this discussion in the forum:
  // https://groups.google.com/g/metamath/c/PAm7YQb2qkw/m/OcDhSoCFAgAJ
  checkEveryVarIsInActiveFStatement(statementContent, currentBlock) {
    statementContent.forEach((token) => {
      const symbol = token.value;
      if (currentBlock.v.has(symbol) && currentBlock.kindOf(symbol) === void 0) {
        const message = `The variable '${symbol}' does not appear  in an active $f statement`;
        const range2 = token.range;
        const code = "varNotInActiveFStatement" /* varNotInActiveFStatement */;
        this.addDiagnosticError(message, range2, code);
        this.fail(message);
      }
    });
  }
  addAStatement(labelToken, toks, currentBlock) {
    if (labelToken === void 0)
      this.fail("$a must have label");
    else {
      const statementContent = toks.readstat();
      this.checkEveryVarIsInActiveFStatement(statementContent, currentBlock);
      const statement = new AxiomStatement(labelToken, statementContent, currentBlock, toks.lastComment);
      Frame.createFrame(statement);
      currentBlock.labelToStatementMap.set(labelToken.value, statement);
      this.labelToStatementMap.set(labelToken.value, statement);
      if (!GrammarManager.isSyntaxAxiom2(statement))
        this.labelToNonSyntaxAssertionMap.set(labelToken.value, statement);
      labelToken = void 0;
      const newAssertionParams = {
        labeledStatement: statement,
        mmParser: this
      };
      this.emit("newAxiomStatement" /* newAxiomStatement */, newAssertionParams);
    }
  }
  addEStatement(labelToken, toks, currentBlock) {
    if (labelToken === void 0)
      this.fail("$e must have label");
    else {
      const statementContent = toks.readstat();
      this.checkEveryVarIsInActiveFStatement(statementContent, currentBlock);
      const statement = new EHyp(labelToken, statementContent, currentBlock);
      currentBlock.eHyps.push(statement);
      currentBlock.labelToStatementMap.set(labelToken.value, statement);
      currentBlock.labelToStatementMap.set(labelToken.value, statement);
      this.labelToStatementMap.set(labelToken.value, statement);
      labelToken = void 0;
    }
  }
  addPStatement(label, toks, currentBlock) {
    if (label === void 0)
      this.fail("$p must have label");
    else {
      const statementContent = toks.readstat();
      const statementContentStrings = MmToken.fromTokensToStrings(statementContent);
      const i = statementContentStrings.indexOf("$=");
      if (i === -1)
        this.fail("$p must contain proof after $=");
      else {
        const proof = statementContentStrings.slice(i + 1);
        const statement = new ProvableStatement(label, statementContent, currentBlock, toks.lastComment);
        Frame.createFrame(statement);
        if (proof.length === 1 && proof[0] === "?") {
          this.addDiagnosticWarning(
            "Unproven $p statement",
            label.range,
            "unprovenStatement" /* unprovenStatement */,
            label.value,
            label.filePath
          );
          this.containsUnprovenStatements = true;
        } else {
          const verifier = new Verifier(this.diagnostics);
          verifier.verify(statement, proof, this.labelToStatementMap);
          this.parseFailed ||= verifier.verificationFailed;
        }
        this.labelToStatementMap.set(label.value, statement);
        if (!GrammarManager.isSyntaxAxiom2(statement))
          this.labelToNonSyntaxAssertionMap.set(label.value, statement);
        label = void 0;
        const newAssertionParams = {
          labeledStatement: statement,
          mmParser: this
        };
        this.emit("newProvableStatement" /* newProvableStatement */, newAssertionParams);
      }
    }
  }
  buildLabelToStatementMap(toks, currentBlock) {
    let label = void 0;
    let tok = toks.Readc();
    if (currentBlock === void 0)
      currentBlock = this.outermostBlock;
    while (tok !== void 0 && tok.value !== "$}") {
      this.notifyProgressIfTheCase(toks);
      switch (tok.value) {
        case "$(":
          {
            this.readComment(tok.value, toks);
          }
          break;
        case "$c": {
          const statement = toks.readstat();
          for (const mmconst of statement) {
            currentBlock.add_c(mmconst.value);
          }
          break;
        }
        case "$v": {
          const statement = toks.readstat();
          for (const mmvar of statement) {
            currentBlock.add_v(mmvar.value);
          }
          break;
        }
        case "$f": {
          this.addFStatement(label, toks, currentBlock);
          break;
        }
        case "$a": {
          this.addAStatement(label, toks, currentBlock);
          break;
        }
        case "$e": {
          this.addEStatement(label, toks, currentBlock);
          break;
        }
        case "$p": {
          this.addPStatement(label, toks, currentBlock);
          break;
        }
        case "$d": {
          const statementContent = toks.readstat();
          currentBlock.add_d(statementContent);
          break;
        }
        case "${": {
          const subBlock = new BlockStatement(currentBlock);
          this.Parse(toks, subBlock);
          break;
        }
        default:
          if (tok.value.substring(0, 0) !== "$") {
            label = tok;
            this.emit("newLabel" /* newLabel */, tok);
          } else {
            this.fail('"Unexpexcted token: " + tok');
          }
          break;
      }
      tok = toks.Readc();
    }
  }
  //#endregion buildLabelToStatementMap
  Parse(tokenReader, currentBlock) {
    this.buildLabelToStatementMap(tokenReader, currentBlock);
  }
  //#endregion Parse
  // the async version. It works fine, but I'm not using
  // it anymore, I'm using ParseFileSync, instead
  ParseFileAsync(localFileName) {
    (async function processLineByLine(parser) {
      try {
        const rl = createInterface({
          input: createReadStream(localFileName),
          crlfDelay: Infinity
        });
        const fileLines = [];
        rl.on("line", (line) => {
          fileLines.push(line);
        });
        await EventEmitter.once(rl, "close");
        console.log("ParseFileAsync: Reading file line by line with readline done.");
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        console.log("inizio parsing: " + /* @__PURE__ */ new Date());
        const tokensCreator = new TokensCreator();
        const mmTokens = tokensCreator.createTokensFromFile(localFileName);
        const toks = new TokenReader(mmTokens);
        parser.isParsingComplete = false;
        parser.outermostBlock.mmParser = parser;
        parser.Parse(toks, parser.outermostBlock);
        parser.isParsingComplete = true;
        console.log("fine parsing: " + /* @__PURE__ */ new Date());
      } catch (err) {
        console.error(err);
      }
    })(this);
  }
  //#region ParseFileSync
  // the synchronous version of ParseFile
  // private parseLines(fileLines: string[]) {
  //     const toks = new TokenReader(fileLines);
  //     this.isParsingComplete = false;
  //     this.outermostBlock.mmParser = this;
  //     this.Parse(toks, this.outermostBlock);
  //     this.outermostBlock.grammar = this.grammar;
  //     this.isParsingComplete = true;
  // }
  parseFromTokenReader(tokenReader) {
    this.isParsingComplete = false;
    this.outermostBlock.mmParser = this;
    this.Parse(tokenReader, this.outermostBlock);
    this.outermostBlock.grammar = this.grammar;
    this.isParsingComplete = true;
  }
  ParseFileSync(localFileName) {
    try {
      console.log("ParseFileSync: Reading file line by line with readline done.");
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
      console.log("inizio parsing: " + /* @__PURE__ */ new Date());
      const tokensCreator = new TokensCreator();
      const mmTokens = tokensCreator.createTokensFromFile(localFileName);
      const tokenReader = new TokenReader(mmTokens);
      this.parseFromTokenReader(tokenReader);
      console.log("fine parsing: " + /* @__PURE__ */ new Date());
    } catch (err) {
      console.error(err);
    }
  }
  //#endregion ParseFileSync
  // parses a text: useful for testing
  ParseText(text, mmFileFullPath) {
    const tokensCreator = new TokensCreator();
    const mmTokens = tokensCreator.createTokensFromText(text, mmFileFullPath);
    const tokenReader = new TokenReader(mmTokens);
    this.parseFromTokenReader(tokenReader);
  }
  //#region createParseNodesForAssertions
  async createParseNodesForAssertionsAsync(progressCallback = defaultProgressCallback) {
    if (this.isParsingComplete)
      await createParseNodesInANewThread(this, progressCallback);
  }
  /** true iff the formula is a provable statement (typically, it starts with '|-' ) */
  static isParsable(labeledStatement) {
    const result = labeledStatement instanceof EHyp || labeledStatement instanceof AssertionStatement && !GrammarManager.isSyntaxAxiom2(labeledStatement);
    return result;
  }
  /** createParseNodesForAssertionsSync will lock up an interactive system while it runs, which
   *  could be minutes for a large .mm file.  createParseNodesForAssertionsAsync is usually prefered. */
  createParseNodesForAssertionsSync(progressCallback = defaultProgressCallback) {
    if (this.isParsingComplete)
      createParseNodesInCurrentThread(this, progressCallback);
  }
};

// yamma/server/src/mm/TheoryLoader.ts
init_browser_shims();

// yamma/server/src/stepSuggestion/ModelLoader.ts
__toESM(require_main4());
init_browser_shims();

// yamma/server/src/stepSuggestion/ModelBuilder.ts
init_browser_shims();
__toESM(require_nearley());
init_browser_shims();

// yamma/server/src/mm/DiagnosticEventHandler.ts
__toESM(require_main4());
init_browser_shims();

// yamma/server/src/mm/TheoryLoader.ts
(init_browser_shims(), __toCommonJS(browser_shims_exports));
(init_browser_shims(), __toCommonJS(browser_shims_exports));

// yamma/server/src/mm/ConfigurationManager.ts
var DiagnosticMessageForSyntaxError = /* @__PURE__ */ ((DiagnosticMessageForSyntaxError2) => {
  DiagnosticMessageForSyntaxError2["short"] = "short";
  DiagnosticMessageForSyntaxError2["verbose"] = "verbose";
  return DiagnosticMessageForSyntaxError2;
})(DiagnosticMessageForSyntaxError || {});
var ConfigurationManager_default = DiagnosticMessageForSyntaxError;

// src/defaultConfig.ts
var defaultConfig = {
  common: {
    proofMode: "compressed" /* compressed */,
    variableKindsConfig: [
      {
        kind: "wff",
        workingVarPrefix: "W",
        lspSemantictokenType: "variable"
      },
      {
        kind: "setvar",
        workingVarPrefix: "S",
        lspSemantictokenType: "string"
      },
      {
        kind: "class",
        workingVarPrefix: "C",
        lspSemantictokenType: "keyword"
      }
    ]
  },
  mm: {
    maxNumberOfProblems: 100,
    mmFileFullPath: "",
    disjVarAutomaticGeneration: "GenerateNone" /* GenerateNone */,
    labelsOrderInCompressedProof: "mostReferencedFirstAndNiceFormatting" /* mostReferencedFirstAndNiceFormatting */,
    diagnosticMessageForSyntaxError: ConfigurationManager_default.short,
    progressCallback: () => {
    },
    singleThread: false,
    createMmParser: (...params) => new MmParser(...params)
  },
  unifier: {
    maxNumberOfHypothesisDispositionsForStepDerivation: 1e5,
    renumber: true,
    removeUnusedStatements: true,
    getProofStripHeader: true
  }
};

// yamma/server/src/mmp/MmpParser.ts
var import_nearley6 = __toESM(require_nearley());

// yamma/server/src/mmp/MmpStatements.ts
var ProofStepFirstTokenInfo = class {
  // this is assigned only when the first token cannot be interpreted in its three components
  constructor(firstToken, isEHyp, stepRef, eHypRefs, stepLabel, unparsableToken) {
    this.firstToken = firstToken;
    this.isEHyp = isEHyp;
    this.stepRef = stepRef;
    this.eHypRefs = eHypRefs;
    this.stepLabel = stepLabel;
    this.unparsableToken = unparsableToken;
  }
  get eHypRefsRange() {
    let range2;
    let startCharacter;
    let endCharacter;
    if (this.stepRef != void 0 && this.stepLabel != void 0) {
      startCharacter = this.stepRef.range.end.character + 1;
      endCharacter = this.stepLabel.range.start.character - 1;
    } else if (this.stepRef != void 0 && this.stepLabel == void 0) {
      startCharacter = this.stepRef.range.end.character + 1;
      endCharacter = startCharacter + 1;
    } else if (this.stepRef == void 0 && this.stepLabel != void 0) {
      startCharacter = this.stepLabel.range.start.character - 1;
      endCharacter = startCharacter + 1;
    }
    if (startCharacter != void 0) {
      const start = { line: this.stepRef.range.start.line, character: startCharacter };
      const end = { line: this.stepRef.range.start.line, character: endCharacter };
      range2 = { start, end };
    }
    return range2;
  }
};

// yamma/server/src/mmp/MmpProofStep.ts
var MmpProofStep = class {
  get isProven() {
    const isProven = this.isEHyp && this.stepLabel != void 0 || this._isProven;
    return isProven;
  }
  get normalizedFormula() {
    if (this.formula != void 0)
      this._normalizedFormula = concatTokenValuesWithSpaces(this.formula);
    return this._normalizedFormula;
  }
  get isQed() {
    const result = this.stepRef == "qed";
    return result;
  }
  /** call this method if this UProofStep is completeley proven */
  setIsProven() {
    this._isProven = true;
  }
  get assertion() {
    if (this._assertion == void 0) {
      const labelToStatementMap = this.mmpProof.outermostBlock.mmParser.labelToStatementMap;
      let statement = void 0;
      if (this.stepLabel != void 0) {
        statement = labelToStatementMap.get(this.stepLabel);
      }
      if (statement instanceof AssertionStatement)
        this._assertion = statement;
    }
    return this._assertion;
  }
  //#region hasWorkingVars
  //#region setHasWorkingVars
  setHasWorkingVarsRecursive(parseNode) {
    if (GrammarManager.isInternalParseNodeForWorkingVar(parseNode))
      this._hasWorkingVars = true;
    else {
      let i = 0;
      while (!this._hasWorkingVars && i < parseNode.parseNodes.length) {
        const childNode = parseNode.parseNodes[i];
        if (childNode instanceof InternalNode)
          this.setHasWorkingVarsRecursive(childNode);
        i++;
      }
    }
  }
  setHasWorkingVars() {
    this._hasWorkingVars = false;
    if (this.parseNode != void 0)
      this.setHasWorkingVarsRecursive(this.parseNode);
  }
  //#endregion setHasWorkingVars
  get hasWorkingVars() {
    if (this._hasWorkingVars == void 0)
      this.setHasWorkingVars();
    return this._hasWorkingVars;
  }
  // eHypRefs?: MmToken[]
  // eHypRefsRanges: Range[]
  // stepLabelToken?: MmToken;
  // stepLabelRange: Range
  // stepFormula?: MmToken[]
  // parseNode?: InternalNode   // contains the ParseNode for the fomula, iff the formula nonempty and it is parsable
  // mmpTokenizer: MmpTokenizer
  // indexOfFirstToken: number
  // indexOfLastToken: number
  constructor(uProof, firstTokenInfo, isFirstTokenParsable, isEHyp, stepRefToken, eHypRefs, eHypMmpSteps, stepLabelToken, stepFormula, formulaParseNode) {
    const actualEHypMmpSteps = eHypMmpSteps == void 0 ? [] : eHypMmpSteps;
    this.mmpProof = uProof;
    this.isEHyp = isEHyp;
    this.isFirstTokenParsable = isFirstTokenParsable;
    this.stepRef = stepRefToken?.value;
    this.eHypUSteps = actualEHypMmpSteps;
    this.eHypRefs = eHypRefs;
    this.stepLabel = stepLabelToken?.value;
    this.stepFormula = stepFormula;
    this.parseNode = formulaParseNode;
    this._isProven = false;
    this.containsUnknownStepRef = false;
    this.firstTokenInfo = firstTokenInfo;
    this.stepRefToken = stepRefToken;
    this.stepRef = stepRefToken.value;
    this.stepLabelToken = stepLabelToken;
  }
  get label() {
    return this.stepLabelToken;
  }
  get formula() {
    return this.stepFormula;
  }
  //TODO now that you are also passing firstTokenInfo, you can also use firstTokenInfo.firstToken.range.start	
  get startPosition() {
    let start = { line: 0, character: 0 };
    if (this.stepRefToken != void 0)
      start = this.stepRefToken.range.start;
    else if (this.eHypRefs != void 0 && this.eHypRefs.length > 0)
      start = this.eHypRefs[0].range.start;
    else if (this.stepLabelToken != void 0)
      start = this.stepLabelToken.range.start;
    else if (this.stepFormula != void 0)
      start = this.stepFormula[0].range.start;
    return start;
  }
  get endPosition() {
    let end = { line: 0, character: 0 };
    if (this.stepFormula != void 0 && this.stepFormula.length > 0)
      end = this.stepFormula[this.stepFormula.length - 1].range.end;
    else
      end = this.firstTokenInfo.firstToken.range.end;
    return end;
  }
  /**
   * returns the range of the whole proof step
   */
  get range() {
    const start = this.startPosition;
    const end = this.endPosition;
    const range2 = {
      start,
      end
    };
    return range2;
  }
  //#region eHypRefsRange
  get eHypRefsRange() {
    let range2;
    let startCharacter;
    let endCharacter;
    if (this.stepRefToken != void 0 && this.stepLabelToken != void 0) {
      startCharacter = this.stepRefToken.range.end.character + 1;
      endCharacter = this.stepLabelToken.range.start.character - 1;
    } else if (this.stepRefToken != void 0 && this.stepLabel == void 0) {
      startCharacter = this.stepRefToken.range.end.character + 1;
      endCharacter = startCharacter + 1;
    } else if (this.stepRefToken == void 0 && this.stepLabelToken != void 0) {
      startCharacter = this.stepLabelToken.range.start.character - 1;
      endCharacter = startCharacter + 1;
    }
    if (startCharacter != void 0) {
      const start = { line: this.range.start.line, character: startCharacter };
      const end = { line: this.range.start.line, character: endCharacter };
      range2 = { start, end };
    }
    return range2;
  }
  //#endregion eHypRefsRange
  get firstTokenInfoToString() {
    let result = "";
    if (this.stepRefToken != void 0)
      result += this.stepRefToken.value;
    result += ":";
    if (this.eHypRefs != void 0)
      result += concatTokenValuesWithSeparator(this.eHypRefs, ",");
    result += ":";
    if (this.stepLabelToken != void 0)
      result += this.stepLabelToken.value;
    return result;
  }
  //#region toText
  //#region textForFirstTokenInfo
  //#region textForEHypRefs
  /** if the current EHyp is undefined, but there was a ref, we leave the original ref unchanged */
  textForEHypRef(eHypIndex) {
    let text = "";
    if (this.eHypUSteps[eHypIndex] != void 0 && this.eHypUSteps[eHypIndex].stepRef != void 0)
      text = this.eHypUSteps[eHypIndex].stepRef;
    else if (this.eHypRefs != void 0 && this.eHypRefs[eHypIndex] != void 0)
      text = this.eHypRefs[eHypIndex].value;
    return text;
  }
  textForEHypRefs() {
    let result = "";
    if (this.eHypUSteps.length > 0)
      result = this.textForEHypRef(0);
    for (let i = 1; i < this.eHypUSteps.length; i++) {
      const newRef = this.textForEHypRef(i);
      result += "," + newRef;
    }
    return result;
  }
  //#endregion textForEHypRefs
  textForFirstTokenInfo() {
    const textForEHyp = this.isEHyp ? "h" : "";
    const textForEHypRefs = this.textForEHypRefs();
    const textForStepLabel = this.stepLabel === void 0 ? "" : this.stepLabel;
    const result = textForEHyp + this.stepRef + ":" + textForEHypRefs + ":" + textForStepLabel;
    return result;
  }
  //#endregion textForFirstTokenInfo
  get textForFormula() {
    let formula;
    if (this.stepFormula != void 0)
      formula = concatTokenValuesWithSpaces(this.stepFormula);
    return formula;
  }
  /**
   * Returns the full text of the UProofStep
   * @returns
   */
  toText() {
    const textForFirstTokenInfo = this.textForFirstTokenInfo();
    let textForFormula = "";
    if (this.parseNode != void 0)
      textForFormula = GrammarManager.buildStringFormula(this.parseNode);
    else if (this.stepFormula != void 0)
      textForFormula = concatTokenValuesWithSpaces(this.stepFormula);
    const text = textForFirstTokenInfo + " " + textForFormula;
    return text;
  }
  //#endregion toText
  //#region proofArray
  //#region proofArrayForFStatements
  getMandatoryVarsInRPNorder(outermostBlock) {
    const vars = new Set(this.substitution.keys());
    const mandatoryVarsInRPNorder = outermostBlock.getVariablesInRPNorder(vars);
    return mandatoryVarsInRPNorder;
  }
  proofArrayForFStatements(outermostBlock) {
    const proofArray = [];
    const mandatoryVarsInRPNorder = this.getMandatoryVarsInRPNorder(outermostBlock);
    for (let i = mandatoryVarsInRPNorder.length - 1; 0 <= i; i--) {
      const logicalVar = mandatoryVarsInRPNorder[i];
      const logicalVarSubstitutionNode = this.substitution?.get(logicalVar);
      const proofArrayForSubstitution = logicalVarSubstitutionNode.proofArray(
        outermostBlock,
        outermostBlock.grammar
      );
      proofArray.unshift(...proofArrayForSubstitution);
    }
    return proofArray;
  }
  //#endregion proofArrayForFStatements
  /**
   * returns a proof for the current step (undefined if there is no proof, yet).
   * It assumes that every UProofStep has already been checked for unification
   * and this.isProven has been assigned and this.substitution has been assigned.
   * @proofArrayForFStatements is used to compute the RPN order of the mandatory F Hyps
   * 
   */
  proofArray(outermostBlock) {
    let proof;
    const currentUProofStatementStep = { label: this.stepLabel, parseNode: this.parseNode };
    if (this.isEHyp)
      proof = [currentUProofStatementStep];
    else if (this.isProven) {
      proof = [currentUProofStatementStep];
      for (let i = this.eHypUSteps.length - 1; 0 <= i; i--) {
        const eHypUStep = this.eHypUSteps[i];
        const proofForEHypUStep = eHypUStep?.proofArray(outermostBlock);
        proof = proofForEHypUStep.concat(proof);
      }
      const proofArrayForFStatements = this.proofArrayForFStatements(outermostBlock);
      proof = proofArrayForFStatements.concat(proof);
    }
    return proof;
  }
  //#endregion proofArray
};

// yamma/server/src/mmp/MmpValidator.ts
var import_vscode_languageserver7 = __toESM(require_main4());

// yamma/server/src/mmp/MmpStatistics.ts
var MmpStatistics = class {
  constructor(mmpParser) {
    this.mmpParser = mmpParser;
  }
  //#region buildStatistics
  addSymbolsForCurrentMmpProofStep(mmpProofStep) {
    if (mmpProofStep.formula != void 0)
      mmpProofStep.formula.forEach((mmToken) => {
        this.symbols?.add(mmToken.value);
      });
  }
  /**
   * builds the statistics for the given MmpParser
   */
  buildStatistics() {
    if (this.mmpParser.mmpProof != void 0) {
      this.symbols = /* @__PURE__ */ new Set();
      this.mmpParser.mmpProof?.mmpStatements.forEach((uStatement) => {
        if (uStatement instanceof MmpProofStep)
          this.addSymbolsForCurrentMmpProofStep(uStatement);
      });
    }
  }
  //#endregion buildStatistics
};

// yamma/server/src/syntaxCompletion/SyntaxCompletion.ts
var import_nearley5 = __toESM(require_nearley());

// yamma/server/src/grammar/MmLexerFromTokens.ts
var MmLexerFromTokens = class {
  constructor(mmTokens) {
    this.nextTokenIndex = 0;
    this.mmTokens = mmTokens;
  }
  reset(_data, _state) {
    this.nextTokenIndex = 0;
  }
  next() {
    let mmToken;
    if (this.nextTokenIndex < this.mmTokens.length) {
      mmToken = this.mmTokens[this.nextTokenIndex];
      this.nextTokenIndex++;
    }
    return mmToken;
  }
  save() {
    const lexerState = {
      nextTokenIndex: this.nextTokenIndex,
      mmTokens: this.mmTokens
    };
    return lexerState;
  }
  formatError(_token, _message) {
    return "";
  }
};

// yamma/server/src/syntaxCompletion/SyntaxCompletion.ts
var SyntaxCompletion = class _SyntaxCompletion {
  constructor(cursorContext, mmParser, mmpParser, mmStatistics, mmpStatistics) {
    this.cursorContext = cursorContext;
    this.mmParser = mmParser;
    this.mmpParser = mmpParser;
    this.mmStatistics = mmStatistics;
    this.mmpStatistics = mmpStatistics;
  }
  //#region completionItems
  //#region getSymbols
  static getSymbolsFromErrorMessage(errorMessage) {
    const regExpMatchArray = errorMessage.match(/(?<=A ).*(?= based on:)/g);
    let symbols = [];
    if (regExpMatchArray != null)
      symbols = regExpMatchArray.map((s) => s.slice(1, s.length - 1));
    return symbols;
  }
  getSymbols() {
    let symbols;
    const stepFormula = this.cursorContext.formulaBeforeCursor();
    if (this.mmParser != void 0 && stepFormula != void 0) {
      this.mmParser.grammar.lexer = new MmLexerFromTokens(stepFormula);
      let parser = new import_nearley5.Parser(this.mmParser.grammar);
      try {
        parser.feed("");
        if (parser.results.length === 0) {
          const stepFormulaString = concatTokenValuesWithSpaces(stepFormula);
          this.mmParser.grammar.lexer = new MmLexer(this.mmParser.workingVars);
          parser = new import_nearley5.Parser(this.mmParser.grammar);
          parser.feed(stepFormulaString + " UnxpexcteEndOfFormula");
        }
      } catch (error) {
        const message = error.message;
        symbols = _SyntaxCompletion.getSymbolsFromErrorMessage(message);
      }
    }
    return symbols;
  }
  //#endregion getSymbols
  //#region getCompletionItems
  //#region sortText
  /** returns '0' if the symbol is in the current .mmp file, returns '1' otherwise */
  firstCharacterForSorting(symbol) {
    let firstCharacter = "1";
    if (this.mmpStatistics?.symbols != void 0) {
      const isInCurrentMmpFile = this.mmpStatistics.symbols.has(symbol);
      if (isInCurrentMmpFile)
        firstCharacter = "0";
    }
    return firstCharacter;
  }
  sortingByPopularity(symbol) {
    const assertions = this.mmStatistics.symbolToAssertionsMap.get(symbol);
    const defaultOrder = 99999;
    let size = defaultOrder;
    if (assertions != void 0)
      size = defaultOrder - assertions.size;
    const result = String(size).padStart(5, "0");
    return result;
  }
  /** symbols already in the current .mmp file are listed first; then are
   * sorted by popularity in the whole theory
   */
  sortText(symbol) {
    const firstCharacterForSorting = this.firstCharacterForSorting(symbol);
    const sortingByPopularity = this.sortingByPopularity(symbol);
    const result = firstCharacterForSorting + sortingByPopularity;
    return result;
  }
  //#endregion sortText
  getCompletionItems(symbols) {
    const alreadyAddedSymbols = /* @__PURE__ */ new Set();
    const completionItems = [];
    symbols.forEach(
      (symbol) => {
        if ((this.mmParser.outermostBlock.c.has(symbol) || this.mmParser.outermostBlock.v.has(symbol)) && !alreadyAddedSymbols.has(symbol)) {
          const completionItem = {
            label: symbol,
            sortText: this.sortText(symbol)
            // detail: this.sortText(symbol)
            //TODO search how to remove the icon from the completion list
            // kind: CompletionItemKind.Keyword
            // data: symbol
          };
          completionItems.push(completionItem);
          alreadyAddedSymbols.add(symbol);
        }
      }
    );
    return completionItems;
  }
  //#endregion getCompletionItems
  completionItems() {
    let completionItems = [
      // {
      // 	label: 'TypeScript',
      // 	kind: CompletionItemKind.Text,
      // 	data: 1
      // },
      // {
      // 	label: 'JavaScript',
      // 	kind: CompletionItemKind.Text,
      // 	data: 2
      // }
    ];
    const symbols = this.getSymbols();
    if (symbols != void 0)
      completionItems = this.getCompletionItems(symbols);
    return completionItems;
  }
  //#endregion completionItems
};

// yamma/server/src/mmp/DiagnosticMessageForSyntaxError.ts
var VerboseDiagnosticMessageForSyntaxError = class {
  diagnosticMessage(earlyParserErrorMessage) {
    return earlyParserErrorMessage;
  }
};
var ShortDiagnosticMessageForSyntaxError = class {
  constructor(theoryConstants, theoryVariables, maxNumberOfSymbolsDisplayed) {
    this.theoryConstants = theoryConstants;
    this.theoryVariables = theoryVariables;
    this.maxNumberOfSymbolsDisplayed = maxNumberOfSymbolsDisplayed;
  }
  //#region diagnosticMessageForSyntaxError
  //#region diagnosticMessageFromSymbols
  //#region getFirstPartOfTheMessage
  getSubstringEndPosition(earlyParserErrorMessage) {
    const substringToSearchFor = "one of the following:";
    const substringStartPosition = earlyParserErrorMessage.indexOf(substringToSearchFor);
    const substringEndPosition = substringStartPosition + substringToSearchFor.length;
    return substringEndPosition;
  }
  getFirstPartOfTheMessage(earlyParserErrorMessage) {
    const substringEndPosition = this.getSubstringEndPosition(earlyParserErrorMessage);
    const firstPart = earlyParserErrorMessage.substring(1, substringEndPosition);
    return firstPart;
  }
  //#endregion getFirstPartOfTheMessage
  getListOfExpectedSymbols(expectedSymbols) {
    let diagnosticMessage = "";
    const alreadyAddedSymbols = /* @__PURE__ */ new Set();
    let i = 0;
    while (i < expectedSymbols.length && i <= this.maxNumberOfSymbolsDisplayed) {
      const nextSymbol = expectedSymbols[i];
      if (this.theoryConstants.has(nextSymbol) || this.theoryVariables.has(nextSymbol) && !alreadyAddedSymbols.has(nextSymbol)) {
        diagnosticMessage += " " + nextSymbol;
        alreadyAddedSymbols.add(nextSymbol);
      }
      i++;
    }
    if (i < expectedSymbols.length)
      diagnosticMessage += "...<more>";
    return diagnosticMessage;
  }
  diagnosticMessageFromSymbols(earlyParserErrorMessage, expectedSymbols) {
    const firstPartOfTheMessage = this.getFirstPartOfTheMessage(earlyParserErrorMessage);
    const listOfExpectedSymbols = this.getListOfExpectedSymbols(expectedSymbols);
    const diagnosticMessage = firstPartOfTheMessage + listOfExpectedSymbols;
    return diagnosticMessage;
  }
  //#endregion diagnosticMessageFromSymbols
  diagnosticMessage(earlyParserErrorMessage) {
    const expectedSymbols = SyntaxCompletion.getSymbolsFromErrorMessage(earlyParserErrorMessage);
    const result = this.diagnosticMessageFromSymbols(earlyParserErrorMessage, expectedSymbols);
    return result;
  }
  //#endregion diagnosticMessageForSyntaxError
};

// yamma/server/src/mmp/MmpSubstitutionApplier.ts
var MmpSubstitutionApplier = class _MmpSubstitutionApplier {
  constructor(substitution, uStepIndex, uProof, assertion, outermostBlock, workingVars, grammar) {
    this.substitution = substitution;
    this.uStepIndex = uStepIndex;
    this.assertion = assertion;
    this.outermostBlock = outermostBlock;
    this.workingVars = workingVars;
    this.grammar = grammar;
    this.uProof = uProof;
    this.uProofStep = this.uProof.mmpStatements[uStepIndex];
    this.logicalSystemEHyps = this.assertion.frame?.eHyps;
    this.eHypUSteps = this.uProofStep.eHypUSteps;
  }
  //#region createParseNode
  //TODO this one is probably to be removed, it's called nowhere
  static createParseNodeForMmToken(parseNodeForLogicalSystemFormula, substitution) {
    const symbol = parseNodeForLogicalSystemFormula.value;
    let newParseNode = substitution.get(symbol);
    if (newParseNode === void 0) {
      newParseNode = new MmToken(symbol, 0, 0);
    }
    return newParseNode;
  }
  static isInternalNodeForLogicalVariable(parseNodeForLogicalSystemFormula, outermostBlock) {
    const result = parseNodeForLogicalSystemFormula instanceof InternalNode && parseNodeForLogicalSystemFormula.parseNodes.length === 1 && parseNodeForLogicalSystemFormula.parseNodes[0] instanceof MmToken && outermostBlock.v.has(parseNodeForLogicalSystemFormula.parseNodes[0].value);
    return result;
  }
  static createParseNodeForLogicalVariable(internalNodeForLogicalVariable, substitution) {
    const symbol = internalNodeForLogicalVariable.parseNodes[0].value;
    const newParseNode = substitution.get(symbol);
    if (newParseNode == void 0) {
      console.log(`Error! The USubstitutionBuilder is trying to build a build a ParseNode, but the given substitution does not contain a substitution value for the logical variable '${symbol}'`);
      throw new Error(`Error! The USubstitutionBuilder is trying to build a build a ParseNode, but the given substitution does not contain a substitution value for the logical variable '${symbol}'`);
    }
    return newParseNode;
  }
  static createParseNodeForInternalNode(parseNodeForLogicalSystemFormula, substitution, outermostBlock) {
    const parseNodes = [];
    parseNodeForLogicalSystemFormula.parseNodes.forEach((parseNode) => {
      const newParseNode = _MmpSubstitutionApplier.createParseNode(
        parseNode,
        substitution,
        outermostBlock
      );
      parseNodes.push(newParseNode);
    });
    const newInternalNode = new InternalNode(
      parseNodeForLogicalSystemFormula.label,
      parseNodeForLogicalSystemFormula.kind,
      parseNodes
    );
    return newInternalNode;
  }
  static createParseNode(parseNodeForLogicalSystemFormula, substitution, outermostBlock) {
    let newParseNode;
    if (_MmpSubstitutionApplier.isInternalNodeForLogicalVariable(
      parseNodeForLogicalSystemFormula,
      outermostBlock
    )) {
      newParseNode = _MmpSubstitutionApplier.createParseNodeForLogicalVariable(
        parseNodeForLogicalSystemFormula,
        substitution
      );
    } else if (parseNodeForLogicalSystemFormula instanceof MmToken)
      newParseNode = _MmpSubstitutionApplier.createParseNodeForMmToken(
        parseNodeForLogicalSystemFormula,
        substitution
      );
    else
      newParseNode = _MmpSubstitutionApplier.createParseNodeForInternalNode(
        parseNodeForLogicalSystemFormula,
        substitution,
        outermostBlock
      );
    return newParseNode;
  }
  //#endregion createParseNode
  // applise the 
  // applySubstitutionToExistingNode(parseNode: ParseNode,
  // 	parseNodeForLogicalSystemFormula: ParseNode): ParseNode {
  // 	let newParseNode: ParseNode = parseNode;
  // 	if (parseNode instanceof MmToken && this.workingVars.isWorkingVar(parseNode.value)) {
  // 		const nodeForSubstitution: ParseNode | undefined = this.substitution.get(parseNode.value);
  // 		if (nodeForSubstitution != undefined)
  // 			// parseNode is a working var for which a substitution was found
  // 			newParseNode = nodeForSubstitution;
  // 	}
  // 	return newParseNode;
  // }
  applySubstitutionToSingleNode(uProofStep, parseNodeForLogicalSystemFormula) {
    if (uProofStep.parseNode == void 0)
      uProofStep.parseNode = _MmpSubstitutionApplier.createParseNodeForInternalNode(
        parseNodeForLogicalSystemFormula,
        this.substitution,
        this.outermostBlock
      );
  }
  //#endregion applySubstitutionToSingleNode
  //#region applySubstitutionToEHypsAndAddMissingOnes
  // it is assumed to be eHypUSteps.length  <= logicalSystemEHyps.length and the missing
  // refs are assumed to be at the end
  applySubstitutionToEHypsAndAddMissingOnes() {
    let indexToInsertNewEHyps = this.uStepIndex;
    for (let i = 0; i < this.logicalSystemEHyps.length; i++) {
      const logicalSystemEHyp = this.logicalSystemEHyps[i];
      if (i < this.eHypUSteps.length) {
        if (this.eHypUSteps[i] === void 0)
          this.eHypUSteps[i] = this.uProof.createEmptyUStepAndAddItBeforeIndex(indexToInsertNewEHyps++);
        if (this.eHypUSteps[i].parseNode === void 0)
          this.eHypUSteps[i].parseNode = _MmpSubstitutionApplier.createParseNodeForInternalNode(
            logicalSystemEHyp.parseNode,
            this.substitution,
            this.outermostBlock
          );
      } else {
        const newEHypUStep = this.uProof.createEmptyUStepAndAddItBeforeIndex(indexToInsertNewEHyps++);
        newEHypUStep.parseNode = _MmpSubstitutionApplier.createParseNodeForInternalNode(
          logicalSystemEHyp.parseNode,
          this.substitution,
          this.outermostBlock
        );
        this.eHypUSteps.push(newEHypUStep);
      }
    }
    return indexToInsertNewEHyps;
  }
  //#endregion applySubstitutionToEHypsAndAddMissingOnes
  /**
   * Applies a substitution to a single MmpProofStep:
   * - if the formula is missing, it's added (with working vars)
   * - if an $e hypothesis is missing, it's added (with working vars)
   * - new $e hypothesis and the MmpProofStep are added at the end of to the UProof
   * Returns the new index for the MmpProofStep that was indexed by uStepIndex (this
   * can be increased, if new hypothesis are added) 
   */
  applySubstitution() {
    const updatedeUStepIndex = this.applySubstitutionToEHypsAndAddMissingOnes();
    if (this.assertion.parseNode)
      this.applySubstitutionToSingleNode(this.uProofStep, this.assertion.parseNode);
    return updatedeUStepIndex;
  }
};

// yamma/server/src/mmp/WorkingVarsUnifierInitializer.ts
var WorkingVarsUnifierInitializer = class {
  constructor(uProofStep, assertion, substitution, outermostBlock, grammar) {
    this.startingPairsForMGUFinder = [];
    this.uProofStep = uProofStep;
    this.assertion = assertion;
    this.substitution = substitution;
    this.outermostBlock = outermostBlock;
    this.grammar = grammar;
  }
  //#region buildStartingPairsForMGUAlgorithm
  //#region addStartingPairsForMGUAlgorithmForParseNode
  addStartingPairsForMGUFinderForParseNodeWithLogicalNodeSubstituted(uStepParseNode, newNodeWithSubstitution) {
    if (GrammarManager.isInternalParseNodeForWorkingVar(uStepParseNode)) {
      if (!GrammarManager.areParseNodesEqual(uStepParseNode, newNodeWithSubstitution)) {
        const orderedPairOfNodes = {
          parseNode1: uStepParseNode,
          parseNode2: newNodeWithSubstitution
        };
        this.startingPairsForMGUFinder.push(orderedPairOfNodes);
      }
    } else if (uStepParseNode instanceof InternalNode)
      for (let i = 0; i < uStepParseNode.parseNodes.length; i++) {
        this.addStartingPairsForMGUFinderForParseNodeWithLogicalNodeSubstituted(
          uStepParseNode.parseNodes[i],
          newNodeWithSubstitution.parseNodes[i]
        );
      }
  }
  // addStartingPairsForMGUAlgorithmForParseNode(uStepParseNode: InternalNode, logicalSystemFormulaParseNode: InternalNode) {
  // 	const newNodeWithSubstitution = USubstitutionApplier.createParseNode(logicalSystemFormulaParseNode,
  // 		this.substitution, this.outermostBlock);
  // 	this.addStartingPairsForMGUFinderForParseNodeWithLogicalNodeSubstituted(uStepParseNode, newNodeWithSubstitution);
  // }
  addStartingPairsForMGUAlgorithmForParseNode(uStepParseNode, logicalSystemFormulaParseNode) {
    const newNodeWithSubstitution = MmpSubstitutionApplier.createParseNode(
      logicalSystemFormulaParseNode,
      this.substitution,
      this.outermostBlock
    );
    if ((GrammarManager.containsWorkingVar(uStepParseNode) || GrammarManager.containsWorkingVar(newNodeWithSubstitution)) && !GrammarManager.areParseNodesEqual(newNodeWithSubstitution, uStepParseNode)) {
      const orderedPairOfNodes = {
        parseNode1: newNodeWithSubstitution,
        parseNode2: uStepParseNode
      };
      this.startingPairsForMGUFinder.push(orderedPairOfNodes);
    }
  }
  //#endregion addStartingPairsForMGUAlgorithmForParseNode
  addStartingPairsForMGUAlgorithmForEHyps() {
    for (let i = 0; i < this.uProofStep.eHypUSteps.length; i++) {
      if (this.uProofStep.eHypUSteps[i] != void 0 && this.uProofStep.eHypUSteps[i]?.parseNode != void 0)
        this.addStartingPairsForMGUAlgorithmForParseNode(
          this.uProofStep.eHypUSteps[i]?.parseNode,
          this.assertion.frame?.eHyps[i].parseNode
        );
    }
  }
  /** builds the starting pairs for the MGU algorithm, for the MmpProofStep given to the constructor  */
  buildStartingPairsForMGUAlgorithm() {
    this.addStartingPairsForMGUAlgorithmForEHyps();
    if (this.uProofStep.parseNode != void 0)
      this.addStartingPairsForMGUAlgorithmForParseNode(this.uProofStep.parseNode, this.assertion.parseNode);
    return this.startingPairsForMGUFinder;
  }
  //#endregion buildStartingPairsForMGUAlgorithm
};

// yamma/server/src/mmp/WorkingVarsUnifierFinder.ts
var WorkingVarsUnifierFinder = class {
  // alreadyReplacedWorkingVars: Set<string>;
  constructor(startingOrderedPairsOfNodes) {
    this.workingVarsForWhichRule5hasAlreadyBeenApplied = /* @__PURE__ */ new Set();
    this.currentOrderedPairsOfNodes = startingOrderedPairsOfNodes;
    this.mostGeneralUnifierResult = /* @__PURE__ */ new Map();
  }
  //#region findMostGeneralUnifier
  //#region runACycle
  //#region tryToPerformAnActionForCurrentPair
  isInternalNodeForVariable(parseNode) {
    const result = GrammarManager.isInternalParseNodeForWorkingVar(parseNode);
    return result;
  }
  //#region applyRule1
  buildOrderedPairsForChildren(node1, node2) {
    const orderedPairsForChildren = [];
    for (let i = 0; i < node1.parseNodes.length; i++) {
      if (node1.parseNodes[i] instanceof InternalNode) {
        const orderedPair = {
          parseNode1: node1.parseNodes[i],
          parseNode2: node2.parseNodes[i]
        };
        orderedPairsForChildren.push(orderedPair);
      }
    }
    return orderedPairsForChildren;
  }
  applyRule1(i, node1, node2) {
    const orderedPairsForChildren = this.buildOrderedPairsForChildren(node1, node2);
    this.currentOrderedPairsOfNodes.splice(i, 1, ...orderedPairsForChildren);
  }
  //#endregion applyRule1
  //#region  applyRule5
  replaceNodeInDescendants(workingVarToBeReplaced, replacingNode, nodeToBeReplaced) {
    for (let i = 0; i < nodeToBeReplaced.parseNodes.length; i++) {
      const descendant = nodeToBeReplaced.parseNodes[i];
      if (GrammarManager.isInternalParseNodeForWorkingVar(descendant) && GrammarManager.getTokenValueFromInternalNode(descendant) == workingVarToBeReplaced)
        nodeToBeReplaced.parseNodes.splice(i, 1, replacingNode);
      else if (descendant instanceof InternalNode)
        this.replaceNodeInDescendants(workingVarToBeReplaced, replacingNode, descendant);
    }
  }
  applyRule5(i, node1, node2) {
    const workingVarToBeReplaced = GrammarManager.getTokenValueFromInternalNode(node1);
    for (let j = 0; j < this.currentOrderedPairsOfNodes.length; j++) {
      if (j != i)
        this.replaceNodeInDescendants(workingVarToBeReplaced, node2, this.currentOrderedPairsOfNodes[j].parseNode1);
      this.replaceNodeInDescendants(workingVarToBeReplaced, node2, this.currentOrderedPairsOfNodes[j].parseNode2);
    }
    this.workingVarsForWhichRule5hasAlreadyBeenApplied.add(workingVarToBeReplaced);
  }
  //#endregion applyRule5
  tryToPerformAnActionForCurrentPair(i) {
    const orderedPair = this.currentOrderedPairsOfNodes[i];
    const parseNode1 = orderedPair.parseNode1;
    const parseNode2 = orderedPair.parseNode2;
    const isParseNode1WorkingVar = this.isInternalNodeForVariable(parseNode1);
    const isParseNode2WorkingVar = this.isInternalNodeForVariable(parseNode2);
    let hasBeenPerformedOneAction = false;
    if (!isParseNode1WorkingVar && !isParseNode2WorkingVar && parseNode1.label == parseNode2.label) {
      this.applyRule1(i, parseNode1, parseNode2);
      hasBeenPerformedOneAction = true;
    } else if (!isParseNode1WorkingVar && !isParseNode2WorkingVar && parseNode1.label != parseNode2.label) {
      this.currentState = "clashFailure" /* clashFailure */;
      this.clashFailureOrderedPair = { parseNode1, parseNode2 };
      hasBeenPerformedOneAction = true;
    } else if (GrammarManager.areParseNodesEqual(parseNode1, parseNode2)) {
      this.currentOrderedPairsOfNodes.splice(i, 1);
      hasBeenPerformedOneAction = true;
    } else if (!isParseNode1WorkingVar && isParseNode2WorkingVar) {
      this.currentOrderedPairsOfNodes[i].parseNode1 = parseNode2;
      this.currentOrderedPairsOfNodes[i].parseNode2 = parseNode1;
      hasBeenPerformedOneAction = true;
    } else if (isParseNode1WorkingVar && !this.workingVarsForWhichRule5hasAlreadyBeenApplied.has(GrammarManager.getTokenValueFromInternalNode(parseNode1)) && !parseNode2.containsTokenValue(GrammarManager.getTokenValueFromInternalNode(parseNode1))) {
      this.applyRule5(i, parseNode1, parseNode2);
      hasBeenPerformedOneAction = true;
    } else if (isParseNode1WorkingVar && // this.mostGeneralUnifierResult.get(GrammarManager.getTokenValueFromInternalNode(parseNode1)) == undefined &&
    parseNode2.containsTokenValue(GrammarManager.getTokenValueFromInternalNode(parseNode1))) {
      this.currentState = "occourCheckFailure" /* occourCheckFailure */;
      this.occourCheckOrderedPair = { parseNode1, parseNode2 };
      hasBeenPerformedOneAction = true;
    }
    return hasBeenPerformedOneAction;
  }
  //#endregion tryToPerformAnActionForCurrentPair
  runUnificationCycles() {
    this.currentState = "running" /* running */;
    let i = 0;
    while (i < this.currentOrderedPairsOfNodes.length && this.currentState == "running" /* running */) {
      const hasBeenPerformedOneAction = this.tryToPerformAnActionForCurrentPair(i);
      if (hasBeenPerformedOneAction)
        i = 0;
      else
        i++;
    }
    if (this.currentState == "running" /* running */)
      this.currentState = "complete" /* complete */;
  }
  //#endregion runACycle
  /**
   * 
   * @returns the most general unifier for the UProof
   */
  findMostGeneralUnifier() {
    let result;
    this.runUnificationCycles();
    if (this.currentState == "complete" /* complete */) {
      this.currentOrderedPairsOfNodes.forEach((orderedPair) => {
        const workingVar = GrammarManager.getTokenValueFromInternalNode(orderedPair.parseNode1);
        const substitution = orderedPair.parseNode2;
        this.mostGeneralUnifierResult.set(workingVar, substitution);
      });
      result = this.mostGeneralUnifierResult;
    }
    return result;
  }
  //#endregion findMostGeneralUnifier
  static buildErrorMessageForOccourCheckOrderedPair(occourCheckOrderedPair) {
    const workingVar = GrammarManager.getTokenValueFromInternalNode(occourCheckOrderedPair.parseNode1);
    const strParseNode2 = GrammarManager.buildStringFormula(occourCheckOrderedPair.parseNode2);
    const errorMessage = `Working Var unification error: the  working var ${workingVar} should be replaced with the following subformula, containing itself ${strParseNode2}`;
    return errorMessage;
  }
};

// yamma/server/src/mmp/MmpSubstitutionBuilder.ts
var MmpSubstitutionBuilder = class {
  constructor(uProofStep, assertion, outermostBlock, workingVars, grammar, diagnostics, requireWorkingVarsToBeAnExactSubstitutionOfALogicalVar) {
    this.uProofStep = uProofStep;
    this.assertion = assertion;
    this.outermostBlock = outermostBlock;
    this.workingVars = workingVars;
    this.grammar = grammar;
    this.diagnostics = diagnostics;
    this.logicalSystemEHyps = this.assertion.frame?.eHyps;
    this.eHypUSteps = this.uProofStep.eHypUSteps;
    if (requireWorkingVarsToBeAnExactSubstitutionOfALogicalVar != void 0)
      this.requireWorkingVarsToBeAnExactSubstitutionOfALogicalVar = requireWorkingVarsToBeAnExactSubstitutionOfALogicalVar;
    else
      this.requireWorkingVarsToBeAnExactSubstitutionOfALogicalVar = false;
  }
  //#region buildSubstitution
  //#region buildSubstitutionForBothInternalNode
  //#region buildSubstitutionForSingleFormula
  isSameKind(logicalSystemVariable, uStepParseNode) {
    let isSameKind;
    const variableKind = this.outermostBlock.varToKindMap.get(logicalSystemVariable);
    if (uStepParseNode instanceof MmToken) {
      const uStepVariableKind = this.outermostBlock.varToKindMap.get(uStepParseNode.value);
      isSameKind = variableKind == uStepVariableKind;
    } else
      isSameKind = variableKind == uStepParseNode.kind;
    return isSameKind;
  }
  addSubstitutionOrCheckCoherence(logicalSystemVariable, uStepParseNode, substitution) {
    const currentSubstitution = substitution.get(logicalSystemVariable);
    const isInternalParseNodeForWorkingVar = currentSubstitution instanceof InternalNode && GrammarManager.isInternalParseNodeForWorkingVar(currentSubstitution);
    if (isInternalParseNodeForWorkingVar)
      substitution.delete(logicalSystemVariable);
    let isCoherentSubstitution;
    if (currentSubstitution === void 0 || isInternalParseNodeForWorkingVar) {
      isCoherentSubstitution = true;
      substitution.set(logicalSystemVariable, uStepParseNode);
    } else
      isCoherentSubstitution = GrammarManager.areParseNodesCoherent(currentSubstitution, uStepParseNode);
    return isCoherentSubstitution;
  }
  buildSubstitutionForLeafNodeWithInternalNode(logicalSystemFormulaToken, uStepParseNode, substitution) {
    let hasFoundSubstitution = false;
    if (this.outermostBlock.v.has(logicalSystemFormulaToken.value)) {
      if (this.isSameKind(logicalSystemFormulaToken.value, uStepParseNode))
        hasFoundSubstitution = this.addSubstitutionOrCheckCoherence(
          logicalSystemFormulaToken.value,
          uStepParseNode,
          substitution
        );
      else
        hasFoundSubstitution = false;
    } else
      hasFoundSubstitution = uStepParseNode.parseNodes.length == 1 && uStepParseNode.parseNodes[0] instanceof MmToken && logicalSystemFormulaToken.value == uStepParseNode.parseNodes[0].value;
    return hasFoundSubstitution;
  }
  buildSubstitutionForLeafNode(logicalSystemFormulaToken, uStepParseNode, substitution) {
    let hasFoundSubstitution;
    if (uStepParseNode instanceof InternalNode)
      hasFoundSubstitution = this.buildSubstitutionForLeafNodeWithInternalNode(
        logicalSystemFormulaToken,
        uStepParseNode,
        substitution
      );
    else
      hasFoundSubstitution = uStepParseNode instanceof MmToken && logicalSystemFormulaToken.value == uStepParseNode.value;
    return hasFoundSubstitution;
  }
  //#region buildSubstitutionForInternalNode
  isInternalNodeForLogicalVariableNotAddedToSubstitutionYet(logicalSystemFormulaInternalNode, substitution) {
    const result = logicalSystemFormulaInternalNode.parseNodes.length == 1 && logicalSystemFormulaInternalNode.parseNodes[0] instanceof MmToken && this.outermostBlock.v.has(logicalSystemFormulaInternalNode.parseNodes[0].value) && substitution.get(logicalSystemFormulaInternalNode.parseNodes[0].value) == void 0;
    return result;
  }
  //#region buildSubstitutionForWorkingVarOfTheSameKind
  buildExactSubstitutionForWorkingVar(logicalSystemFormulaInternalNode, uStepInternalNode, substitution) {
    let hasFoundSubstitution;
    if (GrammarManager.isInternalParseNodeForFHyp(logicalSystemFormulaInternalNode, this.outermostBlock.v)) {
      const logicalVar = GrammarManager.getTokenValueFromInternalNode(logicalSystemFormulaInternalNode);
      const logicalVarSubstitution = substitution.get(logicalVar);
      hasFoundSubstitution = GrammarManager.areParseNodesEqual(logicalVarSubstitution, uStepInternalNode);
    } else
      hasFoundSubstitution = false;
    return hasFoundSubstitution;
  }
  buildSubstitutionForWorkingVarOfTheSameKind(logicalSystemFormulaInternalNode, uStepInternalNode, substitution) {
    let hasFoundSubstitution = true;
    if (this.isInternalNodeForLogicalVariableNotAddedToSubstitutionYet(
      logicalSystemFormulaInternalNode,
      substitution
    ))
      substitution.set(logicalSystemFormulaInternalNode.parseNodes[0].value, uStepInternalNode);
    else if (this.requireWorkingVarsToBeAnExactSubstitutionOfALogicalVar)
      hasFoundSubstitution = this.buildExactSubstitutionForWorkingVar(
        logicalSystemFormulaInternalNode,
        uStepInternalNode,
        substitution
      );
    return hasFoundSubstitution;
  }
  //#endregion buildSubstitutionForWorkingVarOfTheSameKind
  buildSubstitutionForChildren(logicalSystemParseNodes, uStepParseNodes, substitution) {
    let hasFoundSubstitution = true;
    let i = 0;
    while (hasFoundSubstitution && i < logicalSystemParseNodes.length) {
      hasFoundSubstitution &&= this.buildSubstitutionForParseNode(
        logicalSystemParseNodes[i],
        uStepParseNodes[i],
        substitution
      );
      i++;
    }
    return hasFoundSubstitution;
  }
  buildSubstitutionForInternalNodesOfTheSameKindNoWorkingVar(logicalSystemFormulaInternalNode, uStepInternalNode, substitution) {
    let hasFoundSubstitution;
    if (logicalSystemFormulaInternalNode.parseNodes.length === 1 && logicalSystemFormulaInternalNode.parseNodes[0] instanceof MmToken)
      hasFoundSubstitution = this.buildSubstitutionForLeafNodeWithInternalNode(
        logicalSystemFormulaInternalNode.parseNodes[0],
        uStepInternalNode,
        substitution
      );
    else if (logicalSystemFormulaInternalNode.parseNodes.length != uStepInternalNode.parseNodes.length)
      hasFoundSubstitution = false;
    else {
      hasFoundSubstitution = this.buildSubstitutionForChildren(
        logicalSystemFormulaInternalNode.parseNodes,
        uStepInternalNode.parseNodes,
        substitution
      );
    }
    return hasFoundSubstitution;
  }
  buildSubstitutionForBothInternalNode(logicalSystemFormulaInternalNode, uStepInternalNode, substitution) {
    let hasFoundSubstitution;
    if (logicalSystemFormulaInternalNode.kind != uStepInternalNode.kind)
      hasFoundSubstitution = false;
    else if (GrammarManager.isInternalParseNodeForWorkingVar(uStepInternalNode))
      hasFoundSubstitution = this.buildSubstitutionForWorkingVarOfTheSameKind(
        logicalSystemFormulaInternalNode,
        uStepInternalNode,
        substitution
      );
    else
      hasFoundSubstitution = this.buildSubstitutionForInternalNodesOfTheSameKindNoWorkingVar(
        logicalSystemFormulaInternalNode,
        uStepInternalNode,
        substitution
      );
    return hasFoundSubstitution;
  }
  //#endregion buildSubstitutionForBothInternalNode
  buildSubstitutionForInternalNode(logicalSystemFormulaInternalNode, uStepParseNode, substitution) {
    let hasFoundSubstitution;
    if (uStepParseNode instanceof MmToken)
      hasFoundSubstitution = false;
    else
      hasFoundSubstitution = this.buildSubstitutionForBothInternalNode(
        logicalSystemFormulaInternalNode,
        uStepParseNode,
        substitution
      );
    return hasFoundSubstitution;
  }
  //#endregion buildSubstitutionForInternalNode
  buildSubstitutionForParseNode(parseNodeForLogicalSystemFormula, uStepParseNode, substitution) {
    let hasFoundSubstitution;
    if (parseNodeForLogicalSystemFormula instanceof MmToken) {
      hasFoundSubstitution = this.buildSubstitutionForLeafNode(
        parseNodeForLogicalSystemFormula,
        uStepParseNode,
        substitution
      );
    } else
      hasFoundSubstitution = this.buildSubstitutionForInternalNode(
        parseNodeForLogicalSystemFormula,
        uStepParseNode,
        substitution
      );
    return hasFoundSubstitution;
  }
  //#endregion buildSubstitutionForSingleFormula
  buildSubstitutionForSingleLine(logicalSystemFormulaInternalNode, uStepFormula, uStepParseNode, substitution) {
    let foundSubstitution = true;
    if (uStepFormula != void 0 && uStepParseNode == void 0)
      foundSubstitution = false;
    else if (uStepParseNode != void 0)
      foundSubstitution = this.buildSubstitutionForInternalNode(
        logicalSystemFormulaInternalNode,
        uStepParseNode,
        substitution
      );
    return foundSubstitution;
  }
  // it is assumed to be eHypUSteps.length  <= logicalSystemEHyps.length and the missing
  // refs are assumed to be at the end
  addSubstitutionForEHypsMoreOrEqual(substitution) {
    let hasFoundSubstitution = true;
    let i = 0;
    while (hasFoundSubstitution && i < this.logicalSystemEHyps.length) {
      if (i < this.eHypUSteps.length && this.eHypUSteps[i] !== void 0)
        hasFoundSubstitution = this.buildSubstitutionForSingleLine(
          this.logicalSystemEHyps[i].parseNode,
          this.eHypUSteps[i].stepFormula,
          this.eHypUSteps[i].parseNode,
          substitution
        );
      i++;
    }
    return hasFoundSubstitution;
  }
  // if logicalSystemEHyps.length < eHypUSteps.length no substitution can be found.
  // if eHypUSteps.length  <= logicalSystemEHyps.length, the missing
  // refs are assumed to be at the end
  buildSubstitutionForEHyps(substitution) {
    let hasFoundSubstitution;
    if (this.logicalSystemEHyps.length < this.eHypUSteps.length)
      hasFoundSubstitution = false;
    else
      hasFoundSubstitution = this.addSubstitutionForEHypsMoreOrEqual(substitution);
    return hasFoundSubstitution;
  }
  //#endregion buildSubstitutionForEHyps
  //#region tryToUnifyWorkingVars
  //#region addDiagnosticsForWorkingVarsIfTheCase
  addDiagnosticsForWorkingVar(strWorkingVar, parseNode, message) {
    if (parseNode instanceof MmToken && parseNode.value == strWorkingVar)
      MmpValidator.addDiagnosticError(
        message,
        parseNode.range,
        "workingVarUnificationError" /* workingVarUnificationError */,
        this.diagnostics
      );
    else if (parseNode instanceof InternalNode)
      parseNode.parseNodes.forEach((childNode) => {
        this.addDiagnosticsForWorkingVar(strWorkingVar, childNode, message);
      });
  }
  addDiagnosticsForWorkingVarsIfTheCase(workingVarsUnifierFinder) {
    if (workingVarsUnifierFinder.currentState == "occourCheckFailure" /* occourCheckFailure */) {
      const occourCheckOrderedPair = workingVarsUnifierFinder.occourCheckOrderedPair;
      const parseNode1 = workingVarsUnifierFinder.occourCheckOrderedPair.parseNode1;
      const parseNode2 = workingVarsUnifierFinder.occourCheckOrderedPair.parseNode2;
      const message = WorkingVarsUnifierFinder.buildErrorMessageForOccourCheckOrderedPair(
        occourCheckOrderedPair
      );
      MmpValidator.addDiagnosticError(
        message,
        this.uProofStep.stepLabelToken.range,
        "unificationError" /* unificationError */,
        this.diagnostics
      );
      const strWorkingVar = GrammarManager.getTokenValueFromInternalNode(
        occourCheckOrderedPair.parseNode1
      );
      this.addDiagnosticsForWorkingVar(strWorkingVar, parseNode1, message);
      this.addDiagnosticsForWorkingVar(strWorkingVar, parseNode2, message);
    }
  }
  //#endregion addDiagnosticsForWorkingVarsIfTheCase
  tryToUnifyWorkingVars(substitution) {
    const workingVarsUnifierInitializer = new WorkingVarsUnifierInitializer(
      this.uProofStep,
      this.assertion,
      substitution,
      this.outermostBlock,
      this.grammar
    );
    const startingPairsForMGUAlgorthm = workingVarsUnifierInitializer.buildStartingPairsForMGUAlgorithm();
    const workingVarsUnifierFinder = new WorkingVarsUnifierFinder(startingPairsForMGUAlgorthm);
    workingVarsUnifierFinder.findMostGeneralUnifier();
    const result = workingVarsUnifierFinder.currentState == "complete" /* complete */;
    this.addDiagnosticsForWorkingVarsIfTheCase(workingVarsUnifierFinder);
    return result;
  }
  //#endregion tryToUnifyWorkingVars
  buildSubstitutionForExistingParseNodes() {
    const substitution = /* @__PURE__ */ new Map();
    let hasBeenFound = this.buildSubstitutionForEHyps(substitution);
    if (hasBeenFound && this.assertion.parseNode)
      hasBeenFound = this.buildSubstitutionForSingleLine(
        this.assertion.parseNode,
        this.uProofStep.stepFormula,
        this.uProofStep.parseNode,
        substitution
      );
    return { hasBeenFound, substitution };
  }
  //#region addWorkingVarsForVarsWithoutASubstitution
  //#region addWorkingVarsForLogicalVarsWithoutASubstitutionForSingleParseNode
  addWorkingVarsForLogicalVarsWithoutASubstitutionForUndefinedInternalNode(logicalSystemFormulaInternalNode, substitution) {
    if (this.isInternalNodeForLogicalVariableNotAddedToSubstitutionYet(
      logicalSystemFormulaInternalNode,
      substitution
    )) {
      const variable = GrammarManager.getTokenValueFromInternalNode(logicalSystemFormulaInternalNode);
      const kind = logicalSystemFormulaInternalNode.kind;
      const newWorkingVar = this.workingVars.getNewWorkingVar(kind);
      const tokenType = this.workingVars.tokenTypeFromKind(kind);
      const parseNode = GrammarManager.createInternalNodeForWorkingVar(
        newWorkingVar,
        kind,
        tokenType
      );
      substitution.set(variable, parseNode);
    }
    logicalSystemFormulaInternalNode.parseNodes.forEach((parseNode) => {
      this.addWorkingVarsForLogicalVarsWithoutASubstitutionForSingleParseNode(parseNode, substitution);
    });
  }
  addWorkingVarsForLogicalVarsWithoutASubstitutionForSingleParseNode(parseNodeForLogicalSystemFormula, substitution) {
    if (parseNodeForLogicalSystemFormula instanceof InternalNode)
      this.addWorkingVarsForLogicalVarsWithoutASubstitutionForUndefinedInternalNode(
        parseNodeForLogicalSystemFormula,
        substitution
      );
  }
  //#endregion addWorkingVarsForLogicalVarsWithoutASubstitutionForSingleParseNode
  addWorkingVarsForLogicalVarsWithoutASubstitution(substitution) {
    for (let i = 0; i < this.logicalSystemEHyps.length; i++) {
      const eHyp = this.logicalSystemEHyps[i];
      this.addWorkingVarsForLogicalVarsWithoutASubstitutionForSingleParseNode(eHyp.parseNode, substitution);
    }
    this.addWorkingVarsForLogicalVarsWithoutASubstitutionForSingleParseNode(this.assertion.parseNode, substitution);
  }
  //#endregion addWorkingVarsForVarsWithoutASubstitution
  /**
   * tries to find substitution for the uProofStep given in the constructor. If the uProofStep can be unified
   * with the given logical assertion, a substitution is returned and it is complete (all logical vars
   * have a substitution; some logical vars may be substituted with a Working Var)
   * @returns 
   */
  buildSubstitution() {
    const substitutionResult = this.buildSubstitutionForExistingParseNodes();
    if (substitutionResult.hasBeenFound) {
      this.addWorkingVarsForLogicalVarsWithoutASubstitution(substitutionResult.substitution);
      if (!this.requireWorkingVarsToBeAnExactSubstitutionOfALogicalVar)
        substitutionResult.hasBeenFound = this.tryToUnifyWorkingVars(substitutionResult.substitution);
    }
    return substitutionResult;
  }
  //#endregion buildSubstitution
  //#region buildACompleteSubstitutionEvenIfNonUnifiable
  buildCompleteSubstitutionForExistingParseNodes(substitution, nonUnifiableLogicalParseNodes) {
    for (let i = 0; i < this.logicalSystemEHyps.length; i++) {
      if (this.eHypUSteps[i] !== void 0 && this.eHypUSteps[i].parseNode != void 0) {
        const hasFoundSubstitution = this.buildSubstitutionForInternalNode(
          this.logicalSystemEHyps[i].parseNode,
          this.eHypUSteps[i].parseNode,
          substitution
        );
        if (!hasFoundSubstitution)
          nonUnifiableLogicalParseNodes.push(this.logicalSystemEHyps[i].parseNode);
      }
    }
    if (this.uProofStep.parseNode != void 0 && this.assertion.parseNode) {
      const hasFoundSubstitution = this.buildSubstitutionForInternalNode(
        this.assertion.parseNode,
        this.uProofStep.parseNode,
        substitution
      );
      if (!hasFoundSubstitution)
        nonUnifiableLogicalParseNodes.push(this.assertion.parseNode);
    }
    return substitution;
  }
  addWorkingVarsForLogicalVarsWithoutASubstitutionUsingNonUnifiableSteps(substitution, nonUnifiableLogicalParseNodes) {
    for (let i = 0; i < this.logicalSystemEHyps.length; i++) {
      const eHyp = this.logicalSystemEHyps[i];
      if (this.eHypUSteps[i]?.parseNode == void 0 && eHyp.parseNode)
        this.addWorkingVarsForLogicalVarsWithoutASubstitutionForSingleParseNode(eHyp.parseNode, substitution);
    }
    if (this.uProofStep.parseNode === void 0 && this.assertion.parseNode)
      this.addWorkingVarsForLogicalVarsWithoutASubstitutionForSingleParseNode(this.assertion.parseNode, substitution);
    nonUnifiableLogicalParseNodes.forEach((nonUnifiableLogicalParseNode) => {
      this.addWorkingVarsForLogicalVarsWithoutASubstitutionForSingleParseNode(nonUnifiableLogicalParseNode, substitution);
    });
  }
  /**
   * returns a substitution for the uProofStep given in the constructor. It will return a substitution
   * even if the uProofStep cannot be unified. The substitution returned is complete (all logical vars
   * have a substitution; some logical vars may be substituted with a Working Var).
   * This method can be invoked the best possible Diagnostic, when a unification error is encountered.
   */
  buildACompleteSubstitutionEvenIfNonUnifiable() {
    const substitution = /* @__PURE__ */ new Map();
    const nonUnifiableLogicalParseNodes = [];
    this.buildCompleteSubstitutionForExistingParseNodes(substitution, nonUnifiableLogicalParseNodes);
    this.addWorkingVarsForLogicalVarsWithoutASubstitutionUsingNonUnifiableSteps(
      substitution,
      nonUnifiableLogicalParseNodes
    );
    return substitution;
  }
  //#endregion buildACompleteSubstitutionEvenIfNonUnifiable
};

// yamma/server/src/mmp/WorkingVarsUUnifierApplier.ts
var WorkingVarsUnifierApplier = class {
  constructor(unifier, uProof, formulaToParseNodeCache) {
    this.formulaToParseNodeCache = formulaToParseNodeCache;
    this.unifier = unifier;
    this.uProof = uProof;
  }
  //#region applyUnifier
  //#region applyUnifierToProofStep
  //#region applyUnifierToSingleNode
  invalidateParseNodeCache(mmpProofStep) {
    if (this.formulaToParseNodeCache != void 0 && mmpProofStep.formula != void 0) {
      const stepFormulaString = concatTokenValuesWithSpaces(mmpProofStep.formula);
      this.formulaToParseNodeCache.invalidate(stepFormulaString);
    }
  }
  applyUnifierToSingleInternalNode(parseNode) {
    let isParseNodeChanged = false;
    for (let i = 0; i < parseNode.parseNodes.length; i++) {
      const child = parseNode.parseNodes[i];
      if (GrammarManager.isInternalParseNodeForWorkingVar(child)) {
        const workingVar = GrammarManager.getTokenValueFromInternalNode(child);
        const substitutionForWorkingVar = this.unifier.get(workingVar);
        if (substitutionForWorkingVar != void 0) {
          parseNode.parseNodes.splice(i, 1, substitutionForWorkingVar);
          isParseNodeChanged = true;
        }
      } else if (child instanceof InternalNode) {
        const isChildChanged = this.applyUnifierToSingleInternalNode(child);
        isParseNodeChanged ||= isChildChanged;
      }
    }
    return isParseNodeChanged;
  }
  // applyUnifierToSingleNode(parseNode: InternalNode | undefined): boolean {
  // 	let isParseNodeChanged = false;
  // 	if (parseNode instanceof InternalNode)
  // 		isParseNodeChanged = this.applyUnifierToSingleInternalNode(parseNode);
  // 	return isParseNodeChanged;
  // }
  //#endregion applyUnifierToSingleNode
  applyUnifierToSubstitution(mmpProofStep) {
    mmpProofStep.substitution?.forEach((internalNode, logicalVar) => {
      if (GrammarManager.isInternalParseNodeForWorkingVar(internalNode)) {
        const workingVar = GrammarManager.getTokenValueFromInternalNode(internalNode);
        const substitutionForWorkingVar = this.unifier.get(workingVar);
        if (substitutionForWorkingVar != void 0)
          mmpProofStep.substitution?.set(logicalVar, substitutionForWorkingVar);
      } else
        this.applyUnifierToSingleInternalNode(internalNode);
    });
  }
  rebuildSubstitution(mmpProofStep) {
    if (mmpProofStep.assertion != void 0) {
      const uSubstitutionBuilder = new MmpSubstitutionBuilder(
        mmpProofStep,
        mmpProofStep.assertion,
        mmpProofStep.mmpProof.outermostBlock,
        mmpProofStep.mmpProof.workingVars,
        mmpProofStep.mmpProof.outermostBlock.grammar,
        []
      );
      const substitutionResult = uSubstitutionBuilder.buildSubstitution();
      if (substitutionResult.hasBeenFound)
        mmpProofStep.substitution = substitutionResult.substitution;
    }
  }
  applyUnifierToProofStep(mmpProofStep) {
    if (mmpProofStep.parseNode != void 0) {
      const isParseNodeChanged = this.applyUnifierToSingleInternalNode(mmpProofStep.parseNode);
      if (isParseNodeChanged) {
        this.invalidateParseNodeCache(mmpProofStep);
      }
    }
    this.rebuildSubstitution(mmpProofStep);
  }
  //#endregion applyUnifierToProofStep
  /**
   * applies the unifier in every step of this.uProof;
   * at the end of the method, this.uProof will have all working vars
   * replaced by the given unifier
   */
  applyUnifier() {
    this.uProof.mmpStatements.forEach((uStatement) => {
      if (uStatement instanceof MmpProofStep)
        this.applyUnifierToProofStep(uStatement);
    });
  }
  //#endregion applyUnifier
};

// yamma/server/src/mmp/WorkingVarReplacerForCompleteProof.ts
var WorkingVarReplacerForCompleteProof = class {
  constructor(uProof) {
    this.uProof = uProof;
  }
  /**
   * Recursive method that traverses the parse node and adds any working var found to the set
   * @param parseNode the parse node to traverse
   * @param workingVars the set of working vars to update
   */
  gatherWorkingVars(parseNode, workingVars) {
    parseNode.parseNodes.forEach((child) => {
      if (GrammarManager.isInternalParseNodeForWorkingVar(child)) {
        const workingVar = GrammarManager.getTokenValueFromInternalNode(child);
        let internalNodes = workingVars.get(workingVar);
        if (internalNodes == void 0) {
          internalNodes = [];
          workingVars.set(workingVar, internalNodes);
        }
        internalNodes.push(child);
      } else if (child instanceof InternalNode)
        this.gatherWorkingVars(child, workingVars);
    });
  }
  /**
   * Returns the set of working vars present in the proof
   */
  getWorkingVars() {
    const workingVars = /* @__PURE__ */ new Map();
    this.uProof.mmpStatements.forEach((mmpStatement) => {
      if (mmpStatement instanceof MmpProofStep && mmpStatement.parseNode != void 0)
        this.gatherWorkingVars(mmpStatement.parseNode, workingVars);
    });
    return workingVars;
  }
  /**
   * Returns the set of variables present in the proof. This is used to avoid using a variable
   * that is already present in the proof (even if it is not mandatory)
   */
  getVarsPresentInProof() {
    const usedVars = /* @__PURE__ */ new Set();
    this.uProof.mmpStatements.forEach((mmpStatement) => {
      if (mmpStatement instanceof MmpProofStep && mmpStatement.parseNode != void 0) {
        const varsInStep = mmpStatement.parseNode.symbolsSubsetOf(this.uProof.outermostBlock.v);
        varsInStep.forEach((v) => usedVars.add(v));
      }
    });
    return usedVars;
  }
  /**
   * Returns a variable of the given kind that is not in the set of used variables
   * @param kind the kind of the variable to find
   * @param usedVars the set of used variables
   */
  findUnusedVar(kind, usedVars) {
    const variables = this.uProof.outermostBlock.v;
    let unusedVar;
    for (const variable of variables) {
      if (this.uProof.outermostBlock.kindOf(variable) == kind && !usedVars.has(variable)) {
        unusedVar = variable;
        break;
      }
    }
    return unusedVar;
  }
  /**
   * Creates a parse node for the given variable, to be used as a replacement
   * @param unusedVar the variable to create the node for
   * @param kind the kind of the variable
   * @returns the created InternalNode, or undefined if the variable definition cannot be found
   */
  createReplacementNode(unusedVar, kind) {
    const fHyp = this.uProof.outermostBlock.varToFHypMap.get(unusedVar);
    if (fHyp) {
      const mmToken = new MmToken(unusedVar, 0, 0, kind);
      const replacementNode = new InternalNode(fHyp.Label, fHyp.Kind, [mmToken]);
      return replacementNode;
    }
    return void 0;
  }
  /**
   * Builds the map of substitutions from working vars to theory vars
   * @param workingVars the working variables to replace
   * @param usedVars the variables currently used in the proof (updated in place)
   * @returns a map where keys are working vars and values are their replacement nodes
   */
  buildUnifier(workingVars, usedVars, diagnostics) {
    const unifier = /* @__PURE__ */ new Map();
    workingVars.forEach((internalNodes, workingVar) => {
      const kind = this.uProof.workingVars.kindOf(workingVar);
      const unusedVar = this.findUnusedVar(kind, usedVars);
      if (unusedVar == void 0) {
        if (diagnostics != void 0) {
          internalNodes.forEach((internalNode) => {
            const mmToken = GrammarManager.getTokenFromInternalNode(internalNode);
            const message = `The proof is complete, but it contains working variables and there are no unused theory variables of kind '${kind}' to replace them.
Please replace this working variable manually.`;
            MmpValidator.addDiagnosticWarning(
              message,
              mmToken.range,
              "proofCompleteButWorkingVarsRemainAndNoUnusedTheoryVars" /* proofCompleteButWorkingVarsRemainAndNoUnusedTheoryVars */,
              diagnostics
            );
          });
        }
      } else {
        const replacementNode = this.createReplacementNode(unusedVar, kind);
        if (replacementNode) {
          unifier.set(workingVar, replacementNode);
          usedVars.add(unusedVar);
        }
      }
    });
    return unifier;
  }
  /**
   * Applies the unification substitution to the proof
   * @param unifier the substitution map
   * @param formulaToParseNodeCache optional cache to update
   */
  applyUnifier(unifier, formulaToParseNodeCache) {
    if (unifier.size > 0) {
      const unifierApplier = new WorkingVarsUnifierApplier(
        unifier,
        this.uProof,
        formulaToParseNodeCache
      );
      unifierApplier.applyUnifier();
    }
  }
  /**
   * Replaces all working vars in the proof with unused variables (in the theory) of the same kind.
   * This is needed when the proof is complete, but still contains working variables.
   * @param formulaToParseNodeCache if provided, the cache will be updated with the new formulas
   */
  replaceWorkingVarsWithTheoryVars(formulaToParseNodeCache, diagnostics) {
    const workingVars = this.getWorkingVars();
    if (workingVars.size > 0) {
      const usedVars = this.getVarsPresentInProof();
      const unifier = this.buildUnifier(workingVars, usedVars, diagnostics);
      this.applyUnifier(unifier, formulaToParseNodeCache);
    }
  }
  /** adds diagnostics for working vars that cannot be replaced by an unused theory variable.
   * This method is used when the prof is complete, but still contains working variables and
   * there are no unused theory variables to replace them with.
   * This method is called both from the MmpUnifier (to check if the proof can be generated) and
   * from the MmpValidator (to add diagnostics after unification). When called from the MmpUnifier,
   * the diagnostics are not sent to the editor, but only used to decide if the proof can be generated.
   * Only when called from the MmpValidator, the diagnostics are actually sent to the editor.
   */
  addDiagnosticsForMissingUnusedVars(diagnostics) {
    const workingVars = this.getWorkingVars();
    if (workingVars.size > 0) {
      const usedVars = this.getVarsPresentInProof();
      this.buildUnifier(workingVars, usedVars, diagnostics);
    }
  }
};

// yamma/server/src/mmp/MmpValidator.ts
var MmpValidator = class _MmpValidator {
  constructor(mmParser, globalState, diagnosticMessageForSyntaxError) {
    this.globalState = globalState;
    this.diagnosticMessageForSyntaxError = diagnosticMessageForSyntaxError;
    this.diagnostics = [];
    this.mmParser = mmParser;
    this.formulaToParseNodeCache = globalState.formulaToParseNodeCache;
  }
  //#region validateFullDocument
  hypStack(assertionStatement) {
    const stack = [];
    assertionStatement.frame?.fHyps.forEach((fHyp) => {
      stack.push(fHyp.formula);
    });
    assertionStatement.frame?.eHyps.forEach((eHyp) => {
      stack.push(eHyp.formula);
    });
    return stack;
  }
  //#region validateFullDocumentText
  async updateStatistics(mmpParser) {
    const mmpStatistics = new MmpStatistics(mmpParser);
    mmpStatistics.buildStatistics();
    this.globalState.mmpStatistics = mmpStatistics;
  }
  addDiagnosticsForProofCompleteAndItContainsWorkingVarsAndThereAreNoUnusedTheoryVars(mmpProof) {
    if (this.globalState.isProofCompleteAndItContainsWorkingVarsAndThereAreNoUnusedTheoryVars) {
      const workingVarReplacerForCompleteProof = new WorkingVarReplacerForCompleteProof(mmpProof);
      workingVarReplacerForCompleteProof.addDiagnosticsForMissingUnusedVars(this.diagnostics);
    }
  }
  validateFullDocumentText(textToValidate, textDocumentUri, mmParser, workingVars) {
    const diagnosticMessageForSyntaxError = this.diagnosticMessageForSyntaxError == ConfigurationManager_default.verbose ? new VerboseDiagnosticMessageForSyntaxError() : new ShortDiagnosticMessageForSyntaxError(
      mmParser.outermostBlock.c,
      mmParser.outermostBlock.v,
      30
    );
    const mmpParserParams = {
      textToParse: textToValidate,
      mmParser,
      disjVarAutomaticGeneration: this.globalState.configurationManager?.globalSettings.disjVarAutomaticGeneration,
      workingVars,
      formulaToParseNodeCache: this.formulaToParseNodeCache,
      diagnosticMessageForSyntaxError,
      documentUri: textDocumentUri
    };
    this.mmpParser = new MmpParser(mmpParserParams);
    console.log("before mmpParser.parse()");
    this.mmpParser.parse();
    console.log("after mmpParser.parse()");
    this.globalState.lastMmpParser = this.mmpParser;
    this.diagnostics = this.mmpParser.diagnostics;
    this.addDiagnosticsForProofCompleteAndItContainsWorkingVarsAndThereAreNoUnusedTheoryVars(this.mmpParser.mmpProof);
    this.updateStatistics(this.mmpParser);
  }
  //#endregionvalidateFullDocumentText
  validateFullDocument(textDocument) {
    this.diagnostics = [];
    console.log("validateFullDocument - this.mmParser:" + this.mmParser);
    if (this.mmParser != void 0 && this.mmParser.isParsingComplete) {
      const textToValidate = textDocument.getText();
      if (this.mmParser.grammar != void 0)
        this.validateFullDocumentText(
          textToValidate,
          textDocument.uri,
          this.mmParser,
          this.mmParser.workingVars
        );
    }
    return this.diagnostics;
  }
  //#endregion validateFullDocument
  static addDiagnosticError(message, range2, code, diagnostics) {
    if (range2.start.line < 0 || range2.start.character < 0 || range2.end.line < 0 || range2.end.character < 0) {
      consoleLogWithTimestamp("diagnostic error NEGATIVE!!!");
    }
    const diagnostic = {
      severity: import_vscode_languageserver7.DiagnosticSeverity.Error,
      message,
      range: range2,
      code,
      source: "yamma"
    };
    diagnostics.push(diagnostic);
  }
  static addDiagnosticWarning(message, range2, code, diagnostics) {
    if (range2.start.line < 0 || range2.start.character < 0 || range2.end.line < 0 || range2.end.character < 0) {
      consoleLogWithTimestamp("diagnostic warning NEGATIVE!!!");
    }
    const diagnostic = {
      severity: import_vscode_languageserver7.DiagnosticSeverity.Warning,
      message,
      range: range2,
      code,
      source: "yamma"
    };
    diagnostics.push(diagnostic);
  }
  //#region buildMmpParserFromUri
  static buildMmpParserFromText(textToParse, disjVarAutomaticGeneration, mmParser, formulaToParseNodeCache) {
    const mmpParserParams = {
      textToParse,
      disjVarAutomaticGeneration,
      mmParser,
      workingVars: mmParser.workingVars,
      formulaToParseNodeCache
    };
    const mmpParser = new MmpParser(mmpParserParams);
    mmpParser.parse();
    return mmpParser;
  }
  static buildMmpParserFromUri(textDocumentUri, documents, disjVarAutomaticGeneration, mmParser, formulaToParseNodeCache) {
    const textToParse = documents.get(textDocumentUri)?.getText();
    let mmpParser;
    if (textToParse != void 0) {
      mmpParser = _MmpValidator.buildMmpParserFromText(
        textToParse,
        disjVarAutomaticGeneration,
        mmParser,
        formulaToParseNodeCache
      );
      return mmpParser;
    }
  }
};

// yamma/server/src/mmp/MmpStatement.ts
var TextForProofStatement = class {
  constructor(statementTokens) {
    this.statementTokens = statementTokens;
  }
  //#region toText
  toText() {
    const text = rebuildOriginalStringFromTokens(this.statementTokens);
    return text;
  }
  //#endregion toText
};

// yamma/server/src/mmp/MmpTheoremLabel.ts
var MmpTheoremLabel = class _MmpTheoremLabel {
  static {
    this.dollarTokenWidhDefaultRange = new MmToken("$theorem", 0, 0);
  }
  constructor(dollarStatementKeyword, theoremLabel) {
    this.dollarStatementKeyword = dollarStatementKeyword;
    this.theoremLabel = theoremLabel;
  }
  toText() {
    const label = this.theoremLabel != void 0 ? this.theoremLabel?.value : "example";
    const text = this.dollarStatementKeyword.value + " " + label;
    return text;
  }
  /** creates a MmpTheoremLabel from the given string, using dummy ranges */
  static CreateMmpTheoremLabel(theoremLabel) {
    const theoremLabelToken = new MmToken(theoremLabel, 0, 9);
    const mmpTheoremLabel = new _MmpTheoremLabel(
      _MmpTheoremLabel.dollarTokenWidhDefaultRange,
      theoremLabelToken
    );
    return mmpTheoremLabel;
  }
};

// yamma/server/src/general/EdgeCliqueCoverFinder.ts
var EdgeCliqueCoverFinder = class {
  /**
   * 
   * @param undirectedGraph 
   */
  constructor(undirectedGraph) {
    this.undirectedGraph = undirectedGraph;
    this.numberOfVertices = this.computeNumberOfVerticesAndCheckData(undirectedGraph);
  }
  /** builds an edge with vertices in the right order */
  static buildEdge(vertex1, vertex2) {
    let edge;
    if (vertex1 < 0 || vertex2 < 0 || vertex1 == vertex2)
      throw new Error("vertex1 and vertex2 must be distinct nonnegative integers");
    else {
      const v1 = Math.min(vertex1, vertex2);
      const v2 = Math.max(vertex1, vertex2);
      edge = {
        vertex1: v1,
        vertex2: v2
      };
    }
    return edge;
  }
  //#region computeNumberOfVerticesAndCheckData
  // private oneIfVertexIsNew(vertex: number, vertices: Set<number>): number {
  // 	let result = 0;
  // 	if (!vertices.has(vertex)) {
  // 		vertices.add(vertex);
  // 		result = 1;
  // 	}
  // 	return result;
  // }
  computeNumberOfVerticesAndCheckData(edges) {
    const vertices = /* @__PURE__ */ new Set();
    edges.forEach((edge) => {
      if (edge.vertex1 >= edge.vertex2)
        throw new Error("it must be edge.v1 < edge.v2");
      else {
        vertices.add(edge.vertex1);
        vertices.add(edge.vertex2);
      }
    });
    const vertexArray = Array.from(vertices).sort((a, b) => a - b);
    if (vertexArray[0] != 0)
      throw new Error("Vertexes must be numbered with nonnegative integers");
    else if (vertexArray[vertexArray.length - 1] != vertexArray.length - 1)
      throw new Error("vertices must be an interval of integers starting from 0");
    return vertices.size;
  }
  //#endregion computeNumberOfVerticesAndCheckData
  //#region findCliqueCover
  //#region handleVertex
  //#region tryToAddThisVertexToEachOfTheExistingCliques
  /** returns the first clique c such that the size of c i^i w is maximal  */
  getCliqueWithMaximalIntersectionWithW(w) {
    let candidate = /* @__PURE__ */ new Set();
    this.cliqueCover.forEach((clique) => {
      if (candidate.size < intersection2(clique, w).size)
        candidate = clique;
    });
    return candidate;
  }
  tryToAddThisVertexToEachOfTheExistingCliques(i, w) {
    let u = /* @__PURE__ */ new Set();
    this.cliqueCover.forEach((clique) => {
      if (subset(clique, w)) {
        clique.add(i);
        u = union2(u, clique);
      }
    });
    w = difference(w, u);
    while (w.size > 0) {
      const cliqueL = this.getCliqueWithMaximalIntersectionWithW(w);
      const cliqueK = union2(intersection2(cliqueL, w), (/* @__PURE__ */ new Set()).add(i));
      this.cliqueCover.add(cliqueK);
      w = difference(w, cliqueL);
    }
  }
  //#endregion tryToAddThisVertexToEachOfTheExistingCliques
  handleVertex(i) {
    const w = this.undirectedGraph.filter((edge) => edge.vertex2 == i).map((edge) => edge.vertex1);
    if (w.length == 0)
      this.cliqueCover.add((/* @__PURE__ */ new Set()).add(i));
    else
      this.tryToAddThisVertexToEachOfTheExistingCliques(i, new Set(w));
  }
  //#endregion handleVertex
  findEdgeCliqueCover() {
    this.cliqueCover = /* @__PURE__ */ new Set();
    for (let i = 0; i < this.numberOfVertices; i++) {
      this.handleVertex(i);
    }
    return this.cliqueCover;
  }
  //#endregion findCliqueCover
};

// yamma/server/src/mmp/MmpDisjVarStatement.ts
var MmpDisjVarStatement = class _MmpDisjVarStatement {
  // constructor(var1: string, var2: string) {
  constructor(disjointVars) {
    this.disjointVars = disjointVars;
  }
  get range() {
    const range2 = arrayRange(this.disjointVars);
    return range2;
  }
  /** creates a MmpDisjVarStatement with dummy ranges */
  static CreateMmpDisjVarStatement(var1, var2) {
    const disjVarStatement = new _MmpDisjVarStatement([new MmToken(var1, 0, 0), new MmToken(var2, 0, 0)]);
    return disjVarStatement;
  }
  toText() {
    if (this._toText == void 0) {
      const statementContent = concatTokenValuesWithSpaces(this.disjointVars);
      this._toText = `$d ${statementContent}`;
    }
    return this._toText;
  }
  /** returns the text for a $d statement for two vars*/
  static textForTwoVars(var1, var2) {
    const statementText = `$d ${var1} ${var2}`;
    return statementText;
  }
  //#region buildEdgeCliqueCover
  //#region buildEdgeCliqueCoverFromNumbers
  static buildEdgeCliqueCoverSet(undirectedGraph) {
    const edgeCliqueCoverFinder = new EdgeCliqueCoverFinder(undirectedGraph);
    const edgeCliqueCover = edgeCliqueCoverFinder.findEdgeCliqueCover();
    return edgeCliqueCover;
  }
  //#region produceDisjVarMmpStatements
  //#region produceDisjVarMmpStatement
  //#region getDisjVarMmpStatementContent
  static getStrDisjVarMmpStatementContent(clique, numberToVarMap) {
    const strStatementContent = [];
    clique.forEach((vertex) => {
      const logicalVariable = numberToVarMap[vertex];
      strStatementContent.push(logicalVariable);
    });
    strStatementContent.sort();
    return strStatementContent;
  }
  static getDisjVarMmpStatementContentFromStrings(strStatementContent) {
    const disjVarMmpStatementContent = [];
    strStatementContent.forEach((logicalVariable) => {
      const token = new MmToken(logicalVariable, 0, 0);
      disjVarMmpStatementContent.push(token);
    });
    return disjVarMmpStatementContent;
  }
  static getDisjVarMmpStatementContent(clique, numberToVarMap) {
    const strStatementContent = _MmpDisjVarStatement.getStrDisjVarMmpStatementContent(clique, numberToVarMap);
    const statementContent = _MmpDisjVarStatement.getDisjVarMmpStatementContentFromStrings(strStatementContent);
    return statementContent;
  }
  //#endregion getDisjVarMmpStatementContent
  static produceDisjVarMmpStatement(clique, numberToVarMap) {
    const statementContent = _MmpDisjVarStatement.getDisjVarMmpStatementContent(clique, numberToVarMap);
    const mmpDisjVarStatement = new _MmpDisjVarStatement(statementContent);
    return mmpDisjVarStatement;
  }
  //#endregion produceDisjVarMmpStatement
  static produceUnsortedDisjVarMmpStatements(edgeCliqueCoverSet, numberToVarMap) {
    const mmpDisjVarStatements = [];
    edgeCliqueCoverSet.forEach((clique) => {
      const mmpDisjVarStatement = _MmpDisjVarStatement.produceDisjVarMmpStatement(
        clique,
        numberToVarMap
      );
      mmpDisjVarStatements.push(mmpDisjVarStatement);
    });
    return mmpDisjVarStatements;
  }
  static compare(mmpDisjVarStatement1, mmpDisjVarStatement2) {
    const output = mmpDisjVarStatement1.toText() <= mmpDisjVarStatement2.toText() ? -1 : 1;
    return output;
  }
  static produceDisjVarMmpStatements(edgeCliqueCoverSet, numberToVarMap) {
    const mmpDisjVarStatements = _MmpDisjVarStatement.produceUnsortedDisjVarMmpStatements(edgeCliqueCoverSet, numberToVarMap);
    _MmpDisjVarStatement.produceUnsortedDisjVarMmpStatements(edgeCliqueCoverSet, numberToVarMap);
    mmpDisjVarStatements.sort(_MmpDisjVarStatement.compare);
    return mmpDisjVarStatements;
  }
  //#endregion produceDisjVarMmpStatements
  static buildEdgeCliqueCoverFromNumbers(undirectedGraph, numberToVarMap) {
    const edgeCliqueCoverSet = _MmpDisjVarStatement.buildEdgeCliqueCoverSet(undirectedGraph);
    const edgeCliqueCover = _MmpDisjVarStatement.produceDisjVarMmpStatements(edgeCliqueCoverSet, numberToVarMap);
    return edgeCliqueCover;
  }
  //#endregion buildEdgeCliqueCoverFromNumbers
  /**
   * receives an array of disjoint var statements and builds a heuristic edge clique cover
   * of the represented undirected graph (for a compact representation of the graph)
   * @param mmpDisjVarStatements array of MmpDisjVarStatement representing the undirected graph
   * @returns 
   */
  static buildNumberToVarMap(mmpDisjVarStatements) {
    const numberToVarMap = [];
    mmpDisjVarStatements.forEach((mmpDisjVarStatement) => mmpDisjVarStatement.disjointVars.forEach(
      (logicalVariable) => {
        if (!numberToVarMap.includes(logicalVariable.value))
          numberToVarMap.push(logicalVariable.value);
      }
    ));
    return numberToVarMap;
  }
  static buildVarToNumberMap(numberToVarMap) {
    const varToNumberMap = /* @__PURE__ */ new Map();
    for (let i = 0; i < numberToVarMap.length; i++) {
      const logicalVariable = numberToVarMap[i];
      varToNumberMap.set(logicalVariable, i);
    }
    return varToNumberMap;
  }
  //#region buildUndirectedGraph
  //#region addEdgesForSingleMmpDisjVarStatement
  static buildEdge(i, j, logicalVars, varToNumberMap) {
    let edge;
    const vertex1 = varToNumberMap.get(logicalVars[i].value);
    const vertex2 = varToNumberMap.get(logicalVars[j].value);
    if (vertex1 != void 0 && vertex2 != void 0)
      edge = EdgeCliqueCoverFinder.buildEdge(vertex1, vertex2);
    return edge;
  }
  static addEdgesForSingleMmpDisjVarStatement(logicalVars, varToNumberMap, undirectedGraph) {
    for (let j = 0; j < logicalVars.length; j++)
      for (let i = 0; i < j; i++) {
        const edge = this.buildEdge(i, j, logicalVars, varToNumberMap);
        if (edge != void 0 && !undirectedGraph.includes(edge))
          undirectedGraph.push(edge);
      }
  }
  //#endregion addEdgesForSingleMmpDisjVarStatement
  static buildUndirectedGraph(mmpDisjVarStatements, varToNumberMap) {
    const undirectedGraph = [];
    mmpDisjVarStatements.forEach((mmpDisjVarStatement) => {
      this.addEdgesForSingleMmpDisjVarStatement(
        mmpDisjVarStatement.disjointVars,
        varToNumberMap,
        undirectedGraph
      );
    });
    return undirectedGraph;
  }
  //#endregion buildUndirectedGraph
  /**
   * Given an array of disj var statements produces a heuristic edge clique cover,
   * and then a compact representation of the (pair of) constraints
   * @param mmpDisjVarStatements an array of disj var statements
   * @returns 
   */
  static buildEdgeCliqueCover(mmpDisjVarStatements) {
    const numberToVarMap = _MmpDisjVarStatement.buildNumberToVarMap(mmpDisjVarStatements);
    const varToNumberMap = _MmpDisjVarStatement.buildVarToNumberMap(numberToVarMap);
    const undirectedGraph = _MmpDisjVarStatement.buildUndirectedGraph(
      mmpDisjVarStatements,
      varToNumberMap
    );
    const edgeCliqueCover = this.buildEdgeCliqueCoverFromNumbers(
      undirectedGraph,
      numberToVarMap
    );
    return edgeCliqueCover;
  }
  //#endregion buildEdgeCliqueCover
};

// yamma/server/src/general/Parameters.ts
var Parameters = class {
  static {
    /** the leftmost position of a formula in a mmp proof displayed in indented mode */
    this.startCharForIndentedMmpFormula = 20;
  }
  static {
    this.defaultLeftMarginForCompressedProofs = 0;
  }
  static {
    this.charactersPerLine = 79;
  }
  static {
    // static defaultRightMarginForNormalProofs = 80
    this.defaultLeftMarginForMmtFilesCompressedProof = 6;
  }
  static {
    /** the minimum number of characters, for a partial label, that triggers
     * the 'last resort' step suggestion
     */
    this.numberOfCharsTriggeringCompletionItemsFromPartialLabel = 1;
  }
  static {
    /** the maximum number of characters that will populate a new search statement
     * (computed from the statemente where the cursor is placed)
     */
    this.maxNumberOfSymbolsComputedForSearch = 3;
  }
  static {
    /** max number of hypothesis dispositions to be tried for a single
     * assertion, candidate for a step derivation; for instance, if
     * a logical assertion has 3 hypothesis and the step to be derived
     * follows 10 steps, then in the worst case, 10^3 dispositions
     * should be tried; if the worst case exceedes this parameter,
     * the derivation is not even tried
     */
    this.maxNumberOfHypothesisDispositionsForStepDerivation = 1e5;
  }
  static {
    this.defaultComment = "* MissingComment";
  }
  static {
    this.dummyConstraintsComment = "* Dummy $d constraints are listed below";
  }
  static {
    this.newlyAddedConstraintComment = "* The newly added $d constraints are listed below (unify to classify them as mandatory or dummy)";
  }
};

// yamma/server/src/mmp/proofCompression/MmpFifoLabelMapCreator.ts
var MmpFifoLabelMapCreator = class {
  createLabelMap(createLabelMapArgs) {
    const labelSequence = /* @__PURE__ */ new Map();
    createLabelMapArgs.mmpPackedProofStatement.packedProof?.forEach((rpnStep) => {
      if (rpnStep.labeledStatement != void 0) {
        const label = rpnStep.labeledStatement.Label;
        if (!createLabelMapArgs.mandatoryHypsLabels.has(label) && labelSequence.get(label) == void 0) {
          const i = labelSequence.size + 1;
          labelSequence.set(label, i);
        }
      }
    });
    return labelSequence;
  }
};

// yamma/server/src/mmp/ProofNode.ts
var ProofNode = class _ProofNode {
  constructor(internalNode, children, mmpProofStep) {
    this.internalNode = internalNode;
    this.children = children;
    this.mmpProofStep = mmpProofStep;
  }
  toText() {
    let text;
    if (this.mmpProofStep != void 0)
      text = this.mmpProofStep.stepLabel;
    else
      text = this.internalNode.label;
    return text;
  }
  get cachedRpnRepresentation() {
    const representation = this.internalNode.cachedRpnRepresentation;
    return representation;
  }
  //#region proofNodeForParseNode
  static proofNodesWithSubstitution(outermostBlock, substitutionInRpnOrder) {
    const proofNodes = [];
    substitutionInRpnOrder.forEach((substitution) => {
      const proofNode = _ProofNode.proofNodeForParseNode(substitution, outermostBlock);
      proofNodes.push(proofNode);
    });
    return proofNodes;
  }
  static proofNodeForParseNode(parseNode, outermostBlock) {
    const substitutionInRpnOrder = parseNode.buildSubstitutionInRpnOrder(
      outermostBlock,
      outermostBlock.grammar
    );
    const children = _ProofNode.proofNodesWithSubstitution(
      outermostBlock,
      substitutionInRpnOrder
    );
    const proofNode = new _ProofNode(parseNode, children);
    return proofNode;
  }
  //#endregion proofNodeForParseNode
  //#region proofNode
  //#region proofNodeChildren
  //#region addProofNodesForFStatements
  static addProofNodesForFStatements(mmpProofStep, proofNodes) {
    const mandatoryVarsInRPNorder = mmpProofStep.getMandatoryVarsInRPNorder(mmpProofStep.mmpProof.outermostBlock);
    mandatoryVarsInRPNorder.forEach((logicalVar) => {
      const logicalVarSubstitutionNode = mmpProofStep.substitution?.get(logicalVar);
      const proofNode = _ProofNode.proofNodeForParseNode(
        logicalVarSubstitutionNode,
        mmpProofStep.mmpProof.outermostBlock
      );
      proofNodes.push(proofNode);
    });
  }
  //#endregion addProofNodesForFStatements
  static addProofNodesForEHyps(mmpProofStep, output) {
    mmpProofStep.eHypUSteps.forEach((eHyp) => {
      if (eHyp instanceof MmpProofStep) {
        const proofNode = _ProofNode.proofNodeForMmpProofStep(eHyp);
        output.push(proofNode);
      }
    });
  }
  static proofNodeChildren(mmpProofStep) {
    const output = [];
    if (mmpProofStep.substitution != void 0)
      this.addProofNodesForFStatements(mmpProofStep, output);
    this.addProofNodesForEHyps(mmpProofStep, output);
    return output;
  }
  //#endregion proofNodeChildren
  static proofNodeForMmpProofStep(mmpProofStep) {
    const children = _ProofNode.proofNodeChildren(mmpProofStep);
    const output = new _ProofNode(mmpProofStep.parseNode, children, mmpProofStep);
    return output;
  }
  //#endregion proofNode
  //#region squishProofNode
  static squishProofNodeChildren(children, encountered) {
    for (let i = 0; i < children.length; i++) {
      children[i] = _ProofNode.squishProofNode2(children[i], encountered);
    }
  }
  static squishProofNode2(proofNode, encountered) {
    if (proofNode.children != void 0)
      _ProofNode.squishProofNodeChildren(proofNode.children, encountered);
    let output = proofNode;
    const mayBeEncountered = encountered.get(proofNode.cachedRpnRepresentation);
    if (mayBeEncountered != void 0)
      output = mayBeEncountered;
    else
      encountered.set(proofNode.cachedRpnRepresentation, proofNode);
    return output;
  }
  static squishProofNode(proofNode) {
    const output = _ProofNode.squishProofNode2(proofNode, /* @__PURE__ */ new Map());
    return output;
  }
  //#endregion squishProofNode
};

// yamma/server/src/mmp/RPNstep.ts
var RpnStep = class _RpnStep {
  //#endregion isMarkedStepCandidate
  constructor(proofNode, outermostBlock, backRef) {
    this.proofNode = proofNode;
    this.outermostBlock = outermostBlock;
    this.backRef = backRef;
    this.isMarkedStep = false;
    const label = this.labelForCompressedProof;
    this.labeledStatement = outermostBlock.mmParser.labelToStatementMap.get(label);
  }
  get isLogHyp() {
    const output = this.proofNode.mmpProofStep != void 0 && this.proofNode.mmpProofStep.isEHyp;
    return output;
  }
  get isVarHyp() {
    const output = this.proofNode.mmpProofStep == void 0;
    return output;
  }
  /** true iff it is a logHyp or a varHyp */
  get isHyp() {
    const output = this.isLogHyp || this.isVarHyp;
    return output;
  }
  get isBackRefStep() {
    const output = this.backRef != void 0;
    return output;
  }
  //#region isMarkedStepCandidate
  /** true iff the proof for the given proof node is a single label; we don't want
   * this kind of RPNStep to be a marked step. This is similar the mmj2 behaviour,
   * see the paramater pressLeaf given as true to the mmj2 method
   * ParseNode.convetToRPN(final boolean pressLeaf)
   */
  isSingleStepProof(proofNode) {
    const output = proofNode.children.length == 0;
    return output;
  }
  /** true iff its proof is a single step. It is used by  */
  get isMarkedStepCandidate() {
    const output = !this.proofNode.mmpProofStep?.isEHyp && !this.isSingleStepProof(this.proofNode);
    return output;
  }
  //#region labelForCompressedProof
  get labelForCompressedProof() {
    let output;
    if (this.backRef != void 0)
      output = this.backRef.labelForCompressedProof;
    else {
      if (this.proofNode.mmpProofStep != void 0)
        output = this.proofNode.mmpProofStep.stepLabel;
      else
        output = this.proofNode.internalNode.label;
    }
    return output;
  }
  //#endregion labelForCompressedProof
  //#region packetProof
  /** this is similar to the ParseNode.convertToRPN() method in mmj2	 */
  //#region packetProof2
  //#region packedProofForAStepThatIsNotABackreference
  //#region addCurrentProofNode
  static isUnmarkedStep(proofNode, outermostBlock) {
    const isUnmarked = GrammarManager.isInternalParseNodeForFHyp(
      proofNode.internalNode,
      outermostBlock.v
    );
    return isUnmarked;
  }
  static createRpnStep(proofNode, outermostBlock, encountered) {
    let rpnStep;
    if (_RpnStep.isUnmarkedStep(proofNode, outermostBlock))
      rpnStep = new _RpnStep(proofNode, outermostBlock, void 0);
    else {
      rpnStep = new _RpnStep(proofNode, outermostBlock, void 0);
      encountered.set(proofNode, rpnStep);
    }
    return rpnStep;
  }
  static addCurrentProofNode(proofNode, outermostBlock, encountered, rpnSteps) {
    const currentProofNode = _RpnStep.createRpnStep(
      proofNode,
      outermostBlock,
      encountered
    );
    rpnSteps.push(currentProofNode);
  }
  //#endregion addCurrentProofNode
  static packedProofForAStepThatIsNotABackreference(proofNode, outermostBlock, encountered, rpnSteps) {
    proofNode.children.forEach((child) => {
      this.packedProof2(child, outermostBlock, encountered, rpnSteps);
    });
    _RpnStep.addCurrentProofNode(
      proofNode,
      outermostBlock,
      encountered,
      rpnSteps
    );
  }
  //#endregion packedProofForAStepThatIsNotABackreference
  static packedProof2(proofNode, outermostBlock, encountered, rpnSteps) {
    const referencedStep = encountered.get(proofNode);
    if (referencedStep != void 0 && referencedStep.isMarkedStepCandidate) {
      referencedStep.isMarkedStep = true;
      const rpnStep = new _RpnStep(proofNode, outermostBlock, referencedStep);
      rpnSteps.push(rpnStep);
    } else
      _RpnStep.packedProofForAStepThatIsNotABackreference(
        proofNode,
        outermostBlock,
        encountered,
        rpnSteps
      );
  }
  //#endregion packetProof2
  static setMarkedStepNumber(rpnSteps) {
    let nextMarkedStatementIndex = 1;
    rpnSteps.forEach((rpnStep) => {
      if (rpnStep.isMarkedStep && rpnStep.markedStepNumber == void 0)
        rpnStep.markedStepNumber = nextMarkedStatementIndex++;
    });
  }
  static packedProof(proofNode, outermostBlock) {
    const squishedProofNode = ProofNode.squishProofNode(proofNode);
    const encountered = /* @__PURE__ */ new Map();
    const rpnSteps = [];
    _RpnStep.packedProof2(squishedProofNode, outermostBlock, encountered, rpnSteps);
    _RpnStep.setMarkedStepNumber(rpnSteps);
    return rpnSteps;
  }
  //#endregion packetProof
  toText() {
    let text;
    if (this.backRef != void 0)
      text = this.backRef.markedStepNumber.toString();
    else if (this.markedStepNumber != void 0)
      text = `${this.markedStepNumber}:${this.proofNode.toText()}`;
    else
      text = this.proofNode.toText();
    return text;
  }
};

// yamma/server/src/mmp/proofCompression/MmpPackedProofStatement.ts
var MmpPackedProofStatement = class {
  constructor(mmpProof, charactersPerLine) {
    this.mmpProof = mmpProof;
    this.charactersPerLine = charactersPerLine;
    this.packedProof = this.createPackedProof();
  }
  createPackedProof() {
    const proofNode = ProofNode.proofNodeForMmpProofStep(this.mmpProof.lastMmpProofStep);
    this.packedProof = RpnStep.packedProof(proofNode, this.mmpProof.outermostBlock);
    return this.packedProof;
  }
  //#region toText
  rpnPackedStepLabels() {
    const packedStepLabels = [];
    this.packedProof.forEach((rpnStep) => {
      const packedStepLabel = rpnStep.toText();
      packedStepLabels.push(packedStepLabel);
    });
    return packedStepLabels;
  }
  buildLabelRows(labels, charactersPerLine) {
    const labelRows = [];
    const start = "$=  ";
    const leftPadding = "    ";
    let currentRow = start;
    labels.forEach((label) => {
      if (currentRow.length + label.length + 1 > charactersPerLine) {
        labelRows.push(currentRow);
        currentRow = leftPadding;
      } else if (currentRow != start && currentRow != leftPadding)
        currentRow += " ";
      currentRow += label;
    });
    if (currentRow != start && currentRow != leftPadding)
      labelRows.push(currentRow);
    return labelRows;
  }
  toText() {
    const labels = this.rpnPackedStepLabels();
    const labelRows = this.buildLabelRows(labels, this.charactersPerLine);
    const labelsString = labelRows.join("\n");
    let text = "\n" + labelsString;
    const lastRowOfLabels = labelRows[labelRows.length - 1];
    if (lastRowOfLabels.length > this.charactersPerLine - 3)
      text += "\n$.";
    else
      text += " $.\n";
    return text;
  }
  //#endregion toText
};

// yamma/server/src/mmp/proofCompression/MmpCompressedProofStatementFromPackedProof.ts
var MmpCompressedProofStatementFromPackedProof = class {
  // constructor(uProof: UProof, outermostBlock: BlockStatement) {
  /**
   * a statement that represents a compressed proof
   * @param uProof 
   * @param leftMargin the number of spaces to the left of the proof
   * @param charactersPerLine the max text column for the proof
   */
  constructor(uProof, leftMargin, charactersPerLine, labelSequenceCreator) {
    this.uProof = uProof;
    if (leftMargin != void 0)
      this._leftMargin = leftMargin;
    else
      this._leftMargin = Parameters.defaultLeftMarginForCompressedProofs;
    if (charactersPerLine != void 0)
      this._charactersPerLine = charactersPerLine;
    else
      this._charactersPerLine = Parameters.charactersPerLine;
    this._labelSequenceCreator = this.setLabelSequenceCreator(labelSequenceCreator);
    this.labelMap = /* @__PURE__ */ new Map();
    this.upperCaseLetterSequence = [];
    this._mandatoryHypsLabels = /* @__PURE__ */ new Map();
    this._mmpPackedProofStatement = new MmpPackedProofStatement(this.uProof, 80);
    this.createCompressedProof();
  }
  setLabelSequenceCreator(labelSequenceCreator) {
    if (labelSequenceCreator != void 0)
      this._labelSequenceCreator = labelSequenceCreator;
    else
      this._labelSequenceCreator = new MmpFifoLabelMapCreator();
    return this._labelSequenceCreator;
  }
  //#region createCompressedProof
  //#region createMandatoryHypsLabels
  addMandatoryHypLabel(label) {
    const i = this._mandatoryHypsLabels.size + 1;
    this._mandatoryHypsLabels.set(label, i);
  }
  //this is assumed to be invoked by createCompressedProof() and then every eHyp is expected to
  //have a label and a parse node
  createMandatoryHypsLabels() {
    const mandatoryFHypsLabelsInRPNorder = this.uProof.mandatoryFHypsLabelsInRPNorder;
    mandatoryFHypsLabelsInRPNorder.forEach((label) => {
      this.addMandatoryHypLabel(label);
    });
    this.uProof.mmpStatements.forEach((uStatement) => {
      if (uStatement instanceof MmpProofStep && uStatement.isEHyp)
        this.addMandatoryHypLabel(uStatement.stepLabel);
    });
  }
  //#endregion createMandatoryHypsLabels
  createLabelSequence() {
    const createLabelMapArgs = {
      mandatoryHypsLabels: new Set(this._mandatoryHypsLabels.keys()),
      proofInNormalMode: this._proofInNormalMode,
      mmpPackedProofStatement: this._mmpPackedProofStatement
    };
    this.labelMap = this._labelSequenceCreator.createLabelMap(createLabelMapArgs);
  }
  //#region createUpperCaseLetterSequence
  //#region upperCaseLettersFromNumber
  base5base20representation(givenNumber) {
    const result = [];
    const leastSignificantDigit = givenNumber % 20 == 0 ? 20 : givenNumber % 20;
    result.push(leastSignificantDigit);
    let num = Math.floor((givenNumber - leastSignificantDigit) / 20);
    while (num > 0) {
      const digit = num % 5 == 0 ? 5 : num % 5;
      result.push(digit);
      num = Math.floor((num - digit) / 5);
    }
    return result.reverse();
  }
  upperCaseLettersFromNumber(givenNumber) {
    const upperCaseLetters = [];
    const base5base20representation = this.base5base20representation(givenNumber);
    for (let i = 0; i < base5base20representation.length - 1; i++) {
      const num = base5base20representation[i];
      const upperCaseLetter = String.fromCharCode(84 + num);
      upperCaseLetters.push(upperCaseLetter);
    }
    const letterForLeastSignificantDigit = String.fromCharCode(64 + base5base20representation[base5base20representation.length - 1]);
    upperCaseLetters[base5base20representation.length - 1] = letterForLeastSignificantDigit;
    return upperCaseLetters;
  }
  //#endregion upperCaseLettersFromNumber
  //#region getUpperCaseLettersForThisStep
  getCurrentNumber(rpnStep) {
    const label = rpnStep.labelForCompressedProof;
    let currentNumber;
    if (rpnStep.backRef != void 0)
      currentNumber = this._mandatoryHypsLabels.size + this.labelMap.size + rpnStep.backRef.markedStepNumber;
    else {
      currentNumber = this._mandatoryHypsLabels.get(label);
      if (currentNumber == void 0)
        currentNumber = this._mandatoryHypsLabels.size + this.labelMap.get(label);
    }
    return currentNumber;
  }
  getUpperCaseLettersForThisStep(rpnStep) {
    const currentNumber = this.getCurrentNumber(rpnStep);
    const currentUpperCaseLetters = this.upperCaseLettersFromNumber(currentNumber);
    if (rpnStep.isMarkedStep)
      currentUpperCaseLetters.push("Z");
    return currentUpperCaseLetters;
  }
  //#endregion getUpperCaseLettersForThisStep
  createUpperCaseLetterSequence() {
    this._mmpPackedProofStatement.packedProof.forEach((rpnStep) => {
      const upperCaseLettersForThisStep = this.getUpperCaseLettersForThisStep(rpnStep);
      this.upperCaseLetterSequence.push(...upperCaseLettersForThisStep);
    });
  }
  //#endregion createUpperCaseLetterSequence
  createCompressedProof() {
    this.createMandatoryHypsLabels();
    this.createLabelSequence();
    this.createUpperCaseLetterSequence();
  }
  //#endregion createCompressedProof
  //#region toText
  get stringForLabelSequence() {
    const labelsArray = Array.from(this.labelMap.keys());
    const result = concatWithSpaces(labelsArray);
    return result;
  }
  // in .mmp file we have to add left padding, from the second row on, to signal
  // it is a single statement; in .mmt files, instead, all rows in the proof
  // have the same left alignment
  computeLeftPaddingForTheSecondRow() {
    const leftPadding = this._leftMargin == 0 ? 3 : this._leftMargin;
    return leftPadding;
  }
  addLabels(currentRow, text) {
    this.labelMap.forEach((_value, label) => {
      if (currentRow.length + label.length + 1 <= this._charactersPerLine)
        currentRow += " " + label;
      else {
        text[0] += currentRow + "\n";
        const leftPadding = this.computeLeftPaddingForTheSecondRow();
        currentRow = " ".repeat(leftPadding) + label;
      }
    });
    if (currentRow.length <= this._charactersPerLine - 3) {
      currentRow += " ) ";
    } else {
      if (currentRow.length == this._charactersPerLine - 2)
        currentRow += " )";
      else {
        text[0] += currentRow + "\n";
        const leftPadding = this.computeLeftPaddingForTheSecondRow();
        currentRow = " ".repeat(leftPadding) + ") ";
      }
    }
    return currentRow;
  }
  addUpperCaseLetterSequenceAnd(currentRow, text) {
    this.upperCaseLetterSequence.forEach((upperCaseLetter) => {
      if (currentRow.length < this._charactersPerLine)
        currentRow += upperCaseLetter;
      else {
        text[0] += currentRow + "\n";
        const leftPadding = this.computeLeftPaddingForTheSecondRow();
        currentRow = " ".repeat(leftPadding) + upperCaseLetter;
      }
    });
    text[0] += currentRow;
    return currentRow;
  }
  toText() {
    const text = [""];
    let lastRow = " ".repeat(this._leftMargin) + "$= (";
    if (this._leftMargin > 0)
      lastRow = " ".repeat(this._leftMargin) + "(";
    lastRow = this.addLabels(lastRow, text);
    lastRow = this.addUpperCaseLetterSequenceAnd(lastRow, text);
    if (lastRow.length > this._charactersPerLine - 3)
      text[0] += "\n$.";
    else
      text[0] += " $.";
    return text[0];
  }
  //#endregion toText
};

// yamma/server/src/mmp/MmpProofFormatter.ts
var MmpProofFormatter = class {
  constructor(uProof) {
    this.uProof = uProof;
  }
  //#region toText
  //#region computeIndentationLevels
  updateIndentationLevel(uProofStep, currentLevel) {
    if (uProofStep.indentationLevel == void 0 || uProofStep.indentationLevel < currentLevel) {
      uProofStep.indentationLevel = currentLevel;
      uProofStep.eHypUSteps.forEach((eHypUStep) => {
        if (eHypUStep instanceof MmpProofStep)
          this.updateIndentationLevel(eHypUStep, currentLevel + 1);
      });
    }
  }
  computeIndentationLevels() {
    for (let i = this.uProof.mmpStatements.length - 1; i >= 0; i--) {
      const uStatement = this.uProof.mmpStatements[i];
      if (uStatement instanceof MmpProofStep)
        this.updateIndentationLevel(uStatement, 0);
    }
  }
  //#endregion 
  //#region textForUProofStep
  getTextForFormula(uProofStep) {
    let textForFormula = "";
    if (uProofStep.parseNode != void 0)
      textForFormula = GrammarManager.buildStringFormula(uProofStep.parseNode);
    else if (uProofStep.stepFormula != void 0)
      textForFormula = concatTokenValuesWithSpaces(uProofStep.stepFormula);
    return textForFormula;
  }
  textForUProofStep(uProofStep) {
    const textForFirstTokenInfo = uProofStep.textForFirstTokenInfo();
    let text = textForFirstTokenInfo;
    const formulaStartingColumn = Parameters.startCharForIndentedMmpFormula + uProofStep.indentationLevel;
    let spacePadding;
    if (textForFirstTokenInfo.length >= Parameters.startCharForIndentedMmpFormula - 1) {
      text += "\n";
      spacePadding = formulaStartingColumn - 1;
    } else
      spacePadding = formulaStartingColumn - 1 - textForFirstTokenInfo.length;
    const textFormula = this.getTextForFormula(uProofStep);
    if (textFormula.length > 0)
      text += " ".repeat(spacePadding) + textFormula;
    return text;
  }
  //#endregion textForUProofStep
  textWithIndentedProof() {
    this.computeIndentationLevels();
    let text = "";
    this.uProof.mmpStatements.forEach((uStatement, i) => {
      let uStatementText;
      if (uStatement instanceof MmpProofStep)
        uStatementText = this.textForUProofStep(uStatement);
      else {
        uStatementText = uStatement.toText();
        if (uStatement == this.uProof.mainComment || // uStatement instanceof UCompressedProofStatement ||
        uStatement instanceof MmpCompressedProofStatementFromPackedProof)
          uStatementText = `
${uStatementText}
`;
        else if (uStatement == this.uProof.commentForDummyConstraints || uStatement instanceof MmpDisjVarStatement && this.uProof.mmpStatements[i - 1] == this.uProof.lastMmpProofStep)
          uStatementText = `
${uStatementText}`;
      }
      text = text + uStatementText + "\n";
    });
    return text;
  }
};

// yamma/server/src/mmp/MmpAllowDiscouraged.ts
var MmpAllowDiscouraged = class {
  constructor(dollarStatementKeyword) {
    this.dollarStatementKeyword = dollarStatementKeyword;
  }
  toText() {
    const text = this.dollarStatementKeyword.value;
    return text;
  }
};

// yamma/server/src/mmp/MmpComment.ts
var MmpComment = class _MmpComment {
  constructor(contentTokens, comment) {
    this.contentTokens = contentTokens;
    this.comment = comment;
  }
  static CreateMmpComment(comment) {
    const commentMmTokens = splitToTokensDefault(comment);
    const mmpComment = new _MmpComment(commentMmTokens, comment);
    return mmpComment;
  }
  toText() {
    return this.comment;
  }
};

// yamma/server/src/mmp/MmpProof.ts
var MmpProof = class {
  constructor(outermostBlock, workingVars, startIndexForNewRefs) {
    this.startIndexForNewRefs = startIndexForNewRefs;
    this.maxRefAlreadyAssigned = 0;
    this.mmpTheoremLabels = [];
    this.allowDiscouragedStatement = false;
    /** the number of steps added by the unification; this is added to
     * this.formulaToProofStepMap to find the real step index
     */
    this.statementsInsertedAtASpecificIndexSoFar = 0;
    this.outermostBlock = outermostBlock;
    this.workingVars = workingVars;
    if (startIndexForNewRefs != void 0)
      this.maxRefAlreadyAssigned = startIndexForNewRefs - 1;
    this.mmpStatements = [];
    this.disjVars = new DisjointVarMap();
    this.eHyps = [];
    this.disjVarMmpStatements = [];
    this.formulaToProofStepMap = /* @__PURE__ */ new Map();
  }
  /** the theorem label is expected to be the first statement */
  get theoremLabel() {
    let theoremLabel;
    if (this.mmpStatements[0] instanceof MmpTheoremLabel && this.mmpStatements[0].theoremLabel != void 0)
      theoremLabel = this.mmpStatements[0].theoremLabel;
    return theoremLabel;
  }
  //TODO1 NOV 10 2023 add a test fot this getter
  /** true iff the proof is complete (a proof statement has been generated) */
  get isProofComplete() {
    const result = this.proofStatement != void 0;
    return result;
  }
  // needed to implement ITheoremSignature
  get pStatement() {
    let pStat;
    if (this.lastMmpProofStep?.stepRef == "qed")
      pStat = this.lastMmpProofStep;
    return pStat;
  }
  reset() {
    this.maxRefAlreadyAssigned = 0;
    if (this.startIndexForNewRefs != void 0)
      this.maxRefAlreadyAssigned = this.startIndexForNewRefs - 1;
    this.mmpStatements = [];
    this.disjVars = new DisjointVarMap();
    this.eHyps = [];
    this.disjVarMmpStatements = [];
    this.formulaToProofStepMap = /* @__PURE__ */ new Map();
  }
  //#region mandatoryVars
  /** the set of the mandatory vars for this UProof */
  setMandatoryVars() {
    const result = /* @__PURE__ */ new Set();
    this.mmpStatements.forEach((uStatement) => {
      if (uStatement instanceof MmpProofStep && (uStatement.isEHyp || uStatement.stepRef == "qed") && uStatement.parseNode != void 0) {
        const mandatoryVarsForThisStatement = uStatement.parseNode.symbolsSubsetOf(this.outermostBlock.v);
        mandatoryVarsForThisStatement.forEach((mandatoryVar) => {
          if (!result.has(mandatoryVar))
            result.add(mandatoryVar);
        });
      }
    });
    return result;
  }
  get mandatoryVars() {
    if (this._mandatoryVars == void 0)
      this._mandatoryVars = this.setMandatoryVars();
    return this._mandatoryVars;
  }
  //#endregion mandatoryVars
  //#region disjVarUStatements
  // compare(disjVar1: DisjVarUStatement, disjVar2: DisjVarUStatement): number {
  // 	let result: number;
  // 	if (disjVar1.var1 < disjVar2.var1 || (disjVar1.var1 == disjVar2.var2 && disjVar1.var1 < disjVar2.var2))
  // 		// disjVar1 preceeds disjvar2
  // 		result = 1;
  // 	else if (disjVar1.var1 == disjVar2.var1 && disjVar1.var2 == disjVar2.var2)
  // 		// disjVar1 and disjVar2 are equal
  // 		result = 0;
  // 	else
  // 		// disjVar2 preceeds disjvar1
  // 		result = -1;
  // 	return result;
  // }
  // /** the array of DisjVarUStatement defined in this UProof */
  // get disjVarUStatements(): DisjVarUStatement[] {
  // 	const result: DisjVarUStatement[] = [];
  // 	this.uStatements.forEach((uStatement: IUStatement) => {
  // 		if (uStatement instanceof DisjVarUStatement)
  // 			result.push(uStatement);
  // 	});
  // 	result.sort(this.compare);
  // 	return result;
  // }
  //#endregion disjVarUStatements
  //#region createUProofFromMmpProof
  //#region addMmpStep
  //#region getRef
  updateMaxRefIfItsTheCase(stepRef) {
    if (stepRef.startsWith("d")) {
      const stepRefSuffix = stepRef.slice(1);
      const mayBeAnInt = parseInt(stepRefSuffix);
      if (!isNaN(mayBeAnInt) && mayBeAnInt > this.maxRefAlreadyAssigned)
        this.maxRefAlreadyAssigned = mayBeAnInt;
    }
  }
  /**
   * returns the ref for the new MmpProofStep; if stepRef is not undefined, it is assigned as is; if it
   * is an automatically generated ref, this._maxNewRef is updated, it needed; if stepRef
   * is undefined, a new ref is generated
   * @param stepRef 
   */
  getRef(stepRef) {
    let newRef;
    if (stepRef != void 0) {
      newRef = stepRef.value;
      this.updateMaxRefIfItsTheCase(stepRef.value);
    } else
      newRef = this.getNewRef();
    return newRef;
  }
  //#endregion getRef
  updateWorkingVarsIfTheCase(stepFormula) {
    stepFormula.forEach((mmToken) => {
      this.workingVars.updateWorkingVarsIfTheCase(mmToken.value);
    });
  }
  updateFormulaToProofStepMap(normalizedFormula2) {
    if (normalizedFormula2 != void 0) {
      const indexForFormulaIfAlreadyPresent = this.formulaToProofStepMap.get(normalizedFormula2);
      if (indexForFormulaIfAlreadyPresent == void 0) {
        const proofStatementIndex = this.mmpStatements.length - 1;
        this.formulaToProofStepMap.set(normalizedFormula2, proofStatementIndex);
      }
    }
  }
  /** if the current proof step is an eHyp, it is added to the array of eHyps  */
  updateEHyps(mmpProofStep) {
    if (mmpProofStep.isEHyp)
      this.eHyps.push(mmpProofStep);
  }
  // /** if the current proof step is a, it is added to the array of eHyps  */
  // updateDisjVarUStatements(mmpProofStep: MmpProofStep) {
  // 	if (mmpProofStep instanceof DisjVarUStatement)
  // 		this.disjVarUStatements.push(mmpProofStep);
  // }
  addMmpStep(mmpProofStep) {
    this.mmpStatements.push(mmpProofStep);
    this.lastMmpProofStep = mmpProofStep;
    this.updateMaxRefIfItsTheCase(mmpProofStep.stepRef);
    if (mmpProofStep.stepFormula != void 0) {
      this.updateWorkingVarsIfTheCase(mmpProofStep.stepFormula);
      this.updateFormulaToProofStepMap(mmpProofStep.normalizedFormula);
    }
    this.updateEHyps(mmpProofStep);
  }
  //#endregion addMmpStep
  updateAllWorkingVars() {
    this.workingVars.reset();
    this.mmpStatements.forEach((uStatement) => {
      if (uStatement instanceof MmpProofStep && uStatement.stepFormula != void 0)
        this.updateWorkingVarsIfTheCase(uStatement.stepFormula);
    });
  }
  //#region insertStatementToTheHeader
  incrementFormulaToProofStepMap() {
    this.formulaToProofStepMap.forEach((index, ref) => {
      this.formulaToProofStepMap.set(ref, ++index);
    });
  }
  insertStatementToTheHeader(mmpStatement, index) {
    this.mmpStatements.splice(index, 0, mmpStatement);
    if (mmpStatement instanceof MmpComment && this.mainComment == void 0)
      this.mainComment = mmpStatement;
    this.incrementFormulaToProofStepMap();
  }
  //#endregion insertStatementToTheHeader
  insertMmpProofStepAtIndex(uProofStep, index) {
    this.mmpStatements.splice(index, 0, uProofStep);
    if (this.lastMmpProofStep != void 0 && this.mmpStatements.indexOf(this.lastMmpProofStep) < index)
      this.lastMmpProofStep = uProofStep;
    this.updateMaxRefIfItsTheCase(uProofStep.stepRef);
    this.statementsInsertedAtASpecificIndexSoFar++;
  }
  addMmpStatement(mmpStatement) {
    if (mmpStatement instanceof MmpProofStep) {
      this.addMmpStep(mmpStatement);
    } else {
      this.mmpStatements.push(mmpStatement);
      if (mmpStatement instanceof MmpTheoremLabel)
        this.mmpTheoremLabels.push(mmpStatement);
      else if (mmpStatement instanceof MmpAllowDiscouraged)
        this.allowDiscouragedStatement = true;
      else if (mmpStatement instanceof MmpComment && this.mainComment == void 0)
        this.mainComment = mmpStatement;
    }
  }
  //#region insertMmpStatements
  /** insert statements at the given index */
  insertMmpStatements(mmpStatements, i) {
    const currentMmpStatements = this.mmpStatements;
    this.reset();
    for (let j = 0; j < i; j++)
      this.addMmpStatement(currentMmpStatements[j]);
    for (let j = 0; j < mmpStatements.length; j++)
      this.addMmpStatement(mmpStatements[j]);
    for (let j = i; j < currentMmpStatements.length; j++)
      this.addMmpStatement(currentMmpStatements[j]);
  }
  //#endregion insertMmpStatements
  containsDjVarStatement(var1, var2) {
    const result = this.disjVars.containsDjContraint(var1, var2);
    return result;
  }
  // addDisjointVarStatement(var1: string, var2: string) {
  addDisjointVarStatement(statement) {
    const statementContent = statement.slice(1);
    const disjVarUStatement = new MmpDisjVarStatement(statementContent);
    this.mmpStatements.push(disjVarUStatement);
    this.disjVarMmpStatements.push(disjVarUStatement);
    this.disjVars.add(statementContent[0].value, statementContent[1].value);
  }
  /**
   * returns a new ref in the form 'dnn'
   * @returns 
   */
  getNewRef() {
    this.maxRefAlreadyAssigned++;
    const newRef = "d" + this.maxRefAlreadyAssigned;
    return newRef;
  }
  /**
   * creates a new MmpProofStep, with a new ref, empty formula and empty parse node
   * and adds it to the proof, inserting it just before the proof step with position index
   * @param index the position of the UStatement, before which the new MmpProofStep has to be inserted
   * @returns 
   */
  createEmptyUStepAndAddItBeforeIndex(index) {
    const stepRef = this.getNewRef();
    const stepRefToken = new MmToken(stepRef, 0, 0);
    const firstTokenValue = stepRef + "::";
    const firstToken = new MmToken(firstTokenValue, 0, 0);
    const proofStepFirstTokenInfo = new ProofStepFirstTokenInfo(
      firstToken,
      false,
      stepRefToken
    );
    const mmpProofStep = new MmpProofStep(this, proofStepFirstTokenInfo, true, false, stepRefToken);
    this.insertMmpProofStepAtIndex(mmpProofStep, index);
    return mmpProofStep;
  }
  // returns the text of the whole proof, built starting from the parse nodes
  toText() {
    const mmpProofFormatter = new MmpProofFormatter(this);
    const text = mmpProofFormatter.textWithIndentedProof();
    return text;
  }
  /** returns the proof text, without indentation */
  toTextWithoutIndentation() {
    let text = "";
    this.mmpStatements.forEach((uStatement) => {
      let uStatementText = uStatement.toText();
      if (uStatement instanceof MmpComment)
        uStatementText = `
${uStatementText}
`;
      text = text + uStatementText + "\n";
    });
    return text;
  }
  /**inserts a proofStatement just after the qed step */
  insertProofStatement(proofStatement) {
    if (this.lastMmpProofStep?.stepRef == "qed") {
      const indexOfQEDstep = this.mmpStatements.indexOf(this.lastMmpProofStep);
      this.mmpStatements.splice(indexOfQEDstep + 1, 0, proofStatement);
      this.proofStatement = proofStatement;
    }
  }
  /**
   * returns the labels of the mandatory $f labels in RPN order. This method can be
   * invoked only when the proof is found (and then both the qed statement and the
   * $e hyps have valid parse nodes) 
   */
  get mandatoryFHypsLabelsInRPNorder() {
    const mandatoryVars = this.mandatoryVars;
    const mandatoryVarsInRpnOrder = this.outermostBlock.getVariablesInRPNorder(mandatoryVars);
    const result = /* @__PURE__ */ new Set();
    mandatoryVarsInRpnOrder.forEach((mandatoryVar) => {
      const mandatoryFHypLabel = this.outermostBlock.varToFHypMap.get(mandatoryVar).Label;
      result.add(mandatoryFHypLabel);
    });
    return result;
  }
  //#region mandatoryFHypsLabelsInRPNorder
  setMandatoryHypLabels() {
    const mandatoryFHypsLabels = this.mandatoryFHypsLabelsInRPNorder;
    this._mandatoryHypLabels = new Set(mandatoryFHypsLabels);
    this.eHyps.forEach((eHyp) => {
      this._mandatoryHypLabels?.add(eHyp.stepLabel);
    });
  }
  get mandatoryHypLabels() {
    if (this._mandatoryHypLabels == void 0)
      this.setMandatoryHypLabels();
    return this._mandatoryHypLabels;
  }
  //#endregion mandatoryFHypsLabelsInRPNorder
  /** returns the actual index for the given formula; formulaToProofStepMap is
   * adjusted, considering proof steps that could have been added, so far
   */
  adjustedStepIndexForThisFormula(formula) {
    const originalIndex = this.formulaToProofStepMap.get(formula);
    const adjustedIndex = originalIndex != void 0 ? originalIndex + this.statementsInsertedAtASpecificIndexSoFar : void 0;
    return adjustedIndex;
  }
};

// yamma/server/src/mm/DisjointVarsManager.ts
var import_vscode_languageserver8 = __toESM(require_main4());
var DisjointVarsManager = class {
  constructor(assertion, substitution, outermostBlock, mandatoryVars, produceDiagnostics, stepLabelToken, stepRef, uProof) {
    this.mandatoryVars = mandatoryVars;
    this.assertion = assertion;
    this.substitution = substitution;
    this.outermostBlock = outermostBlock;
    this.produceDiagnostics = produceDiagnostics;
    this.stepLabelToken = stepLabelToken;
    this.stepRef = stepRef;
    this.uProof = uProof;
    this.foundDisjVarsConstraintViolation = false;
    this.diagnostics = [];
  }
  //#region checkDisjVarsConstraintsViolation
  //#region checkSingleDisjVarsPair
  //#region checkDisjVarsForTwoNodes
  // private addDiagnosticForCommonVariable(disjVar: DisjVarUStatement, var1: MmToken, var2: MmToken,
  addDiagnosticForCommonVariable(var1, var2, token1, token2, strSubstitution1, strSubstitution2) {
    if (this.stepLabelToken != void 0) {
      const stepRefForErrorMessage = this.stepRef != void 0 ? this.stepRef : "with empty ref";
      const errorMessage = `Step ${stepRefForErrorMessage}: Label ax-5: DjVars restriction violated: 
the step lists <${var1} ${var2}> as a DjVars restriction, but the substitution for ${var1} is '${strSubstitution1}' and the substitution for ${var2} is '${strSubstitution2}': thus, the two substitutions share the variable ${token1.value}`;
      MmpValidator.addDiagnosticError(
        errorMessage,
        this.stepLabelToken.range,
        "djVarsRestrictionViolated" /* djVarsRestrictionViolated */,
        this.diagnostics
      );
      MmpValidator.addDiagnosticError(
        errorMessage,
        token1.range,
        "djVarsRestrictionViolated" /* djVarsRestrictionViolated */,
        this.diagnostics
      );
      MmpValidator.addDiagnosticError(
        errorMessage,
        token2.range,
        "djVarsRestrictionViolated" /* djVarsRestrictionViolated */,
        this.diagnostics
      );
    }
  }
  // private checkDisjVarsForTwoNodes(disjVar: DisjVarUStatement, substitution1: InternalNode, substitution2: InternalNode) {
  checkDisjVarsForTwoNodes(var1, var2, substitution1, substitution2) {
    const logicalVariables = this.outermostBlock.v;
    const varsInSubstitution1 = substitution1.mmTokensContaining(logicalVariables);
    const varsInSubstitution2 = substitution2.mmTokensContaining(logicalVariables);
    const strSubstitution1 = GrammarManager.buildStringFormula(substitution1);
    const strSubstitution2 = GrammarManager.buildStringFormula(substitution2);
    varsInSubstitution1.forEach((token1) => {
      varsInSubstitution2.forEach((token2) => {
        if (token1.value == token2.value) {
          this.foundDisjVarsConstraintViolation = true;
          this.addDiagnosticForCommonVariable(var1, var2, token1, token2, strSubstitution1, strSubstitution2);
        }
      });
    });
  }
  //#endregion checkDisjVarsForTwoNodes
  // private checkSingleDisjVarsPair(disjVar: DisjVarUStatement) {
  checkSingleDisjVarsPair(var1, var2) {
    const substitution1 = this.substitution.get(var1);
    const substitution2 = this.substitution.get(var2);
    if (substitution1 != void 0 && substitution2 != void 0)
      this.checkDisjVarsForTwoNodes(var1, var2, substitution1, substitution2);
  }
  //#endregion checkSingleDisjVarsPair
  checkDisjVarsConstraintsViolation() {
    this.foundDisjVarsConstraintViolation = false;
    this.assertion.frame?.disjVars.map.forEach((vars2, var1) => {
      vars2.forEach((var2) => {
        this.checkSingleDisjVarsPair(var1, var2);
      });
    });
  }
  //#endregion checkDisjVarsConstraintsViolation
  //#region checkMissingDisjVarsConstraints
  //#region getMissingDisjVarConstraints
  addDisjVarsConstraintForCurrentNodes(parseNode1, parseNode2, uProof, missingDisjVarConstraints) {
    const varsInNode1 = parseNode1.symbolsSubsetOf(this.outermostBlock.v);
    const varsInNode2 = parseNode2.symbolsSubsetOf(this.outermostBlock.v);
    varsInNode1.forEach((var1) => varsInNode2.forEach((var2) => {
      if (var1 != var2 && !uProof.containsDjVarStatement(var1, var2))
        missingDisjVarConstraints.add(var1, var2);
    }));
  }
  getMissingDisjVarConstraints(uProof) {
    const missingDisjVarConstraints = new DisjointVarMap();
    this.assertion.frame?.disjVars.map.forEach((vars2, var1) => {
      vars2.forEach((var2) => {
        const parseNode1 = this.substitution.get(var1);
        const parseNode2 = this.substitution.get(var2);
        if (parseNode1 != void 0 && parseNode2 != void 0)
          this.addDisjVarsConstraintForCurrentNodes(parseNode1, parseNode2, uProof, missingDisjVarConstraints);
      });
    });
    return missingDisjVarConstraints;
  }
  //#endregion getMissingDisjVarConstraints
  //#region addDiagnosticsForMissingDjVarConstraints
  isDummy(variable) {
    return !this.mandatoryVars.has(variable);
  }
  addMissingDjVarConstraint(var1, var2) {
    const isDummyConstraint = this.isDummy(var1) || this.isDummy(var2);
    const message = isDummyConstraint ? `Substitution (to) vars subject to Dummy DjVars restriction by proof step but not listed as DjVars in theorem to be proved: <${var1},${var2}>` : `Substitution (to) vars subject to Mandatory DjVars restriction by proof step but not listed as DjVars in theorem to be proved: <${var1},${var2}>`;
    const diagnosticCode = isDummyConstraint ? "missingDummyDisjVarsStatement" /* missingDummyDisjVarsStatement */ : "missingMandatoryDisjVarsStatement" /* missingMandatoryDisjVarsStatement */;
    const dataFieldForMissingDjVarConstraintsDiagnostic = {
      // missingDjVarConstraints: new DisjVarUStatement(var1, var2),
      missingDisjVar1: var1,
      missingDisjVar2: var2
    };
    const range2 = this.stepLabelToken != void 0 ? this.stepLabelToken.range : dummyRange;
    const diagnostic = {
      severity: import_vscode_languageserver8.DiagnosticSeverity.Warning,
      message,
      range: range2,
      code: diagnosticCode,
      data: dataFieldForMissingDjVarConstraintsDiagnostic
    };
    this.diagnostics.push(diagnostic);
  }
  addDiagnosticsForMissingDjVarConstraints(missingDisjVarConstraints) {
    missingDisjVarConstraints.map.forEach((vars2, var1) => {
      vars2.forEach((var2) => {
        this.addMissingDjVarConstraint(var1, var2);
      });
    });
  }
  //#endregion addDiagnosticsForMissingDjVarConstraints
  /** a Diagnostic is added when two vars are in the respective substitution of two
   * mandatory vars (for the assertion in the constructor)
   */
  checkMissingDisjVarsConstraints(uProof) {
    this.missingDisjVarConstraints = this.getMissingDisjVarConstraints(uProof);
    this.addDiagnosticsForMissingDjVarConstraints(this.missingDisjVarConstraints);
  }
  //#endregion checkMissingDisjVarsConstraints
};

// yamma/server/src/mmt/TeoremCoherenceChecker.ts
var TheoremCoherenceChecker = class {
  constructor(theorem, provableStatement, defaultRangeForDiagnostics, diagnostics) {
    this.theorem = theorem;
    this.provableStatement = provableStatement;
    this.defaultRangeForDiagnostics = defaultRangeForDiagnostics;
    if (diagnostics != void 0)
      this.diagnostics = diagnostics;
    else
      this.diagnostics = [];
  }
  //#region checkCoherence
  //#region checkIfDisjVarConstraintsAreIncluded
  //#region addDiagnosticForInvalidConstraint
  addDiagnosticForInvalidConstraint(var1, var2) {
    this.theorem.disjVarMmpStatements.forEach((disjVarUStatement) => {
      const vars = fromTokensToStrings(disjVarUStatement.disjointVars);
      const indexOfVar1 = vars.indexOf(var1);
      if (indexOfVar1 > -1) {
        const indexOfVar2 = vars.indexOf(var2);
        if (indexOfVar2 > -1) {
          const message = `The theorem ${this.provableStatement.Label} is already in the theory, and it does not have a disjoint constraint for <${var1},${var2}>, but this new version of the theorem has such constraint. It cannot be accepted if this constraint is not removed`;
          MmpValidator.addDiagnosticError(
            message,
            disjVarUStatement.disjointVars[indexOfVar1].range,
            "disjVarConstraintNotInTheTheory" /* disjVarConstraintNotInTheTheory */,
            this.diagnostics
          );
          MmpValidator.addDiagnosticError(
            message,
            disjVarUStatement.disjointVars[indexOfVar2].range,
            "disjVarConstraintNotInTheTheory" /* disjVarConstraintNotInTheTheory */,
            this.diagnostics
          );
        }
      }
    });
  }
  //#endregion addDiagnosticForInvalidConstraint
  checkIfDisjVarConstraintsAreIncluded(disjVars, theoryDisjVars) {
    disjVars.map.forEach((vars, var1) => {
      vars.forEach((var2) => {
        const isCurrentDisjConstraintValid = theoryDisjVars.containsDjContraint(var1, var2);
        this.isTheoremCoherent &&= isCurrentDisjConstraintValid;
        if (!isCurrentDisjConstraintValid)
          this.addDiagnosticForInvalidConstraint(var1, var2);
      });
    });
  }
  //#endregion checkIfDisjVarConstraintsAreIncluded
  //#region areLabeledStatementsEqual
  checkLabels(mmtStatement, theoryStatementLabel) {
    if (mmtStatement.label == void 0) {
      const message = `The label is missing. The expected label is ${theoryStatementLabel}`;
      MmpValidator.addDiagnosticError(
        message,
        mmtStatement.formula[0].range,
        "eHypLabelNotCoherentForAlreadyExistingTheorem" /* eHypLabelNotCoherentForAlreadyExistingTheorem */,
        this.diagnostics
      );
      this.isTheoremCoherent = false;
    } else if (mmtStatement.label.value != theoryStatementLabel) {
      const message = `The label does not match the label in the theory. The expected label is ${theoryStatementLabel}`;
      MmpValidator.addDiagnosticError(
        message,
        mmtStatement.label.range,
        "eHypLabelNotCoherentForAlreadyExistingTheorem" /* eHypLabelNotCoherentForAlreadyExistingTheorem */,
        this.diagnostics
      );
      this.isTheoremCoherent = false;
    }
  }
  computeFormulaRange(mmtStatement) {
    let range2;
    if (mmtStatement.formula != void 0 && mmtStatement.formula.length == 0 && mmtStatement.label == void 0)
      range2 = mmtStatement.rangeIfBothLabelAndFormulaAreEmpty;
    else if (mmtStatement.formula != void 0 && mmtStatement.formula.length > 0)
      range2 = arrayRange(mmtStatement.formula);
    else
      range2 = mmtStatement.label.range;
    return range2;
  }
  checkFormulas(mmtStatement, theoryStatementFormula) {
    if (mmtStatement.formula == void 0) {
      const message = `The formula is missing. The expected formula is ${theoryStatementFormula}`;
      const range2 = this.computeFormulaRange(mmtStatement);
      MmpValidator.addDiagnosticError(
        message,
        range2,
        "doesntMatchTheoryFormula" /* doesntMatchTheoryFormula */,
        this.diagnostics
      );
      this.isTheoremCoherent = false;
    } else {
      const mmtStatementFormulaString = fromTokensToStrings(mmtStatement.formula);
      const areFormulasEqual = AreArrayTheSame(mmtStatementFormulaString, theoryStatementFormula);
      if (!areFormulasEqual) {
        const theoryFormulaString = concatWithSpaces(theoryStatementFormula);
        const message = `The formula does not match the formula in the theory. The expected formula is '${theoryFormulaString}'`;
        const range2 = this.computeFormulaRange(mmtStatement);
        MmpValidator.addDiagnosticError(
          message,
          range2,
          "doesntMatchTheoryFormula" /* doesntMatchTheoryFormula */,
          this.diagnostics
        );
        this.isTheoremCoherent = false;
      }
    }
  }
  areLabeledStatementsEqual(mmtStatement, theoryStatement) {
    if (mmtStatement == void 0) {
      const message = `This theorem is already in the theory, but the label ${theoryStatement.Label}is either missing or on the wrong hypothesis`;
      const range2 = this.defaultRangeForDiagnostics;
      MmpValidator.addDiagnosticError(
        message,
        range2,
        "eHypLabelNotCoherentForAlreadyExistingTheorem" /* eHypLabelNotCoherentForAlreadyExistingTheorem */,
        this.diagnostics
      );
      this.isTheoremCoherent = false;
    } else {
      this.checkLabels(mmtStatement, theoryStatement.Label);
      this.checkFormulas(mmtStatement, theoryStatement.formula);
    }
  }
  //#endregion areLabeledStatementsEqual
  //#region checkIfEHypsAreCoherent
  addDiagnosticForWrongNumberOfEHyps() {
    const message = `This theorem is already in the theory, and it has ${this.provableStatement.frame?.eHyps.length} $e hypothesis, but this new version of the theorem has ${this.theorem.eHyps.length} $e hypothesis. This cannot be accepted, because it invalidates the verification of the theory`;
    const range2 = this.defaultRangeForDiagnostics;
    MmpValidator.addDiagnosticError(
      message,
      range2,
      "wrongNumberOfEHypsForAlreadyExistingTheorem" /* wrongNumberOfEHypsForAlreadyExistingTheorem */,
      this.diagnostics
    );
  }
  checkIfEHypsAreCoherent() {
    this.isTheoremCoherent = this.theorem.eHyps.length == this.provableStatement.frame?.eHyps.length;
    if (this.isTheoremCoherent) {
      for (let i = 0; i < this.theorem.eHyps.length; i++)
        this.areLabeledStatementsEqual(
          this.theorem.eHyps[i],
          this.provableStatement.frame.eHyps[i]
        );
    } else
      this.addDiagnosticForWrongNumberOfEHyps();
  }
  //#endregion checkIfEHypsAreCoherent
  checkIfPStatementIsCoherent() {
    if (this.theorem.pStatement == void 0) {
      const theoryFormula = concatWithSpaces(this.provableStatement.formula);
      const message = `This theorem is already in the theory, but the qed statement is missing. The expected qed formula is '${theoryFormula}'`;
      const range2 = this.defaultRangeForDiagnostics;
      MmpValidator.addDiagnosticError(
        message,
        range2,
        "missingQedStatementForAlreadyExistingTheorem" /* missingQedStatementForAlreadyExistingTheorem */,
        this.diagnostics
      );
      this.isTheoremCoherent = false;
    } else {
      this.checkFormulas(this.theorem.pStatement, this.provableStatement.formula);
    }
  }
  /** the theorem can be added iff either it does not exist in the theory, or
   * it exists, but $e hyps agree and $p agrees and $d are included in those
   * in the theory
   */
  checkCoherence() {
    this.isTheoremCoherent = true;
    this.checkIfEHypsAreCoherent();
    this.checkIfPStatementIsCoherent();
    this.checkIfDisjVarConstraintsAreIncluded(this.theorem.disjVars, this.provableStatement.frame.disjVars);
  }
  //#endregion checkCoherence
};

// yamma/server/src/mmp/MmpSearchStatement.ts
var MmpSearchStatement = class _MmpSearchStatement {
  static {
    this.searchSymbolsKeyword = "SearchSymbols:";
  }
  static {
    this.searchCommentKeyword = "SearchComment:";
  }
  constructor(searchStatementTokens) {
    this.searchStatementTokens = searchStatementTokens;
    const searchStatementFormula = MmToken.fromTokensToStrings(searchStatementTokens);
    const searchCommentIndex = searchStatementFormula.indexOf(_MmpSearchStatement.searchCommentKeyword);
    this.symbolsToSearch = this.getSymbolsToSearch(searchStatementFormula, searchCommentIndex);
    this.normalizedSubstringsToSearch = this.getNormalizedSubstringsToSearch(searchStatementFormula);
    this.substringsToSearchInComments = this.getSubstringsForComments(searchStatementFormula, searchCommentIndex);
  }
  getSymbolsToSearch(searchStatementFormula, searchCommentIndex) {
    let lastIndexForSymbols = searchStatementFormula.length;
    if (searchCommentIndex != -1)
      lastIndexForSymbols = searchCommentIndex;
    let symbolsToSearch = searchStatementFormula.slice(1, lastIndexForSymbols);
    symbolsToSearch = symbolsToSearch.filter((symbol) => symbol != "'");
    return symbolsToSearch;
  }
  //#region getNormalizedSubstringsToSearch
  getIndexesForStringDelimiter(searchStatementFormula) {
    const indexesForStringDelimiter = [];
    let index = -2;
    while (index != -1) {
      const fromIndex = index < 0 ? 0 : index + 1;
      index = searchStatementFormula.indexOf("'", fromIndex);
      if (index != -1)
        indexesForStringDelimiter.push(index);
    }
    return indexesForStringDelimiter;
  }
  //#region getNormalizedSubstringsFromDelimeterIndexes
  //#region getNormalizedSubstring
  getSubarrayOfSymbols(searchStatementFormula, indexesForStringDelimiter, delimiterIndex) {
    let subarrayOfSymbols;
    if (delimiterIndex + 1 < indexesForStringDelimiter.length)
      subarrayOfSymbols = searchStatementFormula.slice(
        indexesForStringDelimiter[delimiterIndex] + 1,
        indexesForStringDelimiter[delimiterIndex + 1]
      );
    else
      subarrayOfSymbols = searchStatementFormula.slice(
        indexesForStringDelimiter[delimiterIndex] + 1
      );
    return subarrayOfSymbols;
  }
  getNormalizedSubstring(searchStatementFormula, indexesForStringDelimiter, delimiterIndex) {
    const subarrayOfSymbols = this.getSubarrayOfSymbols(
      searchStatementFormula,
      indexesForStringDelimiter,
      delimiterIndex
    );
    const normalizedSubstring = normalizedFormula(subarrayOfSymbols);
    return normalizedSubstring;
  }
  //#endregion getNormalizedSubstring
  getNormalizedSubstringsFromDelimeterIndexes(searchStatementFormula, indexesForStringDelimiter) {
    const normalizedSubstringsFromDelimeterIndexes = [];
    for (let i = 0; i < indexesForStringDelimiter.length; i += 2) {
      const normalizedSubstring = this.getNormalizedSubstring(
        searchStatementFormula,
        indexesForStringDelimiter,
        i
      );
      normalizedSubstringsFromDelimeterIndexes.push(normalizedSubstring);
    }
    return normalizedSubstringsFromDelimeterIndexes;
  }
  //#endregion getNormalizedSubstringsFromDelimeterIndexes
  /** returns an array of normalized strings to search; such strings are delimited by ' characters;
   * if the delimiters are in odd number, the substring from the last delimeter to the end of
   * the search string is considered to be an additional string to search
   */
  getNormalizedSubstringsToSearch(searchStatementFormula) {
    const indexesForStringDelimiter = this.getIndexesForStringDelimiter(searchStatementFormula);
    const normalizedSubstringsToSearch = this.getNormalizedSubstringsFromDelimeterIndexes(
      searchStatementFormula,
      indexesForStringDelimiter
    );
    return normalizedSubstringsToSearch;
  }
  //#endregion getNormalizedSubstringsToSearch
  getSubstringsForComments(searchStatementFormula, searchCommentIndex) {
    let substringsForComments = [];
    if (searchCommentIndex != -1)
      substringsForComments = searchStatementFormula.slice(searchCommentIndex + 1);
    return substringsForComments;
  }
  get range() {
    const range2 = arrayRange(this.searchStatementTokens);
    return range2;
  }
  toText() {
    const text = concatTokenValuesWithSpaces(this.searchStatementTokens);
    return text;
  }
};

// yamma/server/src/mmp/MmpGetProofStatement.ts
var MmpGetProofStatement = class {
  constructor(getProofKeyword, theoremLabel) {
    this.getProofKeyword = getProofKeyword;
    this.theoremLabel = theoremLabel;
  }
  toText() {
    let text = this.getProofKeyword.value;
    if (this.theoremLabel != void 0)
      text += " " + this.theoremLabel.value;
    return text;
  }
};
var MmpParser = class _MmpParser {
  //#region constructor
  // constructor(textToParse: string, labelToStatementMap: Map<string, LabeledStatement>,
  // 	outermostBlock: BlockStatement, grammar: Grammar, workingVars: WorkingVars) {
  constructor(params) {
    this.params = params;
    // maps each proof step id to the proof step
    this.allowDiscouraged = false;
    // true iff the $allowdiscouraged statement is present
    this.diagnostics = [];
    /** it will conatin the $d statements that are generated in place of warnings */
    this.disjVarStatementsAutomaticallyGenerated = [];
    /** the set of eHyp labels, for this theorem; used to check if there is an eHyp label
     * duplication
     */
    this.eHypLabels = /* @__PURE__ */ new Set();
    this.textToParse = this.params.textToParse;
    this.mmParser = params.mmParser;
    this.workingVars = params.workingVars;
    this.formulaToParseNodeCache = params.formulaToParseNodeCache;
    this.documentUri = params.documentUri;
    this.outermostBlock = this.mmParser.outermostBlock;
    this.diagnosticMessageForSyntaxError = params.diagnosticMessageForSyntaxError != void 0 ? params.diagnosticMessageForSyntaxError : new ShortDiagnosticMessageForSyntaxError(
      this.outermostBlock.c,
      this.outermostBlock.v,
      30
    );
    this.grammar = this.mmParser.grammar;
    this.labelToStatementMap = this.mmParser.labelToStatementMap;
    this.disjVarAutomaticGeneration = params.disjVarAutomaticGeneration == void 0 ? "GenerateNone" /* GenerateNone */ : params.disjVarAutomaticGeneration;
    this.mmLexer = new MmLexer(this.workingVars);
    this.refToProofStepMap = /* @__PURE__ */ new Map();
    this._orderedPairsOfNodesForMGUalgorithm = [];
  }
  addDiagnosticError(message, range2, code) {
    MmpValidator.addDiagnosticError(message, range2, code, this.diagnostics);
  }
  addDiagnosticWarning(message, range2, code) {
    MmpValidator.addDiagnosticWarning(message, range2, code, this.diagnostics);
  }
  //#region  createProofSteps
  //#region createNextMmpStatement
  //#region createMmpStatementFromStepTokens
  //#region proofStepFirstTokenInfo
  static hypRefRanges(hypRefs, currentRow, positions) {
    const hypRefRanges = [];
    for (let i = 0; i < hypRefs.length; i++) {
      const hypRefRange = range(hypRefs[i], currentRow, positions[i]);
      hypRefRanges.push(hypRefRange);
    }
    return hypRefRanges;
  }
  proofStepFirstTokenInfo(firstToken) {
    const stringToParse = firstToken.value;
    let isEHyp = false;
    let stepRef;
    let hypRefs;
    let stepLabel;
    let unparsableToken;
    const firstColon = stringToParse.indexOf(":");
    if (firstColon === -1) {
      stepRef = new MmToken("", firstToken.line, firstToken.column);
      stepLabel = new MmToken(stringToParse, firstToken.line, firstToken.column);
    } else {
      isEHyp = stringToParse.slice(0, firstColon).startsWith("h") ? true : false;
      const refIndexStart = isEHyp ? 1 : 0;
      stepRef = new MmToken(stringToParse.slice(refIndexStart, firstColon), firstToken.line, firstToken.column);
      if (stepRef.value.indexOf(",") != -1) {
        const message = "The ref cannot contain a comma";
        const range2 = stepRef.range;
        const code = "stepRefCannotContainAComma" /* stepRefCannotContainAComma */;
        this.addDiagnosticError(message, range2, code);
      }
      const secondColon = stringToParse.indexOf(":", firstColon + 1);
      if (secondColon === -1) {
        if (firstColon < stringToParse.length - 1)
          stepLabel = new MmToken(stringToParse.slice(firstColon + 1), firstToken.line, firstColon + 1);
      } else {
        const thirdColon = stringToParse.indexOf(":", secondColon + 1);
        if (thirdColon === -1) {
          if (firstColon < secondColon) {
            const hypRefsSubstring = stringToParse.slice(firstColon + 1, secondColon);
            hypRefs = splitToTokensAllowingForEmptyValues(hypRefsSubstring, ",", firstToken.line, firstColon + 1);
          }
          if (secondColon < stringToParse.length - 1)
            stepLabel = new MmToken(stringToParse.slice(secondColon + 1), firstToken.line, secondColon + 1);
        } else {
          const message = "The first token can contain, at most, 2 colons";
          const range2 = firstToken.range;
          const code = "firstTokenWithMoreThanTwoColumns" /* firstTokenWithMoreThanTwoColumns */;
          this.addDiagnosticError(message, range2, code);
          unparsableToken = firstToken.value;
        }
      }
    }
    const firstTokenInfo = new ProofStepFirstTokenInfo(
      firstToken,
      isEHyp,
      stepRef,
      hypRefs,
      stepLabel,
      unparsableToken
    );
    return firstTokenInfo;
  }
  //#endregion proofStepFirstTokenInfo
  addTheoremLabel(nextProofStepTokens) {
    let uTheoremLabel;
    if (nextProofStepTokens.length == 1) {
      const message = `The theorem label is missing`;
      const range2 = oneCharacterRange(nextProofStepTokens[0].range.end);
      MmpValidator.addDiagnosticWarning(
        message,
        range2,
        "missingTheoremLabel" /* missingTheoremLabel */,
        this.diagnostics
      );
      uTheoremLabel = new MmpTheoremLabel(nextProofStepTokens[0]);
    } else
      uTheoremLabel = new MmpTheoremLabel(nextProofStepTokens[0], nextProofStepTokens[1]);
    this.mmpProof?.addMmpStatement(uTheoremLabel);
  }
  addAllowDiscouraged(nextProofStepTokens) {
    const allowDiscouraged = new MmpAllowDiscouraged(nextProofStepTokens[0]);
    this.mmpProof?.addMmpStatement(allowDiscouraged);
    this.allowDiscouraged = true;
  }
  addGetProofStatement(nextProofStepTokens) {
    let mmpGetProofStatement;
    if (nextProofStepTokens.length == 1) {
      const message = `The theorem label is missing`;
      const range2 = oneCharacterRange(nextProofStepTokens[0].range.end);
      MmpValidator.addDiagnosticWarning(
        message,
        range2,
        "missingTheoremLabel" /* missingTheoremLabel */,
        this.diagnostics
      );
      mmpGetProofStatement = new MmpGetProofStatement(nextProofStepTokens[0]);
    } else
      mmpGetProofStatement = new MmpGetProofStatement(nextProofStepTokens[0], nextProofStepTokens[1]);
    this.mmpProof?.addMmpStatement(mmpGetProofStatement);
  }
  //#region  addComment
  addDiagnosticForDefaultComment(comment) {
    if (comment.comment == Parameters.defaultComment) {
      const message = `This comment should contain a description of the theorem`;
      MmpValidator.addDiagnosticWarning(
        message,
        comment.contentTokens[1].range,
        "missingComment" /* missingComment */,
        this.diagnostics
      );
    }
  }
  addComment(nextProofStepTokens) {
    const commentContent = rebuildOriginalStringFromTokens(nextProofStepTokens);
    const comment = new MmpComment(nextProofStepTokens, commentContent);
    this.mmpProof?.addMmpStatement(comment);
    this.addDiagnosticForDefaultComment(comment);
  }
  //#endregion addComment
  addSearchStatement(searchStatementTokens) {
    const mmpSearchStatement = new MmpSearchStatement(searchStatementTokens);
    this.mmpProof?.addMmpStatement(mmpSearchStatement);
  }
  addProofStep(proofStep) {
    this.mmpProof?.addMmpStep(proofStep);
    if (proofStep.stepRefToken != void 0) {
      this.refToProofStepMap.set(proofStep.stepRefToken.value, proofStep);
    }
  }
  //#region addDiagnosticForLabelAndEHypRefs
  addDiagnosticMissingLabel(firstTokenEndPosition) {
    const message = "Missing label";
    const range2 = oneCharacterRange(firstTokenEndPosition);
    const code = "missingLabel" /* missingLabel */;
    this.addDiagnosticWarning(message, range2, code);
  }
  addDiagnisticsForEHypRefs(proofStepFirstTokenInfo, stepLabel, labeledStatement) {
    const refEHyps = proofStepFirstTokenInfo.eHypRefs == void 0 ? 0 : proofStepFirstTokenInfo.eHypRefs.length;
    if (proofStepFirstTokenInfo.stepRef.value != "" && labeledStatement.frame?.eHyps.length != refEHyps) {
      const message = `Unification error: the assertion ${stepLabel.value} expects ${labeledStatement.frame?.eHyps.length} $e hypothesis, but ${refEHyps} are given`;
      const range2 = proofStepFirstTokenInfo.eHypRefs == void 0 ? stepLabel.range : proofStepFirstTokenInfo.eHypRefsRange;
      if (refEHyps == 0)
        MmpValidator.addDiagnosticWarning(
          message,
          range2,
          "missingEHyps" /* missingEHyps */,
          this.diagnostics
        );
      else
        MmpValidator.addDiagnosticError(
          message,
          range2,
          "wrongNumberOfEHyps" /* wrongNumberOfEHyps */,
          this.diagnostics
        );
    }
  }
  addDiagnosticForEHypLabel(stepLabel) {
    if (this.eHypLabels.has(stepLabel.value)) {
      const message = `This eHyp label is duplicated`;
      MmpValidator.addDiagnosticError(
        message,
        stepLabel.range,
        "duplicatedEHyp" /* duplicatedEHyp */,
        this.diagnostics
      );
    }
    this.eHypLabels.add(stepLabel.value);
  }
  addDiagnosticForLabelAndEHypRefs(firstTokenEndPosition, proofStepFirstTokenInfo) {
    if (proofStepFirstTokenInfo.stepLabel === void 0) {
      this.addDiagnosticMissingLabel(firstTokenEndPosition);
    } else if (proofStepFirstTokenInfo.isEHyp)
      this.addDiagnosticForEHypLabel(proofStepFirstTokenInfo.stepLabel);
    else {
      const stepLabel = proofStepFirstTokenInfo.stepLabel;
      const labeledStatement = this.labelToStatementMap.get(stepLabel.value);
      if (labeledStatement == void 0) {
        const message = `Unknown label: this label does not exist in the logical system`;
        MmpValidator.addDiagnosticError(
          message,
          stepLabel.range,
          "unknownLabel" /* unknownLabel */,
          this.diagnostics
        );
      } else if (!(labeledStatement instanceof AssertionStatement)) {
        const message = `This is is not a label for an Assertion in the logical system`;
        MmpValidator.addDiagnosticError(
          message,
          stepLabel.range,
          "notAnAssertion" /* notAnAssertion */,
          this.diagnostics
        );
      } else if (labeledStatement instanceof ProvableStatement && labeledStatement.isProofVerificationFailed) {
        const message = `The verification of this statement failed. You can use $getproof to try to load its proof and fix it`;
        MmpValidator.addDiagnosticError(
          message,
          proofStepFirstTokenInfo.stepLabel.range,
          "provableStatementWithFailedVerification" /* provableStatementWithFailedVerification */,
          this.diagnostics
        );
      } else if (labeledStatement.isDiscouraged && !this.allowDiscouraged) {
        const message = `The new use of '${stepLabel.value}' is discouraged.`;
        MmpValidator.addDiagnosticWarning(
          message,
          proofStepFirstTokenInfo.stepLabel.range,
          "isDiscouraged" /* isDiscouraged */,
          this.diagnostics
        );
      } else if (!labeledStatement.parseNode) {
        const message = `The formula in the .mm file for '${stepLabel.value}' is not parsable. See the problem tab for the .mm file, for a detailed error message`;
        MmpValidator.addDiagnosticError(
          message,
          proofStepFirstTokenInfo.stepLabel.range,
          "FormulaNonParsable" /* mmFormulaNonParsable */,
          this.diagnostics
        );
      } else {
        this.addDiagnisticsForEHypRefs(
          proofStepFirstTokenInfo,
          proofStepFirstTokenInfo.stepLabel,
          labeledStatement
        );
      }
    }
  }
  //#endregion addDiagnosticForLabelAndEHypRefs
  //#region getParseNode
  static tryToParse(stepFormulaString, stepFormula, grammar, workingVars, diagnostics, diagnosticMessageForSyntaxError) {
    let parseNode;
    grammar.lexer = new MmLexerFromTokens(stepFormula);
    let parser = new import_nearley6.Parser(grammar);
    try {
      parser.feed("");
      if (parser.results.length === 0) {
        grammar.lexer = new MmLexer(workingVars);
        parser = new import_nearley6.Parser(grammar);
        parser.feed(stepFormulaString + " UnxpexcteEndOfFormula");
      }
      if (parser.results.length > 1)
        throw new Error("Some ambiguity, let's look into it");
      parseNode = parser.results[0];
    } catch (error) {
      let range2 = oneCharacterRange(stepFormula[stepFormula.length - 1].range.end);
      let errorCode = "unexpectedEndOfFormula" /* unexpectedEndOfFormula */;
      if (parser.current < stepFormula.length) {
        range2 = stepFormula[parser.current].range;
        errorCode = "formulaSyntaxError" /* formulaSyntaxError */;
      }
      const diagnosticMessage = diagnosticMessageForSyntaxError.diagnosticMessage(error.message);
      MmpValidator.addDiagnosticError(diagnosticMessage, range2, errorCode, diagnostics);
    }
    return parseNode;
  }
  getParseNode(stepFormula) {
    const stepFormulaString = concatTokenValuesWithSpaces(stepFormula);
    let parseNode = this.formulaToParseNodeCache?.formulaToInternalNodeMap.get(stepFormulaString);
    if (parseNode == void 0) {
      parseNode = _MmpParser.tryToParse(
        stepFormulaString,
        stepFormula,
        this.grammar,
        this.workingVars,
        this.diagnostics,
        this.diagnosticMessageForSyntaxError
      );
      if (parseNode != void 0 && this.formulaToParseNodeCache != void 0 && !GrammarManager.containsWorkingVar(parseNode))
        this.formulaToParseNodeCache.add(stepFormulaString, parseNode);
    }
    return parseNode;
  }
  //#endregion getParseNode
  //#region getEHypMmpSteps
  getEHypMmpStep(eHypRef) {
    let eHypStep;
    if (eHypRef instanceof MmToken) {
      eHypStep = this.refToProofStepMap.get(eHypRef.value);
    }
    return eHypStep;
  }
  getEHypMmpSteps(eHypRefs, unknownStepRefs) {
    const eHypMmpSteps = [];
    if (eHypRefs != void 0)
      eHypRefs.forEach((eHypRef) => {
        if (eHypRef.value == "") {
          const message = `Missing reference`;
          MmpValidator.addDiagnosticWarning(
            message,
            eHypRef.range,
            "missingRef" /* missingRef */,
            this.diagnostics
          );
        }
        const eHypStep = this.getEHypMmpStep(eHypRef);
        if (eHypRef.value != "" && eHypStep == void 0) {
          const message = `This is not a reference for an existing proof step`;
          MmpValidator.addDiagnosticError(message, eHypRef.range, "unknownStepRef" /* unknownStepRef */, this.diagnostics);
          unknownStepRefs.add(eHypRef.value);
        }
        eHypMmpSteps.push(eHypStep);
      });
    return eHypMmpSteps;
  }
  //#endregion getEHypMmpSteps
  //#region addDisjointVarConstraint
  addDiagnosticForExpectedVariable(mmToken) {
    const errorMessage = `This is not a variable. A $d statement expects two variables`;
    MmpValidator.addDiagnosticError(errorMessage, mmToken.range, "disjVarSyntaxError" /* disjVarSyntaxError */, this.diagnostics);
  }
  addDisjointVarConstraint(nextProofStepTokens) {
    if (nextProofStepTokens.length != 3) {
      const errorMessage = `After a $d , exactly 2 symbols are expected. We got ${nextProofStepTokens.length - 1} symbol/s instead.`;
      MmpValidator.addDiagnosticError(errorMessage, nextProofStepTokens[0].range, "disjVarSyntaxError" /* disjVarSyntaxError */, this.diagnostics);
    } else if (!this.outermostBlock.v.has(nextProofStepTokens[1].value))
      this.addDiagnosticForExpectedVariable(nextProofStepTokens[1]);
    else if (!this.outermostBlock.v.has(nextProofStepTokens[2].value))
      this.addDiagnosticForExpectedVariable(nextProofStepTokens[2]);
    else if (nextProofStepTokens[1].value == nextProofStepTokens[2].value) {
      const errorMessage = `The two distinct variables are both '${nextProofStepTokens[1].value}' : a variable cannot be declared distinct from itself, the two symbols after a $d must be different.`;
      MmpValidator.addDiagnosticError(errorMessage, nextProofStepTokens[0].range, "disjVarWithItself" /* disjVarWithItself */, this.diagnostics);
    } else
      this.mmpProof?.addDisjointVarStatement(nextProofStepTokens);
  }
  //#endregion addDisjointVarConstraint
  createMmpProofStep(nextProofStepTokens) {
    const proofStepFirstTokenInfo = this.proofStepFirstTokenInfo(nextProofStepTokens[0]);
    if (proofStepFirstTokenInfo.unparsableToken === void 0)
      this.addDiagnosticForLabelAndEHypRefs(
        nextProofStepTokens[0].range.end,
        proofStepFirstTokenInfo
      );
    let stepFormula;
    let formulaParseNode;
    if (nextProofStepTokens.length > 1) {
      stepFormula = nextProofStepTokens.slice(1);
      formulaParseNode = this.getParseNode(stepFormula);
    } else {
      const message = "Missing Formula";
      const range2 = oneCharacterRange({
        // line: nextProofStepTokens[0].line,
        // character: nextProofStepTokens[0].column + 1
        line: proofStepFirstTokenInfo.firstToken.range.start.line,
        character: proofStepFirstTokenInfo.firstToken.range.end.character
      });
      const code = "missingFormula" /* missingFormula */;
      this.addDiagnosticWarning(message, range2, code);
    }
    const unknownStepRefs = /* @__PURE__ */ new Set();
    const eHypMmpSteps = this.getEHypMmpSteps(proofStepFirstTokenInfo.eHypRefs, unknownStepRefs);
    const isFirstTokenParsable = proofStepFirstTokenInfo.unparsableToken == void 0;
    const proofStep = new MmpProofStep(
      this.mmpProof,
      proofStepFirstTokenInfo,
      isFirstTokenParsable,
      proofStepFirstTokenInfo.isEHyp,
      proofStepFirstTokenInfo.stepRef,
      proofStepFirstTokenInfo.eHypRefs,
      eHypMmpSteps,
      proofStepFirstTokenInfo.stepLabel,
      stepFormula,
      formulaParseNode
    );
    if (unknownStepRefs.size > 0)
      proofStep.containsUnknownStepRef = true;
    this.addProofStep(proofStep);
  }
  addTextProofStatement(nextProofStepTokens) {
    const textProofStatement = new TextForProofStatement(nextProofStepTokens);
    this.mmpProof?.addMmpStatement(textProofStatement);
    this.mmpProof.textProofStatement = textProofStatement;
  }
  createMmpStatementFromStepTokens(nextProofStepTokens) {
    const nextTokenValue = nextProofStepTokens[0].value;
    if (nextTokenValue == "$theorem")
      this.addTheoremLabel(nextProofStepTokens);
    else if (nextTokenValue == "$allowdiscouraged")
      this.addAllowDiscouraged(nextProofStepTokens);
    else if (nextTokenValue == "$getproof")
      this.addGetProofStatement(nextProofStepTokens);
    else if (nextTokenValue.startsWith("*"))
      this.addComment(nextProofStepTokens);
    else if (nextTokenValue == MmpSearchStatement.searchSymbolsKeyword)
      this.addSearchStatement(nextProofStepTokens);
    else if (nextTokenValue.startsWith("$d"))
      this.addDisjointVarConstraint(nextProofStepTokens);
    else if (nextTokenValue == "$=")
      this.addTextProofStatement(nextProofStepTokens);
    else if (!nextTokenValue.startsWith("$"))
      this.createMmpProofStep(nextProofStepTokens);
  }
  //#endregion createMmpStatementFromStepTokens
  createNextMmpStatement(token, mmLexer) {
    const nextProofStepTokens = [];
    while (token != void 0 && (nextProofStepTokens.length == 0 || token.column !== 0)) {
      nextProofStepTokens.push(token);
      token = mmLexer.next();
    }
    this.createMmpStatementFromStepTokens(nextProofStepTokens);
    return token;
  }
  //#endregion createNextMmpStatement
  //#region checkUnificationOfLogicalVars
  //#region checkUnificationWithUSubstitutionManager
  //#region  addDiagnisticsForSubstitution
  //#region addDiagnisticsForSubstitutionInEHyps
  addDiagnisticsForSubstitutionInEHyp(frameEHypParseNode, referencedEHypProofStep, range2, substitution) {
    const expectedNode = MmpSubstitutionApplier.createParseNode(
      frameEHypParseNode,
      substitution,
      this.outermostBlock
    );
    const expectedFormula = GrammarManager.buildStringArray(expectedNode);
    const referencedFormula = referencedEHypProofStep.stepFormula;
    if (referencedFormula != void 0) {
      const strArrReferencedFormula = MmToken.fromTokensToStrings(referencedFormula);
      if (!AreArrayTheSame(strArrReferencedFormula, expectedFormula)) {
        const strExpectedFormula = concatWithSpaces(expectedFormula);
        const strReferencedFormula = concatWithSpaces(strArrReferencedFormula);
        const message = `Unification error: referenced statement is '${strReferencedFormula}' but it was expected to be '${strExpectedFormula}'`;
        MmpValidator.addDiagnosticError(
          message,
          range2,
          "refStatementUnificationError" /* refStatementUnificationError */,
          this.diagnostics
        );
      }
    }
  }
  addDiagnisticsForSubstitutionInEHyps(frameEHyps, proofStep, substitution) {
    if (proofStep.eHypRefs != void 0 && proofStep.eHypRefs.length == frameEHyps.length) {
      for (let i = 0; i < frameEHyps.length; i++) {
        const referencedEHypProofStep = proofStep.eHypUSteps[i];
        if (referencedEHypProofStep != void 0 && frameEHyps[i].parseNode != void 0)
          this.addDiagnisticsForSubstitutionInEHyp(
            frameEHyps[i].parseNode,
            referencedEHypProofStep,
            proofStep.eHypRefs[i].range,
            substitution
          );
      }
    }
  }
  addDiagnisticsForAssertion(assertionStatementParseNode, proofStep, substitution) {
    const expectedNode = MmpSubstitutionApplier.createParseNode(
      assertionStatementParseNode,
      substitution,
      this.outermostBlock
    );
    const expectedFormula = GrammarManager.buildStringArray(expectedNode);
    const proofStepFormula = proofStep.stepFormula;
    if (proofStepFormula != void 0) {
      const strArrProofStepFormula = MmToken.fromTokensToStrings(proofStepFormula);
      if (!AreArrayTheSame(strArrProofStepFormula, expectedFormula)) {
        const strExpectedFormula = concatWithSpaces(expectedFormula);
        const strProofStepFormula = concatWithSpaces(strArrProofStepFormula);
        const message = `Unification error: statement is '${strProofStepFormula}' but it was expected to be '${strExpectedFormula}'`;
        MmpValidator.addDiagnosticError(
          message,
          proofStep.stepLabelToken.range,
          "unificationError" /* unificationError */,
          this.diagnostics
        );
      }
    }
  }
  addDiagnisticsForSubstitution(frameEHyps, assertionStatement, proofStep, substitution) {
    if (assertionStatement.parseNode != void 0)
      this.addDiagnisticsForAssertion(assertionStatement.parseNode, proofStep, substitution);
    this.addDiagnisticsForSubstitutionInEHyps(frameEHyps, proofStep, substitution);
  }
  //#endregion addDiagnisticsForSubstitutionInEHyps
  //#endregion addDiagnisticsForSubstitution
  addStartingPairsForMGUFinder(mmpProofStep, assertion, substitution) {
    const workingVarsUnifierInitializer = new WorkingVarsUnifierInitializer(
      mmpProofStep,
      assertion,
      substitution,
      this.outermostBlock,
      this.grammar
    );
    const startingPairsForMGUAlgorthm = workingVarsUnifierInitializer.buildStartingPairsForMGUAlgorithm();
    this._orderedPairsOfNodesForMGUalgorithm = this._orderedPairsOfNodesForMGUalgorithm.concat(...startingPairsForMGUAlgorthm);
  }
  //#region checkDisjVarConstraints
  //#region addDiagnosticsOrGenerateDisjVarStatements
  isMissingDisjVar(diagnostic) {
    const result = diagnostic.code == "missingDummyDisjVarsStatement" /* missingDummyDisjVarsStatement */ || diagnostic.code == "missingMandatoryDisjVarsStatement" /* missingMandatoryDisjVarsStatement */;
    return result;
  }
  isDiagnosticToBeAdded(diagnostic) {
    let result = !this.isMissingDisjVar(diagnostic);
    if (!result) {
      const disjVarAutomaticGeneration = this.disjVarAutomaticGeneration;
      result = disjVarAutomaticGeneration == "GenerateNone" /* GenerateNone */ || disjVarAutomaticGeneration == "GenerateDummy" /* GenerateDummy */ && diagnostic.code == "missingMandatoryDisjVarsStatement" /* missingMandatoryDisjVarsStatement */;
    }
    return result;
  }
  generateDisjVarStatement(dataFieldForMissingDjVarConstraintsDiagnostic) {
    const disjVarStatement = MmpDisjVarStatement.CreateMmpDisjVarStatement(
      dataFieldForMissingDjVarConstraintsDiagnostic.missingDisjVar1,
      dataFieldForMissingDjVarConstraintsDiagnostic.missingDisjVar2
    );
    this.disjVarStatementsAutomaticallyGenerated.push(disjVarStatement);
  }
  addDiagnosticsOrGenerateDisjVarStatements(diagnostics) {
    diagnostics.forEach((diagnostic) => {
      if (this.isDiagnosticToBeAdded(diagnostic))
        this.diagnostics.push(diagnostic);
      else if (this.isMissingDisjVar(diagnostic))
        this.generateDisjVarStatement(diagnostic.data);
    });
  }
  //#endregion addDiagnosticsOrGenerateDisjVarStatements
  //TODO this method returns a single pair of Diagnostic for every DjVars constraint violation.
  // The reason is that we have a single substitution for every logical var: it is consistent,
  // thus, in principle, we could have multiple substitutions and then a Diagnostic for violating
  // var. Here's an explanatory example (see the corresponding test in DisjointVarsManager.test.ts):
  // qed:ax-5 |- ( y e. A -> A. y y e. A )
  // will return three constraint errors: one underlying ax-5, one underlying the first occurrence of
  // y (from the substitution of ph) and one underlying the second occurrence of y (from the substitution
  // of x). In principle, the third occurrence of y could also be underlined, because the second y e. A
  // is yet another substitution of ph.
  // You may consider adding all these diagnostics, in the future.
  checkDisjVarConstraints(assertion, substitution, stepLabelToken, stepRef) {
    const disjointVarsManager = new DisjointVarsManager(
      assertion,
      substitution,
      this.outermostBlock,
      this.mmpProof.mandatoryVars,
      true,
      stepLabelToken,
      stepRef,
      this.mmpProof
    );
    disjointVarsManager.checkDisjVarsConstraintsViolation();
    disjointVarsManager.checkMissingDisjVarsConstraints(this.mmpProof);
    this.addDiagnosticsOrGenerateDisjVarStatements(disjointVarsManager.diagnostics);
  }
  //#endregion checkDisjVarConstraints
  checkUnificationWithUSubstitutionManager(mmpProofStep, outermostBlock, grammar, workingVars) {
    if (mmpProofStep.stepLabel != void 0) {
      const stepLabelToken = mmpProofStep.stepLabelToken;
      const labeledStatement = this.labelToStatementMap.get(stepLabelToken.value);
      if (labeledStatement instanceof AssertionStatement && !GrammarManager.isSyntaxAxiom2(labeledStatement)) {
        const uSubstitutionBuilder = new MmpSubstitutionBuilder(
          mmpProofStep,
          labeledStatement,
          outermostBlock,
          workingVars,
          grammar,
          this.diagnostics
        );
        const substitutionResult = uSubstitutionBuilder.buildSubstitution();
        if (!substitutionResult.hasBeenFound) {
          const substitution = uSubstitutionBuilder.buildACompleteSubstitutionEvenIfNonUnifiable();
          this.addDiagnisticsForSubstitution(
            labeledStatement.frame.eHyps,
            labeledStatement,
            mmpProofStep,
            substitution
          );
        } else {
          const substitution = substitutionResult.substitution;
          this.addStartingPairsForMGUFinder(mmpProofStep, labeledStatement, substitution);
          this.checkDisjVarConstraints(
            labeledStatement,
            substitution,
            mmpProofStep.stepLabelToken,
            mmpProofStep.stepRef
          );
        }
      }
    }
  }
  //#endregion checkUnificationWithUSubstitutionManager
  /**
   * Adds diagnostics for each unification in the proof
   */
  checkUnificationOfLogicalVars(outermostBlock, grammar, workingVars) {
    this.mmpProof?.mmpStatements.forEach((mmpStatement) => {
      if (mmpStatement instanceof MmpProofStep && !mmpStatement.isEHyp) {
        this.checkUnificationWithUSubstitutionManager(mmpStatement, outermostBlock, grammar, workingVars);
      }
    });
  }
  //#endregion checkUnificationOfLogicalVars
  /**
   * parses the given text and builds the properties mmpStatements , refToProofStepMap and diagnostics;
   * builds diagnostics, but it doesn't check for unification errors.
   * This is mainly used for testing it separately from the whole method parse
   * @param textToParse 
   * @param labelToStatementMap  
   * @param grammar 
   */
  createMmpStatements() {
    const mmLexer = this.mmLexer;
    mmLexer.reset(this.textToParse);
    this.mmTokens = mmLexer.tokens;
    let token = mmLexer.next();
    this.mmpProof = new MmpProof(this.outermostBlock, this.workingVars);
    while (token != void 0) {
      token = this.createNextMmpStatement(token, mmLexer);
    }
  }
  checkQedStatement() {
    const lastMmpProofStep = this.mmpProof?.lastMmpProofStep;
    if (lastMmpProofStep != void 0 && lastMmpProofStep.stepRef != "qed") {
      const message = `The last proof step's ref is expected to be 'qed'`;
      const range2 = lastMmpProofStep.stepRefToken.range;
      MmpValidator.addDiagnosticWarning(
        message,
        range2,
        "lastStatementShouldBeQED" /* lastStatementShouldBeQed */,
        this.diagnostics
      );
    }
  }
  checkCoherenceIfAlreadyExistingTheorem() {
    const theoremName = this.mmpProof?.theoremLabel?.value;
    if (theoremName != void 0) {
      const labeledStatement = this.labelToStatementMap.get(theoremName);
      if (labeledStatement instanceof ProvableStatement) {
        const defaultRange = this.mmpProof.theoremLabel.range;
        const theoremCoherenceChecker = new TheoremCoherenceChecker(
          this.mmpProof,
          labeledStatement,
          defaultRange,
          this.diagnostics
        );
        theoremCoherenceChecker.checkCoherence();
      }
    }
  }
  //#region checkUnificationOfWorkingVars
  //#region addDiagnosticsForWorkingVarsMGUerror
  //#region addDiagnosticForEachOccourenceOfWorkingVar
  addDiagnosticForOccourenceOfWorkingVarToSingleParseNode(parseNode, workingVar, errorMessage) {
    parseNode.parseNodes.forEach((childNode) => {
      if (childNode instanceof MmToken) {
        if (childNode.value == workingVar)
          MmpValidator.addDiagnosticError(
            errorMessage,
            childNode.range,
            "workingVarUnificationError" /* workingVarUnificationError */,
            this.diagnostics
          );
      } else
        this.addDiagnosticForOccourenceOfWorkingVarToSingleParseNode(childNode, workingVar, errorMessage);
    });
  }
  addDiagnosticForOccourenceOfWorkingVarToSingleFormula(stepFormula, workingVar, errorMessage) {
    stepFormula.forEach((mmToken) => {
      if (mmToken.value == workingVar)
        MmpValidator.addDiagnosticError(
          errorMessage,
          mmToken.range,
          "workingVarUnificationError" /* workingVarUnificationError */,
          this.diagnostics
        );
    });
  }
  addDiagnosticForEachOccourenceOfWorkingVar(workingVar, errorMessage) {
    this.mmpProof?.mmpStatements.forEach((uStatement) => {
      if (uStatement instanceof MmpProofStep && uStatement.stepFormula != void 0) {
        this.addDiagnosticForOccourenceOfWorkingVarToSingleFormula(
          uStatement.stepFormula,
          workingVar,
          errorMessage
        );
      }
    });
  }
  //#endregion addDiagnosticForEachOccourenceOfWorkingVar
  addDiagnosticsForWorkingVarsMGUerror(occourCheckOrderedPair) {
    const errorMessage = WorkingVarsUnifierFinder.buildErrorMessageForOccourCheckOrderedPair(
      occourCheckOrderedPair
    );
    const workingVar = GrammarManager.getTokenValueFromInternalNode(occourCheckOrderedPair.parseNode1);
    this.addDiagnosticForEachOccourenceOfWorkingVar(workingVar, errorMessage);
  }
  //#endregion addDiagnosticsForWorkingVarsMGUerror
  checkUnificationOfWorkingVars() {
    const workingVarsUnifierFinder = new WorkingVarsUnifierFinder(this._orderedPairsOfNodesForMGUalgorithm);
    workingVarsUnifierFinder.findMostGeneralUnifier();
    if (workingVarsUnifierFinder.currentState == "occourCheckFailure" /* occourCheckFailure */) {
      this.addDiagnosticsForWorkingVarsMGUerror(
        workingVarsUnifierFinder.occourCheckOrderedPair
      );
    }
  }
  //#endregion checkUnificationOfWorkingVars
  /**
   * parses the given text and builds the properties mmpStatements , refToProofStepMap and diagnostics
   * @param textToParse 
   */
  parse() {
    this.createMmpStatements();
    this.checkQedStatement();
    this.checkCoherenceIfAlreadyExistingTheorem();
    this.checkUnificationOfLogicalVars(this.outermostBlock, this.grammar, this.workingVars);
    this.checkUnificationOfWorkingVars();
  }
  //#endregion createProofSteps
  //#endregion constructor
};

// yamma/server/src/mmp/FormulaToParseNodeCache.ts
var FormulaToParseNodeCache = class {
  /** cache for formula recently parsed. It really speeds up the MmpParser, because
   * it allows avoiding most of the parsing time (an .mmp file, often doesn't
   * change much from an edit to the other)
   */
  constructor() {
    this.formulaToInternalNodeMap = /* @__PURE__ */ new Map();
  }
  add(formula, internalNode) {
    this.formulaToInternalNodeMap.set(formula, internalNode);
  }
  invalidate(stepFormulaString) {
    this.formulaToInternalNodeMap.delete(stepFormulaString);
  }
};

// yamma/server/src/general/GlobalState.ts
var GlobalState = class {
  constructor() {
    /** true iff the extension is loading a theory; used to avoid multiple loading
     * triggered by different events
     */
    this.loadingATheory = false;
    /** true iff a unify() has been performed, but the cursor has not been updated yet*/
    this._isCursorPositionUpdateRequired = false;
    /** true iff the last unification determined that the proof is complete,
     * but it contains working variables, and there are no unused theory variables
     * to replace them with. In this case, the user should be informed that he/she
     * should manually replace the working variables in order to complete the proof.
     * In most theories, this should never happen, in practice.
     */
    this.isProofCompleteAndItContainsWorkingVarsAndThereAreNoUnusedTheoryVars = false;
    this.isTriggerSuggestRequired = false;
  }
  get isCursorPositionUpdateRequired() {
    const result = this._isCursorPositionUpdateRequired;
    this._isCursorPositionUpdateRequired = false;
    return result;
  }
  requireCursorPositionUpdate() {
    this._isCursorPositionUpdateRequired = true;
  }
  setSuggestedRangeForCursorPosition(range2) {
    this.suggestedRangeForCursorPosition = range2;
  }
  requireTriggerSuggest() {
    this.isTriggerSuggestRequired = true;
  }
  resetTriggerSuggest() {
    this.isTriggerSuggestRequired = false;
  }
  /** cache for formula recently parsed. It really speeds up the MmpParser, because
   * it allows avoiding most of the parsing time (an .mmp file, often doesn't
   * change much from an edit to the other)
   */
  get formulaToParseNodeCache() {
    if (this._formulaToParseNodeCache == void 0)
      this._formulaToParseNodeCache = new FormulaToParseNodeCache();
    return this._formulaToParseNodeCache;
  }
};

// src/helpers/config.ts
var applyDefaultsToConfig = (config) => {
  return config ? {
    common: { ...defaultConfig.common, ...config.common },
    mm: { ...defaultConfig.mm, ...config.mm },
    unifier: { ...defaultConfig.unifier, ...config.unifier }
  } : defaultConfig;
};
var mapConfigToGlobalState = (config) => {
  const variableKindsConfiguration = new Map(
    config.common.variableKindsConfig.map((kindConfig) => [
      kindConfig.kind,
      kindConfig
    ])
  );
  const lastFetchedSettings = {
    ...config.mm,
    proofMode: config.common.proofMode,
    variableKindsConfiguration
  };
  const globalState = new GlobalState();
  globalState.lastFetchedSettings = lastFetchedSettings;
  return globalState;
};

// yamma/server/src/stepDerivation/EHypsDerivation.ts
var EHypsDerivation = class {
  constructor(uProof, mmpProofStepIndex, mmpProofStep, assertion, labelToStatementMap, outermostBlock, grammar, workingVars, maxNumberOfHypothesisDispositionsForStepDerivation, uSubstitutionBuilder, substitution) {
    this.uProof = uProof;
    this.mmpProofStepIndex = mmpProofStepIndex;
    this.mmpProofStep = mmpProofStep;
    this.assertion = assertion;
    this.labelToStatementMap = labelToStatementMap;
    this.outermostBlock = outermostBlock;
    this.grammar = grammar;
    this.workingVars = workingVars;
    this.maxNumberOfHypothesisDispositionsForStepDerivation = maxNumberOfHypothesisDispositionsForStepDerivation;
    this.uSubstitutionBuilder = uSubstitutionBuilder;
    this.substitution = substitution;
    this.eHypsDerivationResult = this.initializeEHypsDerivationResult(assertion.frame.eHyps.length);
  }
  initializeEHypsDerivationResult(assertionEHypsNum) {
    const emptyArray = new Array(assertionEHypsNum);
    const eHypsDerivationResult = {
      isSuccessful: void 0,
      eHypsMmpProofSteps: emptyArray
    };
    return eHypsDerivationResult;
  }
  //#region searchEHyps
  //#region searchEHypsRecursive
  //#region searchCurrentEHypWithAdditionalVarsToBeUnified
  //#region isEHypUnifiableWithCurrentProofStep
  isEHypUnifiableWithCurrentProofStep(currentEHyp, eHypProofStepCandidate) {
    const substitutionFound = eHypProofStepCandidate.parseNode != void 0 && this.uSubstitutionBuilder.buildSubstitutionForSingleLine(
      currentEHyp.parseNode,
      eHypProofStepCandidate.formula,
      eHypProofStepCandidate.parseNode,
      this.substitution
    );
    return substitutionFound;
  }
  //#endregion isEHypUnifiableWithCurrentProofStep
  removeSubstitutionForCurrentEHypIndex(currentEHypIndexForStepDerivation) {
    const eHypOrderForStepDerivation = this.assertion.eHypsOrderForStepDerivation[currentEHypIndexForStepDerivation];
    eHypOrderForStepDerivation.additionalVariablesToBeUnified.forEach((logicalVariable) => {
      this.substitution.delete(logicalVariable);
    });
  }
  tryEHypProofStepCandidate(currentEHypIndexForStepDerivation, currentEHypRealIndex, currentEHyp, eHypProofStepCandidate) {
    const isUnifiable = this.isEHypUnifiableWithCurrentProofStep(currentEHyp, eHypProofStepCandidate);
    if (isUnifiable) {
      if (currentEHypIndexForStepDerivation >= this.assertion.frame.eHyps.length - 1)
        this.eHypsDerivationResult.isSuccessful = true;
      else
        this.searchEHypsRecursive(currentEHypIndexForStepDerivation + 1);
    }
    if (this.eHypsDerivationResult.isSuccessful)
      this.eHypsDerivationResult.eHypsMmpProofSteps[currentEHypRealIndex] = eHypProofStepCandidate;
    else
      this.removeSubstitutionForCurrentEHypIndex(currentEHypIndexForStepDerivation);
  }
  /** this method is invoked when the current EHyp requires additional logical
   * vars to be unified; in this case, the formula for the EHyp is not completely
   * determined, thus we need to cycle through all previous MmpProofStep's to
   * see if one unifies (using the additional logical variables)
   */
  searchCurrentEHypWithAdditionalVarsToBeUnified(currentEHypIndexForStepDerivation, currentEHypRealIndex, currentEHyp) {
    let i = 0;
    while (!this.eHypsDerivationResult.isSuccessful && i < this.mmpProofStepIndex) {
      const eHypProofStepCandidate = this.uProof.mmpStatements[i];
      if (eHypProofStepCandidate instanceof MmpProofStep)
        this.tryEHypProofStepCandidate(
          currentEHypIndexForStepDerivation,
          currentEHypRealIndex,
          currentEHyp,
          eHypProofStepCandidate
        );
      i++;
    }
  }
  //#endregion searchCurrentEHypWithAdditionalVarsToBeUnified
  //#region searchCurrentEHypWithoutAdditionalVarsToBeUnified
  buildFormulaForCurrentEHypProofStep(currentEHyp) {
    const parseNode = MmpSubstitutionApplier.createParseNodeForInternalNode(currentEHyp.parseNode, this.substitution, this.outermostBlock);
    const formula = parseNode.stringFormula;
    return formula;
  }
  /** invoked when the current EHypStep does not require additional logical
   * variables to be unified; the expected formula is completely determined, thus
   * a single trial in a look up table is enough
  */
  searchCurrentEHypWithoutAdditionalVarsToBeUnified(currentEHypIndexForStepDerivation, currentEHypRealIndex, currentEHyp) {
    const formulaForCurrentEHypProofStep = this.buildFormulaForCurrentEHypProofStep(currentEHyp);
    const eHypProofStepIndex = this.uProof.adjustedStepIndexForThisFormula(formulaForCurrentEHypProofStep);
    if (eHypProofStepIndex != void 0 && eHypProofStepIndex < this.mmpProofStepIndex) {
      const eHypProofStep = this.uProof.mmpStatements[eHypProofStepIndex];
      this.eHypsDerivationResult.eHypsMmpProofSteps[currentEHypRealIndex] = eHypProofStep;
      if (currentEHypIndexForStepDerivation >= this.assertion.frame.eHyps.length - 1)
        this.eHypsDerivationResult.isSuccessful = true;
      else
        this.searchEHypsRecursive(currentEHypIndexForStepDerivation + 1);
    } else
      this.eHypsDerivationResult.isSuccessful = false;
  }
  //#endregion searchCurrentEHypWithoutAdditionalVarsToBeUnified
  searchEHypsRecursive(currentEHypIndexForStepDerivation) {
    const currentEHypRealIndex = this.assertion.eHypsOrderForStepDerivation[currentEHypIndexForStepDerivation].eHypIndex;
    const currentEHyp = this.assertion.frame.eHyps[currentEHypRealIndex];
    if (this.assertion.eHypsOrderForStepDerivation[currentEHypIndexForStepDerivation].additionalVariablesToBeUnified.size > 0)
      this.searchCurrentEHypWithAdditionalVarsToBeUnified(
        currentEHypIndexForStepDerivation,
        currentEHypRealIndex,
        currentEHyp
      );
    else
      this.searchCurrentEHypWithoutAdditionalVarsToBeUnified(
        currentEHypIndexForStepDerivation,
        currentEHypRealIndex,
        currentEHyp
      );
  }
  //#endregion searchEHypsRecursive
  /** tries all permutations of previous mmp proof steps, to see if one can be unified with the given
   * assertion
   */
  searchEHyps() {
    if (this.assertion.frame.eHyps.length == 0)
      this.eHypsDerivationResult = {
        isSuccessful: true,
        eHypsMmpProofSteps: []
      };
    else if (this.assertion.eHypsOrderForStepDerivation != void 0)
      this.searchEHypsRecursive(0);
    return this.eHypsDerivationResult;
  }
  //#endregion searchEHyps
};

// yamma/server/src/stepDerivation/StepDerivation.ts
var StepDerivation = class {
  constructor(mmpParser, mmpProofStepIndex, mmpProofStep, maxNumberOfHypothesisDispositionsForStepDerivation) {
    this.mmpProofStepIndex = mmpProofStepIndex;
    this.mmpProofStep = mmpProofStep;
    this.maxNumberOfHypothesisDispositionsForStepDerivation = maxNumberOfHypothesisDispositionsForStepDerivation;
    this.uProof = mmpParser.mmpProof;
    this.labelToNonSyntaxAssertionMap = mmpParser.mmParser.labelToNonSyntaxAssertionMap;
    this.outermostBlock = mmpParser.outermostBlock;
    this.grammar = mmpParser.grammar;
    this.workingVars = mmpParser.workingVars;
  }
  //#region deriveLabelAndHypothesis
  isDeriveToBeTried() {
    const result = !this.mmpProofStep.hasWorkingVars && this.outermostBlock.mmParser != void 0 && this.outermostBlock.mmParser?.areAllParseNodesComplete;
    return result;
  }
  //#region tryCurrentAssertion
  //#region isWorstCaseTooSlow
  computeNumberOfHypothesisDispositions(assertion) {
    const numberOfHypothesisDispositions = Math.pow(
      this.mmpProofStepIndex,
      assertion.eHypsWithAdditionalVariablesToBeUnifiedForStepDerivation
    );
    return numberOfHypothesisDispositions;
  }
  isWorstCaseTooSlow(assertion) {
    const numberOfHypothesisDispositions = this.computeNumberOfHypothesisDispositions(assertion);
    const isTooSlow = numberOfHypothesisDispositions > this.maxNumberOfHypothesisDispositionsForStepDerivation;
    return isTooSlow;
  }
  //#endregion isWorstCaseTooSlow
  //#region tryCurrentAssertionActually
  //#region tryAllPossibleEHypsPermutations
  //#endregion buildSubstitutionForCurrentHyp
  tryEHypsDerivation(assertion, uSubstitutionBuilder, substitution) {
    const eHypsDerivation = new EHypsDerivation(
      this.uProof,
      this.mmpProofStepIndex,
      this.mmpProofStep,
      assertion,
      this.labelToNonSyntaxAssertionMap,
      this.outermostBlock,
      this.grammar,
      this.workingVars,
      this.maxNumberOfHypothesisDispositionsForStepDerivation,
      uSubstitutionBuilder,
      substitution
    );
    eHypsDerivation.searchEHyps();
    if (eHypsDerivation.eHypsDerivationResult.isSuccessful) {
      this.mmpProofStep.stepLabel = assertion.Label;
      this.mmpProofStep.eHypUSteps = eHypsDerivation.eHypsDerivationResult.eHypsMmpProofSteps;
    }
  }
  //#endregion tryAllPossibleEHypsPermutations
  tryCurrentAssertionActually(assertion) {
    const substitution = /* @__PURE__ */ new Map();
    const uSubstitutionBuilder = new MmpSubstitutionBuilder(
      this.mmpProofStep,
      assertion,
      this.outermostBlock,
      this.workingVars,
      this.grammar,
      [],
      true
    );
    const substitutionFound = uSubstitutionBuilder.buildSubstitutionForSingleLine(
      assertion.parseNode,
      this.mmpProofStep.formula,
      this.mmpProofStep.parseNode,
      substitution
    );
    if (substitutionFound) {
      this.tryEHypsDerivation(assertion, uSubstitutionBuilder, substitution);
    }
  }
  //#endregion tryCurrentAssertionActually
  tryCurrentAssertion(labeledStatement) {
    if (!this.isWorstCaseTooSlow(labeledStatement) && labeledStatement.parseNode)
      this.tryCurrentAssertionActually(labeledStatement);
  }
  //#endregion tryCurrentAssertion
  /** tries all possibles theorems in the theory, to see if one unifies the
   * MmpProofStep, using as hypothesis the preceding steps.
   * If a valid, complete, unification is found, then this.mmpProofStep is completed with
   * the label and the hypSteps that unify; otherwise, this.mmpProofStep is left unchanged
    */
  deriveLabelAndHypothesis() {
    if (this.isDeriveToBeTried()) {
      const nonSyntaxAssertions = this.labelToNonSyntaxAssertionMap.values();
      let nonSyntaxAssertion = nonSyntaxAssertions.next();
      while (!nonSyntaxAssertion.done && this.mmpProofStep.stepLabel == void 0) {
        this.tryCurrentAssertion(nonSyntaxAssertion.value);
        nonSyntaxAssertion = nonSyntaxAssertions.next();
      }
    }
  }
  //#endregion deriveLabelAndHypothesis
};

// yamma/server/src/mmp/EHypLabelManager.ts
var EHypLabelManager = class _EHypLabelManager {
  //#region buildNewLabelIfNeeded
  static buildNewLabel(buildNewLabelArgs) {
    buildNewLabelArgs.eHyp.stepLabel = `${buildNewLabelArgs.theoremLabel}.${buildNewLabelArgs.nextLabelIndexToBeAssigned++}`;
  }
  /** label are created to be of the form <theoremName>.nn where nn is
   * an incrementing suffix.
   * But if a label exists with a prefix not equal
   * to <theoremName>, it is left unchanged.
   * If a label exists with a prefix equal to <theoremName> but
   * with a suffix which is not a number, it is left unchanged.
   * If a label exists with a prefix equal to <theoremName>, a
   * suffix which is a number, but it is not the expected number,
   * the suffix is updated to reflect its actual order.
   */
  static buildNewLabelIfNeeded(buildNewLabelArgs) {
    const eHypLabel = buildNewLabelArgs.eHyp.stepLabel;
    if (eHypLabel == void 0 || eHypLabel == buildNewLabelArgs.theoremLabel)
      _EHypLabelManager.buildNewLabel(buildNewLabelArgs);
    else {
      const dotIndex = eHypLabel.indexOf(".");
      const prefix = eHypLabel.substring(0, dotIndex);
      const suffix = eHypLabel.substring(dotIndex + 1);
      if (prefix == buildNewLabelArgs.theoremLabel && !isNaN(parseInt(suffix)))
        _EHypLabelManager.buildNewLabel(buildNewLabelArgs);
    }
  }
  //#endregion buildNewLabelIfNeeded
};

// yamma/server/src/mmp/ProofStepDuplicateRemover.ts
var ProofStepDuplicateRemover = class _ProofStepDuplicateRemover {
  //#region removeDuplicates
  static removeMmpProofStepIfTheCase(mmpProofStep, index, mmpProof, oldRefToNewRefMap) {
    let duplicatedMmpProofStep;
    let nextIndex = index + 1;
    if (mmpProofStep.formula != void 0 && mmpProofStep.parseNode != void 0 && mmpProofStep.stepRef != "qed") {
      const normalizedFormula2 = mmpProofStep.parseNode.stringFormula;
      const duplicatedMmpProofStepIndex = mmpProof.adjustedStepIndexForThisFormula(normalizedFormula2);
      if (duplicatedMmpProofStepIndex != void 0 && duplicatedMmpProofStepIndex < index && (!mmpProofStep.isProven || mmpProof.mmpStatements[duplicatedMmpProofStepIndex].isProven)) {
        duplicatedMmpProofStep = mmpProof.mmpStatements[duplicatedMmpProofStepIndex];
        if (mmpProofStep.stepRef != void 0)
          oldRefToNewRefMap.set(mmpProofStep.stepRef, duplicatedMmpProofStep);
        mmpProof.mmpStatements.splice(index, 1);
        nextIndex = index;
      }
    }
    return nextIndex;
  }
  //#region updateEHypsIfNeeded
  static updateEHypIfNeeded(stepRef, i, oldRefToNewRefMap, eHypUSteps) {
    const newEHyp = oldRefToNewRefMap.get(stepRef);
    if (newEHyp != void 0)
      eHypUSteps[i] = newEHyp;
  }
  static updateEHypsIfNeeded(mmpProofStep, oldRefToNewRefMap) {
    for (let i = 0; i < mmpProofStep.eHypUSteps.length; i++) {
      const eHyp = mmpProofStep.eHypUSteps[i];
      if (eHyp != void 0)
        _ProofStepDuplicateRemover.updateEHypIfNeeded(eHyp.stepRef, i, oldRefToNewRefMap, mmpProofStep.eHypUSteps);
    }
  }
  //#endregion updateEHypsIfNeeded
  /** removes all MmpProofStep's that have the same formula
   * of some preceding step. All references are adjusted accordingly.
   */
  static removeStepDuplicates(mmpProof) {
    const oldRefToNewRefMap = /* @__PURE__ */ new Map();
    let i = 0;
    while (i < mmpProof.mmpStatements.length) {
      const mmpStatement = mmpProof.mmpStatements[i];
      if (mmpStatement instanceof MmpProofStep) {
        i = _ProofStepDuplicateRemover.removeMmpProofStepIfTheCase(mmpStatement, i, mmpProof, oldRefToNewRefMap);
        _ProofStepDuplicateRemover.updateEHypsIfNeeded(mmpStatement, oldRefToNewRefMap);
      } else
        i++;
    }
  }
  //#endregion removeDuplicates
};

// yamma/server/src/mmp/RefNumberManager.ts
var RefNumberManager = class _RefNumberManager {
  static renumberMmpProofStep(mmpProofStep, oldRefToProofStepMap, ref) {
    if (mmpProofStep.stepRef != "")
      oldRefToProofStepMap.set(mmpProofStep.stepRef, mmpProofStep);
    const strRef = ref.toString();
    mmpProofStep.stepRef = strRef;
  }
  static renumber(mmpProof) {
    const oldRefToProofStepMap = /* @__PURE__ */ new Map();
    const mmpStatements = mmpProof.mmpStatements;
    let ref = 1;
    mmpStatements.forEach((mmpStatement) => {
      if (mmpStatement instanceof MmpProofStep && !mmpStatement.isQed) {
        _RefNumberManager.renumberMmpProofStep(mmpStatement, oldRefToProofStepMap, ref++);
      }
    });
  }
  //#endregion renumber
};

// yamma/server/src/mmp/MmpHeaderManager.ts
var MmpHeaderManager = class {
  constructor(mmpProof, expectedTheoremName) {
    this.mmpProof = mmpProof;
    this.expectedTheoremName = expectedTheoremName;
    this.mmpComment = this.buildDefaultComment();
  }
  buildDefaultComment() {
    const mmpComment = MmpComment.CreateMmpComment(Parameters.defaultComment);
    return mmpComment;
  }
  //#region addMissingStatements
  /** searches the first index for a MmpStatement that is not
   * a MmpTheoremLabel. If this is not a MmpComment, than a comment is inserted
   */
  getIndexToInsertMissingComment() {
    let index = 0;
    const mmpStatements = this.mmpProof.mmpStatements;
    while (index < mmpStatements.length && // !(mmpStatements[index] instanceof MmpComment) &&
    // !(mmpStatements[index] instanceof MmpProofStep))
    (mmpStatements[index] instanceof MmpTheoremLabel || mmpStatements[index] instanceof MmpAllowDiscouraged))
      index++;
    const indexOfFirstMmpStatement = mmpStatements[index] instanceof MmpComment ? void 0 : index;
    return indexOfFirstMmpStatement;
  }
  addCommentIfMissing() {
    const index = this.getIndexToInsertMissingComment();
    if (index != void 0)
      this.mmpProof.insertStatementToTheHeader(this.mmpComment, index);
  }
  //#region addTheoremLabelStatementIfMissing
  getFirstStatement() {
    let firstStatement;
    if (this.mmpProof.mmpStatements.length > 0)
      firstStatement = this.mmpProof.mmpStatements[0];
    return firstStatement;
  }
  addTheoremLabelStatement(expectedTheoremName) {
    const theoremLabel = MmpTheoremLabel.CreateMmpTheoremLabel(
      expectedTheoremName
    );
    this.mmpProof.insertStatementToTheHeader(theoremLabel, 0);
  }
  addTheoremLabelStatementIfMissing() {
    if (this.expectedTheoremName != void 0) {
      const firstStatement = this.getFirstStatement();
      if (!(firstStatement instanceof MmpTheoremLabel))
        this.addTheoremLabelStatement(this.expectedTheoremName);
    }
  }
  //#endregion addTheoremLabelStatementIfMissing
  addMissingStatements() {
    this.addTheoremLabelStatementIfMissing();
    this.addCommentIfMissing();
  }
  //#endregion addMissingStatements
};

// yamma/server/src/mmp/MmToMmpConverter.ts
var MmToMmpConverter = class {
  constructor(theoremLabel, outermostBlock, labelToStatementMap) {
    this.theoremLabel = theoremLabel;
    this.outermostBlock = outermostBlock;
    this.labelToStatementMap = labelToStatementMap;
    this.stack = [];
    this.stored = [];
    this.verifier = new Verifier([]);
    this.formulaStringToMmpProofStepMap = /* @__PURE__ */ new Map();
    this.mmpProof = new MmpProof(this.outermostBlock, new WorkingVars(/* @__PURE__ */ new Map()), 1);
  }
  //#region buildProof
  //#region buildProofForProvableStatement
  addTheoremLabel(label) {
    const mmpTheoremLabel = new MmpTheoremLabel(
      new MmToken("$theorem", 0, 0),
      new MmToken(label, 0, 0)
    );
    this.mmpProof.addMmpStatement(mmpTheoremLabel);
  }
  addComment(comment) {
    const commentContent = rebuildOriginalStringFromTokens(comment);
    const newComment = "* " + commentContent.slice(2);
    const newTokens = splitToTokensDefault(newComment);
    const mmpComment = new MmpComment(newTokens, newComment);
    this.mmpProof.addMmpStatement(mmpComment);
  }
  addHeaderStatements(provableStatement) {
    this.addTheoremLabel(provableStatement.Label);
    if (provableStatement.comment != void 0 && provableStatement.comment.length > 0)
      this.addComment(provableStatement.comment);
  }
  //#region addMmpStatements
  isFormulaAlreadyInTheProof(formula) {
    const textForFormula = concatWithSpaces(formula);
    const isAlreadyInThProof = this.formulaStringToMmpProofStepMap.get(textForFormula) != void 0;
    return isAlreadyInThProof;
  }
  getStepRef(isLastStatementInMmProof) {
    let stepRef = this.mmpProof.getNewRef().substring(1);
    if (isLastStatementInMmProof)
      stepRef = "qed";
    return stepRef;
  }
  //#region addEHypMmpProofSteps
  addEHypMmpProofStep(eHyp) {
    const stepRef = this.getStepRef(false);
    const stepRefToken = new MmToken(stepRef, 0, 0);
    const firstToken = this.buildFirstToken(stepRef, [], eHyp.Label);
    const labelToken = new MmToken(eHyp.Label, 0, 0);
    const firstTokenInfo = new ProofStepFirstTokenInfo(
      firstToken,
      true,
      stepRefToken,
      [],
      labelToken
    );
    const formula = fromStringsToTokens(eHyp.formula);
    const mmpProofStep = new MmpProofStep(
      this.mmpProof,
      firstTokenInfo,
      true,
      true,
      firstTokenInfo.stepRef,
      firstTokenInfo.eHypRefs,
      [],
      firstTokenInfo.stepLabel,
      formula
    );
    this.mmpProof.addMmpStep(mmpProofStep);
    this.formulaStringToMmpProofStepMap.set(mmpProofStep.textForFormula, mmpProofStep);
  }
  addEHypMmpProofSteps(provableStatement) {
    provableStatement.frame?.eHyps.forEach((statement) => {
      if (statement instanceof EHyp && !this.isFormulaAlreadyInTheProof(statement.formula))
        this.addEHypMmpProofStep(statement);
    });
  }
  //#endregion addEHypMmpProofSteps
  //#region addSingleStepToMmpProof
  //#region addAssertionStatementWithSubstitution
  //#region buildMmpProofStep
  //#region getEHypMmpSteps
  //#region getEHypMmpStep
  getFormulaStringWithSubstitution(formula, substitution) {
    const formulaWithSubstitution = this.verifier.applySubstitution(formula, substitution);
    const formulaStringWithSubstitution = concatWithSpaces(formulaWithSubstitution);
    return formulaStringWithSubstitution;
  }
  getEHypMmpStep(eHyp, substitution) {
    const eHypFormulaStringWithSubstitution = this.getFormulaStringWithSubstitution(
      eHyp.formula,
      substitution
    );
    const mmpProofStep = this.formulaStringToMmpProofStepMap.get(
      eHypFormulaStringWithSubstitution
    );
    return mmpProofStep;
  }
  //#endregion getEHypMmpStep
  getEHypMmpSteps(assertionStatementProofStep, substitution) {
    const eHypMmpSteps = [];
    assertionStatementProofStep.frame.eHyps.forEach((eHyp) => {
      const eHypMmpStep = this.getEHypMmpStep(eHyp, substitution);
      eHypMmpSteps.push(eHypMmpStep);
    });
    return eHypMmpSteps;
  }
  //#endregion getEHypMmpSteps
  //#region buildFirstTokenInfo
  //#region buildFirstToken
  getStepRefs(eHypMmpSteps) {
    let stepRefs = eHypMmpSteps.length == 0 ? "" : eHypMmpSteps[0].stepRef;
    for (let i = 1; i < eHypMmpSteps.length; i++)
      stepRefs += "," + eHypMmpSteps[i].stepRef;
    return stepRefs;
  }
  buildFirstToken(stepRef, eHypMmpSteps, stepLabel) {
    const stepRefs = this.getStepRefs(eHypMmpSteps);
    const firstTokenValue = `${stepRef}:${stepRefs}:${stepLabel}`;
    const firstToken = new MmToken(firstTokenValue, 0, 0);
    return firstToken;
  }
  //#endregion buildFirstToken
  buildEHypRefs(eHypMmpSteps) {
    const eHypRefs = [];
    eHypMmpSteps.forEach((eHypMmpStep) => {
      const eHypRef = new MmToken(eHypMmpStep.stepRef, 0, 0);
      eHypRefs.push(eHypRef);
    });
    return eHypRefs;
  }
  buildFirstTokenInfo(assertionStatementProofStep, eHypMmpSteps, isLastStatementInMmProof) {
    const isEHyp = false;
    const stepRef = this.getStepRef(isLastStatementInMmProof);
    const stepRefToken = new MmToken(stepRef, 0, 0);
    const firstToken = this.buildFirstToken(
      stepRef,
      eHypMmpSteps,
      assertionStatementProofStep.Label
    );
    const eHypRefs = this.buildEHypRefs(eHypMmpSteps);
    const labelToken = new MmToken(assertionStatementProofStep.Label, 0, 0);
    const proofStepFirstTokenInfo = new ProofStepFirstTokenInfo(
      firstToken,
      isEHyp,
      stepRefToken,
      eHypRefs,
      labelToken
    );
    return proofStepFirstTokenInfo;
  }
  //#endregion buildFirstTokenInfo
  buildMmpProofStep(assertionStatementProofStep, assertionStatementWithSubstitution, substitution, isLastStatementInMmProof) {
    const eHypMmpSteps = this.getEHypMmpSteps(
      assertionStatementProofStep,
      substitution
    );
    const firstTokenInfo = this.buildFirstTokenInfo(
      assertionStatementProofStep,
      eHypMmpSteps,
      isLastStatementInMmProof
    );
    const formula = fromStringsToTokens(assertionStatementWithSubstitution);
    const mmpProofStep = new MmpProofStep(
      this.mmpProof,
      firstTokenInfo,
      true,
      false,
      firstTokenInfo.stepRef,
      firstTokenInfo.eHypRefs,
      eHypMmpSteps,
      firstTokenInfo.stepLabel,
      formula
    );
    return mmpProofStep;
  }
  //#endregion buildMmpProofStep
  addAssertionStatementWithSubstitution(assertionStatementProofStep, assertionStatementWithSubstitution, substitution, isLastStatementInMmProof) {
    const mmpProofStep = this.buildMmpProofStep(
      assertionStatementProofStep,
      assertionStatementWithSubstitution,
      substitution,
      isLastStatementInMmProof
    );
    this.mmpProof.addMmpStep(mmpProofStep);
    this.formulaStringToMmpProofStepMap.set(
      mmpProofStep.textForFormula,
      mmpProofStep
    );
  }
  //#endregion addAssertionStatementWithSubstitution
  addSingleStepToMmpProof(assertionStatementProofStep, isLastStatementInMmProof) {
    const frameProofStep = assertionStatementProofStep.frame;
    const popCount = frameProofStep.fHyps.length + frameProofStep.eHyps.length;
    const fHypsStack = this.verifier.fHypsStack(frameProofStep, this.stack);
    const substitution = this.verifier.buildSubstitution(frameProofStep.fHyps, fHypsStack);
    for (let i = 0; i < popCount; i++)
      this.stack.pop();
    const assertionStatementWithSubstitution = this.verifier.applySubstitution(assertionStatementProofStep.formula, substitution);
    if (!GrammarManager.isSyntaxAxiom2(assertionStatementProofStep) && !this.isFormulaAlreadyInTheProof(assertionStatementWithSubstitution))
      this.addAssertionStatementWithSubstitution(
        assertionStatementProofStep,
        assertionStatementWithSubstitution,
        substitution,
        isLastStatementInMmProof
      );
    this.stack.push(assertionStatementWithSubstitution);
  }
  //#endregion addSingleStepToMmpProof
  addMmpStatementsFromMmStatementsInTheProof(provableStatement, mmProof) {
    this.addEHypMmpProofSteps(provableStatement);
    mmProof.forEach((statement, i) => {
      if (statement instanceof FHyp) {
        this.stack.push(statement.formula);
      } else if (statement instanceof EHyp) {
        this.stack.push(statement.formula);
      } else if (statement instanceof ZIStatement) {
        this.stored.push(this.stack[this.stack.length - 1]);
      } else if (statement instanceof ZRStatement) {
        this.stack.push(this.stored[statement.referencedZ]);
      } else if (statement instanceof AssertionStatement)
        this.addSingleStepToMmpProof(
          statement,
          i == mmProof.length - 1
        );
    });
  }
  getMmStatementsFromCompressedProof(provableStatement) {
    const proofCompressor = new ProofCompressor([]);
    const mmStatements = proofCompressor.DecompressProof(
      provableStatement,
      this.labelToStatementMap
    );
    return mmStatements;
  }
  addMmpStatements(provableStatement) {
    const mmStatements = provableStatement.hasCompressedProof ? this.getMmStatementsFromCompressedProof(provableStatement) : Verifier.GetProofStatements(
      provableStatement.Proof,
      this.labelToStatementMap,
      provableStatement.ParentBlock ?? this.outermostBlock
    );
    this.addMmpStatementsFromMmStatementsInTheProof(provableStatement, mmStatements);
  }
  //#endregion addMmpStatements
  //#region addDisjStatements
  buildStatementTokens(var1, var2) {
    const statementTokens = [
      new MmToken("$", 0, 0),
      new MmToken(var1, 0, 2),
      new MmToken(var2, 0, 4)
    ];
    return statementTokens;
  }
  addDisjStatements(provableStatement) {
    const sortedDisjVarPairs = provableStatement.frame.disjVars.sortedDisjVarPairs;
    for (const [var1, var2] of sortedDisjVarPairs) {
      const statement = this.buildStatementTokens(var1, var2);
      this.mmpProof.addDisjointVarStatement(statement);
    }
  }
  //#endregion addDisjStatements
  buildProofForProvableStatement(provableStatement) {
    this.addHeaderStatements(provableStatement);
    this.addMmpStatements(provableStatement);
    this.addDisjStatements(provableStatement);
    return this.mmpProof;
  }
  //#endregion buildProofForProvableStatement
  buildProof() {
    let mmpProof;
    const provableStatement = this.labelToStatementMap.get(this.theoremLabel);
    if (provableStatement instanceof ProvableStatement)
      mmpProof = this.buildProofForProvableStatement(provableStatement);
    return mmpProof;
  }
  //#endregion buildProof
};

// yamma/server/src/mmp/UnusedStatementsRemover.ts
var UnusedStatementsRemover = class {
  //#region removeUnusedStatements
  //#region getUsedStatements
  static getUsedStatementsRecursively(currentMmpProofStep, usedSatements) {
    usedSatements.add(currentMmpProofStep);
    currentMmpProofStep.eHypUSteps.forEach((mmpProofStep) => {
      if (mmpProofStep)
        this.getUsedStatementsRecursively(mmpProofStep, usedSatements);
    });
  }
  static getUsedStatements(mmpProof) {
    const usedSatements = /* @__PURE__ */ new Set();
    if (mmpProof.lastMmpProofStep != void 0)
      this.getUsedStatementsRecursively(mmpProof.lastMmpProofStep, usedSatements);
    return usedSatements;
  }
  //#endregion getUsedStatements
  static removeUnusedStatements(mmpProof) {
    const usedStatements = this.getUsedStatements(mmpProof);
    mmpProof.mmpStatements = mmpProof.mmpStatements.filter((mmpStatement) => {
      return !(mmpStatement instanceof MmpProofStep) || usedStatements.has(mmpStatement);
    });
  }
  //#endregion removeUnusedStatements
};

// yamma/server/src/mmp/MmpDisjVarStatementsReorganizer.ts
var MmpDisjVarStatementsReorganizer = class _MmpDisjVarStatementsReorganizer {
  //#region reorganizeDisjointVarConstraintsStatements
  //#region getMandatoryAndDummyDisjVarStatementsWithoutDuplicates
  static removeDuplicate(disjVarStatements) {
    const alreadyPresent = /* @__PURE__ */ new Set();
    const disjVarStatementsWithoutDuplicates = [];
    disjVarStatements.forEach((disjVarStatement) => {
      const key = disjVarStatement.toText();
      if (!alreadyPresent.has(key)) {
        alreadyPresent.add(key);
        disjVarStatementsWithoutDuplicates.push(disjVarStatement);
      }
    });
    return disjVarStatementsWithoutDuplicates;
  }
  /** adds the disj var statements withou duplicates; it also adds the
   * disj var statements automatically generated by the MmpParser */
  static getMandatoryAndDummyDisjVarStatementsWithoutDuplicates(mmpProof, mmpDisjVarStatementsAutomaticallyGenerated, mandatoryDisjVarStatements, dummyDisjVarStatements) {
    const disjVarStatements = mmpProof.mmpStatements.filter((statement) => statement instanceof MmpDisjVarStatement);
    disjVarStatements.push(...mmpDisjVarStatementsAutomaticallyGenerated);
    const disjVarStatementsWithoutDuplicates = _MmpDisjVarStatementsReorganizer.removeDuplicate(disjVarStatements);
    disjVarStatementsWithoutDuplicates.forEach((disjVarStatement) => {
      if (mmpProof.mandatoryVars.has(disjVarStatement.disjointVars[0].value) && mmpProof.mandatoryVars.has(disjVarStatement.disjointVars[1].value))
        mandatoryDisjVarStatements.push(disjVarStatement);
      else
        dummyDisjVarStatements.push(disjVarStatement);
    });
  }
  //#endregion getMandatoryAndDummyDisjVarStatementsWithoutDuplicates
  static sortDisjVarStatements(mandatoryDisjVarStatements) {
    mandatoryDisjVarStatements.sort((disjVarStatement1, disjVarStatement2) => {
      const var1 = disjVarStatement1.disjointVars[0].value;
      const var2 = disjVarStatement2.disjointVars[0].value;
      return var1.localeCompare(var2);
    });
  }
  //#region moveDisjVarStatements
  /** removes all the $d statements before the last MmpProofStep and returns the index
   * after the last MmpProofStep, if it is defined (or the index after the last MmpStatement,
   * but this could happen only if the proof does not have any MmpProofStep) */
  static removeAllDisjVarStatementsBeforeTheLastMmpProofStep(mmpProof) {
    let i = 0;
    while (i < mmpProof.mmpStatements.length && mmpProof.mmpStatements[i] != mmpProof.lastMmpProofStep)
      if (mmpProof.mmpStatements[i] instanceof MmpDisjVarStatement)
        mmpProof.mmpStatements.splice(i, 1);
      else
        i++;
    if (i < mmpProof.mmpStatements.length)
      i++;
    return i;
  }
  //#region addMandatoryAddCommentAddDummyDisjVarStatements
  static setStatement(mmpProof, i, mmpStatement) {
    if (i < mmpProof.mmpStatements.length)
      mmpProof.mmpStatements[i] = mmpStatement;
    else {
      mmpProof.mmpStatements.push(mmpStatement);
    }
  }
  static addDisjVarStatements(mmpProof, indexToStartAddingDisjVarStatements, disjVarStatements) {
    let i = indexToStartAddingDisjVarStatements;
    disjVarStatements.forEach((disjVarStatement) => {
      _MmpDisjVarStatementsReorganizer.setStatement(mmpProof, i, disjVarStatement);
      i++;
    });
  }
  static addCommentForDummyConstraints(mmpProof, indexToInsertComment) {
    const commentForDummyConstraints = MmpComment.CreateMmpComment(
      Parameters.dummyConstraintsComment
    );
    _MmpDisjVarStatementsReorganizer.setStatement(mmpProof, indexToInsertComment, commentForDummyConstraints);
    mmpProof.commentForDummyConstraints = commentForDummyConstraints;
  }
  /** adds the mandatory $d statements at the top of the list, then adds a comment
   * to separate mandatory and dummy $d statements, and finally adds the dummy $d
   * statements at the bottom of the list.
   * Returns the index after the last inserted statement, if any (otherwise, the
   * index after the last MmpProofStep) */
  static addMandatoryAddCommentAddDummyDisjVarStatements(mmpProof, isCommentForDummyConstraintToBeInserted, indexAfterTheLastMmpProofStepOrAfterTheLastMmpStatement, mandatoryDisjVarStatements, dummyDisjVarStatements) {
    _MmpDisjVarStatementsReorganizer.addDisjVarStatements(
      mmpProof,
      indexAfterTheLastMmpProofStepOrAfterTheLastMmpStatement,
      mandatoryDisjVarStatements
    );
    let indexForNextInsertion = indexAfterTheLastMmpProofStepOrAfterTheLastMmpStatement + mandatoryDisjVarStatements.length;
    if (isCommentForDummyConstraintToBeInserted && dummyDisjVarStatements.length > 0) {
      _MmpDisjVarStatementsReorganizer.addCommentForDummyConstraints(
        mmpProof,
        indexAfterTheLastMmpProofStepOrAfterTheLastMmpStatement + mandatoryDisjVarStatements.length
      );
      indexForNextInsertion++;
    }
    _MmpDisjVarStatementsReorganizer.addDisjVarStatements(
      mmpProof,
      indexForNextInsertion,
      dummyDisjVarStatements
    );
    indexForNextInsertion += dummyDisjVarStatements.length;
    return indexForNextInsertion;
  }
  //#endregion addMandatoryAddCommentAddDummyDisjVarStatements
  static moveDisjVarStatements(mmpProof, isCommentForDummyConstraintToBeInserted, mandatoryDisjVarStatements, dummyDisjVarStatements) {
    const indexAfterTheLastMmpProofStepOrAfterTheLastMmpStatement = _MmpDisjVarStatementsReorganizer.removeAllDisjVarStatementsBeforeTheLastMmpProofStep(mmpProof);
    const indexAfterTheLastValidStatement = _MmpDisjVarStatementsReorganizer.addMandatoryAddCommentAddDummyDisjVarStatements(
      mmpProof,
      isCommentForDummyConstraintToBeInserted,
      indexAfterTheLastMmpProofStepOrAfterTheLastMmpStatement,
      mandatoryDisjVarStatements,
      dummyDisjVarStatements
    );
    mmpProof.mmpStatements.splice(indexAfterTheLastValidStatement);
  }
  //#endregion moveDisjVarStatements
  static reorganizeDisjointVarConstraintsStatements(mmpProof, isCommentForDummyConstraintToBeInserted, disjVarStatementsAutomaticallyGenerated) {
    const mandatoryDisjVarStatements = [];
    const dummyDisjVarStatements = [];
    _MmpDisjVarStatementsReorganizer.getMandatoryAndDummyDisjVarStatementsWithoutDuplicates(
      mmpProof,
      disjVarStatementsAutomaticallyGenerated,
      mandatoryDisjVarStatements,
      dummyDisjVarStatements
    );
    _MmpDisjVarStatementsReorganizer.sortDisjVarStatements(mandatoryDisjVarStatements);
    _MmpDisjVarStatementsReorganizer.sortDisjVarStatements(dummyDisjVarStatements);
    _MmpDisjVarStatementsReorganizer.moveDisjVarStatements(
      mmpProof,
      isCommentForDummyConstraintToBeInserted,
      mandatoryDisjVarStatements,
      dummyDisjVarStatements
    );
  }
  //#endregion reorganizeDisjointVarConstraintsStatements
};

// yamma/server/src/mmp/MmpProofTransformer.ts
var MmpProofTransformer = class {
  //#region constructor
  // constructor(mmpParser: MmpParser, maxNumberOfHypothesisDispositionsForStepDerivation: number,
  // 	private renumber?: boolean, private expectedTheoremLabel?: string) {
  constructor(mmpProofTransformerArgs) {
    this.mmpProofTransformerArgs = mmpProofTransformerArgs;
    // the list of statements, after createMmpStatements() has been invoked
    // mmpStatements: MmpStatement[] = []
    // maps each proof step id to the proof step,  after createMmpStatements() has been invoked
    // refToProofStepMap: Map<string, MmpProofStep>;
    // the list of diagnostics, after createMmpStatements() has been invoked
    this.diagnostics = [];
    // the list of TextEdit, after createMmpStatements() has been invoked
    this.textEditArray = [];
    this.containsGetProof = false;
    this.mmpParser = this.mmpProofTransformerArgs.mmpParser;
    this.uProof = this.mmpParser.mmpProof;
    this.labelToNonSyntaxAssertionMap = this.mmpParser.mmParser.labelToNonSyntaxAssertionMap;
    this.outermostBlock = this.mmpParser.outermostBlock;
    this.grammar = this.mmpParser.grammar;
    this.workingVars = this.mmpParser.workingVars;
    this.renumber = this.mmpProofTransformerArgs.renumber;
    this.removeUnusedStatements = this.mmpProofTransformerArgs.removeUnusedStatements;
    this.expectedTheoremLabel = this.mmpProofTransformerArgs.expectedTheoremLabel;
    this.maxNumberOfHypothesisDispositionsForStepDerivation = mmpProofTransformerArgs.maxNumberOfHypothesisDispositionsForStepDerivation;
    this._orderedPairsOfNodesForMGUalgorithm = [];
  }
  // true if the proof contains a getproof statement
  get orderedPairOfNodes() {
    return this._orderedPairsOfNodesForMGUalgorithm;
  }
  //#region transformUProof
  addMissingStatements() {
    const mmpHeaderManager = new MmpHeaderManager(
      this.uProof,
      this.expectedTheoremLabel
    );
    mmpHeaderManager.addMissingStatements();
  }
  //#region transformUSteps
  areEHypLabelsToBeTransformed() {
    let areToBeTransformed = true;
    if (this.uProof.theoremLabel != void 0) {
      const labeledStatement = this.mmpParser.labelToStatementMap.get(this.uProof.theoremLabel.value);
      areToBeTransformed = labeledStatement == void 0;
    }
    return areToBeTransformed;
  }
  //#region addStartingPairsForMGUFinder
  //#region addStartingPairsForMGUFinderForParseNode
  // addStartingPairsForMGUFinderForParseNodeWithLogicalNodeSubstituted(uStepParseNode: ParseNode,
  // 	newNodeWithSubstitution: ParseNode) {
  // 	if (GrammarManager.isInternalParseNodeForWorkingVar(uStepParseNode)) {
  // 		// uStepParseNode is a ParseNode for a Working Var
  // 		// uStepParseNode AND logicalSystemFormulaParseNode are internal nodes; for the case uStepParseNode instanceof MmToken nothing has
  // 		// to be done, because when we get here a substitution for logical vars has been found and then leaf nodes match successfully
  // 		if (!GrammarManager.areParseNodesEqual(uStepParseNode, newNodeWithSubstitution)) {
  // 			const orderedPairOfNodes: OrderedPairOfNodes = {
  // 				parseNode1: <InternalNode>uStepParseNode,
  // 				parseNode2: <InternalNode>newNodeWithSubstitution
  // 			};
  // 			this._orderedPairsOfNodesForMGUalgorithm.push(orderedPairOfNodes);
  // 		}
  // 	} else if (uStepParseNode instanceof InternalNode)
  // 		// uStepParseNode AND logicalSystemFormulaParseNode are internal nodes;
  // 		// for the case uStepParseNode instanceof MmToken nothing has to be done, because when we get here a substitution
  // 		// for logical vars has been found and then leaf nodes match successfully
  // 		for (let i = 0; i < uStepParseNode.parseNodes.length; i++) {
  // 			if ((<InternalNode>newNodeWithSubstitution).parseNodes[i] == undefined) {
  // 				const a = 3;
  // 			}
  // 			this.addStartingPairsForMGUFinderForParseNodeWithLogicalNodeSubstituted(uStepParseNode.parseNodes[i],
  // 				(<InternalNode>newNodeWithSubstitution).parseNodes[i]);
  // 		}
  // }
  // addStartingPairsForMGUFinderForParseNode(uStepParseNode: ParseNode, logicalSystemFormulaParseNode: ParseNode,
  // 	substitution: Map<string, InternalNode>) {
  // 	const newNodeWithSubstitution = USubstitutionApplier.createParseNode(logicalSystemFormulaParseNode,
  // 		substitution, this.outermostBlock);
  // 	this.addStartingPairsForMGUFinderForParseNodeWithLogicalNodeSubstituted(uStepParseNode, newNodeWithSubstitution);
  // }
  // //#endregion addStartingPairsForMGUFinderForParseNode
  // addStartingPairsForMGUFinderForEHyps(eHypUSteps: UProofStep[], logicalSystemEHyps: EHyp[],
  // 	substitution: Map<string, InternalNode>) {
  // 	for (let i = 0; i < eHypUSteps.length; i++) {
  // 		const uStepEHyp: UProofStep = eHypUSteps[i];
  // 		const logicalSystemEHyp = logicalSystemEHyps[i];
  // 		if (uStepEHyp.parseNode != undefined)
  // 			this.addStartingPairsForMGUFinderForParseNode(<ParseNode>uStepEHyp.parseNode, logicalSystemEHyp!.parseNode(this.grammar), substitution);
  // 	}
  // }
  /**
   * builds startingPairsForMGUFinder, that will be used to find the most general unifier
   * for the working vars; when we get here, uProofStep has already been completed and substitution is complete
   * @param substitution 
   */
  addStartingPairsForMGUFinder(uProofStep, assertion, substitution) {
    const workingVarsUnifierInitializer = new WorkingVarsUnifierInitializer(
      uProofStep,
      assertion,
      substitution,
      this.outermostBlock,
      this.grammar
    );
    const startingPairsForMGUAlgorthm = workingVarsUnifierInitializer.buildStartingPairsForMGUAlgorithm();
    this._orderedPairsOfNodesForMGUalgorithm = this._orderedPairsOfNodesForMGUalgorithm.concat(...startingPairsForMGUAlgorthm);
  }
  //#endregion addStartingPairsForMGUFinder
  //#region setIsProvenIfTheCase
  foundDisjVarConstraintViolation(uProofStep) {
    const disjointVarsManager = new DisjointVarsManager(
      uProofStep.assertion,
      uProofStep.substitution,
      this.outermostBlock,
      /* @__PURE__ */ new Set(),
      false
    );
    disjointVarsManager.checkDisjVarsConstraintsViolation();
    return disjointVarsManager.foundDisjVarsConstraintViolation;
  }
  missingDisjVarConstraints(uProofStep) {
    const disjointVarsManager = new DisjointVarsManager(
      uProofStep.assertion,
      uProofStep.substitution,
      this.outermostBlock,
      uProofStep.mmpProof.mandatoryVars,
      false
    );
    disjointVarsManager.checkMissingDisjVarsConstraints(this.uProof);
    const disjVarAutomaticGeneration = this.mmpParser.disjVarAutomaticGeneration;
    if (disjVarAutomaticGeneration != "GenerateAll" /* GenerateAll */ && disjointVarsManager.diagnostics.some((diagnostic) => diagnostic.code == "missingMandatoryDisjVarsStatement" /* missingMandatoryDisjVarsStatement */ || disjVarAutomaticGeneration == "GenerateNone" /* GenerateNone */)) {
      return true;
    }
    return false;
  }
  setIsProvenIfTheCase(uProofStep, numberOfLogicalEHyps) {
    let isProven = uProofStep.parseNode != void 0 && uProofStep.eHypUSteps.length == numberOfLogicalEHyps;
    let i = 0;
    while (i < uProofStep.eHypUSteps.length && isProven) {
      isProven &&= uProofStep.eHypUSteps[i] != void 0 && uProofStep.eHypUSteps[i].isProven;
      i++;
    }
    if (isProven) {
      const foundDisjVarConstraintViolation = this.foundDisjVarConstraintViolation(uProofStep);
      if (!foundDisjVarConstraintViolation) {
        const missingDisjVarConstraints = this.missingDisjVarConstraints(uProofStep);
        if (!missingDisjVarConstraints)
          uProofStep.setIsProven();
      }
    }
  }
  //#endregion setIsProvenIfTheCase
  transformEHyp(currentMmpStatement, currentIndexInEHypLabel) {
    let nextLabelIndexToBeAssigned = currentIndexInEHypLabel;
    if (this.uProof.theoremLabel != void 0) {
      const buildNewLabelArgs = {
        theoremLabel: this.uProof.theoremLabel.value,
        eHyp: currentMmpStatement,
        nextLabelIndexToBeAssigned: currentIndexInEHypLabel
      };
      EHypLabelManager.buildNewLabelIfNeeded(buildNewLabelArgs);
      nextLabelIndexToBeAssigned = buildNewLabelArgs.nextLabelIndexToBeAssigned;
    }
    return nextLabelIndexToBeAssigned;
  }
  //#region transformUStep
  tryToDeriveEHypsOnly(uStepIndex, mmpProofStep) {
    if (mmpProofStep.assertion instanceof AssertionStatement && mmpProofStep.assertion.parseNode && !GrammarManager.isSyntaxAxiom2(mmpProofStep.assertion) && mmpProofStep.parseNode != void 0) {
      const substitution = /* @__PURE__ */ new Map();
      const uSubstitutionBuilder = new MmpSubstitutionBuilder(
        mmpProofStep,
        mmpProofStep.assertion,
        this.outermostBlock,
        this.workingVars,
        this.grammar,
        [],
        true
      );
      const foundSubstitution = uSubstitutionBuilder.buildSubstitutionForParseNode(
        mmpProofStep.assertion.parseNode,
        mmpProofStep.parseNode,
        substitution
      );
      if (foundSubstitution) {
        const stepDerivation = new StepDerivation(
          this.mmpParser,
          uStepIndex,
          mmpProofStep,
          this.maxNumberOfHypothesisDispositionsForStepDerivation
        );
        stepDerivation.tryEHypsDerivation(
          mmpProofStep.assertion,
          uSubstitutionBuilder,
          substitution
        );
      }
    }
  }
  deriveLabelAndHypotesisWithoutWorkingVars(uStepIndex, mmpProofStep) {
    const stepLabel = mmpProofStep.stepLabel;
    mmpProofStep.stepLabel = void 0;
    if (this.outermostBlock.mmParser != void 0) {
      const stepDerivation = new StepDerivation(
        this.mmpParser,
        uStepIndex,
        mmpProofStep,
        this.maxNumberOfHypothesisDispositionsForStepDerivation
      );
      stepDerivation.deriveLabelAndHypothesis();
    }
    if (mmpProofStep.stepLabel == void 0)
      mmpProofStep.stepLabel = stepLabel;
  }
  deriveLabelAndHypotesis(uStepIndex, mmpProofStep) {
    if (mmpProofStep.parseNode != void 0) {
      if (mmpProofStep.hasWorkingVars && mmpProofStep.stepLabel != void 0)
        this.tryToDeriveEHypsOnly(uStepIndex, mmpProofStep);
      else if (!mmpProofStep.hasWorkingVars)
        this.deriveLabelAndHypotesisWithoutWorkingVars(uStepIndex, mmpProofStep);
    }
  }
  //#region tryToDeriveEhypsIfIncomplete
  /** eHyps derivation should be tried BEFORE a unification attempt,
   * if the current step is parsable, and the ehyps are not complete */
  isEHypsCompletionToBeTriedBeforUnification(mmpProofStep, length) {
    const isToBeTried = mmpProofStep.parseNode != void 0 && (mmpProofStep.eHypUSteps.length != length || mmpProofStep.eHypUSteps.indexOf(void 0) != -1);
    return isToBeTried;
  }
  tryEHypsDerivation(mmpStepIndex, mmpProofStep, assertion) {
    const stepDerivation = new StepDerivation(
      this.mmpParser,
      mmpStepIndex,
      mmpProofStep,
      this.maxNumberOfHypothesisDispositionsForStepDerivation
    );
    stepDerivation.tryCurrentAssertion(assertion);
  }
  tryToDeriveEhypsIfIncomplete(mmpStepIndex, mmpProofStep, assertion) {
    if (assertion?.frame != void 0 && this.isEHypsCompletionToBeTriedBeforUnification(mmpProofStep, assertion.frame.eHyps.length)) {
      this.tryEHypsDerivation(mmpStepIndex, mmpProofStep, assertion);
    }
  }
  //#endregion tryToDeriveEhypsIfIncomplete
  //#region tranformProofStepWithValidAssertionLabel
  // private tryToDeriveADifferentStepLabel(uStepIndex: number, mmpProofStep: MmpProofStep) {
  // 	// this method is invoked only when uProofStep.stepLabel is defined
  // 	const stepLabel: string = mmpProofStep.stepLabel!;
  // 	mmpProofStep.stepLabel = undefined;
  // 	this.deriveStepLabel(uStepIndex, mmpProofStep);
  // 	if (mmpProofStep.stepLabel == undefined)
  // 		// the step derivation didn't find a label that completely justified the step
  // 		mmpProofStep.stepLabel = stepLabel;
  // }
  tranformProofStepWithValidAssertionLabel(uStepIndex, uProofStep, assertion) {
    let nextUStepIndexToBeTransformed = uStepIndex + 1;
    const uSubstitutionBuilder = new MmpSubstitutionBuilder(
      uProofStep,
      assertion,
      this.outermostBlock,
      this.workingVars,
      this.grammar,
      []
    );
    const substitutionResult = uSubstitutionBuilder.buildSubstitution();
    if (substitutionResult.hasBeenFound) {
      uProofStep.substitution = substitutionResult.substitution;
      this.setIsProvenIfTheCase(uProofStep, assertion.frame.eHyps.length);
      if (uProofStep.stepRef == "")
        uProofStep.stepRef = this.uProof.getNewRef();
      const uSubstitutionApplier = new MmpSubstitutionApplier(
        substitutionResult.substitution,
        uStepIndex,
        this.uProof,
        assertion,
        this.outermostBlock,
        this.workingVars,
        this.grammar
      );
      nextUStepIndexToBeTransformed = uSubstitutionApplier.applySubstitution() + 1;
      this.addStartingPairsForMGUFinder(
        uProofStep,
        assertion,
        substitutionResult.substitution
      );
    } else
      this.deriveLabelAndHypotesis(uStepIndex, uProofStep);
    return nextUStepIndexToBeTransformed;
  }
  //#endregion tranformProofStepWithValidAssertionLabel
  /**
   * adds one step to the new proof and returns the index of the next step to be transformed
   * (this is needed because new proof steps could have been added)
   * @param uStepIndex 
   * @param newProof 
   */
  transformUStep(uStepIndex) {
    let nextUStepIndexToBeTransformed = uStepIndex + 1;
    const uProofStep = this.uProof.mmpStatements[uStepIndex];
    if (uProofStep.parseNode != void 0 && uProofStep.assertion == void 0)
      this.deriveLabelAndHypotesis(uStepIndex, uProofStep);
    this.tryToDeriveEhypsIfIncomplete(uStepIndex, uProofStep, uProofStep.assertion);
    if (!uProofStep.containsUnknownStepRef && uProofStep.assertion instanceof AssertionStatement && uProofStep.assertion.parseNode && !GrammarManager.isSyntaxAxiom2(uProofStep.assertion)) {
      nextUStepIndexToBeTransformed = this.tranformProofStepWithValidAssertionLabel(
        uStepIndex,
        uProofStep,
        uProofStep.assertion
      );
    }
    return nextUStepIndexToBeTransformed;
  }
  //#endregion transformUStep
  //#region getProof
  buildProof(mmpGetProofStatement) {
    let mmpProof;
    if (mmpGetProofStatement.theoremLabel != void 0) {
      const mmToMmpConverter = new MmToMmpConverter(
        mmpGetProofStatement.theoremLabel.value,
        this.outermostBlock,
        this.mmpParser.labelToStatementMap
      );
      mmpProof = mmToMmpConverter.buildProof();
    }
    return mmpProof;
  }
  getProof(i, mmpGetProofStatement) {
    let nextUStepIndexToBeTransformed = i + 1;
    const mmpProof = this.buildProof(mmpGetProofStatement);
    if (mmpProof instanceof MmpProof) {
      this.uProof.mmpStatements.splice(i, 1);
      this.uProof.insertMmpStatements(mmpProof.mmpStatements, i);
      nextUStepIndexToBeTransformed = i + mmpProof.mmpStatements.length;
    }
    return nextUStepIndexToBeTransformed;
  }
  //#endregion getProof
  transformUSteps() {
    const areEHypLabelsToBeTransformed = this.areEHypLabelsToBeTransformed();
    let i = 0;
    let currentIndexInEHypLabel = 1;
    while (i < this.uProof.mmpStatements.length) {
      const currentMmpStatement = this.uProof.mmpStatements[i];
      if (currentMmpStatement instanceof MmpProofStep && currentMmpStatement.isEHyp && areEHypLabelsToBeTransformed) {
        currentIndexInEHypLabel = this.transformEHyp(currentMmpStatement, currentIndexInEHypLabel);
        i++;
      } else if (currentMmpStatement instanceof MmpProofStep && !currentMmpStatement.isEHyp) {
        i = this.transformUStep(i);
      } else if (currentMmpStatement instanceof MmpGetProofStatement) {
        i = this.getProof(i, currentMmpStatement);
        this.containsGetProof = true;
      } else {
        if (currentMmpStatement instanceof TextForProofStatement || currentMmpStatement instanceof MmpSearchStatement)
          this.uProof.mmpStatements.splice(i, 1);
        else
          i++;
      }
    }
  }
  //#endregion transformUSteps
  unifyWorkingVars() {
    const workingVarsUnifierFinder = (
      // new WorkingVarsUnifierFinder(this.uProof, this.labelToStatementMap, this._orderedPairsOfNodesForMGUalgorithm);
      new WorkingVarsUnifierFinder(this._orderedPairsOfNodesForMGUalgorithm)
    );
    const unifier = workingVarsUnifierFinder.findMostGeneralUnifier();
    if (unifier !== void 0) {
      const uUnifierApplier = new WorkingVarsUnifierApplier(unifier, this.uProof, this.mmpParser.formulaToParseNodeCache);
      uUnifierApplier.applyUnifier();
    }
  }
  removeStepDuplicates() {
    ProofStepDuplicateRemover.removeStepDuplicates(this.uProof);
  }
  renumberIfRequired() {
    if (this.renumber)
      RefNumberManager.renumber(this.uProof);
  }
  reorganizeDisjointVarConstraintsStatements() {
    const isCommentForDummyConstraintToBeInserted = !this.containsGetProof;
    MmpDisjVarStatementsReorganizer.reorganizeDisjointVarConstraintsStatements(
      this.uProof,
      isCommentForDummyConstraintToBeInserted,
      this.mmpParser.disjVarStatementsAutomaticallyGenerated
    );
  }
  removeUnusedStatementsIfRequired() {
    if (this.removeUnusedStatements)
      UnusedStatementsRemover.removeUnusedStatements(this.uProof);
  }
  transformUProof() {
    this.addMissingStatements();
    this.transformUSteps();
    this.unifyWorkingVars();
    this.removeStepDuplicates();
    this.renumberIfRequired();
    this.reorganizeDisjointVarConstraintsStatements();
    this.removeUnusedStatementsIfRequired();
  }
  //#endregion transformUProof
};

// yamma/server/src/mmp/UProofStatement.ts
var UProofStatement = class _UProofStatement {
  constructor(proof, charactersPerLine) {
    this.charactersPerLine = charactersPerLine;
    this.proof = proof;
  }
  static labelsArray(proof) {
    const labels = [];
    proof.forEach((uProofStatementStep) => {
      labels.push(uProofStatementStep.label);
    });
    return labels;
  }
  //#region toText
  //#region buildLabelRows
  buildLabelRows(labels, charactersPerLine) {
    const labelRows = [];
    const start = "$=    ";
    const leftPadding = "      ";
    let currentRow = start;
    labels.forEach((label) => {
      if (currentRow.length + label.length + 1 > charactersPerLine) {
        labelRows.push(currentRow);
        currentRow = leftPadding;
      } else if (currentRow != start && currentRow != leftPadding)
        currentRow += " ";
      currentRow += label;
    });
    if (currentRow != start && currentRow != leftPadding)
      labelRows.push(currentRow);
    return labelRows;
  }
  //#endregion buildLabelRows
  toText() {
    const labels = _UProofStatement.labelsArray(this.proof);
    const labelRows = this.buildLabelRows(labels, this.charactersPerLine);
    const labelsString = labelRows.join("\n");
    let text = "\n" + labelsString;
    const lastRowOfLabels = labelRows[labelRows.length - 1];
    if (lastRowOfLabels.length > this.charactersPerLine - 3)
      text += "\n$.";
    else
      text += " $.\n";
    return text;
  }
  //#endregion toText
};

// yamma/server/src/mmp/proofCompression/MmpSortedByReferenceLabelMapCreator.ts
var MmpSortedByReferenceLabelMapCreator = class {
  //#region createLabelMap
  //#region createLabeledStatementToOccourencesMap
  createLabeledStatementToOccourencesMap1(createLabelMapArgs) {
    const labelToNumberOfOccourencesMap = /* @__PURE__ */ new Map();
    createLabelMapArgs.mmpPackedProofStatement?.packedProof.forEach((rpnStep) => {
      const labelCandidate = rpnStep.labelForCompressedProof;
      if (!rpnStep.isBackRefStep && !createLabelMapArgs.mandatoryHypsLabels.has(labelCandidate)) {
        const currentNumberOfOccourences = labelToNumberOfOccourencesMap.get(rpnStep.labeledStatement)?.numberOfOccurences || 0;
        const currentIndex = labelToNumberOfOccourencesMap.get(rpnStep.labeledStatement)?.index || labelToNumberOfOccourencesMap.size + 1;
        const mapEntry = {
          index: currentIndex,
          numberOfOccurences: currentNumberOfOccourences + 1
        };
        labelToNumberOfOccourencesMap.set(rpnStep.labeledStatement, mapEntry);
      }
    });
    return labelToNumberOfOccourencesMap;
  }
  //#region createLabelToNumberOfOccourencesMapWithHypsFirst
  /** reorders labelToNumberOfOccourencesMap, putting Hyps first */
  buildEntry(numberOfOccurences, index) {
    const mapEntry = {
      index,
      numberOfOccurences
    };
    return mapEntry;
  }
  createLabelToNumberOfOccourencesMapWithHypsFirst(labelToNumberOfOccourencesMap) {
    const labelToNumberOfOccourencesMapWithHypsFirst = /* @__PURE__ */ new Map();
    for (const [labeledStatement, mapEntry] of labelToNumberOfOccourencesMap)
      if (labeledStatement instanceof EHyp || labeledStatement instanceof FHyp)
        labelToNumberOfOccourencesMapWithHypsFirst.set(
          labeledStatement,
          this.buildEntry(mapEntry.numberOfOccurences, labelToNumberOfOccourencesMapWithHypsFirst.size + 1)
        );
    for (const [labeledStatement, mapEntry] of labelToNumberOfOccourencesMap)
      if (!(labeledStatement instanceof EHyp || labeledStatement instanceof FHyp))
        labelToNumberOfOccourencesMapWithHypsFirst.set(
          labeledStatement,
          this.buildEntry(mapEntry.numberOfOccurences, labelToNumberOfOccourencesMapWithHypsFirst.size + 1)
        );
    return labelToNumberOfOccourencesMapWithHypsFirst;
  }
  //#endregion createLabelToNumberOfOccourencesMapWithHypsFirst
  /** returns a Map whith number of occourences; they are in the order of RpnSteps in the packed proof, but
   *  with Hyps at the beginning */
  createLabeledStatementToOccourencesMap(createLabelMapArgs) {
    const labelToNumberOfOccourencesMap1 = this.createLabeledStatementToOccourencesMap1(createLabelMapArgs);
    const labelToNumberOfOccourencesMapWithHypsFirst = this.createLabelToNumberOfOccourencesMapWithHypsFirst(labelToNumberOfOccourencesMap1);
    return labelToNumberOfOccourencesMapWithHypsFirst;
  }
  //#endregion createLabeledStatementToOccourencesMap
  labelsToLabelMap(labels) {
    const labelMap = /* @__PURE__ */ new Map();
    for (let i = 0; i < labels.length; i++)
      labelMap.set(labels[i], i + 1);
    return labelMap;
  }
  createLabelMap(createLabelMapArgs) {
    const labelStatementToNumberOfOccourencesMap = this.createLabeledStatementToOccourencesMap(createLabelMapArgs);
    const sortedLabels = [...labelStatementToNumberOfOccourencesMap.entries()].sort((a, b) => a[1].numberOfOccurences == b[1].numberOfOccurences ? a[1].index - b[1].index : b[1].numberOfOccurences - a[1].numberOfOccurences).map(([labeledStatement, _]) => labeledStatement.Label);
    const labelSequence = this.labelsToLabelMap(sortedLabels);
    return labelSequence;
  }
  //#endregion createLabelMap
};

// yamma/server/src/mmp/proofCompression/MmpSortedByReferenceWithKnapsackLabelMapCreator.ts
var MmpSortedByReferenceWithKnapsackLabelMapCreator = class extends MmpSortedByReferenceLabelMapCreator {
  constructor(compressedProofLeftColumn, compressedProofRightColumn) {
    super();
    this.compressedProofLeftColumn = compressedProofLeftColumn;
    this.compressedProofRightColumn = compressedProofRightColumn;
  }
  //#region createLabelMap
  //#region applyKnapSackFit
  //#region processBlock
  //#region knapsackFit
  allocateDoubleArray(dim1, dim2) {
    const doubleArray = [];
    for (let index = 0; index < dim1; index++) {
      const newRow = [];
      for (let i = 0; i < dim2; i++)
        newRow.push(0);
      doubleArray.push(newRow);
    }
    return doubleArray;
  }
  knapsackFit(lengthBlock, size) {
    const worth = this.allocateDoubleArray(lengthBlock.length + 1, size + 1);
    for (let i = 0; i < lengthBlock.length; i++) {
      const value = lengthBlock[i][0].Label.length + 1;
      for (let s2 = 0; s2 <= size; s2++)
        worth[i + 1][s2] = s2 >= value ? Math.max(worth[i][s2], value + worth[i][s2 - value]) : worth[i][s2];
    }
    const included = [];
    let s = size;
    for (let i = lengthBlock.length - 1; i >= 0; i--) {
      if (worth[i + 1][s] != worth[i][s]) {
        included.unshift(lengthBlock[i]);
        s -= lengthBlock[i][0].Label.length + 1;
        if (s == 0)
          break;
      }
    }
    return included;
  }
  //#endregion knapsackFit
  removeItemsFromLenghBlock(included, lengthBlock) {
    included.forEach((item) => {
      const index = lengthBlock.indexOf(item);
      lengthBlock.splice(index, 1);
    });
  }
  processBlock(parenStmt, lengthBlock, width, linePos) {
    lengthBlock.sort((a, b) => a[1].index - b[1].index);
    while (lengthBlock.length > 0) {
      let noSpace = true;
      const included = this.knapsackFit(lengthBlock, width - linePos);
      included.forEach((statement) => {
        noSpace = false;
        const currentLabel = statement[0].Label;
        const l = currentLabel.length + 1;
        linePos += l;
        parenStmt.push(currentLabel);
      });
      this.removeItemsFromLenghBlock(included, lengthBlock);
      if (noSpace || linePos >= width - 1)
        linePos = 0;
    }
    return linePos;
  }
  //#endregion processBlock
  /** mimics the mmj2 behavior:
   * - LabeledStatements with the same number of characters in the capital letter represent, are processed
   * in the same processBlock
   * - each processBlock applies a knapsack algorithm for each line, until the block is completed
   */
  applyKnapSackFit(numberOfMandatoryHyps, labelStatementsSortedByNumberOfOccourences) {
    const parenStmt = [];
    let i = numberOfMandatoryHyps;
    let cutoff = 20;
    while (cutoff <= i) {
      i -= cutoff;
      cutoff *= 5;
    }
    let pos;
    let linePos = 2;
    const width = this.compressedProofRightColumn - this.compressedProofLeftColumn + 2;
    const lengthBlock = [];
    while ((pos = labelStatementsSortedByNumberOfOccourences.shift()) != null) {
      if (i++ == cutoff) {
        i = 1;
        cutoff *= 5;
        linePos = this.processBlock(parenStmt, lengthBlock, width, linePos);
      }
      lengthBlock.push(pos);
    }
    this.processBlock(parenStmt, lengthBlock, width, linePos);
    return parenStmt;
  }
  //#endregion applyKnapSackFit
  createLabelMap(createLabelMapArgs) {
    const labelToNumberOfOccourencesMap = this.createLabeledStatementToOccourencesMap(createLabelMapArgs);
    const labelStatementsSortedByNumberOfOccourences = [...labelToNumberOfOccourencesMap.entries()].sort(
      (a, b) => b[1].numberOfOccurences - a[1].numberOfOccurences
    );
    const labels = this.applyKnapSackFit(
      createLabelMapArgs.mandatoryHypsLabels.size,
      labelStatementsSortedByNumberOfOccourences
    );
    const labelMap = this.labelsToLabelMap(labels);
    return labelMap;
  }
  //#endregion createLabelMap
};

// yamma/server/src/mmp/proofCompression/MmpCompressedProofCreator.ts
var MmpCompressedProofCreatorFromPackedProof = class {
  constructor(labelMapCreator) {
    if (labelMapCreator != void 0)
      this._labelMapCreator = labelMapCreator;
    else
      this._labelMapCreator = new MmpFifoLabelMapCreator();
  }
  createMmpCompressedProof(mmpProof, leftMargin, charactersPerLine) {
    const proofStatement = new MmpCompressedProofStatementFromPackedProof(
      mmpProof,
      leftMargin,
      charactersPerLine,
      this._labelMapCreator
    );
    return proofStatement;
  }
  static getLabelMapCreatorForCompressedProof(labelsOrderInCompressedProof, compressedProofLeftColumn, compressedProofRightColumn) {
    let labelMapCreatorForCompressedProof;
    switch (labelsOrderInCompressedProof) {
      case "fifo" /* fifo */:
        labelMapCreatorForCompressedProof = new MmpFifoLabelMapCreator();
        break;
      case "mostReferencedFirst" /* mostReferencedFirst */:
        labelMapCreatorForCompressedProof = new MmpSortedByReferenceLabelMapCreator();
        break;
      default:
        labelMapCreatorForCompressedProof = new MmpSortedByReferenceWithKnapsackLabelMapCreator(
          compressedProofLeftColumn,
          compressedProofRightColumn
        );
        break;
    }
    return labelMapCreatorForCompressedProof;
  }
};

// yamma/server/src/mmp/MmpUnifier.ts
var MmpUnifier = class {
  //#region constructor
  // constructor(mmpParser: MmpParser, proofMode: ProofMode,
  // 	maxNumberOfHypothesisDispositionsForStepDerivation: number,
  // 	private renumber?: boolean, private expectedTheoremLabel?: string,
  // 	private leftMarginForCompressedProof?: number,
  // 	private characterPerLine?: number,
  // 	mmpCompressedProofCreator?: IMmpCompressedProofCreator) {
  constructor(args) {
    // the list of TextEdit, after createMmpStatements() has been invoked
    this.textEditArray = [];
    this.isProofCompleteAndItContainsWorkingVarsAndThereAreNoUnusedTheoryVars = false;
    this.mmpParser = args.mmpParser;
    this.uProof = args.mmpParser.mmpProof;
    this.outermostBlock = args.mmpParser.outermostBlock;
    this.grammar = args.mmpParser.grammar;
    this.workingVars = args.mmpParser.workingVars;
    this.proofMode = args.proofMode;
    this.maxNumberOfHypothesisDispositionsForStepDerivation = args.maxNumberOfHypothesisDispositionsForStepDerivation;
    this.renumber = args.renumber;
    this.removeUnusedStatements = args.removeUnusedStatements;
    this.expectedTheoremLabel = args.expectedTheoremLabel;
    this.leftMarginForCompressedProof = args.leftMarginForCompressedProof;
    this.characterPerLine = args.characterPerLine;
    this.globalState = args.globalState;
    this._charactersPerLine = args.characterPerLine == void 0 ? Parameters.charactersPerLine : args.characterPerLine;
    this._mmpCompressedProofCreator = args.mmpCompressedProofCreator != void 0 ? args.mmpCompressedProofCreator : (
      // new MmpCompressedProofCreatorFromUncompressedProof();
      // new MmpCompressedProofCreatorFromPackedProof(new MmpSortedByReferenceLabelMapCreator());
      new MmpCompressedProofCreatorFromPackedProof(new MmpSortedByReferenceWithKnapsackLabelMapCreator(4, 79))
    );
    this.textLastLine = 1e6;
    this.thrownError = false;
  }
  //#region buildUstatements
  // parse(textToParse: string): MmpParser {
  // 	const mmpParser: MmpParser = new MmpParser(textToParse, this.labelToStatementMap, this.outermostBlock,
  // 		this.grammar, this.workingVars);
  // 	mmpParser.parse();
  // 	return mmpParser;
  // }
  // protected buildUProof(textToParse: string): UProof {
  // 	const mmpParser: MmpParser = this.parse(textToParse);
  // 	const uProof: UProof = <UProof>mmpParser.uProof;
  // 	return uProof;
  // }
  //#endregion buildUstatements
  buildTextEditArray(newUProof) {
    const newText = newUProof.toText();
    const start = { line: 0, character: 0 };
    const end = { line: this.textLastLine, character: 0 };
    const textEdit = {
      newText,
      range: { start, end }
    };
    const textEdits = [textEdit];
    return textEdits;
  }
  //#region isProofToBeGenerated
  isDiscouragedNotAProblem(diagnostics) {
    const result = (
      // uProof.allowDiscouragedStatement ||    // I had this condition, but it should not be necessary
      // because when this is true no discuraged warning is generated
      !doesDiagnosticsContain(diagnostics, "isDiscouraged" /* isDiscouraged */)
    );
    return result;
  }
  isProofToBeGenerated(uProof, diagnostics) {
    const isProofToBeGenerated = uProof.lastMmpProofStep?.stepRef == "qed" && uProof.lastMmpProofStep.isProven && this.isDiscouragedNotAProblem(diagnostics);
    return isProofToBeGenerated;
  }
  //#endregion isProofToBeGenerated
  replaceRemainingWorkingVarsWithTheoryVars() {
    const workingVarReplacerForCompleteProof = new WorkingVarReplacerForCompleteProof(this.uProof);
    const diagnostics = [];
    workingVarReplacerForCompleteProof.replaceWorkingVarsWithTheoryVars(
      this.mmpParser.formulaToParseNodeCache,
      diagnostics
    );
    if (diagnostics.length > 0) {
      this.isProofCompleteAndItContainsWorkingVarsAndThereAreNoUnusedTheoryVars = true;
      if (this.globalState != void 0)
        this.globalState.isProofCompleteAndItContainsWorkingVarsAndThereAreNoUnusedTheoryVars = true;
    }
  }
  buildProofStatement(uProof) {
    if (this.proofMode == "normal" /* normal */) {
      const proofArray = uProof.lastMmpProofStep.proofArray(this.outermostBlock);
      const proofStatement = new UProofStatement(proofArray, this._charactersPerLine);
      uProof.insertProofStatement(proofStatement);
    } else if (this.proofMode == "packed" /* packed */) {
      const proofStatement = new MmpPackedProofStatement(uProof, 80);
      uProof.insertProofStatement(proofStatement);
    } else {
      const proofStatement = this._mmpCompressedProofCreator.createMmpCompressedProof(
        uProof,
        this.leftMarginForCompressedProof,
        this.characterPerLine
      );
      uProof.insertProofStatement(proofStatement);
    }
  }
  ifProofCompleteReplaceRemainingWoringVarsAndBuildProofStatement() {
    if (this.globalState)
      this.globalState.isProofCompleteAndItContainsWorkingVarsAndThereAreNoUnusedTheoryVars = false;
    if (this.isProofToBeGenerated(this.uProof, this.mmpParser.diagnostics)) {
      this.replaceRemainingWorkingVarsWithTheoryVars();
      if (!this.isProofCompleteAndItContainsWorkingVarsAndThereAreNoUnusedTheoryVars)
        this.buildProofStatement(this.uProof);
    }
  }
  /**
   * Unifies textToParse and builds a UProof and a single TextEdit to replace the whole
   * current document
   * @param textToParse 
   */
  unify() {
    this.uProof.updateAllWorkingVars();
    const uProofTransformer = new MmpProofTransformer(
      {
        mmpParser: this.mmpParser,
        maxNumberOfHypothesisDispositionsForStepDerivation: this.maxNumberOfHypothesisDispositionsForStepDerivation,
        renumber: this.renumber,
        removeUnusedStatements: this.removeUnusedStatements,
        expectedTheoremLabel: this.expectedTheoremLabel
      }
    );
    uProofTransformer.transformUProof();
    this.ifProofCompleteReplaceRemainingWoringVarsAndBuildProofStatement();
    this.textEditArray = this.buildTextEditArray(uProofTransformer.uProof);
  }
  //#endregion unify
};

// src/unifier.ts
var createUnifier = (mmData, config) => {
  const completeConfig = applyDefaultsToConfig(config);
  const mmParser = typeof mmData === "string" ? parseMm(mmData, completeConfig) : mmData;
  const deepParse = async () => {
    let count = 1;
    const progressCallback = (message) => {
      if (message.kind === "progress") {
        count = message.count;
      }
      completeConfig.mm.progressCallback(message);
    };
    if (completeConfig.mm.singleThread) {
      mmParser.createParseNodesForAssertionsSync(
        progressCallback
      );
    } else {
      await mmParser.createParseNodesForAssertionsAsync(
        progressCallback
      );
    }
    progressCallback({
      kind: "progress",
      index: count,
      count
    });
  };
  let deepParsePromise = void 0;
  const unify = (mmpData) => {
    const mmpParser = typeof mmpData === "string" ? parseMmp(mmpData, mmParser, completeConfig) : mmpData;
    const mmpUnifier = new MmpUnifier({
      mmpParser,
      proofMode: completeConfig.common.proofMode,
      ...completeConfig.unifier
    });
    mmpUnifier.unify();
    const result = {
      text: mmpUnifier.textEditArray[0].newText,
      mmpUnifier
    };
    return result;
  };
  const unifier = {
    unify: async (mmpData) => {
      if (deepParsePromise === void 0) {
        deepParsePromise = deepParse();
      }
      await deepParsePromise;
      return unify(mmpData);
    },
    get: (proofId) => {
      const text = `$getproof ${proofId}`;
      const result = unify(text);
      let mmpParser = result.mmpUnifier.mmpParser;
      if (result.text.includes(text) && mmpParser.diagnostics.length === 0) {
        mmpParser.diagnostics.push({
          severity: 1,
          range: {
            start: { line: 0, character: 0 },
            end: { line: 0, character: text.length }
          },
          message: `${proofId} not found`
        });
        return result;
      }
      mmpParser = parseMmp(result.text, mmParser, completeConfig);
      if (completeConfig.unifier.getProofStripHeader && mmpParser.diagnostics.length === 1 && mmpParser.diagnostics[0].code === "missingComment") {
        result.text = result.text.split("\n").slice(3).join("\n");
        mmpParser = parseMmp(result.text, mmParser, completeConfig);
      }
      return unify(result.text);
    },
    mmParser
  };
  return unifier;
};
var parseMm = (mmData, config) => {
  const completeConfig = applyDefaultsToConfig(config);
  const { createMmParser } = completeConfig.mm;
  const mmParser = createMmParser(mapConfigToGlobalState(completeConfig));
  mmParser.ParseText(mmData);
  return mmParser;
};
var parseMmp = (mmpData, mmParser, config) => {
  const completeConfig = applyDefaultsToConfig(config);
  const kindToPrefixMap = new Map(
    completeConfig.common.variableKindsConfig.map((kind) => {
      return [kind.kind, kind.workingVarPrefix];
    })
  );
  const mmpParserParams = {
    textToParse: mmpData,
    mmParser,
    workingVars: new WorkingVars(kindToPrefixMap)
  };
  const mmpParser = new MmpParser(mmpParserParams);
  mmpParser.parse();
  return mmpParser;
};

// src/browser.ts
defaultConfig.mm.singleThread = true;

// getElementById wrapper, with types and exceptions (including a return type to keep variable names in sync ids)
function getElementById(id, nodeName) {
    const elm = document.getElementById(id);
    if (elm === null) {
        throw new Error(`Element ${id} not found`);
    }
    else if (nodeName && elm.nodeName !== nodeName) {
        throw new Error(`Element ${id} is not of nodeName ${nodeName}, found ${elm.nodeName}`);
    }
    else {
        return { [id]: elm };
    }
}

const severityStringArray = [
    'error',
    'error',
    'warning',
    'information',
    'hint',
];
const getDiagnosticsString = (mmpParser) => {
    const lines = mmpParser.textToParse.split('\n');
    return mmpParser.diagnostics
        .map(({ range: { start: { line, character }, end, }, severity, code, message, }) => {
        const severityString = severityStringArray[severity ?? 1];
        const lineText = (lines[line] ?? '').replaceAll('\r', '');
        return [
            `${line}:${character} - ${severityString} ${code} ${message}`,
            `${line} ${lineText}`,
            ``,
        ].join('<br>');
    })
        .join('<br>');
};

const { mmEditor } = getElementById('mmEditor', 'TEXTAREA');
const { parseButton } = getElementById('parseButton');
const { parseOutput } = getElementById('parseOutput');
const { mmpEditor } = getElementById('mmpEditor', 'TEXTAREA');
const { unifyButton } = getElementById('unifyButton');
const { unifierOutput } = getElementById('unifierOutput');
fetch('example.mm').then((response) => {
    if (response.status >= 400) {
        parseOutput.textContent = `${response.status} ${response.statusText}`;
    }
    else {
        response.text().then((text) => (mmEditor.value = text));
    }
});
fetch('ununified.mmp').then((response) => {
    if (response.status >= 400) {
        unifierOutput.textContent = `${response.status} ${response.statusText}`;
    }
    else {
        response.text().then((text) => (mmpEditor.value = text));
    }
});
const config = {
    mm: {
        singleThread: true,
        progressCallback: (message) => {
            if (message.kind === 'progress') {
                const progress = message.index / message.count;
                parseOutput.textContent = `deep parsing... ${Math.round(progress * 100)}%`;
            }
        },
    },
};
let unifier = createUnifier('', config);
let parsed = false;
const parse = () => {
    if (!parsed) {
        try {
            unifier = createUnifier(mmEditor.value, config);
            parsed = true;
            parseOutput.textContent = 'Parsed OK';
        }
        catch (e) {
            if (e instanceof Error) {
                parseOutput.textContent = e.message;
            }
            else {
                parseOutput.textContent = 'Unknown error';
            }
            parsed = false;
        }
    }
};
parseButton.onclick = parse;
mmEditor.addEventListener('input', () => {
    parsed = false;
});
unifyButton.onclick = async () => {
    try {
        parse();
        if (parsed) {
            const result = await unifier.unify(mmpEditor.value);
            mmpEditor.value = result.text;
            // Re-parse the mmp file because we need the diagnostics from after unification rather than before
            const mmpParser = parseMmp(result.text, unifier.mmParser);
            unifierOutput.innerHTML = getDiagnosticsString(mmpParser);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            unifierOutput.textContent = e.message;
        }
        else {
            unifierOutput.textContent = 'Unknown error';
        }
    }
};
